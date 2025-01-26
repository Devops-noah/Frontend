import React, { useEffect, useState } from "react";
import axios from "axios";

const DemandesList = () => {
    const [demandes, setDemandes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null)
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(5);

    useEffect(() => {
        // Fetch data when the component mounts
        const fetchDemandes = async () => {
            const token = localStorage.getItem("token");
            try {
                const response = await axios.get("http://localhost:8080/api/demandes", {
                    headers: {
                        Authorization: `Bearer ${token}`, // Add the token to the headers
                    },
                });
                console.log("demandes response: " + JSON.stringify(response));
                setDemandes(response.data);
                setLoading(false);
            } catch (err) {
                setError("Erreur de récupération des demandes");
                setLoading(false);
            }
        };

        fetchDemandes();
    }, []);

    // If data is still loading
    if (loading) {
        return <div>Chargement des demandes...</div>;
    }

    // If there's an error
    if (error) {
        return <div>{error}</div>;
    }

    // Pagination: Calculate the current items to display based on current page
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = demandes.slice(indexOfFirstItem, indexOfLastItem);

    // Calculate total pages
    const totalPages = Math.ceil(demandes.length / itemsPerPage);

    // Function to determine status color
    const getStatusColor = (status) => {
        console.log("status result: " + status);
        const colorClass = status === "ACCEPTE"
            ? "bg-green-200 text-green-800"
            : status === "EN_ATTENTE"
                ? "bg-orange-200 text-orange-800"
                : status === "REFUSE"
                    ? "bg-red-200 text-red-800"
                    : "bg-gray-200 text-gray-800";

        console.log("status color class: ", colorClass);  // Log the final class
        return colorClass;
    };

    // Handle page change
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    return (
        <div className="container mx-auto px-4 py-6">
            <h1 className="text-2xl font-bold mb-4 text-center">Mes Demandes</h1>
            <div className="overflow-x-auto">
                <table className="mx-auto bg-white border-collapse border border-gray-300 rounded-lg shadow-md">
                    <thead className="bg-indigo-400">
                    <tr>
                        <th className="px-4 py-2 border-b border-r border-gray-300 text-left">Status</th>
                        <th className="px-4 py-2 border-b border-r border-gray-300 text-left">Créé le</th>
                        <th className="px-4 py-2 border-b border-r border-gray-300 text-left">Poids</th>
                        <th className="px-4 py-2 border-b border-r border-gray-300 text-left">Nature</th>
                        <th className="px-4 py-2 border-b border-r border-gray-300 text-left">Catégorie</th>
                        <th className="px-4 py-2 border-b text-left">Dimensions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {currentItems.map((demande) => (
                        <tr key={demande.id} className="hover:bg-gray-50 border-b border-gray-300">
                            <td className={`px-6 py-4 border-b text-sm ${getStatusColor(demande.status)}`}>
                                {demande.status}
                            </td>
                            <td className="px-6 py-4 border-r border-gray-300 text-sm">
                                {new Date(demande.createdAt).toLocaleDateString()}
                            </td>
                            {/* InformationColis fields */}
                            <td className="px-6 py-4 border-r border-gray-300 text-sm">
                                {demande.informationColis?.poids || "N/A"}
                            </td>
                            <td className="px-6 py-4 border-r border-gray-300 text-sm">
                                {demande.informationColis?.nature || "N/A"}
                            </td>
                            <td className="px-6 py-4 border-r border-gray-300 text-sm">
                                {demande.informationColis?.categorie || "N/A"}
                            </td>
                            <td className="px-6 py-4 border-r border-gray-300 text-sm">
                                {demande.informationColis?.dimensions || "N/A"}
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
            {/* Pagination Controls */}
            <div className="mt-4 flex justify-center items-center">
                <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="mx-2 px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
                >
                    Previous
                </button>
                <div className="text-center">
                    Page {currentPage} of {totalPages}
                </div>
                <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="mx-2 px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default DemandesList;
