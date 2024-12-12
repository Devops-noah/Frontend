import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios"; // Importer Axios

const LoginPage = () => {
    const [formData, setFormData] = useState({
        email: "",
        motDePasse: "",
    });
    const [errorMessage, setErrorMessage] = useState("");
    const navigate = useNavigate();

    // Gestion des changements dans les champs du formulaire
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    // Gestion de la soumission du formulaire
    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage("");

        try {
            // Remplacer fetch par axios pour l'appel à l'API
            const response = await axios.post(
                "http://localhost:8080/api/auth/login",
                formData, // Axios gère automatiquement la conversion en JSON
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            // Si la requête est réussie
            localStorage.setItem("token", response.data.token); // Stocker le token JWT
            navigate("/"); // Redirection vers la liste des annonces
        } catch (error) {
            // Gestion des erreurs
            if (error.response) {
                // Si l'API retourne une réponse d'erreur
                setErrorMessage(error.response.data.message || "Identifiants incorrects.");
            } else {
                // Autre type d'erreur (exemple : problème réseau)
                setErrorMessage("Une erreur s'est produite. Veuillez réessayer.");
            }
        }
    };
    console.log("teessss: ", formData)

    return (
        <div className="flex items-center justify-center h-screen bg-gray-100">
            <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold mb-6 text-center">Connexion</h2>
                {errorMessage && (
                    <div className="mb-4 text-red-500 text-center font-semibold">
                        {errorMessage}
                    </div>
                )}
                <form onSubmit={handleSubmit}>
                    {/* Email */}
                    <div className="mb-4">
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Entrez votre email"
                            required
                        />
                    </div>

                    {/* Mot de passe */}
                    <div className="mb-4">
                        <input
                            type="motDePasse"
                            id="motDePasse"
                            name="motDePasse"
                            value={formData.motDePasse}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Entrez votre mot de passe"
                            required
                        />
                    </div>

                    {/* Bouton de connexion */}
                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 font-semibold"
                    >
                        Se connecter
                    </button>
                </form>

                {/* Lien pour rediriger vers la page d'inscription */}
                <div className="mt-4 text-center">
                    <p className="text-gray-600">
                        Pas encore de compte ?{" "}
                        <a href="/register" className="text-blue-500 font-semibold hover:underline">
                            Inscrivez-vous ici
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
