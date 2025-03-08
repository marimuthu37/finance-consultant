import React, { useEffect, useState } from "react";
import axios from "axios";
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";
import { Card, CardContent, Typography } from "@mui/material";
import moment from "moment"; // Import moment.js for formatting

const API_URL = "http://localhost:7000/expenses";

const ExpenseGraph = () => {
  const [monthlyData, setMonthlyData] = useState([]);

  useEffect(() => {
    fetchMonthlyExpenses();
  }, []);

  const fetchMonthlyExpenses = async () => {
    try {
      const response = await axios.get(`${API_URL}/monthly-expenses`);
      
      // Convert "YYYY-MM" to Month Name (e.g., "February")
      const formattedData = response.data.map((item) => ({
        ...item,
        monthName: moment(item.expense_month, "YYYY-MM").format("MMMM"), // Converts "2025-02" -> "February"
      }));

      setMonthlyData(formattedData);
    } catch (error) {
      console.error("Error fetching monthly expenses:", error);
    }
  };

  return (
    <Card sx={{ p: 2, borderRadius: "16px", boxShadow: 3 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Monthly Expense Overview 📊
        </Typography>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={monthlyData} margin={{ top: 10, right: 20, left: 0, bottom: 30 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="monthName" label={{ value: "Month", position: "bottom" }} />
            <YAxis label={{ value: "Amount ($)", angle: -90, position: "insideLeft" }} />
            <Tooltip />
            <Bar dataKey="total_amount" fill="#1976d2" barSize={40} radius={[5, 5, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default ExpenseGraph;
