import { useEffect, useState } from "react";
import axios from "axios";
import { DataGrid, GridActionsCellItem } from "@mui/x-data-grid";
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from "@mui/icons-material";
import { Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import moment from "moment";

const API_URL = "http://localhost:7000/trip";

const Trip = () => {
  const [trips, setTrips] = useState([]);
  const [open, setOpen] = useState(false);
  const [editingTrip, setEditingTrip] = useState(null);
  const [formData, setFormData] = useState({
    date: "",
    name: "",
    type: "",
    amount: "",
  });

  // Fetch Trips on Component Mount
  useEffect(() => {
    loadTrips();
  }, []);

  const loadTrips = async () => {
    try {
      const response = await axios.get(`${API_URL}/all`);
      setTrips(response.data);
    } catch (error) {
      console.error("Error fetching trips:", error);
    }
  };

  // Handle Input Change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle Add or Update
  const handleSubmit = async () => {
    try {
      if (editingTrip) {
        await axios.put(`${API_URL}/update/${editingTrip.id}`, formData);
      } else {
        await axios.post(`${API_URL}/add`, formData);
      }
      loadTrips();
      setOpen(false);
    } catch (error) {
      console.error("Error saving trip:", error);
    }
  };

  // Open Dialog for Add
  const handleAdd = () => {
    setEditingTrip(null);
    setFormData({ date: "", name: "", type: "", amount: "" });
    setOpen(true);
  };

  // Open Dialog for Edit
  const handleEdit = (trip) => {
    setEditingTrip(trip);
    setFormData({
      date: moment(trip.date).format("YYYY-MM-DD"),
      name: trip.name,
      type: trip.type,
      amount: trip.amount,
    });
    setOpen(true);
  };

  // Delete Trip
  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/delete/${id}`);
      loadTrips();
    } catch (error) {
      console.error("Error deleting trip:", error);
    }
  };

  // Define DataGrid Columns
  const columns = [
    { field: "id", headerName: "ID", width: 80 },
    { 
      field: "date", 
      headerName: "Date", 
      width: 150, 
      valueFormatter: (params) => moment(params.value).format("YYYY-MM-DD") 
    },
    { field: "name", headerName: "Name", width: 150 },
    { field: "type", headerName: "Type", width: 150 },
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
    <div style={{ height: 400, width: "100%" }}>
      <Button variant="contained" startIcon={<AddIcon />} onClick={handleAdd} style={{ marginBottom: 10 }}>
        Add Trip
      </Button>
      <DataGrid rows={trips} columns={columns} pageSize={5} />

      {/* Add/Edit Dialog */}
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>{editingTrip ? "Edit Trip" : "Add Trip"}</DialogTitle>
        <DialogContent>
          <TextField name="date" label="Date" type="date" fullWidth margin="dense" value={formData.date} onChange={handleChange} InputLabelProps={{ shrink: true }} />
          <TextField name="name" label="Name" fullWidth margin="dense" value={formData.name} onChange={handleChange} />
          <TextField name="type" label="Type" fullWidth margin="dense" value={formData.type} onChange={handleChange} />
          <TextField name="amount" label="Amount" type="number" fullWidth margin="dense" value={formData.amount} onChange={handleChange} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSubmit}>{editingTrip ? "Update" : "Add"}</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Trip;
