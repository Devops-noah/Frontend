import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import { FaUserCircle, FaBars, FaTimes } from "react-icons/fa";
import Notifications from "../notifications/Notifications";
import { jwtDecode } from "jwt-decode";

const Header = () => {
    const navigate = useNavigate();
    const [userName, setUserName] = useState("");
    const [profileImage, setProfileImage] = useState("");
    const [menuOpen, setMenuOpen] = useState(false);

    const isAuthenticated = !!localStorage.getItem("token");
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");

    let decodedToken = null;

    if (token) {
        try {
            decodedToken = jwtDecode(token);
        } catch (error) {
            console.error("Error decoding token:", error);
        }
    }

    useEffect(() => {
        if (isAuthenticated && decodedToken) {
            const storedUserName = decodedToken?.sub || "Utilisateur";
            let storedProfileImage = null;

            if (userId) {
                storedProfileImage = `http://localhost:8080/api/utilisateurs/profiles/images/${userId}`;
            }

            setUserName(
                storedUserName.replace(/"/g, "").replace(/^./, (char) => char.toUpperCase())
            );

            if (storedProfileImage) {
                fetch(storedProfileImage)
                    .then((response) => response.json())
                    .then((data) => {
                        if (data && data.link) {
                            setProfileImage(data.link);
                        }
                    })
                    .catch((error) => {
                        console.error("Error fetching profile image:", error);
                        setProfileImage("");
                    });
            } else {
                setProfileImage("");
            }
        }
    }, [isAuthenticated, decodedToken, userId]);

    const handleLogout = () => {
        localStorage.clear();
        setUserName("");
        setProfileImage("");
        navigate("/login");
    };

    return (
        <header className="bg-blue-500 text-white w-full">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center p-4 relative">
                {/* Logo + Titre */}
                <div className="flex items-center justify-between md:justify-start w-full md:w-auto">
                    <div className="flex items-center">
                        <img
                            src={logo}
                            alt="Logo"
                            className="h-10 w-10 mr-2 cursor-pointer rounded-full border-2 border-white"
                            onClick={() => navigate("/")}
                        />
                        <h1
                            className="text-xl md:text-2xl font-bold cursor-pointer"
                            onClick={() => navigate("/")}
                        >
                            <span className="text-white">Travel</span>{" "}
                            <span className="text-[#004080]">Carry</span>
                        </h1>
                    </div>

                    {/* Hamburger / Close Icon */}
                    <div className="md:hidden">
                        <button onClick={() => setMenuOpen(!menuOpen)}>
                            {menuOpen ? (
                                <FaTimes className="text-2xl" />
                            ) : (
                                <FaBars className="text-2xl" />
                            )}
                        </button>
                    </div>
                </div>

                {/* Navigation */}
                <nav
                    className={`${
                        menuOpen ? "flex" : "hidden"
                    } flex-col md:flex md:flex-row md:items-center md:space-x-6 w-full md:w-auto bg-blue-500 md:bg-transparent z-50 p-4 md:p-0 space-y-4 md:space-y-0 md:justify-end`}
                >
                    {isAuthenticated && (
                        <div className="flex flex-col md:flex-row md:items-center md:space-x-4 space-y-2 md:space-y-0 text-center md:text-left w-full md:w-auto">
                            <div className="flex flex-col md:flex-row md:items-center md:space-x-2">
                                <span className="text-sm text-white font-semibold">Bienvenue,</span>
                                <span className="text-sm text-white break-all">{userName}</span>
                            </div>

                            <div className="flex justify-center items-center">
                                <Notifications />
                            </div>

                            <Link to="/user-profile" className="flex justify-center">
                                {profileImage ? (
                                    <img
                                        src={profileImage}
                                        alt="User Avatar"
                                        className="h-10 w-10 rounded-full border-2 border-white cursor-pointer"
                                    />
                                ) : (
                                    <FaUserCircle className="text-4xl cursor-pointer text-yellow-400" />
                                )}
                            </Link>

                            <button
                                onClick={handleLogout}
                                className="px-4 py-2 bg-white text-blue-500 font-semibold rounded hover:bg-gray-100 w-full md:w-auto"
                            >
                                Déconnexion
                            </button>
                        </div>
                    )}

                    {!isAuthenticated && (
                        <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4 w-full md:w-auto">
                            <Link to="/login">
                                <button className="px-4 py-2 font-semibold rounded border-2 border-white text-white hover:bg-white hover:text-blue-500 w-full md:w-auto">
                                    Connexion
                                </button>
                            </Link>
                            <Link to="/register">
                                <button className="px-4 py-2 font-semibold rounded border-2 border-white text-white hover:bg-white hover:text-blue-500 w-full md:w-auto">
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
