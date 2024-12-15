import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

const Header = () => {
    const navigate = useNavigate();
    const [userName, setUserName] = useState("");

    // Vérifiez si l'utilisateur est connecté (en regardant le token dans le localStorage)
    const isAuthenticated = !!localStorage.getItem("token");
    console.log("test: ", isAuthenticated)

    // Load the user's name from localStorage
    useEffect(() => {
        if (isAuthenticated) {
            const storedUserName = localStorage.getItem("userName");
            if (storedUserName) {
                // Capitalize the first letter of the email
                const formattedName = storedUserName
                    .replace(/"/g, "") // Remove quotes
                    .replace(/^./, (char) => char.toUpperCase()); // Capitalize first letter
                setUserName(formattedName);
            }
        }
    }, [isAuthenticated]);

    // Fonction pour gérer la déconnexion
    const handleLogout = () => {
        localStorage.removeItem("token"); // Supprimez le token
        localStorage.removeItem("userName"); // Remove the user's name
        setUserName(""); // Clear state
        navigate("/login"); // Redirigez vers la page de connexion
    };

    return (
        <header className="flex justify-between items-center p-4 bg-blue-500 text-white">
            <div className="text-2xl font-bold">Travel Carry</div>
            <nav>
                {isAuthenticated && userName && (
                    <span className="mr-4 text-white font-semibold">Bienvenue, {userName}</span>
                )}
                {isAuthenticated ? (
                    // Affichez Déconnexion si l'utilisateur est connecté
                    <button
                        onClick={handleLogout}
                        className="px-4 py-2 bg-white text-blue-500 font-semibold rounded hover:bg-gray-100"
                    >
                        Déconnexion
                    </button>
                ) : (
                    // Affichez Connexion sinon
                    <Link to="/login">
                        <button className="px-4 py-2 bg-white text-blue-500 font-semibold rounded hover:bg-gray-100">
                            Connexion
                        </button>
                    </Link>
                )}
            </nav>
        </header>
    );
};

export default Header;
