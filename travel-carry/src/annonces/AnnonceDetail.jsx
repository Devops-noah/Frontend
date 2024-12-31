import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { format } from "date-fns";

const AnnonceDetail = () => {
    const { id } = useParams(); // Get the annonce ID from the URL
    const [annonce, setAnnonce] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [userType, setUserType] = useState(""); // State to hold the user's type
    const navigate = useNavigate();

    // Fetch the single annonce
    useEffect(() => {
        const token = localStorage.getItem("token"); // Retrieve the JWT token from localStorage
        const storedUserType = localStorage.getItem("userType"); // Retrieve the user type from localStorage
        setUserType(storedUserType); // Set the user type (expediteur or voyageur)
        axios
            .get(`http://localhost:8080/api/annonces/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`, // Attach the token to the request
                },
            })
            .then((response) => {
                setAnnonce(response.data);
                console.log("Annonce fetched successfully: ", response.data);
                setLoading(false);
            })
            .catch((err) => {
                setError("Failed to fetch annonce. Please try again later.");
                setLoading(false);
                console.error("Error fetching annonce: ", err);
            });
    }, [id]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <p className="text-lg font-semibold">Loading...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <p className="text-lg font-semibold text-red-500">{error}</p>
            </div>
        );
    }

    console.log("User type:", userType);

    return (
        <div className="min-h-screen bg-gray-100 py-8">
            <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
                {/* Header Section */}
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-gray-800">
                        Annonce Details
                    </h1>
                    <p className="text-gray-500 text-sm">
                        Published on:{" "}
                        {format(annonce.datePublication, "dd-MM-yyyy")}
                    </p>
                </div>

                {/* Details Section */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {/* Departure Details */}
                    <div className="bg-gray-50 p-4 rounded-lg shadow">
                        <h2 className="text-lg font-semibold text-blue-600 mb-2">
                            Departure Details
                        </h2>
                        <p className="text-gray-700">
                            <strong>Date Depart:</strong>{" "}
                            {format(annonce.dateDepart, "dd-MM-yyyy")}
                        </p>
                        <p className="text-gray-700">
                            <strong>Pays Depart:</strong> {annonce.paysDepart}
                        </p>
                    </div>

                    {/* Arrival Details */}
                    <div className="bg-gray-50 p-4 rounded-lg shadow">
                        <h2 className="text-lg font-semibold text-green-600 mb-2">
                            Arrival Details
                        </h2>
                        <p className="text-gray-700">
                            <strong>Date Arrivee:</strong>{" "}
                            {format(annonce.dateArrivee, "dd-MM-yyyy")}
                        </p>
                        <p className="text-gray-700">
                            <strong>Pays Destination:</strong>{" "}
                            {annonce.paysDestination}
                        </p>
                    </div>
                </div>

                {/* Additional Details */}
                <div className="mt-6 bg-gray-50 p-4 rounded-lg shadow">
                    <h2 className="text-lg font-semibold text-gray-800 mb-2">
                        Additional Information
                    </h2>
                    <p className="text-gray-700">
                        <strong>Poids Disponible:</strong> {annonce.poidsDisponible} kg
                    </p>
                    <p className="text-gray-700">
                        <strong>Voyageur:</strong> {annonce.voyageurNom || "N/A"}
                    </p>
                </div>

                {/* Button Section */}
                <div className="mt-8 flex justify-between">
                    {userType === "expediteur" && (
                        <button
                            onClick={() => navigate(`/colis/details`)} // Navigate to the colis details page
                            className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded-lg"
                        >
                            Details Colis
                        </button>
                    )}
                    <button
                        onClick={() => window.history.back()}
                        className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg"
                    >
                        Back to Annonces
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AnnonceDetail;
