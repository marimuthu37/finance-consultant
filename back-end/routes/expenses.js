const express = require("express");
const router = express.Router();
const db = require("../db");
const moment = require("moment");

// Get all expenses
router.get("/all", (req, res) => {
    db.query("SELECT id, name, DATE_FORMAT(date, '%Y-%m-%d') AS date, type, amount FROM expenses", (err, results) => {
        if (err) {
            console.error("Error fetching expenses:", err);
            return res.status(500).json({ error: "Internal Server Error" });
        }
        res.json(results);
    });
});

router.get("/last-five", (req, res) => {
    db.query(
        "SELECT id, name, DATE_FORMAT(date, '%Y-%m-%d') AS date, type, amount FROM expenses ORDER BY id DESC LIMIT 5",
        (err, results) => {
            if (err) {
                console.error("Error fetching last 5 expenses:", err);
                return res.status(500).json({ error: "Internal Server Error" });
            }
            res.json(results);
        }
    );
});

router.get("/monthly-expenses", (req, res) => {
    const query = `
        SELECT 
            DATE_FORMAT(date, '%Y-%m') AS expense_month, 
            SUM(amount) AS total_amount
        FROM expenses
        GROUP BY expense_month
        ORDER BY expense_month DESC
    `;

    db.query(query, (err, results) => {
        if (err) {
            console.error("Error fetching monthly expenses:", err);
            return res.status(500).json({ error: "Internal Server Error" });
        }
        res.json(results);
    });
});




// Add new expense
router.post("/add", (req, res) => {
    const { name, date, type, amount } = req.body;
    if (!name || !date || !type || !amount) {
        return res.status(400).json({ error: "All fields are required" });
    }

    const formattedDate = moment(date).format("YYYY-MM-DD");
    const query = `INSERT INTO expenses (name, date, type, amount) VALUES (?, ?, ?, ?)`;
    
    db.query(query, [name, formattedDate, type, amount], (err, result) => {
        if (err) return res.status(500).json({ error: "Database Error" });

        res.status(201).json({ message: "Expense added", id: result.insertId });
    });
});

// Update expense
router.put("/update/:id", (req, res) => {
    const { id } = req.params;
    const { name, date, type, amount } = req.body;

    const formattedDate = moment(date).format("YYYY-MM-DD");
    const query = "UPDATE expenses SET name=?, date=?, type=?, amount=? WHERE id=?";

    db.query(query, [name, formattedDate, type, amount, id], (err, result) => {
        if (err) return res.status(500).json({ error: "Database Error" });

        res.json({ success: true });
    });
});

// Delete expense
router.delete("/delete/:id", (req, res) => {
    db.query("DELETE FROM expenses WHERE id = ?", [req.params.id], (err) => {
        if (err) return res.status(500).json({ error: "Database Error" });

        res.status(200).json({ message: "Expense deleted" });
    });
});

module.exports = router;
