import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaCheck, FaBan, FaTrash } from "react-icons/fa"; // Icons for actions
import { format } from "date-fns";

const AdminAnnonces = () => {
    const [annonces, setAnnonces] = useState([]);
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
    const [deleteAnnonceId, setDeleteAnnonceId] = useState(null);

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
            toast.success(`Annonce ${annonceId} suspend successfully!`);
            fetchAnnonces(); // Refresh the list
        } catch (error) {
            console.error("Error suspending annonce:", error);
            toast.error(`Failed to suspend annonce ${annonceId}`);
        }
    };

    const openDeleteConfirmation = (annonceId) => {
        setDeleteAnnonceId(annonceId);
        setShowDeleteConfirmation(true);
    };

    const deleteAnnonce = async () => {
        const token = localStorage.getItem("token");
        try {
            await axios.delete(`http://localhost:8080/api/admin/annonces/delete/${deleteAnnonceId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            toast.success(`Annonce ${deleteAnnonceId} deleted successfully!`);
            fetchAnnonces(); // Refresh the list
            setShowDeleteConfirmation(false);
        } catch (error) {
            console.error("Error deleting annonce:", error);
            toast.error(`Failed to delete annonce ${deleteAnnonceId}`);
        }
    };

    const getRowClass = (annonce) => {
        if (annonce.approved && !annonce.suspended) {
            return "bg-green-400"; // Green for approved and not suspended
        }
        if (!annonce.approved && annonce.suspended) {
            return "bg-yellow-500"; // Yellow for not approved and suspended
        }
        return "bg-white"; // Default white if no condition matched
    };

    return (
        <div className="overflow-x-auto">
            <h2 className="text-3xl font-semibold mb-4">Annonces</h2>
            <table className="table-auto min-w-full bg-white border border-gray-300 rounded">
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
                    <tr key={annonce.id} className={getRowClass(annonce)}>
                        <td className="p-4 border">{annonce.id}</td>
                        <td className="p-4 border">{format(annonce.datePublication, "dd/MM/yyyy" )}</td>
                        <td className="p-4 border">{annonce.poidsDisponible}</td>
                        <td className="p-4 border flex flex-wrap gap-2 justify-center">
                            {/* Approve Button */}
                            <button
                                className="bg-green-500 text-white py-1 px-4 rounded flex items-center gap-1"
                                onClick={() => approveAnnonce(annonce.id)}
                            >
                                <FaCheck className="text-sm" />
                                <span className="hidden sm:inline">Approve</span>
                            </button>
                            {/* Suspend Button */}
                            <button
                                className="bg-yellow-500 text-white py-1 px-4 rounded flex items-center gap-1"
                                onClick={() => suspendAnnonce(annonce.id)}
                            >
                                <FaBan className="text-sm" />
                                <span className="hidden sm:inline">Suspend</span>
                            </button>
                            {/* Delete Button */}
                            <button
                                className="bg-red-500 text-white py-1 px-4 rounded flex items-center gap-1"
                                onClick={() => openDeleteConfirmation(annonce.id)}
                            >
                                <FaTrash className="text-sm" />
                                <span className="hidden sm:inline">Delete</span>
                            </button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
            <ToastContainer />

            {/* Modal for delete confirmation */}
            {showDeleteConfirmation && (
                <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-10">
                    <div className="bg-white p-8 rounded-lg shadow-md max-w-sm w-full">
                        <h3 className="text-xl font-bold mb-4">Confirmer la suppression</h3>
                        <p>Êtes-vous sûr de vouloir supprimer cette annonce?</p>
                        <div className="mt-4 flex justify-between">
                            <button
                                onClick={() => setShowDeleteConfirmation(false)}
                                className="bg-gray-400 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded-lg"
                            >
                                Annuler
                            </button>
                            <button
                                onClick={deleteAnnonce}
                                className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg"
                            >
                                Supprimer
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminAnnonces;
