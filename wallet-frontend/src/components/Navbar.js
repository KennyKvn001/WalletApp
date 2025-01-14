import React from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    navigate("/login");
  };

  return (
    <nav className="bg-blue-600 p-4 text-white">
      <div className="container mx-auto flex justify-between items-center">
      <Link to="/dashboard" className="text-xl font-bold">
            Dashboard
          </Link>
        <Link to="/transactions" className="text-xl font-bold">
          Transactions
        </Link>
        <Link to="/budget" className="text-xl font-bold">
            Budget
          </Link>
        <button
          onClick={handleLogout}
          className="bg-red-500 px-4 py-2 rounded-lg hover:bg-red-600 transition duration-200"
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;