import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/logo.png"; // Assurez-vous que le chemin est correct
import { FaUserCircle, FaBars, FaTimes } from "react-icons/fa"; // Icons for user and menu

const Header = () => {
    const navigate = useNavigate();
    const [userName, setUserName] = useState("");
    const [menuOpen, setMenuOpen] = useState(false); // State for hamburger menu

    const isAuthenticated = !!localStorage.getItem("token");

    const handleLogoClick = () => navigate("/");

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

    const toggleMenu = () => setMenuOpen(!menuOpen);

    return (
        <header className="bg-blue-500 text-white">
            <div className="flex justify-between items-center p-4">
                {/* Logo Section */}
                <div className="flex items-center">
                    <img
                        src={logo}
                        alt="Logo"
                        className="h-10 w-10 mr-2 cursor-pointer rounded-full border-2 border-white"
                        onClick={handleLogoClick}
                    />
                    <h1
                        className="text-2xl font-bold cursor-pointer"
                        onClick={handleLogoClick}
                    >
                        <span style={{ color: "#ffffff" }}>Travel</span>{" "}
                        <span style={{ color: "#004080" }}>Carry</span>
                    </h1>
                </div>

                {/* Hamburger Menu for Mobile */}
                <div className="md:hidden">
                    <button onClick={toggleMenu} className="text-white text-3xl">
                        {menuOpen ? <FaTimes /> : <FaBars />}
                    </button>
                </div>

                {/* Navigation Links */}
                <nav
                    className={`${
                        menuOpen ? "flex" : "hidden"
                    } md:flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6 absolute md:static top-16 left-0 md:top-auto md:left-auto w-full md:w-auto bg-blue-500 md:bg-transparent z-10 md:z-auto p-4 md:p-0`}
                >
                    {isAuthenticated && userName && (
                        <span className="text-white font-semibold">Bienvenue, {userName}</span>
                    )}
                    {isAuthenticated ? (
                        <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4">
                            <Link to="/user-profile">
                                <FaUserCircle className="text-4xl cursor-pointer text-yellow-400" />
                            </Link>
                            <button
                                onClick={handleLogout}
                                className="px-4 py-2 bg-white text-blue-500 font-semibold rounded hover:bg-gray-100"
                            >
                                Déconnexion
                            </button>
                        </div>
                    ) : (
                        <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4">
                            <Link to="/login">
                                <button className="px-4 py-2 font-semibold rounded border-2 border-white text-white hover:bg-white hover:text-blue-500">
                                    Connexion
                                </button>
                            </Link>
                            <Link to="/register">
                                <button className="px-4 py-2 font-semibold rounded border-2 border-white text-white hover:bg-white hover:text-blue-500">
                                    Inscription
                                </button>
                            </Link>
                        </div>
                    )}
                </nav>
            </div>
        </header>
    );
};

export default Header;
