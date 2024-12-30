import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaCheck, FaBan } from "react-icons/fa";

const AdminUsers = () => {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        const token = localStorage.getItem("token");
        try {
            const response = await axios.get("http://localhost:8080/api/admin/users", {
                headers: { Authorization: `Bearer ${token}` },
            });
            setUsers(response.data.content); // Assuming `content` contains the user list
        } catch (error) {
            console.error("Error fetching users:", error);
        }
    };

    const activateUser = async (userId) => {
        const token = localStorage.getItem("token");
        try {
            await axios.put(
                `http://localhost:8080/api/admin/users/${userId}/activate`,
                null,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            toast.success(`User ${userId} has been activated successfully!`);
            fetchUsers(); // Refresh user list
        } catch (error) {
            console.error("Error activating user:", error);
            toast.error(`Failed to activate user ${userId}`);
        }
    };

    const suspendUser = async (userId) => {
        const token = localStorage.getItem("token");
        try {
            await axios.put(
                `http://localhost:8080/api/admin/users/${userId}/suspend?suspend=true`,
                null,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            toast.success(`User ${userId} has been suspended successfully!`);
            fetchUsers(); // Refresh user list
        } catch (error) {
            console.error("Error suspending user:", error);
            toast.error(`Failed to suspend user ${userId}`);
        }
    };

    console.log("users: " + JSON.stringify(users))
    const getRowClass = (user) => {
        if (!user.enabled) {
            return "bg-red-400"; // Red for suspended
        }
        return "bg-white"; // Default white if no condition matched
    };

    return (
        <div className="p-4">
            <h2 className="text-3xl font-semibold mb-4">Users</h2>
            <ToastContainer className="flex justify-center items-center" />
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-300 rounded">
                    <thead>
                    <tr>
                        <th className="p-4 border">ID</th>
                        <th className="p-4 border">Nom</th>
                        <th className="p-4 border">Prénom</th>
                        <th className="p-4 border">Email</th>
                        <th className="p-4 border">Telephone</th>
                        <th className="p-4 border">Adresse</th>
                        <th className="p-4 border">Rôle</th>
                        <th className="p-4 border">Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {users.map(user => (
                        <tr key={user.id} className={getRowClass(user)}>
                            <td className="p-4 border">{user.id}</td>
                            <td className="p-4 border">{user.nom}</td>
                            <td className="p-4 border">{user.prenom}</td>
                            <td className="p-4 border">{user.email}</td>
                            <td className="p-4 border">{user.telephone}</td>
                            <td className="p-4 border">{user.adresse || "N/A"}</td>
                            <td className="p-4 border">
                                {user.role.name}
                            </td>
                            <td className="p-4 border flex gap-2 justify-center">
                                {/* Responsive button with icons */}
                                <button
                                    className="bg-green-500 text-white py-1 px-3 rounded hover:bg-green-600 flex items-center justify-center"
                                    onClick={() => activateUser(user.id)}
                                >
                                    <span className="hidden md:inline">Activate</span>
                                    <FaCheck className="block md:hidden" />
                                </button>
                                <button
                                    className="bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600 flex items-center justify-center"
                                    onClick={() => suspendUser(user.id)}
                                >
                                    <span className="hidden md:inline">Suspend</span>
                                    <FaBan className="block md:hidden" />
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminUsers;
