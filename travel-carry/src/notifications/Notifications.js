import React, { useState, useEffect } from "react";
import axios from "axios";
import { GoPackage } from "react-icons/go";

const Notifications = () => {
    const [notifications, setNotifications] = useState([]);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [selectedNotification, setSelectedNotification] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Récupérer les notifications non lues pour le voyageur
        axios
            .get("http://localhost:8080/api/notifications/unread", {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            })
            .then((response) => setNotifications(response.data))
            .catch((error) => {
                setError("Impossible de charger les notifications.");
            });
    }, []);

    const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

    const handleNotificationClick = (notification) => {
        setSelectedNotification(notification);  // Afficher les détails de la demande
        toggleDropdown();  // Fermer le dropdown
    };

    const handleAccept = (demandeId) => {
        axios
            .put(
                `http://localhost:8080/api/demandes/${demandeId}/status`,
                { status: "ACCEPTE" },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            )
            .then(() => alert("Demande acceptée"))
            .catch((error) => console.error("Erreur lors de l'acceptation"));
    };

    const handleReject = (demandeId) => {
        axios
            .put(
                `http://localhost:8080/api/demandes/${demandeId}/status`,
                { status: "REFUSE" },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            )
            .then(() => alert("Demande refusée"))
            .catch((error) => console.error("Erreur lors du rejet"));
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
                <div
                    className="absolute right-0 mt-2 bg-blue-300 w-80 shadow-md rounded p-4 z-50"
                    onClick={(e) => e.stopPropagation()} // Prevent dropdown from closing when clicking inside
                >
                    {error && <p className="text-red-500">{error}</p>}
                    {notifications.length === 0 ? (
                        <p className="text-gray-500">Aucune notification</p>
                    ) : (
                        notifications.map((notification) => {
                            const informationColis = notification?.demande?.informationColis;
                            const expediteurNom = notification?.demande?.expediteur?.nom;

                            return (
                                <div key={notification.id} className="border-b py-2">
                                    <button
                                        className="w-full text-left py-2 px-4 font-semibold text-white bg-blue-500 rounded-md cursor-pointer"
                                        onClick={() => handleNotificationClick(notification)}
                                    >
                                        <GoPackage />

                                    </button>
                                </div>
                            );
                        })
                    )}
                </div>
            )}

            {selectedNotification && (
                <div className="modal fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white p-6 shadow-lg rounded-lg w-1/2">
                        <h3 className="text-2xl font-bold mb-4">Détails de la demande</h3>
                        {selectedNotification?.demande?.informationColis ? (
                            <>
                                <p><strong>Nature:</strong> {selectedNotification.demande.informationColis.nature}</p>
                                <p><strong>Dimensions:</strong> {selectedNotification.demande.informationColis.dimensions}</p>
                                <p><strong>Poids:</strong> {selectedNotification.demande.informationColis.poids} kg</p>
                                <p><strong>Catégorie:</strong> {selectedNotification.demande.informationColis.categorie}</p>
                                <p><strong>Date prise en charge:</strong> {selectedNotification.demande.informationColis.datePriseEnCharge}</p>
                                <p><strong>Plage horaire:</strong> {selectedNotification.demande.informationColis.plageHoraire}</p>
                            </>
                        ) : (
                            <p className="text-gray-500">Informations colis indisponibles</p>
                        )}

                        <div className="flex justify-between mt-4">
                            <button
                                onClick={() => handleAccept(selectedNotification.id)}
                                className="px-4 py-2 bg-green-500 text-white rounded"
                            >
                                Accepter
                            </button>
                            <button
                                onClick={() => handleReject(selectedNotification.id)}
                                className="px-4 py-2 bg-red-500 text-white rounded"
                            >
                                Refuser
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Notifications;
