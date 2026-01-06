// server.js - Complete CRUD Node.js Backend Server
const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Database connection pool
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'diane',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Test database connection
pool.getConnection()
    .then(connection => {
        console.log('✅ Database connected successfully');
        connection.release();
    })
    .catch(err => {
        console.error('❌ Database connection failed:', err.message);
    });

// ==================== CUSTOMERS API ====================
// Get all customers
app.get('/api/customers', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM Customer ORDER BY CustID DESC');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Search customers
app.get('/api/customers/search/:term', async (req, res) => {
    try {
        const term = `%${req.params.term}%`;
        const [rows] = await pool.query(
            'SELECT * FROM Customer WHERE CustFname LIKE ? OR CustLname LIKE ?',
            [term, term]
        );
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get single customer
app.get('/api/customers/:id', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM Customer WHERE CustID = ?', [req.params.id]);
        res.json(rows[0] || null);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Create customer
app.post('/api/customers', async (req, res) => {
    try {
        const { fname, lname } = req.body;
        const [result] = await pool.query(
            'INSERT INTO Customer (CustFname, CustLname) VALUES (?, ?)',
            [fname, lname]
        );
        res.json({ message: 'Customer added successfully', id: result.insertId });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update customer
app.put('/api/customers/:id', async (req, res) => {
    try {
        const { fname, lname } = req.body;
        await pool.query(
            'UPDATE Customer SET CustFname = ?, CustLname = ? WHERE CustID = ?',
            [fname, lname, req.params.id]
        );
        res.json({ message: 'Customer updated successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete customer
app.delete('/api/customers/:id', async (req, res) => {
    try {
        await pool.query('DELETE FROM Customer WHERE CustID = ?', [req.params.id]);
        res.json({ message: 'Customer deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ==================== CASHIERS API ====================
app.get('/api/cashiers', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM Cashier ORDER BY CashierId DESC');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/cashiers/search/:term', async (req, res) => {
    try {
        const term = `%${req.params.term}%`;
        const [rows] = await pool.query(
            'SELECT * FROM Cashier WHERE CashierFname LIKE ? OR CashierLname LIKE ?',
            [term, term]
        );
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/cashiers/:id', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM Cashier WHERE CashierId = ?', [req.params.id]);
        res.json(rows[0] || null);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/cashiers', async (req, res) => {
    try {
        const { fname, lname } = req.body;
        const [result] = await pool.query(
            'INSERT INTO Cashier (CashierFname, CashierLname) VALUES (?, ?)',
            [fname, lname]
        );
        res.json({ message: 'Cashier added successfully', id: result.insertId });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.put('/api/cashiers/:id', async (req, res) => {
    try {
        const { fname, lname } = req.body;
        await pool.query(
            'UPDATE Cashier SET CashierFname = ?, CashierLname = ? WHERE CashierId = ?',
            [fname, lname, req.params.id]
        );
        res.json({ message: 'Cashier updated successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.delete('/api/cashiers/:id', async (req, res) => {
    try {
        await pool.query('DELETE FROM Cashier WHERE CashierId = ?', [req.params.id]);
        res.json({ message: 'Cashier deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ==================== SUPPLIERS API ====================
app.get('/api/suppliers', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM Supplier ORDER BY SupplierId DESC');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/suppliers/search/:term', async (req, res) => {
    try {
        const term = `%${req.params.term}%`;
        const [rows] = await pool.query(
            'SELECT * FROM Supplier WHERE SupplierDEC LIKE ?',
            [term]
        );
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/suppliers/:id', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM Supplier WHERE SupplierId = ?', [req.params.id]);
        res.json(rows[0] || null);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/suppliers', async (req, res) => {
    try {
        const { name } = req.body;
        const [result] = await pool.query(
            'INSERT INTO Supplier (SupplierDEC) VALUES (?)',
            [name]
        );
        res.json({ message: 'Supplier added successfully', id: result.insertId });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.put('/api/suppliers/:id', async (req, res) => {
    try {
        const { name } = req.body;
        await pool.query(
            'UPDATE Supplier SET SupplierDEC = ? WHERE SupplierId = ?',
            [name, req.params.id]
        );
        res.json({ message: 'Supplier updated successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.delete('/api/suppliers/:id', async (req, res) => {
    try {
        await pool.query('DELETE FROM Supplier WHERE SupplierId = ?', [req.params.id]);
        res.json({ message: 'Supplier deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ==================== PRODUCTS API ====================
app.get('/api/products', async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT p.*, s.SupplierDEC as SupplierName 
            FROM Product p 
            LEFT JOIN Supplier s ON p.SupplierID = s.SupplierId
            ORDER BY p.ProductID DESC
        `);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/products/search/:term', async (req, res) => {
    try {
        const term = `%${req.params.term}%`;
        const [rows] = await pool.query(`
            SELECT p.*, s.SupplierDEC as SupplierName 
            FROM Product p 
            LEFT JOIN Supplier s ON p.SupplierID = s.SupplierId
            WHERE p.ProdDESC LIKE ? OR s.SupplierDEC LIKE ?
        `, [term, term]);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/products/:id', async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT p.*, s.SupplierDEC as SupplierName 
            FROM Product p 
            LEFT JOIN Supplier s ON p.SupplierID = s.SupplierId
            WHERE p.ProductID = ?
        `, [req.params.id]);
        res.json(rows[0] || null);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/products', async (req, res) => {
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();
        
        const { description, supplierId } = req.body;
        const [result] = await connection.query(
            'INSERT INTO Product (ProdDESC, SupplierID) VALUES (?, ?)',
            [description, supplierId]
        );
        
        await connection.query(
            'INSERT INTO Product_Supplier (ProductID, SupplierID) VALUES (?, ?)',
            [result.insertId, supplierId]
        );
        
        await connection.commit();
        res.json({ message: 'Product added successfully', id: result.insertId });
    } catch (error) {
        await connection.rollback();
        res.status(500).json({ error: error.message });
    } finally {
        connection.release();
    }
});

app.put('/api/products/:id', async (req, res) => {
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();
        
        const { description, supplierId } = req.body;
        await connection.query(
            'UPDATE Product SET ProdDESC = ?, SupplierID = ? WHERE ProductID = ?',
            [description, supplierId, req.params.id]
        );
        
        await connection.query(
            'DELETE FROM Product_Supplier WHERE ProductID = ?',
            [req.params.id]
        );
        
        await connection.query(
            'INSERT INTO Product_Supplier (ProductID, SupplierID) VALUES (?, ?)',
            [req.params.id, supplierId]
        );
        
        await connection.commit();
        res.json({ message: 'Product updated successfully' });
    } catch (error) {
        await connection.rollback();
        res.status(500).json({ error: error.message });
    } finally {
        connection.release();
    }
});

app.delete('/api/products/:id', async (req, res) => {
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();
        
        await connection.query('DELETE FROM Product_Supplier WHERE ProductID = ?', [req.params.id]);
        await connection.query('DELETE FROM Product WHERE ProductID = ?', [req.params.id]);
        
        await connection.commit();
        res.json({ message: 'Product deleted successfully' });
    } catch (error) {
        await connection.rollback();
        res.status(500).json({ error: error.message });
    } finally {
        connection.release();
    }
});

// ==================== SALES API ====================
app.get('/api/sales', async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT 
                s.SalesId,
                s.Sales_Date,
                s.CustID,
                s.CashierID,
                CONCAT(c.CustFname, ' ', c.CustLname) as CustomerName,
                CONCAT(ca.CashierFname, ' ', ca.CashierLname) as CashierName,
                GROUP_CONCAT(p.ProdDESC SEPARATOR ', ') as ProductName,
                GROUP_CONCAT(p.ProductID) as ProductIDs
            FROM Sales s
            JOIN Customer c ON s.CustID = c.CustID
            JOIN Cashier ca ON s.CashierID = ca.CashierId
            LEFT JOIN Sales_Details sd ON s.SalesId = sd.Sales
            LEFT JOIN Product p ON sd.ProductID = p.ProductID
            GROUP BY s.SalesId
            ORDER BY s.SalesId DESC
        `);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/sales/search/:term', async (req, res) => {
    try {
        const term = `%${req.params.term}%`;
        const [rows] = await pool.query(`
            SELECT 
                s.SalesId,
                s.Sales_Date,
                CONCAT(c.CustFname, ' ', c.CustLname) as CustomerName,
                CONCAT(ca.CashierFname, ' ', ca.CashierLname) as CashierName,
                GROUP_CONCAT(p.ProdDESC SEPARATOR ', ') as ProductName
            FROM Sales s
            JOIN Customer c ON s.CustID = c.CustID
            JOIN Cashier ca ON s.CashierID = ca.CashierId
            LEFT JOIN Sales_Details sd ON s.SalesId = sd.Sales
            LEFT JOIN Product p ON sd.ProductID = p.ProductID
            WHERE c.CustFname LIKE ? OR c.CustLname LIKE ? OR ca.CashierFname LIKE ? OR ca.CashierLname LIKE ?
            GROUP BY s.SalesId
            ORDER BY s.SalesId DESC
        `, [term, term, term, term]);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/sales/:id', async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT 
                s.*,
                CONCAT(c.CustFname, ' ', c.CustLname) as CustomerName,
                CONCAT(ca.CashierFname, ' ', ca.CashierLname) as CashierName,
                GROUP_CONCAT(p.ProductID) as ProductIDs,
                GROUP_CONCAT(p.ProdDESC SEPARATOR ', ') as ProductName
            FROM Sales s
            JOIN Customer c ON s.CustID = c.CustID
            JOIN Cashier ca ON s.CashierID = ca.CashierId
            LEFT JOIN Sales_Details sd ON s.SalesId = sd.Sales
            LEFT JOIN Product p ON sd.ProductID = p.ProductID
            WHERE s.SalesId = ?
            GROUP BY s.SalesId
        `, [req.params.id]);
        res.json(rows[0] || null);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/sales', async (req, res) => {
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();
        
        const { customerId, cashierId, productId, date } = req.body;
        
        const [salesResult] = await connection.query(
            'INSERT INTO Sales (CustID, CashierID, Sales_Date) VALUES (?, ?, ?)',
            [customerId, cashierId, date]
        );
        
        const salesId = salesResult.insertId;
        
        await connection.query(
            'INSERT INTO Sales_Details (Sales, ProductID, CashierID) VALUES (?, ?, ?)',
            [salesId, productId, cashierId]
        );
        
        await connection.commit();
        res.json({ message: 'Sale recorded successfully', id: salesId });
    } catch (error) {
        await connection.rollback();
        res.status(500).json({ error: error.message });
    } finally {
        connection.release();
    }
});

app.put('/api/sales/:id', async (req, res) => {
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();
        
        const { customerId, cashierId, productId, date } = req.body;
        
        await connection.query(
            'UPDATE Sales SET CustID = ?, CashierID = ?, Sales_Date = ? WHERE SalesId = ?',
            [customerId, cashierId, date, req.params.id]
        );
        
        await connection.query('DELETE FROM Sales_Details WHERE Sales = ?', [req.params.id]);
        
        await connection.query(
            'INSERT INTO Sales_Details (Sales, ProductID, CashierID) VALUES (?, ?, ?)',
            [req.params.id, productId, cashierId]
        );
        
        await connection.commit();
        res.json({ message: 'Sale updated successfully' });
    } catch (error) {
        await connection.rollback();
        res.status(500).json({ error: error.message });
    } finally {
        connection.release();
    }
});

app.delete('/api/sales/:id', async (req, res) => {
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();
        
        await connection.query('DELETE FROM Sales_Details WHERE Sales = ?', [req.params.id]);
        await connection.query('DELETE FROM Sales WHERE SalesId = ?', [req.params.id]);
        
        await connection.commit();
        res.json({ message: 'Sale deleted successfully' });
    } catch (error) {
        await connection.rollback();
        res.status(500).json({ error: error.message });
    } finally {
        connection.release();
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📊 API endpoints available at http://localhost:${PORT}/api/`);
});

// Graceful shutdown
process.on('SIGINT', async () => {
    console.log('\n⏳ Shutting down gracefully...');
    await pool.end();
    process.exit(0);
});