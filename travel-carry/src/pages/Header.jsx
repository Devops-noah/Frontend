import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/logo.png"; // Assurez-vous que le chemin est correct
import { FaUserCircle } from "react-icons/fa"; // User icon for the profile

const Header = () => {
    const navigate = useNavigate();
    const [userName, setUserName] = useState("");

    // Handle logo click to navigate to home page
    const handleLogoClick = () => {
        navigate("/"); // Redirect to the homepage
    };

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
                        cursor: "pointer"
                    }}
                    onClick={handleLogoClick}
                />
                <h1 className="text-2xl font-bold">
                    <span style={{ color: "#ffffff", cursor: "pointer" }} onClick={handleLogoClick}>Travel</span>{" "}
                    <span style={{ color: "#004080", cursor: "pointer" }} onClick={handleLogoClick}>Carry</span>
                </h1>
            </div>

            <nav className="flex items-center space-x-4">
                {isAuthenticated && userName && (
                    <span className="text-white font-semibold">Bienvenue, {userName}</span>
                )}

                {isAuthenticated ? (
                    <div className="flex items-center gap-4">
                        {/* Profile Icon */}
                        <Link to="/user-profile">
                            <FaUserCircle className="text-red-950 text-4xl cursor-pointer" />
                        </Link>

                        <button
                            onClick={handleLogout}
                            className="px-4 py-2 bg-white text-blue-500 font-semibold rounded hover:bg-gray-100"
                        >
                            Déconnexion
                        </button>
                    </div>
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
