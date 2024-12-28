import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar = () => {
    return (
        <div className="w-64 bg-gray-800 text-white min-h-screen">
            <ul className="space-y-2 mt-4">
                <li>
                    <Link to="/admin" className="text-xl block p-4 hover:bg-gray-700 rounded">
                        Admin Dashboard
                    </Link>
                </li>
                <li>
                    <Link to="/admin/users" className="block p-4 hover:bg-gray-700 rounded">
                        Users
                    </Link>
                </li>
                <li>
                    <Link to="/admin/annonces" className="block p-4 hover:bg-gray-700 rounded">
                        Annonces
                    </Link>
                </li>
                {/* Add more links as necessary */}
            </ul>
        </div>
    );
};

export default Sidebar;

