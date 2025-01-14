import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [accounts, setAccounts] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const accessToken = localStorage.getItem("access_token");
      if (!accessToken) {
        navigate("/login");
        return;
      }

      try {
        // Fetch accounts
        const accountsResponse = await axios.get("http://127.0.0.1:8000/api/accounts/", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setAccounts(accountsResponse.data);

        // Fetch transactions
        const transactionsResponse = await axios.get("http://127.0.0.1:8000/api/transactions/", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setTransactions(transactionsResponse.data);

        // Fetch budgets
        const budgetsResponse = await axios.get("http://127.0.0.1:8000/api/budgets/", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setBudgets(budgetsResponse.data);
      } catch (err) {
        if (err.response?.status === 401) {
          localStorage.removeItem("access_token");
          localStorage.removeItem("refresh_token");
          navigate("/login");
        } else {
          setError("Failed to fetch data");
        }
      }
    };

    fetchData();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      {/* Accounts Section */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Accounts</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {accounts.map((account) => (
            <div key={account.id} className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-bold">{account.name}</h3>
              <p className="text-gray-700">Balance: ${account.balance}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Transactions Section */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Recent Transactions</h2>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2">Description</th>
                <th className="text-left py-2">Amount</th>
                <th className="text-left py-2">Date</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((transaction) => (
                <tr key={transaction.id} className="border-b">
                  <td className="py-2">{transaction.description}</td>
                  <td className="py-2">${transaction.amount}</td>
                  <td className="py-2">{transaction.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Budgets Section */}
      <div>
        <h2 className="text-2xl font-semibold mb-4">Budgets</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {budgets.map((budget) => (
            <div key={budget.id} className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-bold">{budget.category.name}</h3>
              <p className="text-gray-700">Limit: ${budget.limit}</p>
              <p className="text-gray-700">
                Period: {budget.start_date} to {budget.end_date}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;