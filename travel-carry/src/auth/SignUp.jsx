import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const SignUp = () => {
    const [formData, setFormData] = useState({
        nom: "",
        prenom: "",
        type: "",
        email: "",
        motDePasse: "",
        telephone: "",
        adresse: "",
    });
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const navigate = useNavigate();

    // Check if user is already logged in
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            navigate("/"); // Redirect to home if already logged in
        }
    }, [navigate]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage("");
        setSuccessMessage("");

        try {
            // API call to register the user
            const response = await axios.post("http://localhost:8080/api/auth/register", {
                nom: formData.nom,
                prenom: formData.prenom,
                type: formData.type,
                email: formData.email,
                motDePasse: formData.motDePasse,
                telephone: formData.telephone,
                adresse: formData.adresse,
            });

            setSuccessMessage("Inscription réussie ! Vous pouvez vous connecter.");
            setFormData({
                nom: "",
                prenom: "",
                type: "",
                email: "",
                motDePasse: "",
                telephone: "",
                adresse: "",
            });
        } catch (error) {
            if (error.response) {
                setErrorMessage(error.response.data.message || "Une erreur est survenue.");
            } else {
                setErrorMessage("Impossible de se connecter au serveur.");
            }
        }
    };

    return (
        <div
            className="flex items-center justify-center bg-gray-100"
            style={{ minHeight: "calc(100vh - 64px)" }}
        >
            <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md mt-16">
                <h2 className="text-2xl font-bold mb-6 text-center">Inscription</h2>

                {/* Messages d'erreur ou de succès */}
                {errorMessage && (
                    <div className="mb-4 text-red-500 text-center font-semibold">
                        {errorMessage}
                    </div>
                )}
                {successMessage && (
                    <div className="mb-4 text-green-500 text-center font-semibold">
                        {successMessage}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    {/* Nom */}
                    <div className="mb-4">
                        <label className="block text-gray-700 font-semibold mb-2">Nom</label>
                        <input
                            type="text"
                            name="nom"
                            value={formData.nom}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Nom"
                            required
                        />
                    </div>

                    {/* Prénom */}
                    <div className="mb-4">
                        <label className="block text-gray-700 font-semibold mb-2">Prénom</label>
                        <input
                            type="text"
                            name="prenom"
                            value={formData.prenom}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Prénom"
                            required
                        />
                    </div>

                    {/* Type */}
                    <div className="mb-4">
                        <label className="block text-gray-700 font-semibold mb-2">Type</label>
                        <select
                            name="type"
                            value={formData.type}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        >
                            <option value="">Sélectionner un type</option>
                            <option value="expediteur">Expéditeur</option>
                            <option value="voyageur">Voyageur</option>
                        </select>
                    </div>

                    {/* Email */}
                    <div className="mb-4">
                        <label className="block text-gray-700 font-semibold mb-2">Email</label>
                        <input
                            type="email"
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
                        <label className="block text-gray-700 font-semibold mb-2">Mot de passe</label>
                        <input
                            type="password"
                            name="motDePasse"
                            value={formData.motDePasse}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Entrez votre mot de passe"
                            required
                        />
                    </div>

                    {/* Téléphone */}
                    <div className="mb-4">
                        <label className="block text-gray-700 font-semibold mb-2">Téléphone</label>
                        <input
                            type="text"
                            name="telephone"
                            value={formData.telephone}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Entrez votre téléphone"
                            required
                        />
                    </div>

                    {/* Adresse */}
                    <div className="mb-4">
                        <label className="block text-gray-700 font-semibold mb-2">Adresse</label>
                        <input
                            type="text"
                            name="adresse"
                            value={formData.adresse}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Entrez votre adresse"
                            required
                        />
                    </div>

                    {/* Sign Up Button */}
                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 font-semibold"
                    >
                        S'inscrire
                    </button>

                    {/* Link to login */}
                    <p className="text-center mt-4">
                        <a href="/login" className="text-blue-500 hover:underline">
                            Avez-vous déjà un compte ? Connectez-vous
                        </a>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default SignUp;
