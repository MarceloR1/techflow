const sqlite3 = require('sqlite3').verbose();
const { open } = require('sqlite');
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcryptjs');

async function initDb() {
    const dbPath = path.resolve(__dirname, 'database.sqlite');
    const db = await open({
        filename: dbPath,
        driver: sqlite3.Database
    });

    const schemaPath = path.resolve(__dirname, 'schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');

    await db.exec(schema);
    console.log('Database initialized with normalized schema.');

    // 1. Seed Roles
    const existingRoles = await db.all('SELECT * FROM roles');
    if (existingRoles.length === 0) {
        await db.run("INSERT INTO roles (name) VALUES ('Administrador'), ('Vendedor'), ('Contador')");
        console.log('Roles seeded.');
    }

    // 2. Seed Categories
    const existingCategories = await db.all('SELECT * FROM categories');
    if (existingCategories.length === 0) {
        await db.run("INSERT INTO categories (name, description) VALUES ('Laptop', 'Computadoras portátiles'), ('Smartphone', 'Teléfonos inteligentes'), ('Accesorios', 'Complementos técnicos')");
        console.log('Categories seeded.');
    }

    // 3. Ensure Admin exists with correct Role ID
    const adminEmail = 'admin@techflow.com';
    const adminPassword = 'admin123';
    const adminRole = await db.get("SELECT id FROM roles WHERE name = 'Administrador'");
    const hashedPwd = await bcrypt.hash(adminPassword, 10);

    const adminUser = await db.get('SELECT * FROM users WHERE email = ?', [adminEmail]);
    if (!adminUser) {
        await db.run(`INSERT INTO users (name, email, password, role_id) VALUES 
            ('Admin TechFlow', ?, ?, ?)`, [adminEmail, hashedPwd, adminRole.id]);
        console.log('Admin user created (Normalized).');
    } else {
        await db.run('UPDATE users SET password = ?, role_id = ? WHERE id = ?', [hashedPwd, adminRole.id, adminUser.id]);
        console.log('Admin user updated (Normalized).');
    }

    // 4. Seed Products if empty
    const products = await db.all('SELECT * FROM products');
    if (products.length === 0) {
        const catLaptop = await db.get("SELECT id FROM categories WHERE name = 'Laptop'");
        const catPhone = await db.get("SELECT id FROM categories WHERE name = 'Smartphone'");
        const catAcc = await db.get("SELECT id FROM categories WHERE name = 'Accesorios'");

        await db.run(`INSERT INTO products (name, category_id, price, stock) VALUES 
            ('MacBook Pro 14"', ?, 1999.99, 10),
            ('iPhone 15 Pro', ?, 999.99, 25),
            ('AirPods Pro', ?, 249.99, 50)
        `, [catLaptop.id, catPhone.id, catAcc.id]);

        // Seed initial attributes for first product
        const firstProd = await db.get("SELECT id FROM products LIMIT 1");
        await db.run("INSERT INTO product_attributes (product_id, attr_key, attr_value) VALUES (?, 'Procesador', 'M2 Pro'), (?, 'RAM', '16GB')", [firstProd.id, firstProd.id]);
        
        console.log('Seed products and attributes added.');
    }

    return db;
}

module.exports = { initDb };
