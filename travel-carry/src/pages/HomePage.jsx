import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import TravelAnimation from "../TravelAnimation";
import { format } from "date-fns";
import { useUserContext } from "../context/UserContext";

export default function HomePage() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [recentAnnonces, setRecentAnnonces] = useState([]);
    const [recentNotations, setRecentNotations] = useState([]);
    const [averageRating, setAverageRating] = useState(0);
    const { user } = useUserContext();
    const navigate = useNavigate();
    const [hasRedirected, setHasRedirected] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("token");
        setIsAuthenticated(!!token);
    }, []);

    // Fetch the 4 most recent annonces
    useEffect(() => {
        axios
            .get("http://localhost:8080/api/annonces")
            .then((response) => {
                const sortedAnnonces = response.data.sort((a, b) => {
                    const dateA = new Date(a.datePublication);
                    const dateB = new Date(b.datePublication);
                    return dateB - dateA;
                });
                setRecentAnnonces(sortedAnnonces.slice(0, 4));
            })
            .catch((error) => {
                console.error("Erreur lors du fetch des annonces :", error);
            });
    }, []);

    // Fetch recent notations and calculate average rating
    useEffect(() => {
        axios
            .get("http://localhost:8080/notations")
            .then((response) => {
                const sortedNotations = response.data.sort((a, b) => {
                    const dateA = new Date(a.datePublication);
                    const dateB = new Date(b.datePublication);
                    return dateB - dateA;
                });
                setRecentNotations(sortedNotations.slice(0, 3));

                const avgRating =
                    response.data.reduce((sum, notation) => sum + notation.note, 0) /
                    response.data.length || 0;
                setAverageRating(avgRating);
            })
            .catch((error) => {
                console.error("Erreur lors du fetch des notations :", error);
            });
    }, []);

    const handleAnnonceClick = (id) => {
        const token = localStorage.getItem("token");
        if (token) {
            navigate(`/annonces/${id}`);
        } else {
            navigate(`/login?redirect=/annonces/${id}`);
        }
    };

    const handleShareFeedback = () => {
        if (!hasRedirected) {
            setHasRedirected(true);
            if (isAuthenticated) {
                navigate("/notations");
            } else {
                navigate("/login?redirect=/notations");
            }
        }
    };

    const renderStars = (value) => {
        const fullStars = Math.floor(value);
        const halfStar = value % 1 >= 0.5;
        const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
        return (
            <>
                {"★".repeat(fullStars)}
                {halfStar && "☆"}
                {"☆".repeat(emptyStars)}
            </>
        );
    };

    return (
        <div className="homepage-background min-h-screen" style={{ paddingBottom: "64px", paddingTop: "10px" }}>
            <div style={{ textAlign: "center", marginTop: "20px" }}>
                {isAuthenticated && (
                    <h1
                        style={{
                            fontSize: "2.5rem",
                            fontWeight: "bold",
                            fontFamily: "'Pacifico', cursive",
                            color: "#0047AB",
                        }}
                    >
                        Bienvenue sur TravelCarry
                    </h1>
                )}

                {/* Button for "Chaine de Transfert" */}
                <Link to="http://localhost:3000/create-transfer">
                    <div style={{ marginTop: "20px", textAlign: "center" }}>
                        <p style={{ fontSize: "1.2rem", fontWeight: "bold", color: "black" }}>
                            Si vous souhaitez organiser un transfert en chaîne, cliquez ci-dessous :
                        </p>
                        <button
                            style={{
                                padding: "10px 20px",
                                fontSize: "1rem",
                                fontWeight: "bold",
                                backgroundColor: "#3498db",
                                color: "white",
                                border: "none",
                                borderRadius: "5px",
                                cursor: "pointer",
                            }}
                        >
                            Chaine de Transfert
                        </button>
                    </div>
                </Link>

                {/* Flight Animation for each annonce */}
                <div className="min-h-screen bg-transparent py-8">
                    <div className="max-w-6xl mx-auto px-4">
                        <h2 className="text-2xl font-bold mb-6">Dernières annonces publiées</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {recentAnnonces.map((annonce) => (
                                <div
                                    key={annonce.id}
                                    className="p-4 relative flex justify-between items-center gap-4 cursor-pointer hover:shadow-lg transition bg-blue-300 rounded-xl"
                                    onClick={() => handleAnnonceClick(annonce.id)}
                                >
                                    <TravelAnimation
                                        paysDepart={annonce.paysDepart}
                                        paysDestination={annonce.paysDestination}
                                        dateDepart={format(new Date(annonce.dateDepart), "dd-MM-yyyy")}
                                        dateArrivee={format(new Date(annonce.dateArrivee), "dd-MM-yyyy")}
                                    />
                                </div>
                            ))}
                        </div>
                        <div className="mt-4 flex justify-center mb-8">
                            <button
                                onClick={() => navigate("/annonces")}
                                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg"
                            >
                                Voir toutes les annonces
                            </button>
                        </div>
                    </div>
                </div>

                <div
                    style={{
                        margin: "20px auto",
                        padding: "20px",
                        maxWidth: "600px",
                        backgroundColor: "white",
                        borderRadius: "10px",
                        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                    }}
                >
                    <h2 className="text-2xl font-bold mb-4">Note moyenne du site</h2>
                    <div className="text-yellow-500 text-3xl font-bold">{renderStars(averageRating)}</div>
                    <p className="mt-2 text-gray-600">
                        {averageRating.toFixed(1)} / 5 basé sur les avis des utilisateurs.
                    </p>
                </div>

                <div className="py-8">
                    <h2 className="text-2xl font-bold mb-6">Avis récents</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {recentNotations.map((notation, index) => (
                            <div
                                key={index}
                                className="p-4 bg-blue-300 shadow-md rounded-lg"
                                style={{
                                    textAlign: "left",
                                }}
                            >
                                <p>
                                    <strong>Note :</strong> {notation.note} / 5
                                </p>
                                <p>
                                    <strong>Commentaire :</strong> {notation.commentaire}
                                </p>
                                <p>
                                    <strong>Publié par :</strong> {notation.userName} {notation.userFirstName}
                                </p>
                                <p className="text-sm text-gray-500">
                                    Publié le {format(new Date(notation.datePublication), "dd-MM-yyyy")}
                                </p>
                            </div>
                        ))}
                    </div>
                    <div className="mt-4 flex justify-center">
                        <button
                            onClick={() => navigate("/tous-les-avis")}
                            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg"
                        >
                            Voir plus d'avis
                        </button>
                    </div>
                </div>

                <button
                    onClick={handleShareFeedback}
                    className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg mt-4"
                >
                    Partagez votre avis 💬⭐
                </button>
            </div>
        </div>
    );
}
