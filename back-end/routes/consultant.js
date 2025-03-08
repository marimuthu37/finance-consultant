const express = require('express')
const router = express.Router()
const db = require('../db')

router.get('/list', (req, res) => {
    const query = `SELECT * FROM consultant`;

    db.query(query, (err, result) => {
        if (err) {
            console.error("Database error:", err);
            return res.status(500).json({ error: "Internal Server Error" });
        }
        res.status(200).json(result);
    });
});


router.post('/add/consultant', (req, res) => {
    const { name, experience, type } = req.body;

    if (!name || !experience || !type) {
        return res.status(400).json({ error: "All fields are required" });
    }

    const query = `INSERT INTO consultant (name, experience, type) VALUES (?, ?, ?)`;

    db.query(query, [name, experience, type], (err, result) => {
        if (err) {
            console.error("Database error:", err);
            return res.status(500).json({ error: "Internal Server Error" });
        }
        res.status(201).json({ message: "Consultant added successfully", id: result.insertId });
    });
});


module.exports = router ;