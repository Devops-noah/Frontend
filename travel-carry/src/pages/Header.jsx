import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import { FaUserCircle, FaBars, FaTimes } from "react-icons/fa";
import Notifications from "../notifications/Notifications";
import { jwtDecode } from "jwt-decode";

 // Import du composant Notifications

const Header = () => {
    const navigate = useNavigate();
    const [userName, setUserName] = useState("");
    const [profileImage, setProfileImage] = useState("");
    const [menuOpen, setMenuOpen] = useState(false);

    const isAuthenticated = !!localStorage.getItem("token");
    const userType = localStorage.getItem("userType");

    console.log("Is Authenticated:", isAuthenticated);

    const token = localStorage.getItem("token");
    let decodedToken;
    if (!token) {
        console.error("No token found in localStorage!");
    } else {
        try {
            decodedToken = JSON.parse(atob(token.split('.')[1]));
            console.log("Decoded Token:", decodedToken);
        } catch (error) {
            console.error("Error decoding token:", error);
        }
    }


    const handleLogoClick = () => navigate("/");

    useEffect(() => {
        if (isAuthenticated) {

            if (!token) return; // Add check to ensure token exists

            const { userId } = localStorage.getItem("userId");

            //const storedUserName = localStorage.getItem("userName");
            const storedUserName = decodedToken.sub;
            let storedProfileImage = null;

            if (userId) {
                // Fetch the profile image URL from the backend (assuming it's an Imgur URL)
                storedProfileImage = `http://localhost:8080/api/utilisateurs/profiles/images/${userId}`;
            }

            console.log("storedProfileImage: ", storedProfileImage);

            // Set username
            if (storedUserName) {
                const formattedName = storedUserName
                    .replace(/"/g, "")
                    .replace(/^./, (char) => char.toUpperCase());
                setUserName(formattedName);
            }

            // Fetch the actual Imgur image URL if available
            if (storedProfileImage) {
                fetch(storedProfileImage)
                    .then((response) => response.json())
                    .then((data) => {
                        // Assuming your API returns the Imgur image URL in the response
                        if (data && data.link) {
                            setProfileImage(data.link); // Set the Imgur URL as the profile image
                        }
                    })
                    .catch((error) => {
                        console.error("Error fetching profile image:", error);
                        setProfileImage(''); // Optional: Set a fallback image or empty string
                    });
            } else {
                setProfileImage(''); // Optional: Set a fallback or placeholder image
            }
        }
    }, [isAuthenticated]);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("userName");
        localStorage.removeItem("userType");
        setUserName("");
        setProfileImage("");
        navigate("/login");
    };

    console.log("header profile value: ", profileImage)
    console.log("user name value: ", userName)

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
                    {isAuthenticated && (
                        <Notifications /> // Affiche les notifications uniquement pour les voyageurs
                    )}
                    {isAuthenticated ? (
                        <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4">
                            {/*<Link to="/user-profile">*/}
                            {/*    <FaUserCircle className="text-4xl cursor-pointer text-yellow-400" />*/}
                            {/*</Link>*/}
                            <Link to="/user-profile">
                                {profileImage ? (
                                    <img
                                        src={profileImage}
                                        alt="User Avatar"
                                        className="h-10 w-10 rounded-full border-2 border-white cursor-pointer"
                                    />
                                ) : (
                                    // <div className="h-10 w-10 bg-gray-300 rounded-full border-2 border-white flex items-center justify-center text-yellow-400 text-4xl">
                                    //     <span>?</span>
                                    // </div>
                                    <FaUserCircle className="text-4xl cursor-pointer text-yellow-400"/>
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
