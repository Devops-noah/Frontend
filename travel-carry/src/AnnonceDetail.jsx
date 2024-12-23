import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const AnnonceDetail = () => {
    const { id } = useParams(); // Get the annonce ID from the URL
    const [annonce, setAnnonce] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Fetch the single annonce
    useEffect(() => {
        const token = localStorage.getItem("token"); // Retrieve the JWT token from localStorage

        axios
            .get(`http://localhost:8080/api/annonces/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`, // Attach the token to the request
                },
            })
            .then((response) => {
                setAnnonce(response.data);
                console.log("response annocne details: " + JSON.stringify(response))
                setLoading(false);
                console.log("Annonce fetched successfully: ", response.data);
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
                        {new Date(annonce.datePublication).toLocaleDateString()}
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
                            {new Date(annonce.dateDepart).toLocaleDateString()}
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
                            {new Date(annonce.dateArrivee).toLocaleDateString()}
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

                {/* Back Button */}
                <div className="mt-8">
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
