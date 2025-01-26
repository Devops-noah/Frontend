import React, { useState, useEffect } from "react";
import axios from "axios";
import { GoPackage } from "react-icons/go";

const Notifications = () => {
    const [notifications, setNotifications] = useState([]);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [selectedNotification, setSelectedNotification] = useState(null);
    const [error, setError] = useState(null);
    const [message, setMessage] = useState(""); // Ajout de l'état pour gérer le message de confirmation

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
    console.log("hawwaaaaaaaaaaaaaaa: " ,JSON.stringify(notifications));
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
                            // Récupérer l'expéditeur ID de la notification
                            const expediteurId = notification?.demande?.expediteurEmail;
                            console.log("expediteurId:", expediteurId);
                            // Faire une requête pour récupérer le nom de l'expéditeur (si nécessaire)
                            let expediteurNom = "";
                            if (expediteurId) {
                                // Si vous avez déjà l'expéditeur avec l'ID, vous pouvez récupérer son nom ici
                                axios.get(`http://localhost:8080/api/utilisateurs/${expediteurId}`)
                                    .then(response => {
                                        expediteurNom = response.data.nom;  // suppose que la réponse contient le nom
                                        console.log("expediteurNom:", expediteurNom);
                                    })
                                    .catch(error => {
                                        console.error("Erreur lors de la récupération du nom de l'expéditeur", error);
                                    });
                            }
                            return (
                                <div key={notification.id} className="border-b py-2">
                                    <button
                                        className="w-full text-left py-2 px-4 font-semibold text-white bg-blue-500 rounded-md cursor-pointer"
                                        onClick={() => handleNotificationClick(notification)}
                                    >
                                        <GoPackage />
                                        <span>Colis proposé par {expediteurNom || "Expéditeur inconnu"}</span>
                                    </button>
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
