import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaEdit, FaTrash } from "react-icons/fa";

export default function UserProfile() {
    const [profile, setProfile] = useState(null); // State to store user profile
    const [loading, setLoading] = useState(true); // State to show loading indicator
    const [error, setError] = useState(null); // State to handle errors
    const navigate = useNavigate(); // Use navigate hook to navigate to different routes

    // Get voyages
    const [voyages, setVoyages] = useState([]);
    const [errorMessage, setErrorMessage] = useState("");
    const [profileType, setProfileType] = useState(""); // To store profile type (voyageur or expediteur)
    const [modalVisible, setModalVisible] = useState(false);
    const [currentVoyage, setCurrentVoyage] = useState(null);
    const [deleteVoyageId, setDeleteVoyageId] = useState(null);
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

    const [currentPage, setCurrentPage] = useState(1); // Current page number
    const [voyagesPerPage] = useState(2); // Number of voyages per page
    const [totalPages, setTotalPages] = useState(1); // Total number of pages

    useEffect(() => {
        // Fetch the user profile based on authentication
        const fetchProfile = async () => {
            try {
                // Retrieve token from localStorage or cookies
                const token = localStorage.getItem("token");

                if (!token) {
                    throw new Error("User is not authenticated");
                }

                const response = await fetch("http://localhost:8080/api/utilisateurs/profile", {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`, // Attach token in Authorization header
                        "Content-Type": "application/json",
                    },
                });

                if (!response.ok) {
                    throw new Error("Failed to fetch profile data");
                }

                const data = await response.json();
                setProfile(data); // Set profile data
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    useEffect(() => {
        const fetchProfileType = () => {
            const token = localStorage.getItem("token");
            if (token) {
                const decodedToken = JSON.parse(atob(token.split('.')[1])); // Decode token to extract profile type

                setProfileType(decodedToken.sub); // Assume profileType is part of the decoded token
            }
        };

        const fetchVoyages = async () => {
            try {
                const token = localStorage.getItem("token"); // Get token from localStorage
                const userEmail = token ? JSON.parse(atob(token.split('.')[1])).sub : ""; // Extract email from token

                const response = await axios.get("http://localhost:8080/api/voyages", {
                    headers: {
                        Authorization: `Bearer ${token}`, // Add the token to the headers
                    },
                });

                // Filter voyages where the voyageur email matches the logged-in user's email
                const userVoyages = response.data.filter(
                    (voyage) => voyage.voyageurEmail === userEmail
                );

                setVoyages(userVoyages);
                setTotalPages(Math.ceil(userVoyages.length / voyagesPerPage)); // Calculate total pages based on filtered voyages
            } catch (error) {
                console.error("Error fetching voyages:", error);
                setErrorMessage("Failed to load voyages. Please try again later.");
            }
        };

        fetchProfileType(); // Get profile type from localStorage
        fetchVoyages(); // Fetch voyages
    }, [currentPage]);

    const handleEdit = (voyage) => {
        // Format the date as yyyy-MM-dd
        const formattedDateDepart = new Date(voyage.dateDepart).toISOString().split('T')[0];
        const formattedDateArrivee = new Date(voyage.dateArrivee).toISOString().split('T')[0];

        setCurrentVoyage({
            ...voyage,
            dateDepart: formattedDateDepart,
            dateArrivee: formattedDateArrivee,
        });

        setModalVisible(true); // Open the modal
    };

    // Open delete confirmation
    const openDeleteConfirmation = (voyageId) => {
        setDeleteVoyageId(voyageId);
        setShowDeleteConfirmation(true);
    };

    const handleCloseModal = () => {
        setModalVisible(false);
    };

    // Handle input changes in the modal
    const handleInputChange = (field, value) => {
        setCurrentVoyage({ ...currentVoyage, [field]: value });
    };

    const handleUpdateVoyage = async () => {
        try {
            const token = localStorage.getItem("token");
            const updatedVoyage = {
                voyage: {
                    dateDepart: currentVoyage.dateDepart,
                    dateArrivee: currentVoyage.dateArrivee,
                },
                paysDepart: currentVoyage.paysDepartNom,
                paysDestination: currentVoyage.paysDestinationNom,
            };

            // Send PUT request to update the voyage
            await axios.put(`http://localhost:8080/api/voyages/update/${currentVoyage.id}`, updatedVoyage, {
                headers: {
                    Authorization: `Bearer ${token}`, // Add the token to the headers
                },
            });

            // Update the voyages list after a successful update
            setVoyages(voyages.map(voyage => voyage.id === currentVoyage.id ? currentVoyage : voyage));
            setModalVisible(false);
        } catch (error) {
            console.error("Error updating voyage:", error);
            setErrorMessage("Failed to update the voyage. Please try again.");
        }
    };

    // Handle delete
    const handleDelete = () => {
        axios
            .delete(`http://localhost:8080/api/voyages/delete/${deleteVoyageId}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`, // Replace with your actual token key
                },
            })
            .then(() => {
                console.log("Voyage deleted successfully");
                setVoyages((prev) => prev.filter((a) => a.id !== deleteVoyageId));
                setShowDeleteConfirmation(false);
            })
            .catch((error) => console.error("Error deleting voyage:", error));
    };

    // Pagination logic
    const indexOfLastVoyage = currentPage * voyagesPerPage;
    const indexOfFirstVoyage = indexOfLastVoyage - voyagesPerPage;
    const currentVoyages = voyages.slice(indexOfFirstVoyage, indexOfLastVoyage);
    console.log("current voyages: " + JSON.stringify(currentVoyages));

    if (loading) {
        return <p className="text-center py-5">Loading...</p>;
    }

    if (error) {
        return <p className="text-center py-5 text-red-500">Error: {error}</p>;
    }

    return (
        <section className="bg-gray-100 py-5">
            <div className="container mx-auto">
                <div className="flex flex-col lg:flex-row gap-4">
                    {/* Profile Card */}
                    <div className="lg:w-1/3">
                        <div className="bg-white rounded-lg shadow-md p-4 text-center">
                            <img
                                src={profile.avatar || "https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava3.webp"}
                                alt="avatar"
                                className="rounded-full w-36 mx-auto mb-4"
                            />
                            <p className="text-lg font-semibold">
                                {profile.nom} {profile.prenom}
                            </p>
                            <p className="text-gray-500 mb-4">{profile.type === "voyageur" ? "Voyageur" : "Expediteur"}</p>
                            <div className="flex justify-center gap-2">
                                {profile.type === "voyageur" ? (
                                    <>
                                        <button
                                            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                                            onClick={() => {
                                                // Check if there are any annonces or if a voyageId exists
                                                if (profile.annonces && profile.annonces.length > 0) {
                                                    const voyageId = profile.annonces[0].voyageId; // Access the first annonce's voyageId
                                                    navigate(`/create-annonce/${voyageId}`);
                                                } else if (profile.voyages[0].id) {
                                                    // If no annonces, but a voyageId exists, navigate to create-annonce page
                                                    navigate(`/create-annonce/${profile.voyages[0].id}`);
                                                } else {
                                                    console.log("profile.voyageId: " + profile.voyageId)
                                                    // Handle case where no annonces exist and no voyageId is available
                                                    alert("No available voyage to create annonce.");
                                                }
                                            }}
                                        >
                                            Create Annonce
                                        </button>
                                        <button
                                            className="border border-gray-300 px-4 py-2 rounded hover:bg-gray-100"
                                            onClick={() => navigate("/create-voyage")}
                                        >
                                            Create Voyage
                                        </button>
                                    </>
                                ) : profile.type === "expediteur" ? (
                                    <button
                                        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                                        onClick={() => navigate("/colis/details")}
                                    >
                                        Mes colis
                                    </button>
                                ) : null}
                            </div>
                        </div>
                    </div>

                    {/* Details Card */}
                    <div className="lg:w-2/3">
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <hr className="my-4"/>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-y-4">
                                <p className="font-medium">Email</p>
                                <p className="text-gray-500 col-span-2">{profile.email}</p>
                            </div>
                            <hr className="my-4"/>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-y-4">
                                <p className="font-medium">Telephone</p>
                                <p className="text-gray-500 col-span-2">{profile.telephone || "N/A"}</p>
                            </div>
                            <hr className="my-4"/>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-y-4">
                                <p className="font-medium">Address</p>
                                <p className="text-gray-500 col-span-2">{profile.adresse || "N/A"}</p>
                            </div>
                            <hr className="my-4"/>
                            {profile.type === "expediteur" && profile.message && (
                                <div className="text-center text-red-500 mt-4">
                                    <p>{profile.message}</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* My Voyages */}
            {profile.type === "voyageur" && (
                <div className="min-h-screen bg-gray-100 py-10">
                    <div className="max-w-6xl mx-auto bg-white p-6 shadow rounded-lg">
                        <h1 className="text-2xl font-bold text-gray-800 mb-4">My Voyages</h1>
                        {errorMessage && (
                            <div className="bg-red-100 text-red-700 p-4 rounded mb-4">
                                {errorMessage}
                            </div>
                        )}
                        {voyages.length > 0 ? (
                            <div className="overflow-x-auto">
                                <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow">
                                    <thead>
                                    <tr className="bg-gray-50 text-left text-sm font-semibold text-gray-700">
                                        <th className="px-4 py-2">Date Depart</th>
                                        <th className="px-4 py-2">Date Arrivee</th>
                                        <th className="px-4 py-2">Pays Depart</th>
                                        <th className="px-4 py-2">Pays Destination</th>
                                        <th className="px-4 py-2">Actions</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {currentVoyages.map((voyage) => (
                                        <tr key={voyage.id} className="border-t border-gray-200 hover:bg-gray-50">
                                            <td className="px-4 py-2">
                                                {new Date(voyage.dateDepart).toLocaleDateString()}
                                            </td>
                                            <td className="px-4 py-2">
                                                {new Date(voyage.dateArrivee).toLocaleDateString()}
                                            </td>
                                            <td className="px-4 py-2">{voyage.paysDepartNom}</td>
                                            <td className="px-4 py-2">{voyage.paysDestinationNom}</td>
                                            <td className="px-4 py-2 flex space-x-2">
                                                <button
                                                    className="text-blue-600 hover:text-blue-800"
                                                    onClick={() => handleEdit(voyage)}
                                                >
                                                    <FaEdit size={18}/>
                                                </button>
                                                <button
                                                    className="text-red-600 hover:text-red-800"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        openDeleteConfirmation(voyage.id);
                                                    }}
                                                >
                                                    <FaTrash size={18}/>
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <p className="text-gray-600">No voyages found for your account.</p>
                        )}
                    </div>
                    <div className="flex justify-center mt-4">
                        <button
                            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md mr-2"
                            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                            disabled={currentPage === 1}
                        >
                            Previous
                        </button>
                        <span className="px-4 py-2 text-gray-700">
                            {console.log("current page value: " + currentPage + " and " + totalPages)}
                                    Page {currentPage} of {totalPages}
                                </span>
                        <button
                            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md ml-2"
                            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                            disabled={currentPage === totalPages}
                        >
                            Next
                        </button>
                    </div>
                </div>


            )}
            {profileType === "expediteur" && (
                <p className="text-gray-600">Voyages are not available for expediteur profile.</p>
            )}

            {/* Modal for delete confirmation */}
            {
                showDeleteConfirmation && (
                    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-10">
                        <div className="bg-white p-8 rounded-lg shadow-md max-w-sm w-full">
                            <h3 className="text-xl font-bold mb-4">Confirmer la suppression</h3>
                            <p>Êtes-vous sûr de vouloir supprimer cette voyage?</p>
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

            {/* Modal for Editing Voyage */}
            {modalVisible && currentVoyage && (
                <div className="fixed inset-0 z-50 bg-gray-500 bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                        <h2 className="text-2xl font-semibold mb-4">Edit Voyage</h2>
                        <form onSubmit={(e) => e.preventDefault()}>
                            <div className="mb-4">
                                <label htmlFor="dateDepart" className="block text-sm font-medium text-gray-700">
                                    Date Depart
                                </label>
                                <input
                                    type="date"
                                    id="dateDepart"
                                    value={currentVoyage.dateDepart}
                                    onChange={(e) => setCurrentVoyage({ ...currentVoyage, dateDepart: e.target.value })}
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                                />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="dateArrivee" className="block text-sm font-medium text-gray-700">
                                    Date Arrivee
                                </label>
                                <input
                                    type="date"
                                    id="dateArrivee"
                                    value={currentVoyage.dateArrivee}
                                    onChange={(e) => setCurrentVoyage({ ...currentVoyage, dateArrivee: e.target.value })}
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                                />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="paysDepart" className="block text-sm font-medium text-gray-700">
                                    Pays Depart
                                </label>
                                <select
                                    id="paysDepart"
                                    value={currentVoyage.paysDepartNom}
                                    onChange={(e) =>
                                        handleInputChange("paysDepartNom", e.target.value)
                                    }
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                                >
                                    {voyages.map((voyage) => (
                                        <option key={voyage.id} value={voyage.paysDepartNom}>
                                            {voyage.paysDepartNom}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="mb-4">
                                <label htmlFor="paysDestination" className="block text-sm font-medium text-gray-700">
                                    Pays Destination
                                </label>
                                <select
                                    id="paysDestination"
                                    value={currentVoyage.paysDestinationNom}
                                    onChange={(e) =>
                                        handleInputChange("paysDestinationNom", e.target.value)
                                    }
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                                >
                                    {voyages.map((voyage) => (
                                        <option key={voyage.id} value={voyage.paysDestinationNom}>
                                            {voyage.paysDestinationNom}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="flex justify-end space-x-4">
                                <button
                                    type="button"
                                    onClick={handleCloseModal}
                                    className="text-gray-600 hover:text-gray-800"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    onClick={handleUpdateVoyage}
                                    className="bg-blue-600 text-white px-4 py-2 rounded-md"
                                >
                                    Save Changes
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </section>
    );
}
