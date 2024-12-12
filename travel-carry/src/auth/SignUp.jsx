import React, { useState } from "react";
import axios from "axios";

const SignUp = () => {
    const [formData, setFormData] = useState({
        nom: "",
        prenom: "",
        type: "",
        email: "",
        password: "",
       // confirmPassword: "",
        telephone: "",
        adresse: "",
    });
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        console.log("hawa");
        e.preventDefault();
        setErrorMessage("");
        setSuccessMessage("");

        // Vérification des mots de passe


        try {
            // Appel à l'API pour créer l'utilisateur
            const response = await axios.post("http://localhost:8080/api/auth/register", {
                nom: formData.nom,
                prenom: formData.prenom,
                type: formData.type,
                email: formData.email,
                password: formData.password,
                telephone: formData.telephone,
                adresse: formData.adresse,
            });

            console.log("reponse : ", response);

            setSuccessMessage("Inscription réussie ! Vous pouvez vous connecter.");
            setFormData({
                nom: "",
                prenom: "",
                type: "",
                email: "",
                password: "",
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
                            name="password"
                            value={formData.password}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Entrez votre mot de passe"
                            required
                        />
                    </div>

                    {/* Confirmer mot de passe */}


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

                    {/* Bouton d'inscription */}
                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 font-semibold"
                    >
                        S'inscrire
                    </button>

                    {/* Lien pour se connecter */}
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
