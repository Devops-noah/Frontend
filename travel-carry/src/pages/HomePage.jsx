import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import TravelAnimation from '../TravelAnimation'; // Import the TravelAnimation component
import { format } from "date-fns";

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
                    //const dateA = new Date(a.datePublication);
                    const dateA = format(a.datePublication, "dd-MM-yyyy")
                    //const dateB = new Date(b.datePublication);
                    const dateB = format(a.datePublication, "dd-MM-yyyy")
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
        console.log("token homepage: ", token)
        if (token) {
            navigate(`/annonces/${id}`); // Redirect to the detail page if authenticated
        } else {
            navigate(`/login?redirect=/annonces/${id}`); // Redirect to login if not authenticated
        }
    };

    return (
        <div className="homepage-background">
            <div style={{textAlign: "center", marginTop: "0px"}}>
                {/* Welcome Message for Authenticated Users */}
                {isAuthenticated && (
                    <>
                        <h1
                            style={{
                                fontSize: "2.5rem",
                                fontWeight: "bold",
                                fontFamily: "'Pacifico', cursive",
                                color: "#0047AB", // Bleu apaisant pour le texte principal
                                textShadow: `
            2px 2px 0 #A1C4FD,   /* Ombre bleu clair */
            -2px -2px 0 #FFD700, /* Ombre dorée */
            1px -1px 0 #6CC1F2,  /* Ombre légère cyan */
            -1px 1px 0 #FFECB3   /* Ombre douce crème */
        `,
                            }}
                        >
                            Bienvenue sur TravelCarry
                        </h1>


                        <Link to="/notations">
                            <button
                                style={{
                                    marginTop: "20px", // Ajustez cette valeur pour contrôler l'espacement vertical
                                    padding: "10px 20px",
                                    fontSize: "1rem",
                                    fontWeight: "bold",
                                    backgroundColor: "#FFC107", // Couleur jaune foncé (comme le bouton Déconnexion)
                                    color: "white",
                                    border: "none",
                                    borderRadius: "5px",
                                    cursor: "pointer",
                                    boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)", // Ajoute un effet d'ombre pour plus de style
                                }}
                            >
                                Partagez votre avis 💬⭐
                            </button>
                        </Link>

                    </>
                )}

                {/* Flight Animation for each annonce */}
                <div className="min-h-screen bg-transparent py-8">
                    <div className="max-w-6xl mx-auto px-4">
                        <h2 className="text-2xl font-bold mb-6">
                            Dernières annonces publiées
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {recentAnnonces.map((annonce) => (
                                <div
                                    key={annonce.id}
                                    className="text-red-950 p-4 font-bold relative flex justify-between items-center gap-4 cursor-pointer hover:shadow-lg transition bg-blue-300 rounded-xl"
                                    onClick={() => handleAnnonceClick(annonce.id)}
                                >
                                    {/* Flight animation for each annonce */}
                                    <TravelAnimation
                                        paysDepart={annonce.paysDepart}
                                        paysDestination={annonce.paysDestination}
                                        dateDepart={format(annonce.dateDepart, "dd-MM-yyyy")}
                                        dateArrivee={format(annonce.dateArrivee, "dd-MM-yyyy")}
                                    />
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
