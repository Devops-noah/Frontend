import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function HomePage() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [recentAnnonces, setRecentAnnonces] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            setIsAuthenticated(true);
        } else {
            setIsAuthenticated(false);
        }
    }, []);

    // Fetch the 4 most recent annonces
    useEffect(() => {
        axios.get("http://localhost:8080/api/annonces").then((response) => {
            const sortedAnnonces = response.data.sort((a, b) => {
                const dateA = new Date(a.datePublication);
                const dateB = new Date(b.datePublication);
                return dateB - dateA; // Sort by most recent
            });
            setRecentAnnonces(sortedAnnonces.slice(0, 4));
        });
    }, []);

    return (
        <div style={{ textAlign: "center", marginTop: "50px" }}>
            {isAuthenticated ? (
                <>
                    {/* Afficher la page si l'utilisateur est connecté */}
                    <h1 style={{ fontSize: "2.5rem", fontWeight: "bold" }}>Bienvenue sur TravelCarry</h1>
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
            ) : (
                <>
                    {/* Message si l'utilisateur n'est pas connecté */}
                    <h2 style={{color: "red", fontWeight: "bold"}}>
                        Veuillez vous connecter pour accéder à cette page.
                    </h2>

                    <div className="min-h-screen bg-gray-100 py-8">
                        <div className="max-w-6xl mx-auto px-4">
                            <h2 className="text-2xl font-bold mb-6">Recent Annonces</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {recentAnnonces.map((annonce, index) => (
                                    <div
                                        key={index}
                                        className="bg-white p-6 rounded-lg shadow-md relative"
                                    >
                                        {/* Date Publication */}
                                        <div className="absolute top-4 right-4 text-gray-500 text-sm">
                                            Published: {new Date(annonce.datePublication).toLocaleDateString()}
                                        </div>
                                        {/* Main Content */}
                                        <div className="flex justify-between">
                                            {/* Left Section */}
                                            <div>
                                                <h3 className="text-lg font-bold mb-2">
                                                    Date Depart: {new Date(annonce.dateDepart).toLocaleDateString()}
                                                </h3>
                                                <p className="text-gray-700">
                                                    Date Arrivee: {new Date(annonce.dateArrivee).toLocaleDateString()}
                                                </p>
                                            </div>
                                            {/* Right Section */}
                                            <div>
                                                <h3 className="text-lg font-bold mb-2">
                                                    From: {annonce.paysDepart.nom}
                                                </h3>
                                                <p className="text-gray-700">
                                                    To: {annonce.paysDestination.nom}
                                                </p>
                                            </div>
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
                                    See All the Annonces
                                </button>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
