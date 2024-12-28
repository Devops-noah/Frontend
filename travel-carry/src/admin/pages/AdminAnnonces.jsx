import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AdminAnnonces = () => {
    const [annonces, setAnnonces] = useState([]);

    useEffect(() => {
        fetchAnnonces();
    }, []);

    const fetchAnnonces = async () => {
        const token = localStorage.getItem("token");
        try {
            const response = await axios.get("http://localhost:8080/api/admin/annonces/all", {
                headers: { Authorization: `Bearer ${token}` },
            });
            setAnnonces(response.data); // Adjust if your data is nested
        } catch (error) {
            console.error("Error fetching annonces:", error);
            toast.error("Failed to fetch annonces.");
        }
    };

    const approveAnnonce = async (annonceId) => {
        const token = localStorage.getItem("token");
        try {
            await axios.put(
                `http://localhost:8080/api/admin/annonces/approve/${annonceId}`,
                null,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            toast.success(`Annonce ${annonceId} approved successfully!`);
            fetchAnnonces(); // Refresh the list
        } catch (error) {
            console.error("Error approving annonce:", error);
            toast.error(`Failed to approve annonce ${annonceId}`);
        }
    };

    const suspendAnnonce = async (annonceId) => {
        const token = localStorage.getItem("token");
        try {
            await axios.put(
                `http://localhost:8080/api/admin/annonces/suspend/${annonceId}`,
                null,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            toast.success(`Annonce ${annonceId} suspended successfully!`);
            fetchAnnonces(); // Refresh the list
        } catch (error) {
            console.error("Error suspending annonce:", error);
            toast.error(`Failed to suspend annonce ${annonceId}`);
        }
    };

    const deleteAnnonce = async (annonceId) => {
        const token = localStorage.getItem("token");
        try {
            await axios.delete(`http://localhost:8080/api/admin/annonces/delete/${annonceId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            toast.success(`Annonce ${annonceId} deleted successfully!`);
            fetchAnnonces(); // Refresh the list
        } catch (error) {
            console.error("Error deleting annonce:", error);
            toast.error(`Failed to delete annonce ${annonceId}`);
        }
    };

    console.log("annonces: " + JSON.stringify(annonces))
    return (
        <div>
            <h2 className="text-3xl font-semibold mb-4">Annonces</h2>
            <table className="min-w-full bg-white border border-gray-300 rounded">
                <thead>
                <tr>
                    <th className="p-4 border">ID</th>
                    <th className="p-4 border">Publication Date</th>
                    <th className="p-4 border">Poids Disponible</th>
                    <th className="p-4 border">Actions</th>
                </tr>
                </thead>
                <tbody>
                {annonces.map((annonce) => (
                    <tr key={annonce.id}>
                        <td className="p-4 border">{annonce.id}</td>
                        <td className="p-4 border">{annonce.datePublication}</td>
                        <td className="p-4 border">{annonce.poidsDisponible}</td>
                        <td className="p-4 border">
                            <button
                                className="bg-green-500 text-white py-1 px-4 rounded mr-2"
                                onClick={() => approveAnnonce(annonce.id)}
                            >
                                Approve
                            </button>
                            <button
                                className="bg-yellow-500 text-white py-1 px-4 rounded mr-2"
                                onClick={() => suspendAnnonce(annonce.id)}
                            >
                                Suspend
                            </button>
                            <button
                                className="bg-red-500 text-white py-1 px-4 rounded"
                                onClick={() => deleteAnnonce(annonce.id)}
                            >
                                Delete
                            </button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
            {/* Toast Notification Container */}
            <ToastContainer />
        </div>
    );
};

export default AdminAnnonces;
