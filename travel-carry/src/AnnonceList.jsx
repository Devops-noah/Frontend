import React, { useState } from "react";
import axios from "axios";

const AnnonceList = () => {
    const [annonce, setAnnonce] = useState({
        id: null,
        dateDepart: "",
        dateArrivee: "",
        datePublication: "",
        poidsDisponible: 0,
        voyageur: null,
        demandes: [],
        voyage: null,
        paysDestination: null,
        paysDepart: null,
    });

    // Handle form field changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setAnnonce((prevAnnonce) => ({
            ...prevAnnonce,
            [name]: value,
        }));
    };

    // Handle submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post("http://localhost:8080/api/annonces", annonce);
            console.log("Annonce créée avec succès:", response.data);
            alert("Annonce créée avec succès !");

            // Réinitialise le formulaire si nécessaire
            setAnnonce({
                id: null,
                dateDepart: "",
                dateArrivee: "",
                datePublication: "",
                poidsDisponible: 0,
                voyageur: null,
                demandes: [],
                voyage: null,
                paysDestination: null,
                paysDepart: null,
            });
        } catch (error) {
            console.error("Erreur lors de la création de l'annonce:", error);
            alert("Une erreur est survenue lors de la création de l'annonce.");
        }
    };

    return (
        <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Créer une Annonce</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                    {/* Date de Départ */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Date de Départ</label>
                        <input
                            type="date"
                            name="dateDepart"
                            value={annonce.dateDepart}
                            onChange={handleChange}
                            required
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        />
                    </div>

                    {/* Date d'Arrivée */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Date d'Arrivée</label>
                        <input
                            type="date"
                            name="dateArrivee"
                            value={annonce.dateArrivee}
                            onChange={handleChange}
                            required
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        />
                    </div>

                    {/* Date de Publication */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Date de Publication</label>
                        <input
                            type="date"
                            name="datePublication"
                            value={annonce.datePublication}
                            onChange={handleChange}
                            required
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        />
                    </div>

                    {/* Poids Disponible */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Poids Disponible</label>
                        <input
                            type="number"
                            name="poidsDisponible"
                            value={annonce.poidsDisponible}
                            onChange={handleChange}
                            required
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        />
                    </div>
                </div>

                {/* Voyageur */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">Voyageur (ID)</label>
                    <input
                        type="number"
                        name="voyageur"
                        value={annonce.voyageur || ""}
                        onChange={handleChange}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                </div>

                {/* Voyage */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">Voyage (ID)</label>
                    <input
                        type="number"
                        name="voyage"
                        value={annonce.voyage || ""}
                        onChange={handleChange}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                </div>

                {/* Pays Destination */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">Pays Destination (ID)</label>
                    <input
                        type="number"
                        name="paysDestination"
                        value={annonce.paysDestination || ""}
                        onChange={handleChange}
                        required
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                </div>

                {/* Pays Départ */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">Pays Départ (ID)</label>
                    <input
                        type="number"
                        name="paysDepart"
                        value={annonce.paysDepart || ""}
                        onChange={handleChange}
                        required
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                    Créer
                </button>
            </form>
        </div>
    );
};

export default AnnonceList;
