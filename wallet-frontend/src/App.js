import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/login";
import Transactions from "./pages/Transactions";
import Budget from "./pages/Budget";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";

const App = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/transactions" element={<Transactions />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/budget" element={<Budget />} />
        <Route path="/" element={<Login />} />
      </Routes>
    </Router>
  );
};

export default App;