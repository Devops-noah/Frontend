import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import Toastify styles

const CreateAnnonce = () => {
    const [userType, setUserType] = useState(null); // To track user type
    const [formData, setFormData] = useState({
        dateDepart: "",
        dateArrivee: "",
        poidsDisponible: "",
        voyageId: "",
        paysDepartNom: "",
        paysDestinationNom: "",
    });
    const navigate = useNavigate();

    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        const token = localStorage.getItem("token");

        if (!token) {
            navigate("/login"); // Redirect to login if not authenticated
            return;
        }

        // Fetch user type
        axios
            .get("http://localhost:8080/api/auth/me", {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then((response) => {
                const user = response.data;
                console.log("user data: ", user); // Log user data for debugging

                // Ensure we're checking the correct user type
                if (user.type === "expediteur") {
                    // Display message
                    toast.error("You are not authorized! Only Voyageur can access this page.", {
                        position: toast.POSITION.TOP_CENTER,
                        autoClose: 50000, // Auto close after 5 seconds
                    });

                    // Redirect to home after a delay
                    setTimeout(() => {
                        navigate("/"); // Redirect to home page after 5 seconds
                    }, 5000);
                } else {
                    setUserType(user.type); // Set user type
                }
            })
            .catch(() => {
                navigate("/"); // Redirect to home if there's an error (e.g., token expired)
            });
    }, [navigate]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const token = localStorage.getItem("token");

        axios
            .post("http://localhost:8080/api/annonces", formData, {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then((response) => {
                setMessage("Annonce created successfully!");
                navigate("/annonces");
            })
            .catch((error) => {
                setError("Error creating annonce: " + error.response?.data?.message || error.message);
            });
    };

    return (
        <>
            {/* ToastContainer is essential for rendering Toast notifications */}
            <ToastContainer />

            <div className="p-6 bg-gray-100 min-h-screen">
                <div className="w-1/2 mx-auto bg-white p-6 rounded-lg shadow">
                    <h2 className="text-2xl font-semibold text-center text-blue-600 mb-6">Créer une Annonce</h2>

                    {message && <p className="text-green-500 text-center mb-4">{message}</p>}
                    {error && <p className="text-red-500 text-center mb-4">{error}</p>}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <input
                            type="date"
                            name="dateDepart"
                            value={formData.dateDepart}
                            onChange={handleInputChange}
                            className="w-full p-2 border border-gray-300 rounded"
                            required
                        />
                        <input
                            type="date"
                            name="dateArrivee"
                            value={formData.dateArrivee}
                            onChange={handleInputChange}
                            className="w-full p-2 border border-gray-300 rounded"
                            required
                        />
                        <input
                            type="number"
                            name="poidsDisponible"
                            value={formData.poidsDisponible}
                            onChange={handleInputChange}
                            placeholder="Poids (kg)"
                            className="w-full p-2 border border-gray-300 rounded"
                            required
                        />
                        <input
                            type="text"
                            name="paysDepart"
                            value={formData.paysDepart}
                            onChange={handleInputChange}
                            placeholder="Pays de départ"
                            className="w-full p-2 border border-gray-300 rounded"
                            required
                        />
                        <input
                            type="text"
                            name="paysDestination"
                            value={formData.paysDestination}
                            onChange={handleInputChange}
                            placeholder="Pays de destination"
                            className="w-full p-2 border border-gray-300 rounded"
                            required
                        />
                        <button
                            type="submit"
                            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition"
                        >
                            Créer l'Annonce
                        </button>
                    </form>
                </div>
            </div>
        </>
    );
};

export default CreateAnnonce;
