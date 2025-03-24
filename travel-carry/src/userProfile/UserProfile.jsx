import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from 'react-toastify';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaEdit, FaTrash } from "react-icons/fa";
import DemandesList from "../demandes/DemandesList";
import UpdateUserProfileImage from "./UpdateUserProfileImage";
import notifications from "../notifications/Notifications";

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

    const [profileImage, setProfileImage] = useState(null);
    const [currentPage, setCurrentPage] = useState(1); // Current page number
    const [voyagesPerPage] = useState(2); // Number of voyages per page
    const [totalPages, setTotalPages] = useState(1); // Total number of pages


    // Retrieve token from localStorage or cookies
    const token = localStorage.getItem("token");
    // const decodeToken = JSON.parse(atob(token.split('.')[1]));
    const decodeToken = token ? JSON.parse(atob(token.split('.')[1])) : null;

    const userId = localStorage.getItem("userId");

    const [isEditing, setIsEditing] = useState({
        nom: false,
        prenom: false,
        telephone: false,
        adresse: false,
    });
    const [editedProfile, setEditedProfile] = useState({
        nom: "",
        prenom: "",
        telephone: "",
        adresse: "",
    });

    useEffect(() => {
        // Fetch the user profile based on authentication
        const fetchProfile = async () => {
            try {
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
                console.log("response profile: ", JSON.stringify(response))

                if (!response.ok) {
                    throw new Error("Failed to fetch profile data");
                }

                const data = await response.json();
                setProfile(data); // Set profile data
                setEditedProfile({
                    nom: data.nom,
                    prenom: data.prenom,
                    telephone: data.telephone || "",
                    adresse: data.adresse || "",
                });
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [token]);

    useEffect(() => {
        const fetchProfileType = () => {
            if (token) {
                const decodedToken = JSON.parse(atob(token.split('.')[1])); // Decode token to extract profile type

                setProfileType(decodedToken.sub); // Assume profileType is part of the decoded token
            }
        };

        const fetchVoyages = async () => {
            try {
                const userEmail = decodeToken?.sub || "Unknow user";  // Use optional chaining to prevent crashes

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

    useEffect(() => {
        if (!userId || profileImage) return; // ✅ Stop fetch if image is already set

        const fetchProfileImage = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/api/utilisateurs/profiles/images/${userId}`, {
                    responseType: 'text', // ✅ Ensure response is treated as text, not JSON
                });

                if (response.status === 200) {
                    setProfileImage(response.data);  // ✅ Directly store image URL
                } else {
                    console.error("Profile image not found, using default.");
                    setProfileImage("https://via.placeholder.com/150"); // ✅ Fallback image
                }
            } catch (err) {
                console.error("Error fetching profile image:", err);
                setProfileImage("https://via.placeholder.com/150"); // ✅ Fallback image
            }
        };


        fetchProfileImage();
    }, [userId, profileImage]); // ✅ Stops infinite loop


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
                setVoyages((prev) => prev.filter((a) => a.id !== deleteVoyageId));
                setShowDeleteConfirmation(false);
            })
            .catch((error) => console.error("Error deleting voyage:", error));
    };

    // Handle editing toggle
    const handleEditClick = (field) => {
        setIsEditing((prev) => ({ ...prev, [field]: true }));
    };

    // Handle input change
    const handleInputChangeEditProfile = (e) => {
        const { name, value } = e.target;
        setEditedProfile((prev) => ({ ...prev, [name]: value }));
    };

    // Handle save logic
    const handleSaveClick = async (field) => {
        try {
            const updatedField = { [field]: editedProfile[field] };

            await axios.put(`http://localhost:8080/api/utilisateurs/profile/update/${profile.id}`, updatedField, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`, // Replace with your actual token key
                }
            }); // Update field
            setProfile((prev) => ({ ...prev, ...updatedField })); // Update state
            // Success toast notification
            toast.success(`${field} has been successfully updated!`, {
                position: "top-right", // Correct position
                autoClose: 5000, // Duration before it disappears
            });
        } catch (error) {
            console.error("Error updating profile:", error);
            // Error toast notification
            toast.error(`There was an error updating your ${field}. Please try again.`, {
                position: "top-right", // Correct position
                autoClose: 5000,
            });
        } finally {
            setIsEditing((prev) => ({ ...prev, [field]: false })); // Exit edit mode
        }
    };

    // Pagination logic
    const indexOfLastVoyage = currentPage * voyagesPerPage;
    const indexOfFirstVoyage = indexOfLastVoyage - voyagesPerPage;
    const currentVoyages = voyages.slice(indexOfFirstVoyage, indexOfLastVoyage);

    if (loading && !profile) {
        return (
            <div className="flex justify-center items-center py-5">
                <svg className="w-10 h-10 text-gray-500 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" strokeOpacity="0.25"></circle>
                    <path d="M22 12a10 10 0 1 1-10-10" strokeOpacity="0.75"></path>
                </svg>
            </div>
        );
    }


    if (error) {
        return <p className="text-center py-5 text-red-500">Error: {error}</p>;
    }

    console.log("edit profile value: ", profile.userTypes.dtype[1]);
    console.log("test profile image: ", profileImage)

    return (
        <section className="bg-gray-100 py-5">
            <div className="container mx-auto">
                <div>
                    <ToastContainer/>
                    {/* Your other components */}
                </div>
                <div className="flex flex-col lg:flex-row gap-4">
                    {/* Profile Card */}
                    <div className="lg:w-1/3 mx-auto">
                        <div className="bg-white rounded-lg shadow-md p-4 text-center">
                            <img
                                src={profileImage || "https://via.placeholder.com/150"}
                                alt="Upload your photo"
                                className="rounded-full w-36 h-36 object-cover mx-auto mb-4"
                            />
                            <div className="max-w-xs mx-auto">
                                <UpdateUserProfileImage/>
                            </div>
                            <p className="text-lg font-semibold">
                                {editedProfile.nom} {editedProfile.prenom}
                            </p>
                            <p className="text-gray-500 mb-4">
                                {profile.admin
                                    ? "Admin"
                                    : {
                                    voyageur: "Voyageur",
                                    expediteur: "Expediteur",
                                }[profile.type] || "Unknown"}
                            </p>

                            <div className="flex justify-center gap-2">
                                {profile && userId && Number(profile.id) === Number(userId) && !profile.admin ? (
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

                                        {/*{profile.userTypes?.dtype?.includes("EXPEDITEUR") && (*/}
                                        {/*    <button*/}
                                        {/*        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"*/}
                                        {/*        onClick={() => navigate("/colis/details")}*/}
                                        {/*    >*/}
                                        {/*        Mes colis*/}
                                        {/*    </button>*/}
                                        {/*)}*/}
                                    </>
                                ) : profile.admin ? (
                                    <button
                                        className="bg-violet-400 text-white px-4 py-2 rounded hover:bg-violet-900"
                                        onClick={() => navigate("/admin/users")}
                                    >
                                        Admin Dashboard
                                    </button>
                                ) : null}
                            </div>
                        </div>
                    </div>

                    {/* Details Card */}
                    <div className="w-2/4 mx-auto">
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <hr className="my-4"/>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-y-4">
                                <p className="font-medium">Email</p>
                                <p className="text-gray-500 col-span-2">{profile.email}</p>
                            </div>
                            <hr className="my-4"/>
                            {/* Editable Nom */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-y-4">
                                <p className="font-medium">Nom</p>
                                {isEditing.nom ? (
                                    <input
                                        type="text"
                                        name="nom"
                                        value={editedProfile.nom}
                                        onChange={handleInputChangeEditProfile}
                                        className="border px-2 py-1 rounded col-span-2 bg-blue-200"
                                        onBlur={() => handleSaveClick("nom")}
                                    />
                                ) : (
                                    <p
                                        className="text-gray-500 col-span-2 cursor-pointer underline decoration-2 decoration-blue-500"
                                        onClick={() => handleEditClick("nom")}
                                    >
                                        {profile.nom}
                                    </p>
                                )}
                            </div>
                            <hr className="my-4"/>
                            {/* Editable Prenom */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-y-4">
                                <p className="font-medium">Prenom</p>
                                {isEditing.prenom ? (
                                    <input
                                        type="text"
                                        name="prenom"
                                        value={editedProfile.prenom}
                                        onChange={handleInputChangeEditProfile}
                                        className="border px-2 py-1 rounded col-span-2 bg-green-200"
                                        onBlur={() => handleSaveClick("prenom")}
                                    />
                                ) : (
                                    <p
                                        className="text-gray-500 col-span-2 cursor-pointer underline decoration-2 decoration-green-500"
                                        onClick={() => handleEditClick("prenom")}
                                    >
                                        {profile.prenom}
                                    </p>
                                )}
                            </div>
                            <hr className="my-4"/>
                            {/* Editable Telephone */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-y-4">
                                <p className="font-medium">Telephone</p>
                                {isEditing.telephone ? (
                                    <input
                                        type="text"
                                        name="telephone"
                                        value={editedProfile.telephone}
                                        onChange={handleInputChangeEditProfile}
                                        className="border px-2 py-1 rounded col-span-2 bg-yellow-200"
                                        onBlur={() => handleSaveClick("telephone")}
                                    />
                                ) : (
                                    <p
                                        className="text-gray-500 col-span-2 cursor-pointer underline decoration-2 decoration-yellow-500"
                                        onClick={() => handleEditClick("telephone")}
                                    >
                                        {profile.telephone || "N/A"}
                                    </p>
                                )}
                            </div>
                            <hr className="my-4"/>
                            {/* Editable Adresse */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-y-4">
                                <p className="font-medium">Adresse</p>
                                {isEditing.adresse ? (
                                    <input
                                        type="text"
                                        name="adresse"
                                        value={editedProfile.adresse}
                                        onChange={handleInputChangeEditProfile}
                                        className="border px-2 py-1 rounded col-span-2 bg-pink-200"
                                        onBlur={() => handleSaveClick("adresse")}
                                    />
                                ) : (
                                    <p
                                        className="text-gray-500 col-span-2 cursor-pointer underline decoration-2 decoration-pink-500"
                                        onClick={() => handleEditClick("adresse")}
                                    >
                                        {profile.adresse || "N/A"}
                                    </p>
                                )}
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
            {console.log("Checking Profile ID and User ID:", profile)}
            {console.log("Voyages Array:", profile.voyages)}
            {console.log("Annonces Array:", profile.annonces)}

            {profile && userId && Number(profile.id) === Number(userId) && profile.voyages && profile.voyages.length > 0 && (
                <div className="bg-gray-100 py-10">
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
            {
                !profile.admin && (
                    <div>
                        <DemandesList/>
                    </div>
                )
            }


            {/*{profile && userId &&*/}
            {/*    Number(profile.id) === Number(userId) &&*/}
            {/*    profile.userTypes?.dType && // ✅ Ensure userTypes exists*/}
            {/*    Array.isArray(profile.userTypes.dType) && // ✅ Ensure it's an array*/}
            {/*    profile.userTypes.dType.includes("EXPEDITEUR") && // ✅ Now it's safe to call includes()*/}
            {/*    profile.demandes && profile.demandes.length > 0 && (*/}
            {/*        <div className="mt-8">*/}
            {/*            /!*<DemandesList/>*!/*/}
            {/*            {profile.demandes[0].createdAt}*/}
            {/*        </div>*/}
            {/*    )}*/}





            {/*{profileType === "expediteur" && (*/}
            {/*    <p className="text-red-600">Voyages are not available for expediteur profile.</p>*/}
            {/*)}*/}

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
