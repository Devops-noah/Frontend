import React, { useEffect, useState } from 'react';
import axios from 'axios';

const UserProfile = () => {
    const [user, setUser] = useState(null);
    const [annonces, setAnnonces] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const response = await axios.get('http://localhost:8080/api/user/profile');
                setUser(response.data);
            } catch (err) {
                setError('Failed to fetch user profile');
            }
        };

        const fetchUserAnnonces = async () => {
            try {
                const response = await axios.get('http://localhost:8080/api/annonces/user');
                setAnnonces(response.data);
            } catch (err) {
                setError('Failed to fetch user annonces');
            }
        };

        fetchUserProfile();
        fetchUserAnnonces();
    }, []);

    if (error) {
        return <p className="text-red-500 text-center">{error}</p>;
    }

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            {user ? (
                <div className="bg-white p-4 rounded-lg shadow mb-6">
                    <h2 className="text-2xl font-semibold text-center text-blue-600 mb-4">Profil de {user.nom}</h2>
                    <p><strong>Email:</strong> {user.email}</p>
                    <p><strong>Téléphone:</strong> {user.telephone}</p>
                    <p><strong>Adresse:</strong> {user.adresse}</p>

                    <h3 className="text-xl font-semibold text-center text-blue-600 mt-6">Annonces Créées</h3>
                    {annonces.length === 0 ? (
                        <p className="text-center text-gray-600">Aucune annonce créée.</p>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full bg-white rounded-lg shadow">
                                <thead>
                                <tr className="bg-blue-600 text-white">
                                    <th className="px-4 py-3 font-semibold text-left">ID</th>
                                    <th className="px-4 py-3 font-semibold text-left">Titre</th>
                                    <th className="px-4 py-3 font-semibold text-left">Poids (kg)</th>
                                    <th className="px-4 py-3 font-semibold text-left">Prix ($)</th>
                                    <th className="px-4 py-3 font-semibold text-left">Date de départ</th>
                                    <th className="px-4 py-3 font-semibold text-left">Actions</th>
                                </tr>
                                </thead>
                                <tbody>
                                {annonces.map((annonce) => (
                                    <tr key={annonce.id}>
                                        <td className="border-t px-4 py-2">{annonce.id}</td>
                                        <td className="border-t px-4 py-2">{annonce.titre}</td>
                                        <td className="border-t px-4 py-2">{annonce.poids}</td>
                                        <td className="border-t px-4 py-2">{annonce.prix}</td>
                                        <td className="border-t px-4 py-2">{annonce.dateDepart}</td>
                                        <td className="border-t px-4 py-2">
                                            <button
                                                onClick={() => alert(`View annonce: ${annonce.id}`)} // Replace with your route
                                                className="text-blue-500 hover:text-blue-700"
                                            >
                                                Voir
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            ) : (
                <p className="text-center text-gray-600">Chargement du profil...</p>
            )}
        </div>
    );
};

export default UserProfile;
