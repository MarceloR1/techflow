const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { initDb } = require('./db');

const app = express();
const PORT = process.env.PORT || 5000;
const SECRET_KEY = 'techflow_secret_key';

app.use(cors());
app.use(express.json());

let db;

// Initialize DB and Start Server
initDb().then(database => {
    db = database;
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
});

// Helper: Log action
async function logAction(userId, action) {
    if (!db) return;
    await db.run('INSERT INTO logs (user_id, action) VALUES (?, ?)', [userId, action]);
}

// --- AUTH MODULE ---
app.post('/api/auth/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await db.get(`
            SELECT u.*, r.name as role 
            FROM users u 
            JOIN roles r ON u.role_id = r.id 
            WHERE u.email = ?
        `, [email]);

        if (!user) return res.status(401).json({ error: 'Usuario no encontrado' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ error: 'Contraseña incorrecta' });

        const token = jwt.sign({ id: user.id, role: user.role }, SECRET_KEY, { expiresIn: '1h' });
        res.json({ token, user: { id: user.id, name: user.name, role: user.role } });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- INVENTORY MODULE ---
app.get('/api/products', async (req, res) => {
    try {
        const products = await db.all(`
            SELECT p.*, c.name as category 
            FROM products p 
            LEFT JOIN categories c ON p.category_id = c.id
        `);
        
        // Fetch attributes for each product
        for (let p of products) {
            p.attributes = await db.all('SELECT attr_key as key, attr_value as value FROM product_attributes WHERE product_id = ?', [p.id]);
        }
        res.json(products);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/categories', async (req, res) => {
    const categories = await db.all('SELECT * FROM categories');
    res.json(categories);
});

app.post('/api/products', async (req, res) => {
    const { name, category_id, price, stock, user_id } = req.body;
    try {
        const result = await db.run(
            'INSERT INTO products (name, category_id, price, stock) VALUES (?, ?, ?, ?)',
            [name, category_id, price, stock]
        );
        await logAction(user_id, `Agregó el producto: ${name}`);
        res.json({ id: result.lastID });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// AI Attribute Generator (Replacing Description)
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
        await db.run('DELETE FROM product_attributes WHERE product_id = ?', [id]);
        for (const s of specs) {
            await db.run('INSERT INTO product_attributes (product_id, attr_key, attr_value) VALUES (?, ?, ?)', [id, s.key, s.value]);
        }
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
        await db.run('BEGIN TRANSACTION');

        let clientId;
        const existingClient = await db.get('SELECT id FROM clients WHERE nit_dni = ?', [client.nit_dni]);
        if (existingClient) {
            clientId = existingClient.id;
        } else {
            const clientRes = await db.run('INSERT INTO clients (name, nit_dni, address) VALUES (?, ?, ?)', 
                [client.name, client.nit_dni, client.address]);
            clientId = clientRes.lastID;
        }

        const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const invoiceRes = await db.run('INSERT INTO invoices (client_id, user_id, total) VALUES (?, ?, ?)',
            [clientId, userId, total]);
        const invoiceId = invoiceRes.lastID;

        for (const item of items) {
            await db.run(`
                INSERT INTO invoice_details (invoice_id, product_id, quantity, price_at_sale, subtotal) 
                VALUES (?, ?, ?, ?, ?)`,
                [invoiceId, item.id, item.quantity, item.price, item.price * item.quantity]);
            
            await db.run('UPDATE products SET stock = stock - ? WHERE id = ?', [item.quantity, item.id]);
        }

        await db.run('INSERT INTO accounting_entries (invoice_id, amount, type, reference) VALUES (?, ?, ?, ?)',
            [invoiceId, total, 'Ingreso', `Factura #${invoiceId} - Cliente: ${client.name}`]);

        await logAction(userId, `Generó Factura #${invoiceId} por $${total}`);

        await db.run('COMMIT');
        res.json({ success: true, invoiceId });
    } catch (err) {
        await db.run('ROLLBACK');
        res.status(500).json({ error: err.message });
    }
});

// --- USER MANAGEMENT ---
app.get('/api/users', async (req, res) => {
    const users = await db.all(`
        SELECT u.id, u.name, u.email, r.name as role 
        FROM users u 
        JOIN roles r ON u.role_id = r.id
    `);
    res.json(users);
});

app.get('/api/roles', async (req, res) => {
    const roles = await db.all('SELECT * FROM roles');
    res.json(roles);
});

app.post('/api/users', async (req, res) => {
    const { name, email, password, role_id, adminId } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        await db.run(
            'INSERT INTO users (name, email, password, role_id) VALUES (?, ?, ?, ?)',
            [name, email, hashedPassword, role_id]
        );
        await logAction(adminId, `Creó el usuario: ${name}`);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- CLIENT MANAGEMENT ---
app.get('/api/clients', async (req, res) => {
    const clients = await db.all('SELECT * FROM clients');
    res.json(clients);
});

app.post('/api/clients', async (req, res) => {
    const { name, nit_dni, address, userId } = req.body;
    try {
        await db.run(
            'INSERT INTO clients (name, nit_dni, address) VALUES (?, ?, ?)',
            [name, nit_dni, address]
        );
        await logAction(userId, `Registró al cliente: ${name}`);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/accounting', async (req, res) => {
    const entries = await db.all('SELECT * FROM accounting_entries ORDER BY date DESC');
    res.json(entries);
});

app.get('/api/logs', async (req, res) => {
    const logs = await db.all(`
        SELECT l.*, u.name as user_name 
        FROM logs l 
        JOIN users u ON l.user_id = u.id 
        ORDER BY l.timestamp DESC
    `);
    res.json(logs);
});
