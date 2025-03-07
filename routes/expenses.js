const express = require('express');
const router = express.Router();
const db = require('../db'); 

router.get('/summary', (req, res) => {
    const query = `SELECT * FROM expenses`;

    db.query(query, (err, result) => {
        if (err) {
            console.error("Database error:", err);
            return res.status(500).json({ error: "Internal Server Error" });
        }
        res.status(200).json(result);
    });
});

router.post('/add/expenses', (req, res) => {
    const { name, date, type, amount } = req.body;

    if (!name || !date || !type || !amount) {
        return res.status(400).json({ error: "All fields are required" });
    }

    const query = `INSERT INTO expenses (name, date, type, amount) VALUES (?, ?, ?, ?)`;

    db.query(query, [name, date, type, amount], (err, result) => {
        if (err) {
            console.error("Database error:", err);
            return res.status(500).json({ error: "Internal Server Error" });
        }
        res.status(201).json({ message: "Expense added successfully", id: result.insertId });
    });
});

module.exports = router;
