// /src/components/Sidebar.jsx
import React from "react";
import { Link, useNavigate } from "react-router-dom";

const Sidebar = () => {
    const navigate = useNavigate();

    const logout = () => {
        localStorage.clear();
        navigate("/login");
    }

  return (
    <div className="w-64 bg-gray-800 text-white h-screen p-4 space-y-4">
      <h2 className="text-xl font-semibold">Admin Menu</h2>
      <nav className="space-y-2">
        <Link to="/" className="block hover:bg-gray-700 p-2 rounded">Home</Link>
        <Link to="/settings" className="block hover:bg-gray-700 p-2 rounded">Settings</Link>
        <Link to="/profile" className="block hover:bg-gray-700 p-2 rounded">Profile</Link>
        <Link onClick={logout} to={"/"} className="block hover:bg-gray-700 p-2 rounded">Logout</Link>
      </nav>
    </div>
  );
};

export default Sidebar;
