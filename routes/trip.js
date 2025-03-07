const express = require('express')
const router = express.Router()
const db = require('../db')

router.get('/summary', (req, res) => {
    const query = `SELECT * FROM trip`;

    db.query(query, (err, result) => {
        if (err) {
            console.error("Database query error:", err);
            return res.status(500).json({ error: "Internal Server Error" });
        }
        res.status(200).json(result);
    });
});

router.post('/add/summary', (req, res) => {
    const { date, name, type, amount } = req.body;

    if (!date || !name || !type || !amount) {
        return res.status(400).json({ error: "All fields are required" });
    }

    const query = `INSERT INTO trip (date, name, type, amount) VALUES (?, ?, ?, ?)`;
    db.query(query, [date, name, type, amount], (err, result) => {
        if (err) {
            console.error("Database error:", err);
            return res.status(500).json({ error: "Internal Server Error" });
        }
        res.status(201).json({ message: "Summary added successfully", id: result.insertId });
    });
});

module.exports = router ;