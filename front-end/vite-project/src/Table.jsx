import React, { useEffect, useState } from "react";
import axios from "axios";
import { DataGrid, GridActionsCellItem } from "@mui/x-data-grid";
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from "@mui/icons-material";
import { Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import moment from "moment";

const API_URL = "http://localhost:7000/expenses";

const ExpenseTracker = () => {
  const [expenses, setExpenses] = useState([]);
  const [open, setOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [formData, setFormData] = useState({
    date: "",
    name: "",
    type: "",
    amount: "",
  });

  useEffect(() => {
    loadExpenses();
  }, []);

  const loadExpenses = async () => {
    try {
      const response = await axios.get(`${API_URL}/all`);
      setExpenses(response.data);
    } catch (error) {
      console.error("Error fetching expenses:", error);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      if (editingExpense) {
        await axios.put(`${API_URL}/update/${editingExpense.id}`, formData);
      } else {
        await axios.post(`${API_URL}/add`, formData);
      }
      loadExpenses();
      setOpen(false);
    } catch (error) {
      console.error("Error saving expense:", error);
    }
  };

  const handleAdd = () => {
    setEditingExpense(null);
    setFormData({ date: "", name: "", type: "", amount: "" });
    setOpen(true);
  };

  const handleEdit = (expense) => {
    setEditingExpense(expense);
    setFormData({
      date: moment(expense.date).format("YYYY-MM-DD"),
      name: expense.name,
      type: expense.type,
      amount: expense.amount,
    });
    setOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/delete/${id}`);
      loadExpenses();
    } catch (error) {
      console.error("Error deleting expense:", error);
    }
  };

  const columns = [
    { field: "id", headerName: "ID", width: 80 },
    {
      field: "date",
      headerName: "Date",
      width: 150,
      valueFormatter: (params) => moment(params.value).format("YYYY-MM-DD"),
    },
    { field: "name", headerName: "Details", width: 200 },
    { field: "type", headerName: "Category", width: 180 },
    { field: "amount", headerName: "Amount ($)", width: 120 },
    {
      field: "actions",
      headerName: "Actions",
      width: 150,
      renderCell: (params) => (
        <>
          <GridActionsCellItem icon={<EditIcon />} label="Edit" onClick={() => handleEdit(params.row)} />
          <GridActionsCellItem icon={<DeleteIcon />} label="Delete" onClick={() => handleDelete(params.row.id)} />
        </>
      ),
    },
  ];

  return (
    <div style={{ height: 500, width: "100%" }}>
      <Button variant="contained" startIcon={<AddIcon />} onClick={handleAdd} style={{ marginBottom: 10 }}>
        Add Expense
      </Button>
      <DataGrid rows={expenses} columns={columns} pageSize={5} />

      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>{editingExpense ? "Edit Expense" : "Add Expense"}</DialogTitle>
        <DialogContent>
          <TextField name="date" label="Date" type="date" fullWidth margin="dense" value={formData.date} onChange={handleChange} InputLabelProps={{ shrink: true }} />
          <TextField name="name" label="Details" fullWidth margin="dense" value={formData.name} onChange={handleChange} />
          <TextField name="type" label="Category" fullWidth margin="dense" value={formData.type} onChange={handleChange} />
          <TextField name="amount" label="Amount" type="number" fullWidth margin="dense" value={formData.amount} onChange={handleChange} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSubmit}>{editingExpense ? "Update" : "Add"}</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ExpenseTracker;
