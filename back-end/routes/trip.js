const express = require("express");
const router = express.Router();
const db = require("../db");
const moment = require("moment");

// Get all trips
router.get("/all", (req, res) => {
    db.query("SELECT * FROM trip", (err, results) => {
        if (err) {
            console.error("Error fetching trips:", err);
            return res.status(500).json({ error: "Internal Server Error" });
        }
        res.json(results);
    });
});

// Add new trip
router.post("/add", (req, res) => {
    const { date, name, type, amount } = req.body;
    if (!date || !name || !type || !amount) {
        return res.status(400).json({ error: "All fields are required" });
    }

    const formattedDate = moment(date).format("YYYY-MM-DD");

    const query = `INSERT INTO trip (date, name, type, amount) VALUES (?, ?, ?, ?)`;
    db.query(query, [formattedDate, name, type, amount], (err, result) => {
        if (err) {
            console.error("Database error:", err);
            return res.status(500).json({ error: "Internal Server Error" });
        }
        res.status(201).json({
            message: "Trip added successfully",
            id: result.insertId,
            createdAt: new Date()
        });
    });
});

// Update trip
router.put("/update/:id", (req, res) => {
    const { id } = req.params;
    let { date, name, type, amount } = req.body;

    if (!id || !date || !name || !type || !amount) {
        return res.status(400).json({ error: "All fields are required" });
    }

    const formattedDate = moment(date).format("YYYY-MM-DD");

    const query = "UPDATE trip SET date=?, name=?, type=?, amount=? WHERE id=?";
    db.query(query, [formattedDate, name, type, amount, id], (err, result) => {
        if (err) {
            console.error("SQL ERROR:", err);
            return res.status(500).json({ error: "Database Error", details: err.message });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Trip not found" });
        }

        res.json({ success: true, updatedTrip: { id, date, name, type, amount } });
    });
});

// Delete trip
router.delete("/delete/:id", (req, res) => {
    const { id } = req.params;
    db.query("DELETE FROM trip WHERE id = ?", [id], (err, result) => {
        if (err) {
            console.error("Database error:", err);
            return res.status(500).json({ error: "Internal Server Error" });
        }
        res.status(200).json({ message: "Trip deleted successfully" });
    });
});

module.exports = router;
