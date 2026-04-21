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

// Global Error Handler Middleware
const asyncErrorHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

// --- MIDDLEWARES ---

// Middleware: Authenticate and Extract User
const authenticate = async (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Acceso denegado. Token no proporcionado.' });

    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        req.user = decoded;
        next();
    } catch (err) {
        res.status(401).json({ error: 'Token inválido o expirado' });
    }
};

// Middleware: Role Verification
const checkRole = (allowedRoles) => (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
        return res.status(403).json({ error: 'No tiene permisos suficientes para esta operación' });
    }
    next();
};

// --- UTILS ---

// Helper: Log action in Supabase
async function logAction(userId, action) {
    const { error } = await supabase
        .from('logs')
        .insert([{ user_id: userId, action }]);
    if (error) console.error("CRITICAL LOG ERROR:", error);
}

// Diagnostic endpoint
app.get('/api/health', async (req, res) => {
    try {
        const { data, error } = await supabase.from('roles').select('id').limit(1);
        if (error) throw error;
        res.json({ 
            status: 'SYSTEM_OK', 
            engine: 'TechFlow Core 2.0',
            db: 'Supabase Cloud Connected',
            timestamp: new Date().toISOString()
        });
    } catch (err) {
        res.status(500).json({ status: 'OFFLINE', details: err.message });
    }
});

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
        const token = jwt.sign({ id: user.id, role: roleName }, SECRET_KEY, { expiresIn: '12h' });
        
        console.log(`[AUTH] Login exitoso: ${user.email} (${roleName})`);
        res.json({ token, user: { id: user.id, name: user.name, role: roleName } });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/auth/register', async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const { data: existingUser } = await supabase.from('users').select('id').eq('email', email).single();
        if (existingUser) return res.status(400).json({ error: 'Identidad ya registrada' });

        const { data: role } = await supabase.from('roles').select('id').eq('name', 'Cliente').single();
        if (!role) throw new Error('Protocolo Cliente no configurado');

        const hashedPassword = await bcrypt.hash(password, 10);
        const { data: newUser, error } = await supabase
            .from('users')
            .insert([{ name, email, password: hashedPassword, role_id: role.id }])
            .select().single();

        if (error) throw error;
        await logAction(newUser.id, "Protocolo de Auto-registro: Usuario Cliente creado.");
        res.json({ success: true, message: 'Perfil TechFlow activado' });
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
        const mapped = products.map(p => ({
            ...p,
            category: p.categories?.name,
            attributes: p.product_attributes?.map(a => ({ key: a.attr_key, value: a.attr_value })) || []
        }));
        res.json(mapped);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/categories', asyncErrorHandler(async (req, res) => {
    const { data, error } = await supabase.from('categories').select('*');
    if (error) throw error;
    res.json(data);
}));

app.post('/api/products', async (req, res) => {
    const { name, category_id, price, stock, user_id } = req.body;
    try {
        const { data, error } = await supabase
            .from('products')
            .insert([{ name, category_id, price, stock }])
            .select().single();

        if (error) throw error;
        await logAction(user_id, `Inventario: Alta de producto "${name}"`);
        res.json({ id: data.id });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.delete('/api/products/:id', async (req, res) => {
    const { id } = req.params;
    const { user_id } = req.query;
    try {
        await supabase.from('product_attributes').delete().eq('product_id', id);
        const { error } = await supabase.from('products').delete().eq('id', id);
        if (error) throw error;
        await logAction(user_id, `Inventario: Purga de producto ID ${id}`);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// AI Attribute Generator (Simulated)
app.post('/api/ai/generate-specs', async (req, res) => {
    const { productName } = req.body;
    setTimeout(() => {
        const specs = [{ key: 'Marca', value: 'TechFlow' }, { key: 'Estándar', value: 'Original' }];
        const name = productName.toLowerCase();
        if (name.includes('laptop')) specs.push({ key: 'CPU', value: 'Core i7 Gen 13' }, { key: 'RAM', value: '32GB' });
        else if (name.includes('mouse')) specs.push({ key: 'DPI', value: '25,000' }, { key: 'Sensor', value: 'HERO 2' });
        res.json({ specs });
    }, 800);
});

app.post('/api/products/:id/attributes', async (req, res) => {
    const { id } = req.params;
    const { specs, user_id } = req.body;
    try {
        await supabase.from('product_attributes').delete().eq('product_id', id);
        const toInsert = specs.map(s => ({ product_id: id, attr_key: s.key, attr_value: s.value }));
        const { error } = await supabase.from('product_attributes').insert(toInsert);
        if (error) throw error;
        await logAction(user_id, `Especificación: Optimización de atributos para producto ${id}`);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- BILLING MODULE ---
app.post('/api/billing/invoice', async (req, res) => {
    const { client, items, userId } = req.body; 
    try {
        // 1. Client Resolution
        let clientId;
        const { data: linked } = await supabase.from('clients').select('id').eq('user_id', userId).single();
        if (linked) clientId = linked.id;
        else {
            let { data: existing } = await supabase.from('clients').select('id').eq('nit_dni', client.nit_dni).single();
            if (existing) {
                clientId = existing.id;
                await supabase.from('clients').update({ user_id: userId }).eq('id', clientId);
            } else {
                const { data: newC, error: ce } = await supabase.from('clients').insert([{ 
                    name: client.name, nit_dni: client.nit_dni, address: client.address, user_id: userId 
                }]).select().single();
                if (ce) throw ce;
                clientId = newC.id;
            }
        }

        const total = items.reduce((s, i) => s + (i.price * i.quantity), 0);

        // 2. Transaccional Instance
        const { data: inv, error: ie } = await supabase.from('invoices').insert([{ client_id: clientId, user_id: userId, total }]).select().single();
        if (ie) throw ie;

        // 3. Immutability Detail & Stock Control
        for (const item of items) {
            const { data: p } = await supabase.from('products').select('stock, name').eq('id', item.id).single();
            if (!p || p.stock < item.quantity) throw new Error(`Stock crítico para ${p?.name || item.id}`);

            await supabase.from('invoice_details').insert([{
                invoice_id: inv.id, product_id: item.id, quantity: item.quantity, 
                price_at_sale: item.price, subtotal: item.price * item.quantity
            }]);
            await supabase.from('products').update({ stock: p.stock - item.quantity }).eq('id', item.id);
        }

        // 4. Ledger Entry
        await supabase.from('accounting_entries').insert([{
            invoice_id: inv.id, amount: total, type: 'Ingreso', reference: `Orden #${inv.id} - Ref: ${client.name}`
        }]);

        await logAction(userId, `Transacción: Factura #${inv.id} emitida por $${total}`);
        res.json({ success: true, invoiceId: inv.id });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- REPORTING MODULE ---
app.get('/api/users', asyncErrorHandler(async (req, res) => {
    const { data, error } = await supabase.from('users').select('id, name, email, roles(name)');
    if (error) throw error;
    res.json(data.map(u => ({ ...u, role: u.roles?.name })));
}));

app.get('/api/roles', async (req, res) => {
    const { data } = await supabase.from('roles').select('*');
    res.json(data);
});

app.post('/api/users', async (req, res) => {
    const { name, email, password, role_id, adminId } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const { error } = await supabase.from('users').insert([{ name, email, password: hashedPassword, role_id }]);
        if (error) throw error;
        await logAction(adminId, `Gestión: Nuevo personal autorizado -> ${name}`);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.delete('/api/users/:id', async (req, res) => {
    const { id } = req.params;
    const { adminId } = req.query;
    try {
        const { error } = await supabase.from('users').delete().eq('id', id);
        if (error) throw error;
        await logAction(adminId, `Gestión: Revocación de acceso para usuario ID ${id}`);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/clients', async (req, res) => {
    const { data } = await supabase.from('clients').select('*');
    res.json(data);
});

app.get('/api/accounting', async (req, res) => {
    const { data } = await supabase.from('accounting_entries').select('*').order('date', { ascending: false });
    res.json(data);
});

app.get('/api/logs', asyncErrorHandler(async (req, res) => {
    const { data, error } = await supabase.from('logs').select('*, users(name)').order('timestamp', { ascending: false });
    if (error) throw error;
    res.json(data.map(l => ({ ...l, user_name: l.users?.name })));
}));

// Final Catch-all Error Handler
app.use((err, req, res, next) => {
    console.error("[TECHFLOW_CORE_ERR]", err.message);
    res.status(500).json({ error: 'Protocolo de error del servidor', details: err.message });
});

if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => console.log(`[SYSTEM] CORE ACTIVE -> PORT ${PORT}`));
}

module.exports = app;
