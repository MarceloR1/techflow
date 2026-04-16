const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const { supabase } = require('./supabaseClient');

const app = express();
const PORT = process.env.PORT || 5000;
const SECRET_KEY = process.env.SECRET_KEY || 'techflow_secret_key';

app.use(cors());
app.use(express.json());

// Helper: Log action in Supabase
async function logAction(userId, action) {
    const { error } = await supabase
        .from('logs')
        .insert([{ user_id: userId, action }]);
    if (error) console.error("Error logging action:", error);
}

// --- AUTH MODULE ---
app.post('/api/auth/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const { data: user, error } = await supabase
            .from('users')
            .select('*, roles(name)')
            .eq('email', email)
            .single();

        if (error || !user) return res.status(401).json({ error: 'Usuario no encontrado' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ error: 'Contraseña incorrecta' });

        const roleName = user.roles ? user.roles.name : 'Sin Rol';
        const token = jwt.sign({ id: user.id, role: roleName }, SECRET_KEY, { expiresIn: '1h' });
        
        res.json({ token, user: { id: user.id, name: user.name, role: roleName } });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- INVENTORY MODULE ---
app.get('/api/products', async (req, res) => {
    try {
        const { data: products, error } = await supabase
            .from('products')
            .select('*, categories(name), product_attributes(attr_key, attr_value)');

        if (error) throw error;

        // Map values to match client expectations
        const mappedProducts = products.map(p => ({
            ...p,
            category: p.categories?.name,
            attributes: p.product_attributes?.map(a => ({ key: a.attr_key, value: a.attr_value })) || []
        }));

        res.json(mappedProducts);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/categories', async (req, res) => {
    const { data: categories, error } = await supabase.from('categories').select('*');
    if (error) return res.status(500).json({ error: error.message });
    res.json(categories);
});

app.post('/api/products', async (req, res) => {
    const { name, category_id, price, stock, user_id } = req.body;
    try {
        const { data, error } = await supabase
            .from('products')
            .insert([{ name, category_id, price, stock }])
            .select()
            .single();

        if (error) throw error;

        await logAction(user_id, `Agregó el producto: ${name}`);
        res.json({ id: data.id });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// AI Attribute Generator
app.post('/api/ai/generate-specs', async (req, res) => {
    const { productName } = req.body;
    setTimeout(() => {
        const specs = [
            { key: 'Marca', value: 'TechFlow Premium' },
            { key: 'Garantía', value: '12 Meses' },
            { key: 'Estado', value: 'Nuevo Sellado' }
        ];
        const lowerName = productName.toLowerCase();
        if (lowerName.includes('laptop')) {
            specs.push({ key: 'CPU', value: 'Intel Core i7 / M2' }, { key: 'RAM', value: '16GB DDR5' });
        } else if (lowerName.includes('phone')) {
            specs.push({ key: 'Pantalla', value: 'OLED 120Hz' }, { key: 'Cámara', value: '48MP Triple' });
        }
        res.json({ specs });
    }, 1000);
});

app.post('/api/products/:id/attributes', async (req, res) => {
    const { id } = req.params;
    const { specs, user_id } = req.body;
    try {
        // Delete existing attributes
        await supabase.from('product_attributes').delete().eq('product_id', id);
        
        // Insert new ones
        const attributesToInsert = specs.map(s => ({
            product_id: id,
            attr_key: s.key,
            attr_value: s.value
        }));
        
        const { error } = await supabase.from('product_attributes').insert(attributesToInsert);
        if (error) throw error;

        await logAction(user_id, `Actualizó especificaciones IA del producto ID: ${id}`);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- BILLING & ACCOUNTING ---
app.post('/api/billing/invoice', async (req, res) => {
    const { client, items, userId } = req.body; 
    
    try {
        // 1. Handle Client (Check or Create)
        let { data: existingClient } = await supabase
            .from('clients')
            .select('id')
            .eq('nit_dni', client.nit_dni)
            .single();

        let clientId = existingClient?.id;
        if (!clientId) {
            const { data: newClient, error: cErr } = await supabase
                .from('clients')
                .insert([{ name: client.name, nit_dni: client.nit_dni, address: client.address }])
                .select()
                .single();
            if (cErr) throw cErr;
            clientId = newClient.id;
        }

        const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

        // 2. Create Invoice
        const { data: invoice, error: iErr } = await supabase
            .from('invoices')
            .insert([{ client_id: clientId, user_id: userId, total }])
            .select()
            .single();
        if (iErr) throw iErr;

        // 3. Invoice Details & Stock Update
        for (const item of items) {
            await supabase.from('invoice_details').insert([{
                invoice_id: invoice.id,
                product_id: item.id,
                quantity: item.quantity,
                price_at_sale: item.price,
                subtotal: item.price * item.quantity
            }]);
            
            // Stock Update (Atomic update would be better via RPC, but for demo we do it here)
            const { data: prod } = await supabase.from('products').select('stock').eq('id', item.id).single();
            await supabase.from('products').update({ stock: prod.stock - item.quantity }).eq('id', item.id);
        }

        // 4. Accounting Entry
        await supabase.from('accounting_entries').insert([{
            invoice_id: invoice.id,
            amount: total,
            type: 'Ingreso',
            reference: `Factura #${invoice.id} - Cliente: ${client.name}`
        }]);

        await logAction(userId, `Generó Factura #${invoice.id} por $${total}`);

        res.json({ success: true, invoiceId: invoice.id });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- MANAGEMENT ---
app.get('/api/users', async (req, res) => {
    const { data, error } = await supabase.from('users').select('id, name, email, roles(name)');
    if (error) return res.status(500).json({ error: error.message });
    res.json(data.map(u => ({ ...u, role: u.roles?.name })));
});

app.get('/api/roles', async (req, res) => {
    const { data, error } = await supabase.from('roles').select('*');
    res.json(data);
});

app.post('/api/users', async (req, res) => {
    const { name, email, password, role_id, adminId } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const { error } = await supabase
            .from('users')
            .insert([{ name, email, password: hashedPassword, role_id }]);
        
        if (error) throw error;
        await logAction(adminId, `Creó el usuario: ${name}`);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/clients', async (req, res) => {
    const { data, error } = await supabase.from('clients').select('*');
    res.json(data);
});

app.get('/api/accounting', async (req, res) => {
    const { data, error } = await supabase.from('accounting_entries').select('*').order('date', { ascending: false });
    res.json(data);
});

app.get('/api/logs', async (req, res) => {
    const { data, error } = await supabase
        .from('logs')
        .select('*, users(name)')
        .order('timestamp', { ascending: false });
    
    if (error) return res.status(500).json({ error: error.message });
    res.json(data.map(l => ({ ...l, user_name: l.users?.name })));
});

if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT} with Supabase Connection`);
    });
}

module.exports = app;
