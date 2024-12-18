import React, { useState } from "react";

const ColisDetails = () => {
    const [formData, setFormData] = useState({
        poids: "",
        longueur: "",
        largeur: "",
        hauteur: "",
        nature: "",
        categorie: "",
        datePriseEnCharge: "",
        plageHoraire: "",
    });

    const [feedback, setFeedback] = useState("");

    // Gestion des champs de formulaire
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    // Gestion de la soumission du formulaire
    const handleSubmit = (e) => {
        e.preventDefault();

        // Validation des champs obligatoires
        const { poids, longueur, largeur, hauteur, nature, categorie, datePriseEnCharge } = formData;
        if (!poids || !longueur || !largeur || !hauteur || !nature || !categorie || !datePriseEnCharge) {
            setFeedback("Erreur : Veuillez remplir tous les champs obligatoires.");
            return;
        }

        // Simuler la soumission avec un message de succès
        setFeedback("Les informations de votre colis ont été enregistrées avec succès !");
    };

    return (
        <div className="p-8 max-w-lg mx-auto bg-white shadow-lg rounded">
            <h2 className="text-2xl font-bold mb-4 text-center">Détails du Colis</h2>
            {feedback && <div className="mb-4 text-center text-green-600 font-semibold">{feedback}</div>}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label>Poids (en kg)</label>
                    <input
                        type="number"
                        name="poids"
                        value={formData.poids}
                        onChange={handleInputChange}
                        className="w-full border p-2 rounded"
                        required
                    />
                </div>
                <div>
                    <label>Dimensions (en cm)</label>
                    <div className="flex space-x-2">
                        <input
                            type="number"
                            name="longueur"
                            placeholder="Longueur"
                            value={formData.longueur}
                            onChange={handleInputChange}
                            className="w-1/3 border p-2 rounded"
                            required
                        />
                        <input
                            type="number"
                            name="largeur"
                            placeholder="Largeur"
                            value={formData.largeur}
                            onChange={handleInputChange}
                            className="w-1/3 border p-2 rounded"
                            required
                        />
                        <input
                            type="number"
                            name="hauteur"
                            placeholder="Hauteur"
                            value={formData.hauteur}
                            onChange={handleInputChange}
                            className="w-1/3 border p-2 rounded"
                            required
                        />
                    </div>
                </div>
                <div>
                    <label>Nature</label>
                    <select
                        name="nature"
                        value={formData.nature}
                        onChange={handleInputChange}
                        className="w-full border p-2 rounded"
                        required
                    >
                        <option value="">-- Sélectionnez --</option>
                        <option value="Fragile">Fragile</option>
                        <option value="Périssable">Périssable</option>
                        <option value="Non dangereux">Non dangereux</option>
                        <option value="Autre">Autre</option>
                    </select>
                </div>
                <div>
                    <label>Catégorie</label>
                    <select
                        name="categorie"
                        value={formData.categorie}
                        onChange={handleInputChange}
                        className="w-full border p-2 rounded"
                        required
                    >
                        <option value="">-- Sélectionnez --</option>
                        <option value="Électronique">Électronique</option>
                        <option value="Textiles">Textiles</option>
                        <option value="Documents">Documents</option>
                    </select>
                </div>
                <div>
                    <label>Date de prise en charge</label>
                    <input
                        type="date"
                        name="datePriseEnCharge"
                        value={formData.datePriseEnCharge}
                        onChange={handleInputChange}
                        className="w-full border p-2 rounded"
                        required
                    />
                </div>
                <div>
                    <label>Plage horaire</label>
                    <input
                        type="text"
                        name="plageHoraire"
                        placeholder="Exemple : 14h00 - 16h00"
                        value={formData.plageHoraire}
                        onChange={handleInputChange}
                        className="w-full border p-2 rounded"
                    />
                </div>

                <button
                    type="submit"
                    className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 font-semibold"
                >
                    Confirmer
                </button>
            </form>
        </div>
    );
};

export default ColisDetails;
