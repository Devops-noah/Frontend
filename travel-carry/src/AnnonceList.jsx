import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AnnoncesPage = () => {
    const [annonces, setAnnonces] = useState([]);
    const [filteredAnnonces, setFilteredAnnonces] = useState([]);
    const [filters, setFilters] = useState({
        dateDepart: "",
        dateArrivee: "",
        paysDepart: "",
        paysDestination: "",
    });
    const [currentPage, setCurrentPage] = useState(1);
    const annoncesPerPage = 8;
    const navigate = useNavigate();

    // Fetch all annonces
    useEffect(() => {
        axios.get("http://localhost:8080/api/annonces").then((response) => {
            console.log("annonces list: " + JSON.stringify(response))
            setAnnonces(response.data);
            setFilteredAnnonces(response.data);
        });
    }, []);

    // Handle filter changes
    const handleFilterChange = (e) => {
        setFilters({
            ...filters,
            [e.target.name]: e.target.value,
        });
    };

    // Apply filters
    const handleFilter = () => {
        const filtered = annonces.filter((annonce) => {
            return (
                (!filters.dateDepart ||
                    new Date(annonce.dateDepart) >= new Date(filters.dateDepart)) &&
                (!filters.dateArrivee ||
                    new Date(annonce.dateArrivee) <= new Date(filters.dateArrivee)) &&
                (!filters.paysDepart ||
                    annonce.paysDepart
                        .toLowerCase()
                        .includes(filters.paysDepart.toLowerCase())) &&
                (!filters.paysDestination ||
                    annonce.paysDestination
                        .toLowerCase()
                        .includes(filters.paysDestination.toLowerCase()))
            );
        });
        setFilteredAnnonces(filtered);
        setCurrentPage(1); // Reset to first page
    };

    // Clear filters
    const clearFilters = () => {
        setFilters({
            dateDepart: "",
            dateArrivee: "",
            paysDepart: "",
            paysDestination: "",
        });
        setFilteredAnnonces(annonces); // Reset to show all annonces
        setCurrentPage(1); // Reset to first page
    };

    // Pagination logic
    const indexOfLastAnnonce = currentPage * annoncesPerPage;
    const indexOfFirstAnnonce = indexOfLastAnnonce - annoncesPerPage;
    const currentAnnonces = filteredAnnonces.slice(
        indexOfFirstAnnonce,
        indexOfLastAnnonce
    );

    const totalPages = Math.ceil(filteredAnnonces.length / annoncesPerPage);

    return (
        <div className="min-h-screen bg-gray-100 py-8">
            <div className="max-w-6xl mx-auto px-5 grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Sidebar - Filters */}
                <div className="lg:col-span-1 bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-bold mb-4">Filter les annonces</h2>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-gray-700">Date Depart:</label>
                            <input
                                type="date"
                                name="dateDepart"
                                value={filters.dateDepart}
                                onChange={handleFilterChange}
                                className="w-full p-2 border rounded-lg"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700">Date Arrivee:</label>
                            <input
                                type="date"
                                name="dateArrivee"
                                value={filters.dateArrivee}
                                onChange={handleFilterChange}
                                className="w-full p-2 border rounded-lg"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700">Pays Depart:</label>
                            <input
                                type="text"
                                name="paysDepart"
                                value={filters.paysDepart}
                                onChange={handleFilterChange}
                                className="w-full p-2 border rounded-lg"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700">Pays Destination:</label>
                            <input
                                type="text"
                                name="paysDestination"
                                value={filters.paysDestination}
                                onChange={handleFilterChange}
                                className="w-full p-2 border rounded-lg"
                            />
                        </div>
                        <div className="mt-6 flex justify-between">
                            <button
                                onClick={handleFilter}
                                className="bg-gray-400 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded-lg"
                            >
                                Filter
                            </button>
                            <button
                                onClick={clearFilters}
                                className="bg-gray-400 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded-lg"
                            >
                                Supprimer
                            </button>
                        </div>
                    </div>
                </div>

                {/* Right Section - Annonces List */}
                <div className="lg:col-span-3 bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-2xl font-bold mb-6">Annonces</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-8">
                        {currentAnnonces.map((annonce, index) => (
                            <div
                                key={index}
                                className="bg-blue-500 text-white p-4 rounded-lg shadow-md relative flex justify-between items-center"
                                onClick={() => navigate(`/annonces/${annonce.id}`)} // Redirect to AnnonceDetail
                            >
                                {/* Section gauche : Dates */}
                                <div>
                                    <h3 className="text-sm font-bold">
                                        Date Départ {new Date(annonce.dateDepart).toLocaleDateString()}
                                    </h3>
                                    <p className="text-sm font-bold">
                                        Date Arrivée  {new Date(annonce.dateArrivee).toLocaleDateString()}
                                    </p>
                                </div>

                                {/* Section droite : Pays */}
                                <div className="text-right">
                                    <h3 className="text-sm font-bold mb-2">
                                         Départ {annonce.paysDepart}
                                    </h3>
                                    <p className="text-sm font-bold">
                                        Déstination {annonce.paysDestination}
                                    </p>
                                </div>

                                {/* Date de publication */}
                                <div className="absolute top-1 left-2 text-gray-200 text-xs">
                                    Publiée le : {new Date(annonce.datePublication).toLocaleDateString()}
                                </div>
                            </div>
                        ))}

                    </div>

                    {/* Pagination */}
                    <div className="mt-8 flex justify-center gap-4">
                        {Array.from({ length: totalPages }).map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentPage(index + 1)}
                                className={`${
                                    currentPage === index + 1
                                        ? "bg-blue-500 text-white"
                                        : "bg-gray-300"
                                } hover:bg-blue-600 py-2 px-4 rounded-lg font-bold`}
                            >
                                {index + 1}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AnnoncesPage;
