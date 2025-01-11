import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaEdit, FaTrashAlt } from "react-icons/fa"; // Import React Icons
import TravelAnimation from "../TravelAnimation";
import { format } from "date-fns";

const AnnoncesList = () => {
    const [annonces, setAnnonces] = useState([]);
    const [filteredAnnonces, setFilteredAnnonces] = useState([]);
    const [filters, setFilters] = useState({
        dateDepart: "",
        dateArrivee: "",
        paysDepart: "",
        paysDestination: "",
    });
    const [currentPage, setCurrentPage] = useState(1);
    const annoncesPerPage = 8;
    const [selectedAnnonce, setSelectedAnnonce] = useState(null);
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
    const [showDeleteAllConfirmation, setShowDeleteAllConfirmation] = useState(false);
    const [deleteAnnonceId, setDeleteAnnonceId] = useState(null);
    //const [selectedAnnonces, setSelectedAnnonces] = useState([]); // New state for selected annonces
    const navigate = useNavigate();

    const userType = localStorage.getItem("userType"); // Get user type from local storage

    // Fetch all annonces
    useEffect(() => {
        axios.get("http://localhost:8080/api/annonces").then((response) => {
            console.log("annonces list: " + JSON.stringify(response));
            setAnnonces(response.data);
            setFilteredAnnonces(response.data);
        });
    }, []);

    // Handle filter changes
    const handleFilterChange = (e) => {
        setFilters({
            ...filters,
            [e.target.name]: e.target.value,
        });
    };

    // Apply filters
    const handleFilter = () => {
        const filtered = annonces.filter((annonce) => {
            return (
                (!filters.dateDepart ||
                    format(annonce.dateDepart, "dd-MM-yyyy") >= format(filters.dateDepart, "dd-MM-yyyy")) &&
                (!filters.dateArrivee ||
                    format(annonce.dateArrivee, "dd-MM-yyyy") >= format(filters.dateArrivee, "dd-MM-yyyy")) &&
                (!filters.paysDepart ||
                    annonce.paysDepart
                        .toLowerCase()
                        .includes(filters.paysDepart.toLowerCase())) &&
                (!filters.paysDestination ||
                    annonce.paysDestination
                        .toLowerCase()
                        .includes(filters.paysDestination.toLowerCase()))
            );
        });
        setFilteredAnnonces(filtered);
        setCurrentPage(1); // Reset to first page
    };

    // Clear filters
    const clearFilters = () => {
        setFilters({
            dateDepart: "",
            dateArrivee: "",
            paysDepart: "",
            paysDestination: "",
        });
        setFilteredAnnonces(annonces); // Reset to show all annonces
        setCurrentPage(1); // Reset to first page
    };

    // Pagination logic
    const indexOfLastAnnonce = currentPage * annoncesPerPage;
    const indexOfFirstAnnonce = indexOfLastAnnonce - annoncesPerPage;
    const currentAnnonces = filteredAnnonces.slice(
        indexOfFirstAnnonce,
        indexOfLastAnnonce
    );

    const totalPages = Math.ceil(filteredAnnonces.length / annoncesPerPage);

    // Open update modal
    const openUpdateModal = (annonce) => {
        setSelectedAnnonce(annonce);
        setShowUpdateModal(true);
    };

    const token = localStorage.getItem('token');
    const decodedToken = JSON.parse(atob(token.split('.')[1]));

    // Handle update
    const handleUpdate = () => {
        const updatedAnnonce = { ...selectedAnnonce };
        if (userType === "voyageur") {
            // Only update datePublication and poidsDisponible for voyageur
            updatedAnnonce.datePublication = selectedAnnonce.datePublication;
            updatedAnnonce.poidsDisponible = selectedAnnonce.poidsDisponible;
        }

        axios
            .put(
                `http://localhost:8080/api/annonces/update/${selectedAnnonce.id}`,
                updatedAnnonce, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`, // Replace with your actual token key
                    },
                }
            )
            .then((response) => {
                console.log("Annonce updated successfully:", response.data);
                setAnnonces((prevAnnonces) =>
                    prevAnnonces.map((a) =>
                        a.id === selectedAnnonce.id ? response.data : a
                    )
                );
                setFilteredAnnonces((prevFiltered) =>
                    prevFiltered.map((a) =>
                        a.id === selectedAnnonce.id ? response.data : a
                    )
                );
                setShowUpdateModal(false);
            })
            .catch((error) => console.error("Error updating annonce:", error));
    };

    // Open delete confirmation
    const openDeleteConfirmation = (annonceId) => {
        setDeleteAnnonceId(annonceId);
        setShowDeleteConfirmation(true);
    };
    // Open delete confirmation
    const openDeleteAllConfirmation = () => {
        setAnnonces(annonces)
        setShowDeleteAllConfirmation(true);
    };

    // Handle delete
    const handleDelete = () => {
        axios
            .delete(`http://localhost:8080/api/annonces/delete/${deleteAnnonceId}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`, // Replace with your actual token key
                },
            })
            .then(() => {
                console.log("Annonce deleted successfully");
                setAnnonces((prev) => prev.filter((a) => a.id !== deleteAnnonceId));
                setFilteredAnnonces((prev) =>
                    prev.filter((a) => a.id !== deleteAnnonceId)
                );
                setShowDeleteConfirmation(false);
            })
            .catch((error) => console.error("Error deleting annonce:", error));
    };

    // Delete All annonces
    const deleteAllAnnonces = () => {
        axios
            .delete("http://localhost:8080/api/annonces/delete/all", {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            })
            .then(() => {
                console.log("All annonces deleted successfully");
                setAnnonces([]);
                setFilteredAnnonces([]);
                setShowDeleteAllConfirmation(false)
            })
            .catch((error) => console.error("Error deleting all annonces:", error));
    };

    console.log("currentAnnonce: ", JSON.stringify(currentAnnonces))

    return (
        <div className="min-h-screen bg-gray-100 py-8">
            <div className="max-w-6xl mx-auto px-5 grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Sidebar - Filters */}
                <div className="lg:col-span-1 bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-bold mb-4">Filter les annonces</h2>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-gray-700">Date Depart:</label>
                            <input
                                type="date"
                                name="dateDepart"
                                value={filters.dateDepart}
                                onChange={handleFilterChange}
                                className="w-full p-2 border rounded-lg"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700">Date Arrivee:</label>
                            <input
                                type="date"
                                name="dateArrivee"
                                value={filters.dateArrivee}
                                onChange={handleFilterChange}
                                className="w-full p-2 border rounded-lg"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700">Pays Depart:</label>
                            <input
                                type="text"
                                name="paysDepart"
                                value={filters.paysDepart}
                                onChange={handleFilterChange}
                                className="w-full p-2 border rounded-lg"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700">Pays Destination:</label>
                            <input
                                type="text"
                                name="paysDestination"
                                value={filters.paysDestination}
                                onChange={handleFilterChange}
                                className="w-full p-2 border rounded-lg"
                            />
                        </div>
                        <div className="mt-6 flex justify-between">
                            <button
                                onClick={handleFilter}
                                className="bg-gray-400 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded-lg"
                            >
                                Filter
                            </button>
                            <button
                                onClick={clearFilters}
                                className="bg-gray-400 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded-lg"
                            >
                                Supprimer
                            </button>
                        </div>
                    </div>
                </div>

                {/* Right Section - Annonces List */}
                <div className="lg:col-span-3 bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-2xl font-bold mb-6">Annonces</h2>
                    {currentAnnonces.length === 0 ? (
                        <div className="text-center text-gray-600">
                            <p className="mb-4">Aucune anoonce!
                                Pas d'inquiétude, nous avons d'autres options pour vous !</p>
                            <p className="mb-4">Découvrez le transfert en chaîne ou d'autres solutions adaptées.</p>
                            <a
                                href="http://localhost:3000/create-transfer"
                                className="text-white bg-blue-500 hover:bg-blue-600 font-bold py-3 px-6 rounded-lg"
                            >
<<<<<<< HEAD
                                Accéder au Transfert en Chaîne
                            </a>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-8">
                            {currentAnnonces.map((annonce, index) => (
                                <div
                                    key={index}
                                    className="bg-blue-300 p-4 relative flex justify-between items-center gap-4 cursor-pointer hover:shadow-lg transition"
                                    onClick={() => navigate(`/annonces/${annonce.id}`)}
                                >
                                    <TravelAnimation
                                        paysDepart={annonce.paysDepart}
                                        paysDestination={annonce.paysDestination}
                                        dateDepart={new Date(annonce.dateDepart).toLocaleDateString()}
                                        dateArrivee={new Date(annonce.dateArrivee).toLocaleDateString()}
                                    />
                                    <div className="absolute bottom-3 left-0 right-0 flex justify-center items-center gap-2">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                openUpdateModal(annonce);
                                            }}
                                            className="text-green-950 hover:text-blue-500"
                                        >
                                            <FaEdit />
                                        </button>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                openDeleteConfirmation(annonce.id);
                                            }}
                                            className="text-red-700 hover:text-red-500"
                                        >
                                            <FaTrashAlt />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}


                    {/* Button to delete all annonces */}
                    <button
=======
                                <TravelAnimation
                                    paysDepart={annonce.paysDepart}
                                    paysDestination={annonce.paysDestination}
                                    dateDepart={format(annonce.dateDepart, "dd-MM-yyyy")}
                                    dateArrivee={format(annonce.dateArrivee, "dd-MM-yyyy")}
                                />
                                {console.log("voyageur email: " + annonce.voyageurEmail)}
                                {
                                    userType !== "voyageur" && decodedToken.sub !== annonce.voyageurEmail ? (
                                        <div className="hidden absolute bottom-3 left-0 right-0 flex justify-center items-center gap-2">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    openUpdateModal(annonce);
                                                }}
                                                className="text-green-950 hover:text-blue-500"
                                            >
                                                <FaEdit/>
                                            </button>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    openDeleteConfirmation(annonce.id);
                                                }}
                                                className="text-red-700 hover:text-red-500"
                                            >
                                                <FaTrashAlt/>
                                            </button>
                                        </div>
                                    ) : (
                                        <div
                                            className="absolute bottom-3 left-0 right-0 flex justify-center items-center gap-2">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    openUpdateModal(annonce);
                                                }}
                                                className="text-green-950 hover:text-blue-500"
                                            >
                                                <FaEdit/>
                                            </button>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    openDeleteConfirmation(annonce.id);
                                                }}
                                                className="text-red-700 hover:text-red-500"
                                            >
                                                <FaTrashAlt/>
                                            </button>
                                        </div>
                                    )
                                }

                            </div>
                        ))}
                    </div>
                    {
                        userType !== "voyageur" ? (
                        <button
>>>>>>> e93b166bc5ffb6ce894d9b15924d7a0c8cb67d26
                        onClick={(e) => {
                        e.stopPropagation();
                        openDeleteAllConfirmation(annonces);
                    }}
                    className=" hidden mt-3 right-4 bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-6 rounded-lg"
                >
                    Supprimer Annonces
                </button>
                        ) : (
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        openDeleteAllConfirmation(annonces);
                    }}
                    className="mt-3 right-4 bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-6 rounded-lg"
                >
                    Supprimer Annonces
                </button>
                        )
                    }

                    {/* Pagination */}
                    <div className="mt-6 flex justify-between items-center">
                        <button
                            onClick={() => setCurrentPage(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="text-white bg-gray-400 hover:bg-gray-500 py-2 px-4 rounded-lg"
                        >
                            Prev
                        </button>
                        <span className="text-lg font-bold">
                            Page {currentPage} of {totalPages}
                        </span>
                        <button
                            onClick={() => setCurrentPage(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className="text-white bg-gray-400 hover:bg-gray-500 py-2 px-4 rounded-lg"
                        >
                            Next
                        </button>
                    </div>
                </div>
            </div>

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
                                onClick={handleDelete}
                                className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg"
                            >
                                Supprimer
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {/* Delete All Annonces Confirmation Modal */}
            {showDeleteAllConfirmation && (
                <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-10">
                    <div className="bg-white p-8 rounded-lg shadow-md max-w-sm w-full">
                        <h3 className="text-xl font-bold mb-4">Confirmer la suppression</h3>
                        <p>Êtes-vous sûr de vouloir supprimer toutes les annonces ?</p>
                        <div className="mt-4 flex justify-between">
                            <button
                                onClick={() => setShowDeleteAllConfirmation(false)}
                                className="bg-gray-400 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded-lg"
                            >
                                Annuler
                            </button>
                            <button
                                onClick={deleteAllAnnonces}
                                className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg"
                            >
                                Supprimer
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal for update */}
            {showUpdateModal && (
                <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-10">
                    <div className="bg-white p-8 rounded-lg shadow-md max-w-sm w-full">
                        <h3 className="text-xl font-bold mb-4">Modifier l'annonce</h3>
                        <div className="space-y-4">
                            {/* Form fields for update */}
                            <div>
                                <label className="block text-gray-700">Date Publication:</label>
                                <input
                                    type="date"
                                    value={selectedAnnonce.datePublication}
                                    onChange={(e) => setSelectedAnnonce({ ...selectedAnnonce, datePublication: e.target.value })}
                                    className="w-full p-2 border rounded-lg"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700">Poids Disponible:</label>
                                <input
                                    type="number"
                                    value={selectedAnnonce.poidsDisponible}
                                    onChange={(e) => setSelectedAnnonce({ ...selectedAnnonce, poidsDisponible: e.target.value })}
                                    className="w-full p-2 border rounded-lg"
                                />
                            </div>
                            <div className="flex justify-between gap-2 mt-4">
                                <button
                                    onClick={() => setShowUpdateModal(false)}
                                    className="bg-gray-400 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded-lg"
                                >
                                    Annuler
                                </button>
                                <button
                                    onClick={handleUpdate}
                                    className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg"
                                >
                                    Mettre à jour
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AnnoncesList;
