const express = require('express');
const router = express.Router();
const db = require('../db'); 

router.get('/consultant-request', (req, res) => {
    const query = `SELECT * FROM consultantRequest`;

    db.query(query, (err, result) => {
        if (err) {
            console.error("Database error:", err);
            return res.status(500).json({ error: "Internal Server Error" });
        }
        res.status(200).json(result);
    });
});


router.post('/add/consultant-request', (req, res) => {
    const { user_id, consultant_id } = req.body;

    if (!user_id || !consultant_id) {
        return res.status(400).json({ error: "User ID and Consultant ID are required" });
    }

    const query = `INSERT INTO consultantRequest (user_id, consultant_id) VALUES (?, ?)`;

    db.query(query, [user_id, consultant_id], (err, result) => {
        if (err) {
            console.error("Database error:", err);
            return res.status(500).json({ error: "Internal Server Error" });
        }
        res.status(201).json({ message: "Consultant request added successfully", id: result.insertId });
    });
});


router.put('/update/consultant-request/:id', (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    if (!status || !['pending', 'approved', 'rejected'].includes(status)) {
        return res.status(400).json({ error: "Invalid status" });
    }

    const query = `UPDATE consultantRequest SET status = ?, updatedAt = CURRENT_TIMESTAMP WHERE id = ?`;

    db.query(query, [status, id], (err, result) => {
        if (err) {
            console.error("Database error:", err);
            return res.status(500).json({ error: "Internal Server Error" });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Consultant request not found" });
        }

        res.status(200).json({ message: "Consultant request updated successfully" });
    });
});



module.exports = router ;