import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import TravelAnimation from "../TravelAnimation";

const CreateAnnonce = () => {
    const [userType, setUserType] = useState(null);
    const [formData, setFormData] = useState({
        datePublication: "",
        poidsDisponible: "",
        voyageId: "",
        paysDepart: "",
        paysDestination: "",
        dateDepart: "",
        dateArrivee: "",
    });
    const [voyage, setVoyage] = useState(null);
    const [voyages, setVoyages] = useState([]); // List of all voyages for the dropdown
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const { id } = useParams();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/login");
            return;
        }

        axios
            .get("http://localhost:8080/api/auth/me", {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then((response) => {
                const user = response.data;
                if (user.type === "expediteur") {
                    toast.error("Unauthorized! Only Voyageurs can create an annonce.", {
                        position: toast.POSITION.TOP_CENTER,
                        autoClose: 5000,
                    });
                    setTimeout(() => navigate("/"), 5000);
                } else {
                    setUserType(user.type);
                    fetchVoyageData(token, id);
                    fetchAllVoyages(token); // Fetch all voyages for dropdown
                }
            })
            .catch(() => {
                navigate("/");
            });
    }, [navigate, id]);

    const fetchVoyageData = async (token, voyageId) => {
        try {
            const response = await axios.get(`http://localhost:8080/api/voyages/${voyageId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            const voyageData = response.data;
            setVoyage(voyageData);

            setFormData((prevFormData) => ({
                ...prevFormData,
                voyageId: voyageData.id,
                paysDepart: voyageData.paysDepart?.nom || "",
                paysDestination: voyageData.paysDestination?.nom || "",
                dateDepart: voyageData.dateDepart || "",
                dateArrivee: voyageData.dateArrivee || "",
            }));
        } catch (error) {
            console.error("Failed to fetch voyage data:", error);
            toast.error("Failed to load voyage data. Please try again later.", {
                position: toast.POSITION.TOP_CENTER,
            });
        }
    };

    const fetchAllVoyages = async (token) => {
        try {
            // Fetch all voyages
            const response = await axios.get("http://localhost:8080/api/voyages", {
                headers: { Authorization: `Bearer ${token}` },
            });

            // Decode the email from the token
            const userEmail = JSON.parse(atob(token.split(".")[1])).sub; // Assuming `sub` contains the email

            // Filter voyages where the `voyage.voyageurEmail` matches the logged-in user's email
            const userVoyages = response.data.filter((voyage) => voyage.voyageurEmail === userEmail);

            setVoyages(userVoyages);
        } catch (error) {
            console.error("Failed to fetch voyages:", error);
            toast.error("Failed to load voyages. Please try again later.", {
                position: toast.POSITION.TOP_CENTER,
            });
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
    };

    const handleVoyageChange = (e) => {
        const selectedVoyageId = e.target.value;
        if (selectedVoyageId === "") {
            // Do nothing and stay on the current page
            return;
        } else {
            // Update URL with the selected voyage ID
            navigate(`/create-annonce/${selectedVoyageId}`);
        }

    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const { voyageId, poidsDisponible, datePublication } = formData;

        if (!voyageId || !poidsDisponible || !datePublication) {
            toast.error("Please fill in all required fields.", {
                position: toast.POSITION.TOP_CENTER,
            });
            return;
        }

        const token = localStorage.getItem("token");
        if (!token) {
            setError("You must be logged in to create an annonce.");
            navigate("/login");
            return;
        }

        try {
            await axios.post(
                `http://localhost:8080/api/annonces/${voyageId}`,
                formData,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            setMessage("Annonce created successfully!");
            navigate("/annonces");
        } catch (error) {
            console.error("Error creating annonce:", error);
            setError(
                error.response?.data?.message ||
                "An error occurred while creating the annonce."
            );
        }
    };

    return (
        <>
            <ToastContainer />
            <div className="p-6 bg-gray-100 min-h-screen">
                <div className="w-full max-w-lg mx-auto bg-white p-6 rounded-lg shadow">
                    <h2 className="text-2xl font-semibold text-center text-blue-600 mb-6">
                        Create Annonce
                    </h2>

                    {message && <p className="text-green-500 text-center mb-4">{message}</p>}
                    {error && <p className="text-red-500 text-center mb-4">{error}</p>}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Voyage Selection Dropdown */}
                        <div>
                            <label htmlFor="voyageId" className="block mb-2 text-md font-medium text-gray-700">
                                Select Voyage
                            </label>
                            <select
                                id="voyageId"
                                name="voyageId"
                                value={id}
                                onChange={handleVoyageChange}
                                className="block w-full border border-gray-300 rounded-md bg-green-50 text-center text-gray-700 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                required
                            >
                                <option value="">-- Select a Voyage --</option>
                                {voyages.map((voyage) => (
                                    <option key={voyage.id} value={voyage.id}>
                                        {voyage.paysDepartNom} ➡️ {voyage.paysDestinationNom} &nbsp; &nbsp; |  &nbsp; &nbsp;{new Date(voyage.dateDepart).toLocaleDateString()}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Travel Animation Component */}
                        {voyage && (
                            <div className="mt-8">
                                <TravelAnimation
                                    paysDepart={voyage.paysDepart?.nom}
                                    paysDestination={voyage.paysDestination?.nom}
                                    dateDepart={new Date(voyage.dateDepart).toLocaleDateString()}
                                    dateArrivee={new Date(voyage.dateArrivee).toLocaleDateString()}
                                />
                            </div>
                        )}

                        <div>
                            <label htmlFor="datePublication" className="block text-sm font-medium text-gray-700">
                                Publication Date
                            </label>
                            <input
                                id="datePublication"
                                type="date"
                                name="datePublication"
                                value={formData.datePublication}
                                onChange={handleInputChange}
                                className="w-full p-2 border border-gray-300 rounded mt-1"
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="poidsDisponible" className="block text-sm font-medium text-gray-700">
                                Weight Available (kg)
                            </label>
                            <input
                                id="poidsDisponible"
                                type="number"
                                name="poidsDisponible"
                                value={formData.poidsDisponible}
                                onChange={handleInputChange}
                                className="w-full p-2 border border-gray-300 rounded mt-1"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
                        >
                            Submit
                        </button>
                    </form>
                </div>
            </div>
        </>
    );
};

export default CreateAnnonce;
