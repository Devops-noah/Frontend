import React, { useState, useEffect } from "react";
import axios from "axios";
import { GoPackage } from "react-icons/go";

const Notifications = () => {
    const [notifications, setNotifications] = useState([]);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [selectedNotification, setSelectedNotification] = useState(null);
    const [error, setError] = useState(null);
    const [message, setMessage] = useState(""); // Ajout de l'état pour gérer le message de confirmation
    const [expediteurNames, setExpediteurNames] = useState({});

    useEffect(() => {
        // Fetch notifications and prefetch expediteur names
        axios
            .get("http://localhost:8080/api/notifications/unread", {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            })
            .then(async (response) => {
                const notifications = response.data;
                setNotifications(notifications);

                // Collect expediteur IDs from the notifications
                const expediteurIds = notifications
                    .map((notification) => notification?.demande?.expediteurId)
                    .filter(Boolean); // Remove null/undefined IDs

                // Fetch the names for all expediteur IDs
                const namesMap = {};
                const fetchPromises = expediteurIds.map(async (id) => {
                    try {
                        const res = await axios.get(
                            `http://localhost:8080/api/utilisateurs/expediteur/${id}`,
                            {
                                headers: {
                                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                                },
                            }
                        );
                        namesMap[id] = res.data; // Assuming response contains the expediteur name
                    } catch (error) {
                        console.error(`Error fetching expediteur name for ID: ${id}`, error);
                    }
                });

                // Wait for all fetches to complete
                await Promise.all(fetchPromises);

                // Update state with expediteur names
                setExpediteurNames(namesMap);
            })
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
            .then(() => {
                setMessage("Demande acceptée"); // Affichage du message de confirmation
                setSelectedNotification(null);  // Fermer la modale après acceptation
                setTimeout(() => setMessage(""), 5000); // Ferme le message après 5 secondes
            })
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
            .then(() => {
                setMessage("Demande refusée"); // Affichage du message de confirmation
                setSelectedNotification(null);  // Fermer la modale après rejet
                setTimeout(() => setMessage(""), 5000); // Ferme le message après 5 secondes
            })
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
                    className="absolute right-0 mt-2 bg-gray-800 w-80 shadow-md rounded p-4 z-50"
                    onClick={(e) => e.stopPropagation()} // Prevent dropdown from closing when clicking inside
                >
                    {error && <p className="text-red-500">{error}</p>}
                    {notifications.length === 0 ? (
                        <p className="text-gray-500">Aucune notification</p>
                    ) : (
                        notifications.map((notification) => {
                                const expediteurId = notification?.demande?.expediteurId;
                                const expediteurNom = expediteurNames[expediteurId] || "Expéditeur inconnu";

                                return (
                                    <div key={notification.id} className="border-b py-2">
                                        <a
                                            className="w-full text-left font-semibold text-white cursor-pointer flex justify-center items-center gap-2"
                                            onClick={() => handleNotificationClick(notification)}
                                        >
                                            <GoPackage className="text-white"/>
                                            <em className="text-yellow-300">Colis proposé par {expediteurNom}</em>
                                        </a>

                                    </div>
                                );
                        })
                    )}
                </div>
            )}

            {selectedNotification && (
                <div className="modal fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-black p-6 shadow-lg rounded-lg w-1/2">
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

            {/* Affichage du message de confirmation sans alert() */}
            {message && (
                <div className="fixed bottom-5 left-5 bg-green-500 text-white p-4 rounded-lg">
                    {message}
                </div>
            )}
        </div>
    );
};
export default Notifications;
