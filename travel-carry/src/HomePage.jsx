import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function HomePage() {
    const navigate = useNavigate();

    // Vérifier si l'utilisateur est connecté
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/login");
        }
    }, [navigate]);

    return (
        <div style={{ textAlign: "center", marginTop: "50px" }}>
            {/* Titre principal */}
            <h1 style={{ fontSize: "2.5rem", fontWeight: "bold" }}>Bienvenue sur TravelCarry</h1>

            {/* Bouton vers la page des notations */}
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

            {/* Lien vers la page des détails du colis */}
            <div style={{ marginTop: "20px" }}>
                <Link
                    to="/colis/details"
                    className="inline-block mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                    Détails du colis
                </Link>
            </div>
        </div>
    );
}