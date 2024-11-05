import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AnnonceList = () => {
    const [annonces, setAnnonces] = useState([]);
    const [error, setError] = useState(null);
    const [filter, setFilter] = useState({
        dateDepart: '',
        prixMax: '',
        poidsMin: '',
        destination: '',
    });

    // Function to handle filter input changes
    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilter((prevFilter) => ({
            ...prevFilter,
            [name]: value,
        }));
    };

    // Function to fetch annonces based on filter
    const fetchAnnonces = async () => {
        // Create a new object to hold only valid filter properties
        const filteredRequestBody = {};

        // Iterate through the filter object
        for (const key in filter) {
            if (filter[key]) { // Only include properties that have a truthy value
                filteredRequestBody[key] = filter[key];
            }
        }

        // Log the filtered request body to verify what will be sent
        console.log('Sending filter:', filteredRequestBody);

        try {
            // Send the request with the filtered body
            const response = await axios.post('http://localhost:8080/api/annonces/filter', filteredRequestBody, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            console.log("response respnse: " + JSON.stringify(response.data))
            setAnnonces(response.data); // Assuming the API returns data directly
        } catch (err) {
            console.error('Error fetching annonces:', err);
            setError('Failed to fetch annonces');
        }
    };


    // Call fetchAnnonces whenever the filter changes
    useEffect(() => {
        fetchAnnonces();
    }, [filter]);

    return (
        <div>
            {error && <p className="text-red-500">{error}</p>}
            <h2>Filter Annonces</h2>
            <div className="flex space-x-4 mb-4">
                <input
                    type="date"
                    name="dateDepart"
                    value={filter.dateDepart}
                    onChange={handleFilterChange}
                    className="border rounded p-2"
                    placeholder="Date de départ"
                />
                <input
                    type="number"
                    name="prixMax"
                    value={filter.prixMax}
                    onChange={handleFilterChange}
                    className="border rounded p-2"
                    placeholder="Prix maximum"
                />
                <input
                    type="number"
                    name="poidsMin"
                    value={filter.poidsMin}
                    onChange={handleFilterChange}
                    className="border rounded p-2"
                    placeholder="Poids minimum"
                />
                <input
                    type="text"
                    name="destination"
                    value={filter.destination}
                    onChange={handleFilterChange}
                    className="border rounded p-2"
                    placeholder="Destination"
                />
                <button
                    onClick={fetchAnnonces}
                    className="bg-blue-500 text-white rounded p-2"
                >
                    Filter
                </button>
            </div>
            <h2>Available Annonces</h2>
            {annonces.length === 0 ? (
                <p>No annonces available.</p>
            ) : (
                <table className="min-w-full">
                    <thead>
                    <tr>
                        <th className="border px-4 py-2">ID</th>
                        <th className="border px-4 py-2">Poids (kg)</th>
                        <th className="border px-4 py-2">Prix ($)</th>
                        <th className="border px-4 py-2">Date de Création</th>
                        <th className="border px-4 py-2">Pays de Départ</th>
                        <th className="border px-4 py-2">Pays de Destination</th>
                    </tr>
                    </thead>
                    <tbody>
                    {annonces.map((annonce) => (
                        <tr key={annonce.id}>
                            <td className="border px-4 py-2">{annonce.id}</td>
                            <td className="border px-4 py-2">{annonce.poids}</td>
                            <td className="border px-4 py-2">{annonce.prix}</td>
                            <td className="border px-4 py-2">{annonce.dateCreation || 'Not specified'}</td>
                            <td className="border px-4 py-2">{annonce.paysDepart?.nom}</td>
                            <td className="border px-4 py-2">{annonce.paysDestination?.nom}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default AnnonceList;
