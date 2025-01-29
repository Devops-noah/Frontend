import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const CreateVoyage = () => {
    const [paysDepartOptions, setPaysDepartOptions] = useState([]);
    const [paysDestinationOptions, setPaysDestinationOptions] = useState([]);
    const [voyage, setVoyage] = useState({
        dateDepart: "",
        dateArrivee: "",
    });
    const [paysDepart, setPaysDepart] = useState("");
    const [paysDestination, setPaysDestination] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const navigate = useNavigate();

    // Check if the user is a Voyageur
    useEffect(() => {
        const userType = localStorage.getItem("userType"); // Assuming you store the user type in localStorage
        if (userType !== "voyageur") {
            navigate("/"); // Redirect to home or another page if the user is not a Voyageur
        }
    }, [navigate]);

    // Fetch Pays data from the backend
    useEffect(() => {
        const fetchPays = async () => {
            try {
                const token = localStorage.getItem("token"); // Assuming you store the token in localStorage
                const response = await axios.get("http://localhost:8080/api/pays", {
                    headers: {
                        Authorization: `Bearer ${token}`, // Add the token to the request
                    },
                });
                console.log("pays response: " + JSON.stringify(response.data));
                setPaysDepartOptions(response.data);
                setPaysDestinationOptions(response.data);
            } catch (error) {
                console.error("Error fetching pays", error);
                setErrorMessage("Failed to load countries.");
            }
        };

        fetchPays();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem("token"); // Get the stored token

            // Make the POST request with the correct structure
            const response = await axios.post(
                "http://localhost:8080/api/voyages",
                {
                    voyage: voyage, // Payload object
                    paysDepart: paysDepart,
                    paysDestination: paysDestination,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`, // Add the token in the headers
                    },
                }
            );

            console.log("Voyage created:", response.data);
            // Redirect to another page or show success message
            navigate("/user-profile"); // Replace with the desired route
        } catch (error) {
            console.error("Error creating voyage:", error);
            setErrorMessage(error.response?.data || "An error occurred while creating the voyage.");
        }
    };


    return (
        <div className="container mx-auto px-4 py-6">
            <h1 className="text-2xl font-semibold text-center mb-6">Create Voyage</h1>
            <form onSubmit={handleSubmit} className="max-w-lg mx-auto bg-white p-6 rounded-lg shadow-md">
                <div className="mb-4">
                    <label htmlFor="dateDepart" className="block text-sm font-medium text-gray-700">Date Départ:</label>
                    <input
                        type="date"
                        id="dateDepart"
                        value={voyage.dateDepart}
                        onChange={(e) => setVoyage({ ...voyage, dateDepart: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="dateArrivee" className="block text-sm font-medium text-gray-700">Date Arrivée:</label>
                    <input
                        type="date"
                        id="dateArrivee"
                        value={voyage.dateArrivee}
                        onChange={(e) => setVoyage({ ...voyage, dateArrivee: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="paysDepart" className="block text-sm font-medium text-gray-700">Pays de Départ:</label>
                    <select
                        id="paysDepart"
                        value={paysDepart}
                        onChange={(e) => setPaysDepart(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    >
                        <option value="">Select Pays Depart</option>
                        {paysDepartOptions.map((pays) => (
                            <option key={pays.id} value={pays.nom}>
                                {pays.nom}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="mb-6">
                    <label htmlFor="paysDestination" className="block text-sm font-medium text-gray-700">Pays de Destination:</label>
                    <select
                        id="paysDestination"
                        value={paysDestination}
                        onChange={(e) => setPaysDestination(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    >
                        <option value="">Select Pays Destination</option>
                        {paysDestinationOptions.map((pays) => (
                            <option key={pays.id} value={pays.nom}>
                                {pays.nom}
                            </option>
                        ))}
                    </select>
                </div>

                {errorMessage && (
                    <p className="text-red-500 text-sm mb-4">{errorMessage}</p>
                )}

                <button
                    type="submit"
                    className="w-full py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    Create Voyage
                </button>
            </form>
        </div>
    );
};

export default CreateVoyage;
