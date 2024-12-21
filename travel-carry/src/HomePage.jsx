import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function HomePage() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            setIsAuthenticated(true);
        } else {
            setIsAuthenticated(false);
        }
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
                    <h2 style={{ color: "red", fontWeight: "bold" }}>
                        Veuillez vous connecter pour accéder à cette page.
                    </h2>
                </>
            )}
        </div>
    );
}
