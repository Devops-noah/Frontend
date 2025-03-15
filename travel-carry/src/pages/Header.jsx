import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import { FaUserCircle, FaBars, FaTimes } from "react-icons/fa";
import Notifications from "../notifications/Notifications";
import {jwtDecode} from "jwt-decode"; // ✅ Use `jwtDecode` to decode JWT properly

const Header = () => {
    const navigate = useNavigate();
    const [userName, setUserName] = useState("");
    const [profileImage, setProfileImage] = useState("");
    const [menuOpen, setMenuOpen] = useState(false);

    const isAuthenticated = !!localStorage.getItem("token");
    const userType = localStorage.getItem("userType");
    const userId = localStorage.getItem("userId");

    console.log("Is Authenticated:", isAuthenticated);

    // ✅ Fetch & Decode Token Safely
    const token = localStorage.getItem("token");
    let decodedToken = null;

    if (token) {
        try {
            decodedToken = jwtDecode(token); // ✅ Use jwtDecode properly
            console.log("Decoded Token:", decodedToken);
        } catch (error) {
            console.error("Error decoding token:", error);
        }
    } else {
        console.warn("No token found in localStorage!");
    }

    useEffect(() => {
        if (isAuthenticated && decodedToken) {
            console.log("User Token:", decodedToken);

            // ✅ Ensure `decodedToken` exists before accessing `sub`
            const storedUserName = decodedToken?.sub || "Utilisateur";
            console.log("stored user name new: ", storedUserName);
            let storedProfileImage = null;

            console.log("userId: ", userId);

            if (userId) {
                storedProfileImage = `http://localhost:8080/api/utilisateurs/profiles/images/${userId}`;
            }

            console.log("storedProfileImage: ", storedProfileImage);

            // ✅ Format Username Safely
            setUserName(
                storedUserName.replace(/"/g, "").replace(/^./, (char) => char.toUpperCase())
            );

            // ✅ Fetch User Profile Image
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

    // ✅ Handle Logout
    const handleLogout = () => {
        localStorage.clear();
        setUserName("");
        setProfileImage("");
        navigate("/login");
    };

    console.log("Header profile value: ", profileImage);
    console.log("User name value: ", userName);

    return (
        <header className="bg-blue-500 text-white">
            <div className="flex justify-between items-center p-4">
                <div className="flex items-center">
                    <img
                        src={logo}
                        alt="Logo"
                        className="h-10 w-10 mr-2 cursor-pointer rounded-full border-2 border-white"
                        onClick={() => navigate("/")}
                    />
                    <h1
                        className="text-2xl font-bold cursor-pointer"
                        onClick={() => navigate("/")}
                    >
                        <span style={{ color: "#ffffff" }}>Travel</span>{" "}
                        <span style={{ color: "#004080" }}>Carry</span>
                    </h1>
                </div>

                <nav className={`flex items-center space-x-6`}>
                    {isAuthenticated && userName && (
                        <span className="text-white font-semibold">Bienvenue, {userName}</span>
                    )}
                    {isAuthenticated && <Notifications />}
                    {isAuthenticated ? (
                        <div className="flex items-center space-x-4">
                            <Link to="/user-profile">
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
                                className="px-4 py-2 bg-white text-blue-500 font-semibold rounded hover:bg-gray-100"
                            >
                                Déconnexion
                            </button>
                        </div>
                    ) : (
                        <div className="flex items-center space-x-4">
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
