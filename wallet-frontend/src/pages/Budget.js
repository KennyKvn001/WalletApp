import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Budget = () => {
  const [budgets, setBudgets] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBudgets = async () => {
      const accessToken = localStorage.getItem("access_token");
      if (!accessToken) {
        navigate("/login"); // Redirect to login if no token
        return;
      }

      try {
        const response = await axios.get("http://127.0.0.1:8000/api/budgets/", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setBudgets(response.data);
      } catch (err) {
        if (err.response?.status === 401) {
          // Token expired, redirect to login
          localStorage.removeItem("access_token");
          localStorage.removeItem("refresh_token");
          navigate("/login");
        } else {
          setError("Failed to fetch budgets");
        }
      }
    };

    fetchBudgets();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h2 className="text-2xl font-bold mb-6">Budgets</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <ul className="space-y-4">
        {budgets.map((budget) => (
          <li key={budget.id} className="bg-white p-4 rounded-lg shadow-md">
            <p className="text-gray-700">
              <span className="font-semibold">{budget.category.name}</span>: $
              {budget.limit} (From {budget.start_date} to {budget.end_date})
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Budget;