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
        </div>
    );
}




