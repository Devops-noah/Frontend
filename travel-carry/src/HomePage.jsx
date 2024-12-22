import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

export default function HomePage() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [recentAnnonces, setRecentAnnonces] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");
        setIsAuthenticated(!!token); // Set authentication status based on token presence
    }, []);

    // Fetch the 4 most recent annonces
    useEffect(() => {
        axios
            .get("http://localhost:8080/api/annonces")
            .then((response) => {
                const sortedAnnonces = response.data.sort((a, b) => {
                    const dateA = new Date(a.datePublication);
                    const dateB = new Date(b.datePublication);
                    return dateB - dateA; // Sort by most recent
                });
                setRecentAnnonces(sortedAnnonces.slice(0, 4));
            })
            .catch((error) => {
                console.error("Error fetching annonces:", error);
            });
    }, []);

    const handleAnnonceClick = (id) => {
        const token = localStorage.getItem("token");
        if (token) {
            navigate(`/annonces/${id}`); // Redirect to the detail page if authenticated
        } else {
            navigate(`/login?redirect=/annonces/${id}`); // Redirect to login if not authenticated
        }
    };

    return (
        <div className="homepage-carousel">
            <div style={{ textAlign: "center", marginTop: "50px" }}>
                {/* Welcome Message for Authenticated Users */}
                {isAuthenticated && (
                    <>
                        <h1 style={{ fontSize: "2.5rem", fontWeight: "bold" }}>
                            Bienvenue sur TravelCarry
                        </h1>
                        <Link to="/notations">
                            <button
                                style={{
                                    marginTop: "20px",
                                    padding: "10px 20px",
                                    fontSize: "1rem",
                                    fontWeight: "bold",
                                    backgroundColor: "#4CAF50",
                                    color: "white",
                                    border: "none",
                                    borderRadius: "5px",
                                    cursor: "pointer",
                                }}
                            >
                                Notations
                            </button>
                        </Link>
                        <div style={{ marginTop: "20px" }}>
                            <Link
                                to="/colis/details"
                                className="inline-block mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                            >
                                Détails du colis
                            </Link>
                        </div>
                    </>
                )}

                {/* Recent Annonces Section */}
                <div className="min-h-screen bg-transparent py-8">
                    <div className="max-w-6xl mx-auto px-4">
                        <h2 className="text-2xl font-bold mb-6">
                            Dernières annonces publiées
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {recentAnnonces.map((annonce) => (
                                <div
                                    key={annonce.id}
                                    className="bg-blue-500 text-white p-4 rounded-lg shadow-md relative flex justify-between items-center gap-4 cursor-pointer hover:shadow-lg transition"
                                    onClick={() => handleAnnonceClick(annonce.id)}
                                >
                                    {/* Date Publication */}
                                    <div className="absolute top-1 left-2 text-gray-200 text-xs">
                                        Publiée le :{" "}
                                        {new Date(
                                            annonce.datePublication
                                        ).toLocaleDateString()}
                                    </div>

                                    {/* Section gauche : Dates */}
                                    <div className="flex flex-col space-y-2">
                                        <h3 className="text-sm font-bold flex items-center">
                                            <span className="inline-block w-2 h-2 bg-white rounded-full mr-2"></span>
                                            Date Départ :{" "}
                                            {new Date(
                                                annonce.dateDepart
                                            ).toLocaleDateString()}
                                        </h3>
                                        <p className="text-sm font-bold flex items-center">
                                            <span className="inline-block w-2 h-2 bg-white rounded-full mr-2"></span>
                                            Date Arrivée :{" "}
                                            {new Date(
                                                annonce.dateArrivee
                                            ).toLocaleDateString()}
                                        </p>
                                    </div>

                                    {/* Section droite : Pays */}
                                    <div className="flex flex-col space-y-2 text-right">
                                        <h3 className="text-sm font-bold flex items-center">
                                            <span className="inline-block w-2 h-2 bg-white rounded-full mr-2"></span>
                                            Départ :{" "}
                                            {annonce.paysDepart.nom}
                                        </h3>
                                        <p className="text-sm font-bold flex items-center">
                                            <span className="inline-block w-2 h-2 bg-white rounded-full mr-2"></span>
                                            Destination :{" "}
                                            {annonce.paysDestination.nom}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* "See All" Button */}
                        <div className="mt-8 flex justify-center">
                            <button
                                onClick={() => navigate("/annonces")}
                                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg"
                            >
                                Cliquer pour voir toutes les annonces
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
