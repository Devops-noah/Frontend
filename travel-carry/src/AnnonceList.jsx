import React, { useEffect, useState } from 'react';
import axios from 'axios';
import debounce from 'lodash/debounce';

const AnnonceList = () => {
    const [annonces, setAnnonces] = useState([]);
    const [error, setError] = useState(null);
    const [filter, setFilter] = useState({
        dateDepart: '',
        prixMax: '',
        poidsMin: '',
        destinationNom: '',
    });
    const [newAnnonce, setNewAnnonce] = useState({
        titre: '',
        poids: '',
        prix: '',
        dateDepart: '',
        paysDepart: '',
        paysDestination: '',
    });
    const [editAnnonce, setEditAnnonce] = useState(null); // For editing an annonce

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilter((prevFilter) => ({
            ...prevFilter,
            [name]: value,
        }));
    };

    const handleNewAnnonceChange = (e) => {
        const { name, value } = e.target;
        setNewAnnonce((prevAnnonce) => ({
            ...prevAnnonce,
            [name]: value,
        }));
    };

    // Debounced fetch function to avoid rapid calls
    const debouncedFetchAnnonces = debounce(async () => {
        const filteredRequestBody = {};
        for (const key in filter) {
            if (filter[key]) filteredRequestBody[key] = filter[key];
        }

        try {
            const response = await axios.post('http://localhost:8080/api/annonces/filter', filteredRequestBody, {
                headers: { 'Content-Type': 'application/json' },
            });
            setAnnonces(response.data);
        } catch (err) {
            console.error('Error fetching annonces:', err);
            setError('Failed to fetch annonces');
        }
    }, 300); // Adjust the debounce delay as needed

    useEffect(() => {
        debouncedFetchAnnonces();
    }, [filter]);

    // Add a new annonce
    const handleCreateAnnonce = async () => {
        try {
            const response = await axios.post('http://localhost:8080/api/annonces', newAnnonce, {
                headers: { 'Content-Type': 'application/json' },
            });
            setAnnonces((prevAnnonces) => [...prevAnnonces, response.data]);
            setNewAnnonce({
                titre: '',
                poids: '',
                prix: '',
                dateDepart: '',
                paysDepart: '',
                paysDestination: '',
            }); // Reset new annonce form
        } catch (err) {
            setError('Failed to create annonce');
        }
    };

    // Update an existing annonce
    const handleEditAnnonce = async (id) => {
        try {
            const response = await axios.put(`http://localhost:8080/api/annonces/${id}`, editAnnonce, {
                headers: { 'Content-Type': 'application/json' },
            });
            setAnnonces((prevAnnonces) =>
                prevAnnonces.map((annonce) =>
                    annonce.id === id ? response.data : annonce
                )
            );
            setEditAnnonce(null); // Close edit form
        } catch (err) {
            setError('Failed to update annonce');
        }
    };

    // Delete an annonce
    const handleDeleteAnnonce = async (id) => {
        try {
            await axios.delete(`http://localhost:8080/api/annonces/${id}`);
            setAnnonces((prevAnnonces) => prevAnnonces.filter((annonce) => annonce.id !== id));
        } catch (err) {
            setError('Failed to delete annonce');
        }
    };

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            {error && <p className="text-red-500 text-center mb-4">{error}</p>}

            {/* Filter Section */}
            <div className="w-1/2 mx-auto">
                <h2 className="text-2xl font-semibold text-center text-blue-600 mb-6">Filter Annonces</h2>

                <div className="flex flex-wrap items-center gap-3 mb-6 bg-white p-4 rounded-lg shadow">
                    <input
                        type="date"
                        name="dateDepart"
                        value={filter.dateDepart}
                        onChange={handleFilterChange}
                        className="border border-gray-300 rounded-md p-2 w-full md:w-1/5"
                        placeholder="Date de départ"
                    />
                    <input
                        type="number"
                        name="poidsMin"
                        value={filter.poidsMin}
                        onChange={handleFilterChange}
                        className="border border-gray-300 rounded-md p-2 w-full md:w-1/5"
                        placeholder="Poids minimum"
                    />
                    <input
                        type="number"
                        name="prixMax"
                        value={filter.prixMax}
                        onChange={handleFilterChange}
                        className="border border-gray-300 rounded-md p-2 w-full md:w-1/5"
                        placeholder="Prix maximum"
                    />
                    <input
                        type="text"
                        name="destinationNom"
                        value={filter.destinationNom}
                        onChange={handleFilterChange}
                        className="border border-gray-300 rounded-md p-2 w-full md:w-1/5"
                        placeholder="Destination"
                    />
                    <button
                        onClick={debouncedFetchAnnonces}
                        className="bg-blue-500 text-white rounded-md p-2 w-full md:w-auto md:px-6 hover:bg-blue-600 transition"
                    >
                        Filtres
                    </button>
                </div>
            </div>

            {/* Create Annonce Form */}
            <div className="w-1/2 mx-auto bg-white p-4 rounded-lg shadow mb-6">
                <h2 className="text-2xl font-semibold text-center text-blue-600 mb-4">Créer une Annonce</h2>
                <input
                    type="text"
                    name="titre"
                    value={newAnnonce.titre}
                    onChange={handleNewAnnonceChange}
                    placeholder="Titre"
                    className="border border-gray-300 rounded-md p-2 w-full mb-2"
                />
                <input
                    type="number"
                    name="poids"
                    value={newAnnonce.poids}
                    onChange={handleNewAnnonceChange}
                    placeholder="Poids (kg)"
                    className="border border-gray-300 rounded-md p-2 w-full mb-2"
                />
                <input
                    type="number"
                    name="prix"
                    value={newAnnonce.prix}
                    onChange={handleNewAnnonceChange}
                    placeholder="Prix ($)"
                    className="border border-gray-300 rounded-md p-2 w-full mb-2"
                />
                <input
                    type="date"
                    name="dateDepart"
                    value={newAnnonce.dateDepart}
                    onChange={handleNewAnnonceChange}
                    className="border border-gray-300 rounded-md p-2 w-full mb-2"
                />
                <input
                    type="text"
                    name="paysDepart"
                    value={newAnnonce.paysDepart}
                    onChange={handleNewAnnonceChange}
                    placeholder="Pays de départ"
                    className="border border-gray-300 rounded-md p-2 w-full mb-2"
                />
                <input
                    type="text"
                    name="paysDestination"
                    value={newAnnonce.paysDestination}
                    onChange={handleNewAnnonceChange}
                    placeholder="Pays de destination"
                    className="border border-gray-300 rounded-md p-2 w-full mb-4"
                />
                <button
                    onClick={handleCreateAnnonce}
                    className="bg-blue-500 text-white rounded-md p-2 w-full hover:bg-blue-600 transition"
                >
                    Créer l'Annonce
                </button>
            </div>

            {/* Annonce List */}
            <h2 className="text-2xl font-semibold text-center text-blue-600 mb-4">Available Annonces</h2>
            {annonces.length === 0 ? (
                <p className="text-center text-gray-600">No annonces available.</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white rounded-lg shadow">
                        <thead>
                        <tr className="bg-blue-600 text-white">
                            <th className="px-4 py-3 font-semibold text-left">ID</th>
                            <th className="px-4 py-3 font-semibold text-left">Poids (kg)</th>
                            <th className="px-4 py-3 font-semibold text-left">Prix ($)</th>
                            <th className="px-4 py-3 font-semibold text-left">Date de Départ</th>
                            <th className="px-4 py-3 font-semibold text-left">Pays de Départ</th>
                            <th className="px-4 py-3 font-semibold text-left">Pays de Destination</th>
                            <th className="px-4 py-3 font-semibold text-left">Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {annonces.map((annonce, index) => (
                            <tr key={annonce.id} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                                <td className="border-t px-4 py-2">{annonce.id}</td>
                                <td className="border-t px-4 py-2">{annonce.poids}</td>
                                <td className="border-t px-4 py-2">{annonce.prix}</td>
                                <td className="border-t px-4 py-2">{annonce.voyage?.dateDepart || 'Voyage not available'}</td>
                                <td className="border-t px-4 py-2">{annonce.paysDepart?.nom}</td>
                                <td className="border-t px-4 py-2">{annonce.paysDestination?.nom}</td>
                                <td className="border-t px-4 py-2">
                                    <button
                                        onClick={() => handleDeleteAnnonce(annonce.id)}
                                        className="text-red-500 hover:text-red-700"
                                    >
                                        Supprimer
                                    </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default AnnonceList;
