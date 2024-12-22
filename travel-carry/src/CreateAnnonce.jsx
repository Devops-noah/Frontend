import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const CreateAnnonce = () => {
    const [userType, setUserType] = useState(null);
    const [formData, setFormData] = useState({
        dateDepart: "",
        dateArrivee: "",
        datePublication: "",
        poidsDisponible: "",
        voyageId: "",
        paysDepart: "",
        paysDestination: "",
    });
    const [voyages, setVoyages] = useState([]);
    const [pays, setPays] = useState([]);
    const navigate = useNavigate();

    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

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
                    fetchInitialData(token);
                }
            })
            .catch(() => {
                navigate("/");
            });
    }, [navigate]);

    const fetchInitialData = async (token) => {
        try {
            const [voyagesResponse, paysResponse] = await Promise.all([
                axios.get("http://localhost:8080/api/voyages", {
                    headers: { Authorization: `Bearer ${token}` },
                }),
                axios.get("http://localhost:8080/api/pays", {
                    headers: { Authorization: `Bearer ${token}` },
                }),
            ]);
            setVoyages(voyagesResponse.data);
            setPays(paysResponse.data);
        } catch (error) {
            console.error("Failed to fetch initial data:", error);
            toast.error("Failed to load data. Please try again later.", {
                position: toast.POSITION.TOP_CENTER,
            });
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem("token");
        if (!token) {
            setError("You must be logged in to create an annonce.");
            navigate("/login");
            return;
        }

        try {
            const response = await axios.post(
                "http://localhost:8080/api/annonces",
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
                            <label htmlFor="dateDepart" className="block text-sm font-medium text-gray-700">
                                Departure Date
                            </label>
                            <input
                                id="dateDepart"
                                type="date"
                                name="dateDepart"
                                value={formData.dateDepart}
                                onChange={handleInputChange}
                                className="w-full p-2 border border-gray-300 rounded mt-1"
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="dateArrivee" className="block text-sm font-medium text-gray-700">
                                Arrival Date
                            </label>
                            <input
                                id="dateArrivee"
                                type="date"
                                name="dateArrivee"
                                value={formData.dateArrivee}
                                onChange={handleInputChange}
                                className="w-full p-2 border border-gray-300 rounded mt-1"
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="poidsDisponible" className="block text-sm font-medium text-gray-700">
                                Available Weight (kg)
                            </label>
                            <input
                                id="poidsDisponible"
                                type="number"
                                name="poidsDisponible"
                                value={formData.poidsDisponible}
                                onChange={handleInputChange}
                                placeholder="Enter weight"
                                className="w-full p-2 border border-gray-300 rounded mt-1"
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="voyageId" className="block text-sm font-medium text-gray-700">
                                Voyage
                            </label>
                            <select
                                id="voyageId"
                                name="voyageId"
                                value={formData.voyageId}
                                onChange={handleInputChange}
                                className="w-full p-2 border border-gray-300 rounded mt-1"
                                required
                            >
                                <option value="">Select a Voyage</option>
                                {voyages.map((voyage) => (
                                    <option key={voyage.id} value={voyage.id}>
                                        Voyage {voyage.id}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label htmlFor="paysDepart" className="block text-sm font-medium text-gray-700">
                                Departure Country
                            </label>
                            <select
                                id="paysDepart"
                                name="paysDepart"
                                value={formData.paysDepart}
                                onChange={handleInputChange}
                                className="w-full p-2 border border-gray-300 rounded mt-1"
                                required
                            >
                                <option value="">Select Departure Country</option>
                                {pays.map((pay) => (
                                    <option key={pay.id} value={pay.nom}>
                                        {pay.nom}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label htmlFor="paysDestination" className="block text-sm font-medium text-gray-700">
                                Destination Country
                            </label>
                            <select
                                id="paysDestination"
                                name="paysDestination"
                                value={formData.paysDestination}
                                onChange={handleInputChange}
                                className="w-full p-2 border border-gray-300 rounded mt-1"
                                required
                            >
                                <option value="">Select Destination Country</option>
                                {pays.map((pay) => (
                                    <option key={pay.id} value={pay.nom}>
                                        {pay.nom}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition"
                        >
                            Create Annonce
                        </button>
                    </form>
                </div>
            </div>
        </>
    );
};

export default CreateAnnonce;
