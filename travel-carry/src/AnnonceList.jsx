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

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilter((prevFilter) => ({
            ...prevFilter,
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
    console.log("annocnces : " + JSON.stringify(annonces));

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            {error && <p className="text-red-500 text-center mb-4">{error}</p>}

            <div className="w-1/2 mx-auto">
                <h2 className="text-2xl font-semibold text-center text-blue-600 mb-6">Filter Annonces</h2>

                {/* Filter Section */}
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
                            </tr>
                            </thead>
                            <tbody>
                            {annonces.map((annonce, index) => (
                                <tr key={annonce.id} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                                    <td className="border-t px-4 py-2">{annonce.id}</td>
                                    <td className="border-t px-4 py-2">{annonce.poids}</td>
                                    <td className="border-t px-4 py-2">{annonce.prix}</td>
                                    <td className="border-t px-4 py-2">{annonce.voyage?.dateDepart || 'Voyage not available'}</td> {/* Updated for dateDepart */}
                                    <td className="border-t px-4 py-2">{annonce.paysDepart?.nom}</td>
                                    <td className="border-t px-4 py-2">{annonce.paysDestination?.nom}</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AnnonceList;
