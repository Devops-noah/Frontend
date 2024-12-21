gimport React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const AnnonceDetail = () => {
    const { id } = useParams(); // Assuming you're using React Router for dynamic routing
    const [annonce, setAnnonce] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchAnnonceDetail = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/api/annonces/${id}`);
                setAnnonce(response.data);
            } catch (err) {
                console.error('Erreur lors de la récupération de l\'annonce :', err);
                setError('Impossible de charger les détails de l\'annonce.');
            }
        };
        fetchAnnonceDetail();
    }, [id]);

    if (error) {
        return <p className="text-red-500 text-center">{error}</p>;
    }

    if (!annonce) {
        return <p className="text-center text-gray-600">Chargement des détails de l'annonce...</p>;
    }

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <div className="w-1/2 mx-auto bg-white p-6 rounded-lg shadow">
                <h2 className="text-2xl font-semibold text-center text-blue-600 mb-6">Détails de l'Annonce</h2>
                <ul className="space-y-3">
                    <li><strong>ID :</strong> {annonce.id}</li>
                    <li><strong>Description :</strong> {annonce.description}</li>
                    <li><strong>Poids :</strong> {annonce.poids} kg</li>
                    <li><strong>Dimensions :</strong> {annonce.dimensions}</li>
                    <li><strong>Date de départ :</strong> {annonce.dateDepart}</li>
                    <li><strong>Pays de départ :</strong> {annonce.paysDepart?.nom || 'Non spécifié'}</li>
                    <li><strong>Pays de destination :</strong> {annonce.paysDestination?.nom || 'Non spécifié'}</li>
                </ul>
            </div>
        </div>
    );
};

export default AnnonceDetail;
