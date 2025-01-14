import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTransactions = async () => {
      const accessToken = localStorage.getItem("access_token");
      if (!accessToken) {
        navigate("/login");
        return;
      }

      try {
        const response = await axios.get("http://127.0.0.1:8000/api/transactions/", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setTransactions(response.data);
      } catch (err) {
        if (err.response?.status === 401) {
          localStorage.removeItem("access_token");
          localStorage.removeItem("refresh_token");
          navigate("/login");
        } else {
          setError("Failed to fetch transactions");
        }
      }
    };

    fetchTransactions();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h2 className="text-2xl font-bold mb-6">Transactions</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <ul className="space-y-4">
        {transactions.map((transaction) => (
          <li
            key={transaction.id}
            className="bg-white p-4 rounded-lg shadow-md"
          >
            <p className="text-gray-700">
              <span className="font-semibold">{transaction.description}</span>: $
              {transaction.amount} ({transaction.date})
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Transactions;