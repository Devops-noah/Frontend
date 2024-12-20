import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

const Header = () => {
    const navigate = useNavigate();
    const [userName, setUserName] = useState("");

    // Vérifiez si l'utilisateur est connecté (en regardant le token dans le localStorage)
    const isAuthenticated = !!localStorage.getItem("token");
    console.log("test: ", isAuthenticated);

    // Charger le nom de l'utilisateur depuis le localStorage
    useEffect(() => {
        if (isAuthenticated) {
            const storedUserName = localStorage.getItem("userName");
            if (storedUserName) {
                // Capitaliser la première lettre du nom de l'utilisateur
                const formattedName = storedUserName
                    .replace(/"/g, "") // Supprimer les guillemets
                    .replace(/^./, (char) => char.toUpperCase()); // Capitaliser la première lettre
                setUserName(formattedName);
            }
        }
    }, [isAuthenticated]);

    // Fonction pour gérer la déconnexion
    const handleLogout = () => {
        localStorage.removeItem("token"); // Supprimez le token
        localStorage.removeItem("userName"); // Supprimez le nom de l'utilisateur
        setUserName(""); // Effacer l'état du nom
        navigate("/login"); // Redirigez vers la page de connexion
    };

    return (
        <header className="flex justify-between items-center p-4 bg-blue-500 text-white">
            <div className="text-2xl font-bold">Travel Carry</div>
            <nav className="flex items-center">
                {/* Si l'utilisateur est connecté et que son nom est disponible */}
                {isAuthenticated && userName && (
                    <span className="mr-4 text-white font-semibold">
                        Bienvenue, {userName}
                    </span>
                )}
                {isAuthenticated ? (
                    // Bouton pour la déconnexion si l'utilisateur est connecté
                    <button
                        onClick={handleLogout}
                        className="px-4 py-2 bg-white text-blue-500 font-semibold rounded hover:bg-gray-100"
                    >
                        Déconnexion
                    </button>
                ) : (
                    // Bouton pour la connexion si l'utilisateur n'est pas connecté
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