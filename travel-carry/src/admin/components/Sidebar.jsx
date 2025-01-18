import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaBars, FaTimes, FaTachometerAlt, FaUsers, FaBullhorn } from "react-icons/fa"; // Importing necessary icons

const Sidebar = () => {
    const [isCollapsed, setIsCollapsed] = useState(false); // State to track sidebar state

    const toggleSidebar = () => {
        setIsCollapsed(!isCollapsed);
    };

    return (
        <div className="flex">
            {/* Sidebar */}
            <div
                className={`${
                    isCollapsed ? "w-16" : "w-64"
                } bg-gray-800 text-white min-h-screen transition-all duration-300`}
            >
                <button
                    className="p-4 text-white focus:outline-none hover:bg-gray-700 w-full"
                    onClick={toggleSidebar}
                >
                    {isCollapsed ? <FaBars /> : <FaTimes />}
                </button>
                <ul className={`space-y-2 mt-4 ${isCollapsed ? "text-center" : ""}`}>
                    {/* Admin Dashboard Link */}
                    <li>
                        <Link
                            to="/admin"
                            className="flex items-center p-4 hover:bg-gray-700 rounded"
                        >
                            <FaTachometerAlt className="mr-3 text-lg" />
                            {!isCollapsed && <span>Admin Dashboard</span>}
                        </Link>
                    </li>
                    {/* Users Link */}
                    <li>
                        <Link
                            to="/admin/users"
                            className="flex items-center p-4 hover:bg-gray-700 rounded"
                        >
                            <FaUsers className="mr-3 text-lg" />
                            {!isCollapsed && <span>Users</span>}
                        </Link>
                    </li>
                    {/* Annonces Link */}
                    <li>
                        <Link
                            to="/admin/annonces"
                            className="flex items-center p-4 hover:bg-gray-700 rounded"
                        >
                            <FaBullhorn className="mr-3 text-lg" />
                            {!isCollapsed && <span>Annonces</span>}
                        </Link>
                    </li>
                    {/* Annonces Link */}
                    <li>
                        <Link
                            to="/admin/comments"
                            className="flex items-center p-4 hover:bg-gray-700 rounded"
                        >
                            <FaBullhorn className="mr-3 text-lg" />
                            {!isCollapsed && <span>Commentaires de Notations</span>}
                        </Link>
                    </li>
                </ul>
            </div>
        </div>
    );
};

export default Sidebar;
