import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AnnonceUpdateForm = ({ id }) => {
    const [annonce, setAnnonce] = useState(null);
    const [error, setError] = useState(null);
    const [updatedAnnonce, setUpdatedAnnonce] = useState({
        titre: '',
        poids: '',
        prix: '',
        dateDepart: '',
        paysDepart: '',
        paysDestination: '',
    });

    useEffect(() => {
        const fetchAnnonce = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/api/annonces/${id}`);
                setAnnonce(response.data);
                setUpdatedAnnonce({
                    titre: response.data.titre,
                    poids: response.data.poids,
                    prix: response.data.prix,
                    dateDepart: response.data.dateDepart,
                    paysDepart: response.data.paysDepart,
                    paysDestination: response.data.paysDestination,
                });
            } catch (err) {
                setError('Failed to fetch annonce data');
            }
        };

        fetchAnnonce();
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUpdatedAnnonce((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleUpdateAnnonce = async () => {
        try {
            const response = await axios.put(`http://localhost:8080/api/annonces/${id}`, updatedAnnonce, {
                headers: { 'Content-Type': 'application/json' },
            });
            alert('Annonce updated successfully');
        } catch (err) {
            setError('Failed to update annonce');
        }
    };

    if (error) {
        return <p className="text-red-500 text-center">{error}</p>;
    }

    return (
        <div className="w-1/2 mx-auto bg-white p-4 rounded-lg shadow mb-6">
            <h2 className="text-2xl font-semibold text-center text-blue-600 mb-4">Mettre à jour l'Annonce</h2>
            {annonce ? (
                <>
                    <input
                        type="text"
                        name="titre"
                        value={updatedAnnonce.titre}
                        onChange={handleChange}
                        placeholder="Titre"
                        className="border border-gray-300 rounded-md p-2 w-full mb-2"
                    />
                    <input
                        type="number"
                        name="poids"
                        value={updatedAnnonce.poids}
                        onChange={handleChange}
                        placeholder="Poids (kg)"
                        className="border border-gray-300 rounded-md p-2 w-full mb-2"
                    />
                    <input
                        type="number"
                        name="prix"
                        value={updatedAnnonce.prix}
                        onChange={handleChange}
                        placeholder="Prix ($)"
                        className="border border-gray-300 rounded-md p-2 w-full mb-2"
                    />
                    <input
                        type="date"
                        name="dateDepart"
                        value={updatedAnnonce.dateDepart}
                        onChange={handleChange}
                        className="border border-gray-300 rounded-md p-2 w-full mb-2"
                    />
                    <input
                        type="text"
                        name="paysDepart"
                        value={updatedAnnonce.paysDepart}
                        onChange={handleChange}
                        placeholder="Pays de départ"
                        className="border border-gray-300 rounded-md p-2 w-full mb-2"
                    />
                    <input
                        type="text"
                        name="paysDestination"
                        value={updatedAnnonce.paysDestination}
                        onChange={handleChange}
                        placeholder="Pays de destination"
                        className="border border-gray-300 rounded-md p-2 w-full mb-4"
                    />
                    <button
                        onClick={handleUpdateAnnonce}
                        className="bg-blue-500 text-white rounded-md p-2 w-full hover:bg-blue-600 transition"
                    >
                        Mettre à jour l'Annonce
                    </button>
                </>
            ) : (
                <p className="text-center text-gray-600">Chargement des données...</p>
            )}
        </div>
    );
};

export default AnnonceUpdateForm;
