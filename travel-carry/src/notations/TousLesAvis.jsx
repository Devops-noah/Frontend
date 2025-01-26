import React, { useState, useEffect, useMemo } from "react";
import { format } from "date-fns";
import axios from "axios";

export default function TousLesAvis() {
    const [notations, setNotations] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const notationsPerPage = 8;

    // Charger les données depuis localStorage au montage du composant
    useEffect(() => {
        axios.get("http://localhost:8080/api/notations/approved").then((response) => {
            setNotations(response.data);
        });
        // const storedNotations = JSON.parse(localStorage.getItem("notations")) || [];
        // setNotations(storedNotations);
    }, []);
    console.log("uuuuu: ", notations)

    // Mémorisation des notations triées et paginées
    const sortedAndPaginatedNotations = useMemo(() => {
        const sortedNotations = [...notations].sort(
            (a, b) => new Date(a.datePublication) - new Date(b.datePublication)
        );

        const indexOfLastNotation = currentPage * notationsPerPage;
        const indexOfFirstNotation = indexOfLastNotation - notationsPerPage;

        return sortedNotations.slice(indexOfFirstNotation, indexOfLastNotation);
    }, [notations, currentPage, notationsPerPage]);

    const totalPages = Math.ceil(notations.length / notationsPerPage);

    const renderStars = (value) => {
        const fullStars = Math.floor(value);
        const halfStar = value % 1 >= 0.5;
        const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
        return (
            <>
                {"★".repeat(fullStars)}
                {halfStar && "☆"}
                {"☆".repeat(emptyStars)}
            </>
        );
    };

    return (
        <div className="min-h-screen bg-gray-100 py-8">
            <div className="max-w-6xl mx-auto px-5">
                <h2 className="text-3xl font-bold mb-6 text-center">Tous les avis</h2>

                {/* Liste des avis */}
                {notations.length === 0 ? (
                    <p className="text-center text-gray-500">
                        Aucun avis disponible pour le moment.
                    </p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-8">
                        {sortedAndPaginatedNotations.map((notation) => {
                            const formattedDate = format(
                                new Date(notation.datePublication),
                                "dd-MM-yyyy"
                            );

                            return (
                                <div
                                    key={notation.id} // Utilisation d'un ID unique
                                    className="p-6 bg-white shadow-md rounded-lg hover:shadow-lg transition-shadow duration-200"
                                    style={{textAlign: "left"}}
                                >
                                    <p className="mb-2">
                                        <strong>Note :</strong>{" "}
                                        <span className="font-bold text-yellow-700">{renderStars(notation.note)}</span> <span className="text-blue-600">({notation.note} / 5)</span>
                                    </p>
                                    <p className="mb-2">
                                        {notation.commentaire ? (
                                            <>
                                            <strong>Commentaire :</strong>
                                            <span>{notation.commentaire}</span>
                                            </>
                                        ) : (<span className="hidden"><strong>Commentaire :</strong>{" "}: {notation.commentaire}</span> )
                                        }
                                    </p>

                                    <p className="mb-2">
                                        <strong>Publié par :</strong>{" "}
                                        {notation.userName} {notation.userFirstName}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        Publié le {formattedDate}
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* Pagination */}
                {notations.length > notationsPerPage && (
                    <div className="mt-6 flex justify-between items-center">
                    <button
                            onClick={() => setCurrentPage(currentPage - 1)}
                            disabled={currentPage === 1}
                            className={`py-2 px-4 rounded-lg transition-all duration-200 ${
                                currentPage === 1
                                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                    : "bg-gray-400 text-white hover:bg-gray-500"
                            }`}
                        >
                            Précédent
                        </button>
                        <span className="text-lg font-bold">
                            Page {currentPage} sur {totalPages}
                        </span>
                        <button
                            onClick={() => setCurrentPage(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className={`py-2 px-4 rounded-lg transition-all duration-200 ${
                                currentPage === totalPages
                                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                    : "bg-gray-400 text-white hover:bg-gray-500"
                            }`}
                        >
                            Suivant
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
