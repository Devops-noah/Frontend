import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AdminUsers = () => {
    const [users, setUsers] = useState([]);
    const [notification, setNotification] = useState(null);

    const showNotification = (message, type) => {
        setNotification({ message, type });
        setTimeout(() => setNotification(null), 3000); // Auto-hide after 3 seconds
    };

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

    return (
        <div>
            <h2 className="text-3xl font-semibold mb-4">Users</h2>
            <ToastContainer className="flex justify-center items-center"/>
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
                    <tr key={user.id}>
                        <td className="p-4 border">{user.id}</td>
                        <td className="p-4 border">{user.nom}</td>
                        <td className="p-4 border">{user.prenom}</td>
                        <td className="p-4 border">{user.email}</td>
                        <td className="p-4 border">{user.telephone}</td>
                        <td className="p-4 border">{user.adresse || "N/A"}</td>
                        <td className="p-4 border">
                            {user.role.name}
                        </td>
                        <td className="p-4 border">
                            {/* Add buttons for actions like suspend, activate */}
                            <button
                                className="bg-green-500 text-white py-1 px-4 rounded mr-2"
                                onClick={() => activateUser(user.id)}
                            >
                                Activate
                            </button>
                            <button
                                className="bg-red-500 text-white py-1 px-4 rounded"
                                onClick={() => suspendUser(user.id)}
                            >
                                Suspend
                            </button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default AdminUsers;
