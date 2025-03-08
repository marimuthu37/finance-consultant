import React, { useEffect, useState } from "react";

const LastFiveExpenses = () => {
  const [expenses, setExpenses] = useState([]);

  useEffect(() => {
    fetch("http://localhost:7000/expenses/last-five")
      .then((res) => res.json())
      .then((data) => setExpenses(data))
      .catch((err) => console.error("Error fetching expenses:", err));
  }, []);

  // Function to format date (e.g., "March 7, 2025")
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  // Function to get color for type (badge styling)
  const getTypeColor = (type) => {
    const colors = {
      Food: "bg-purple-600",
      Transport: "bg-red-600",
      Entertainment: "bg-pink-600",
      Study: "bg-blue-600",
      Others: "bg-green-600",
    };
    return colors[type] || "bg-gray-600";
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 bg-gray-900 text-white p-6 rounded-lg shadow-lg">
      <h2 className="text-xl font-bold mb-4">Recent Expenses</h2>
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-gray-700 text-gray-400">
            <th className="py-3 text-left">Subject</th>
            <th className="py-3 text-left">Date</th>
            <th className="py-3 text-left">Type</th>
            <th className="py-3 text-right">Amount</th>
          </tr>
        </thead>
        <tbody>
          {expenses.map((expense) => (
            <tr key={expense.id} className="border-b border-gray-800">
              <td className="py-3">{expense.name}</td>
              <td className="py-3">{formatDate(expense.date)}</td>
              <td className="py-3">
                <span
                  className={`px-3 py-1 text-sm font-medium text-white rounded-full ${getTypeColor(
                    expense.type
                  )}`}
                >
                  {expense.type}
                </span>
              </td>
              <td className="py-3 text-right font-bold">€{expense.amount}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LastFiveExpenses;
