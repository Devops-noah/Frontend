import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "./assets/logo.png"; // Assurez-vous que le chemin est correct

const Header = () => {
    const navigate = useNavigate();
    const [userName, setUserName] = useState("");

    const isAuthenticated = !!localStorage.getItem("token");

    useEffect(() => {
        if (isAuthenticated) {
            const storedUserName = localStorage.getItem("userName");
            if (storedUserName) {
                const formattedName = storedUserName
                    .replace(/"/g, "")
                    .replace(/^./, (char) => char.toUpperCase());
                setUserName(formattedName);
            }
        }
    }, [isAuthenticated]);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("userName");
        setUserName("");
        navigate("/login");
    };

    return (
        <header className="flex justify-between items-center p-4 bg-blue-500 text-white">
            <div className="flex items-center">
                <img
                    src={logo}
                    alt="Logo"
                    className="h-10 w-10 mr-2"
                    style={{
                        borderRadius: "50%",
                        border: "2px solid white",
                    }}
                />
                <h1 className="text-2xl font-bold">
                    <span style={{ color: "#ffffff" }}>Travel</span>{" "}
                    <span style={{ color: "#004080" }}>Carry</span>
                </h1>
            </div>

            <nav className="flex items-center space-x-4">
                {isAuthenticated && userName && (
                    <span className="text-white font-semibold">Bienvenue, {userName}</span>
                )}

                {isAuthenticated ? (
                    <button
                        onClick={handleLogout}
                        className="px-4 py-2 bg-white text-blue-500 font-semibold rounded hover:bg-gray-100"
                    >
                        Déconnexion
                    </button>
                ) : (
                    <>
                        <Link to="/login">
                            <button
                                className="px-4 py-2 font-semibold rounded"
                                style={{
                                    backgroundColor: "transparent",
                                    color: "white",
                                    border: "2px solid white",
                                    transition: "background-color 0.3s, color 0.3s",
                                }}
                                onMouseEnter={(e) => {
                                    e.target.style.backgroundColor = "white";
                                    e.target.style.color = "#004080";
                                }}
                                onMouseLeave={(e) => {
                                    e.target.style.backgroundColor = "transparent";
                                    e.target.style.color = "white";
                                }}
                            >
                                Connexion
                            </button>
                        </Link>
                        <Link to="/register">
                            <button
                                className="px-4 py-2 font-semibold rounded"
                                style={{
                                    backgroundColor: "transparent",
                                    color: "white",
                                    border: "2px solid white",
                                    transition: "background-color 0.3s, color 0.3s",
                                }}
                                onMouseEnter={(e) => {
                                    e.target.style.backgroundColor = "white";
                                    e.target.style.color = "#004080";
                                }}
                                onMouseLeave={(e) => {
                                    e.target.style.backgroundColor = "transparent";
                                    e.target.style.color = "white";
                                }}
                            >
                                Inscription
                            </button>
                        </Link>
                    </>
                )}
            </nav>
        </header>
    );
};

export default Header;
