import React, { useState, useEffect } from "react";
import axios from "axios";

const AnnonceList = () => {
    const [annonces, setAnnonces] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Récupère les annonces depuis l'API au chargement du composant
    useEffect(() => {
        const fetchAnnonces = async () => {
            try {
                const response = await axios.get("http://localhost:8080/api/annonces");
                setAnnonces(response.data);
            } catch (err) {
                console.error("Erreur lors de la récupération des annonces:", err);
                setError("Impossible de récupérer les annonces.");
            } finally {
                setLoading(false);
            }
        };

        fetchAnnonces();
    }, []);

    if (loading) {
        return <div className="text-center mt-10 text-lg">Chargement des annonces...</div>;
    }

    if (error) {
        return <div className="text-center mt-10 text-lg text-red-600">{error}</div>;
    }

    return (
        <div className="max-w-6xl mx-auto p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Liste des Annonces</h2>
            <div className="overflow-x-auto">
                <table className="min-w-full border-collapse border border-gray-300">
                    <thead>
                    <tr className="bg-gray-100">
                        <th className="border border-gray-300 px-4 py-2 text-left">#</th>
                        <th className="border border-gray-300 px-4 py-2 text-left">Date Départ</th>
                        <th className="border border-gray-300 px-4 py-2 text-left">Date Arrivée</th>
                        <th className="border border-gray-300 px-4 py-2 text-left">Poids Disponible</th>
                        <th className="border border-gray-300 px-4 py-2 text-left">Pays Départ</th>
                        <th className="border border-gray-300 px-4 py-2 text-left">Pays Destination</th>
                    </tr>
                    </thead>
                    <tbody>
                    {annonces.map((annonce, index) => (
                        <tr key={annonce.id} className="hover:bg-gray-100">
                            <td className="border border-gray-300 px-4 py-2">{index + 1}</td>
                            <td className="border border-gray-300 px-4 py-2">{annonce.dateDepart}</td>
                            <td className="border border-gray-300 px-4 py-2">{annonce.dateArrivee}</td>
                            <td className="border border-gray-300 px-4 py-2">{annonce.poidsDisponible} kg</td>
                            <td className="border border-gray-300 px-4 py-2">
                                {annonce.paysDepart ? annonce.paysDepart.nom : "N/A"}
                            </td>
                            <td className="border border-gray-300 px-4 py-2">
                                {annonce.paysDestination ? annonce.paysDestination.nom : "N/A"}
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AnnonceList;
