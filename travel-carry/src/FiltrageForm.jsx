import React, { useState } from 'react';

const FiltrageForm = ({ onFilterChange }) => {
    const [filters, setFilters] = useState({
        dateDepart: '',
        destinationNom: '',
        poidsMin: '',
        prixMax: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFilters((prevFilters) => ({
            ...prevFilters,
            [name]: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onFilterChange(filters);
    };

    return (
        <form className="p-4 bg-white rounded shadow-md" onSubmit={handleSubmit}>
            <h2 className="text-xl font-bold mb-4">Filtrer les Annonces</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                    type="date"
                    name="dateDepart"
                    value={filters.dateDepart}
                    onChange={handleChange}
                    className="border rounded p-2"
                    placeholder="Date de départ"
                />
                <input
                    type="text"
                    name="destinationNom"
                    value={filters.destinationNom}
                    onChange={handleChange}
                    className="border rounded p-2"
                    placeholder="Destination"
                />
                <input
                    type="number"
                    name="poidsMin"
                    value={filters.poidsMin}
                    onChange={handleChange}
                    className="border rounded p-2"
                    placeholder="Poids minimum"
                />
                <input
                    type="number"
                    name="prixMax"
                    value={filters.prixMax}
                    onChange={handleChange}
                    className="border rounded p-2"
                    placeholder="Prix maximum"
                />
            </div>
            <button
                type="submit"
                className="bg-blue-500 text-white mt-4 py-2 px-6 rounded hover:bg-blue-600 transition"
            >
                Appliquer les Filtres
            </button>
        </form>
    );
};

export default FiltrageForm;
