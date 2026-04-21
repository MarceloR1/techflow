-- TechFlow Database Schema

-- 1. Roles Table
CREATE TABLE IF NOT EXISTS roles (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE NOT NULL
);

-- Seed Roles
INSERT OR IGNORE INTO roles (name) VALUES ('Administrador'), ('Auditor'), ('Ventas'), ('Cliente');


-- 2. Users Table
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role_id INTEGER,
    FOREIGN KEY(role_id) REFERENCES roles(id)
);

-- 3. Categories Table
CREATE TABLE IF NOT EXISTS categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE NOT NULL,
    description TEXT
);

-- 4. Products Table
CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    category_id INTEGER,
    price REAL NOT NULL,
    stock INTEGER NOT NULL,
    FOREIGN KEY(category_id) REFERENCES categories(id)
);

-- 5. Product Attributes (Specifications)
CREATE TABLE IF NOT EXISTS product_attributes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    product_id INTEGER,
    attr_key TEXT NOT NULL,
    attr_value TEXT NOT NULL,
    FOREIGN KEY(product_id) REFERENCES products(id)
);

-- 6. Clients Table
CREATE TABLE IF NOT EXISTS clients (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    nit_dni TEXT UNIQUE NOT NULL,
    address TEXT,
    user_id INTEGER,
    FOREIGN KEY(user_id) REFERENCES users(id)
);


-- 7. Invoices Table
CREATE TABLE IF NOT EXISTS invoices (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    client_id INTEGER,
    user_id INTEGER,
    date TEXT DEFAULT CURRENT_TIMESTAMP,
    total REAL NOT NULL,
    FOREIGN KEY(client_id) REFERENCES clients(id),
    FOREIGN KEY(user_id) REFERENCES users(id)
);

-- 8. Invoice Details
CREATE TABLE IF NOT EXISTS invoice_details (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    invoice_id INTEGER,
    product_id INTEGER,
    quantity INTEGER NOT NULL,
    price_at_sale REAL NOT NULL,
    subtotal REAL NOT NULL,
    FOREIGN KEY(invoice_id) REFERENCES invoices(id),
    FOREIGN KEY(product_id) REFERENCES products(id)
);

-- 9. Accounting Table
CREATE TABLE IF NOT EXISTS accounting_entries (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    invoice_id INTEGER,
    date TEXT DEFAULT CURRENT_TIMESTAMP,
    amount REAL NOT NULL,
    type TEXT CHECK(type IN ('Ingreso', 'Egreso')) NOT NULL,
    reference TEXT,
    FOREIGN KEY(invoice_id) REFERENCES invoices(id)
);

-- 10. Audit Logs
CREATE TABLE IF NOT EXISTS logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    action TEXT NOT NULL,
    timestamp TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(id)
);
