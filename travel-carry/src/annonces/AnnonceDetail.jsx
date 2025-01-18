import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { format } from "date-fns";

const AnnonceDetail = () => {
    const location = useLocation(); // Utilisé pour obtenir l'URL complète
    const navigate = useNavigate();

    // Extraire les IDs de l'URL (ex: "/annonces/32/39/63" -> ["32", "39", "63"])
    const annonceIds = location.pathname.replace("/annonces/", "").split("/");

    const [annonces, setAnnonces] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [userType, setUserType] = useState("");

    // Fetch les annonces
    useEffect(() => {
        const token = localStorage.getItem("token");
        const storedUserType = localStorage.getItem("userType");
        setUserType(storedUserType);

        const fetchAnnonces = async () => {
            try {
                const fetchedAnnonces = await Promise.all(
                    annonceIds.map((id) =>
                        axios.get(`http://localhost:8080/api/annonces/${id}`, {
                            headers: {
                                Authorization: `Bearer ${token}`,
                            },
                        })
                    )
                );
                setAnnonces(fetchedAnnonces.map((response) => response.data));
                setLoading(false);
            } catch (err) {
                setError("Failed to fetch annonces. Please try again later.");
                setLoading(false);
                console.error("Error fetching annonces: ", err);
            }
        };

        fetchAnnonces();
    }, [annonceIds]);

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
                <h1 className="text-2xl font-bold text-gray-800">Détails des Annonces</h1>
                {annonces.map((annonce, index) => (
                    <div key={index} className="mb-8">
                        {/* Header Section */}
                        <div className="mb-4">
                            <h2 className="text-xl font-bold text-gray-800">
                                Annonce ID: {annonce.id}
                            </h2>
                            <p className="text-gray-500 text-sm">
                                Published on: {format(new Date(annonce.datePublication), "dd-MM-yyyy")}
                            </p>
                        </div>

                        {/* Details Section */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            {/* Departure Details */}
                            <div className="bg-gray-50 p-4 rounded-lg shadow">
                                <h3 className="text-lg font-semibold text-blue-600 mb-2">
                                    Departure Details
                                </h3>
                                <p className="text-gray-700">
                                    <strong>Date Depart:</strong> {format(new Date(annonce.dateDepart), "dd-MM-yyyy")}
                                </p>
                                <p className="text-gray-700">
                                    <strong>Pays Depart:</strong> {annonce.paysDepart}
                                </p>
                            </div>

                            {/* Arrival Details */}
                            <div className="bg-gray-50 p-4 rounded-lg shadow">
                                <h3 className="text-lg font-semibold text-green-600 mb-2">
                                    Arrival Details
                                </h3>
                                <p className="text-gray-700">
                                    <strong>Date Arrivee:</strong> {format(new Date(annonce.dateArrivee), "dd-MM-yyyy")}
                                </p>
                                <p className="text-gray-700">
                                    <strong>Pays Destination:</strong> {annonce.paysDestination}
                                </p>
                            </div>
                        </div>

                        {/* Additional Details */}
                        <div className="mt-6 bg-gray-50 p-4 rounded-lg shadow">
                            <h3 className="text-lg font-semibold text-gray-800 mb-2">
                                Additional Information
                            </h3>
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
                                    onClick={() => navigate(`/colis/details/${annonce.id}`)}
                                    className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded-lg"
                                >
                                    Proposer colis
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
                ))}
            </div>
        </div>
    );
};

export default AnnonceDetail;
