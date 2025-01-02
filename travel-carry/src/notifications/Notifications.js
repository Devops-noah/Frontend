import React, { useState, useEffect } from "react";
import axios from "axios";

const Notifications = () => {
    const [notifications, setNotifications] = useState([]);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Récupérer les demandes du backend
        axios
            .get("http://localhost:8080/api/demandes", {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            })
            .then((response) => setNotifications(response.data))
            .catch((error) => {
                console.error("Erreur lors du chargement des demandes :", error);
                setError("Impossible de charger les demandes.");
            });
    }, []);

    const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

    const handleAction = (demandeId, action) => {
        axios
            .put(
                `http://localhost:8080/api/demandes/${demandeId}/status`,
                { status: action },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            )
            .then(() => {
                // Mettre à jour la liste après action
                setNotifications((prev) =>
                    prev.filter((notification) => notification.id !== demandeId)
                );
            })
            .catch((error) => {
                console.error("Erreur lors de la mise à jour de la demande :", error);
                setError("Impossible de mettre à jour la demande.");
            });
    };

    return (
        <div className="relative">
            <button
                onClick={toggleDropdown}
                className="text-white font-bold px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded"
            >
                Notifications [{notifications.length}]
            </button>
            {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white shadow-md rounded p-4 z-50">
                    {error && <p className="text-red-500">{error}</p>}
                    {notifications.length === 0 ? (
                        <p className="text-gray-500">Aucune notification</p>
                    ) : (
                        notifications.map((notification) => (
                            <div key={notification.id} className="border-b py-2">
                                <p className="font-semibold">
                                    Demande : {notification.informationColis.nature}
                                </p>
                                <p>
                                    Dimensions : {notification.informationColis.dimensions}
                                </p>
                                <p>Poids : {notification.informationColis.poids} kg</p>
                                <p>
                                    Prise en charge :{" "}
                                    {new Date(
                                        notification.informationColis.datePriseEnCharge
                                    ).toLocaleDateString()}
                                </p>
                                <div className="flex justify-between mt-2">
                                    <button
                                        onClick={() =>
                                            handleAction(notification.id, "ACCEPTE")
                                        }
                                        className="px-2 py-1 bg-green-500 text-white rounded"
                                    >
                                        Accepter
                                    </button>
                                    <button
                                        onClick={() =>
                                            handleAction(notification.id, "REJETE")
                                        }
                                        className="px-2 py-1 bg-red-500 text-white rounded"
                                    >
                                        Refuser
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
};

export default Notifications;
