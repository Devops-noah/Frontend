import React, { useState, useEffect } from "react";
import axios from "axios";

const Notifications = () => {
    const [notifications, setNotifications] = useState([]);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [selectedNotification, setSelectedNotification] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Récupérer les notifications non lues pour le voyageur
        //hawa a modifier ici 
        axios.get("http://localhost:8080/api/notifications/unread/{voyageurId}", {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            }
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
        axios.put(`http://localhost:8080/api/demandes/${demandeId}/status`, { status: "ACCEPTE" })
            .then(() => alert("Demande acceptée"))
            .catch((error) => console.error("Erreur lors de l'acceptation"));
    };

    const handleReject = (demandeId) => {
        axios.put(`http://localhost:8080/api/demandes/${demandeId}/status`, { status: "REFUSE" })
            .then(() => alert("Demande refusée"))
            .catch((error) => console.error("Erreur lors du rejet"));
        
    };

    return (
        <div className="relative">
            <button onClick={toggleDropdown} className="text-white font-bold px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded">
                Notifications [{notifications.length}]
            </button>

            {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white shadow-md rounded p-4 z-50">
                    {error && <p className="text-red-500">{error}</p>}
                    {notifications.length === 0 ? (
                        <p className="text-gray-500">Aucune notification</p>
                    ) : (
                        notifications.map((notification) => (
                            <div
                                key={notification.id}
                                className="border-b py-2 cursor-pointer"
                                onClick={() => handleNotificationClick(notification)}
                            >
                                <p className="font-semibold">{notification.message}</p>
                                {/* Tu peux aussi afficher plus d'infos si tu veux ici */}
                                <p>Dimensions : {notification.informationColis.dimensions}</p>
                            </div>
                        ))
                    )}
                </div>
            )}

            {selectedNotification && (
                <div className="modal">
                    <h3>Détails de la demande</h3>
                    <p>Nature: {selectedNotification.informationColis.nature}</p>
                    <p>Dimensions: {selectedNotification.informationColis.dimensions}</p>
                    <p>Poids: {selectedNotification.informationColis.poids} kg</p>
                    <div className="flex justify-between mt-2">
                        <button onClick={() => handleAccept(selectedNotification.id)} className="px-2 py-1 bg-green-500 text-white rounded">
                            Accepter
                        </button>
                        <button onClick={() => handleReject(selectedNotification.id)} className="px-2 py-1 bg-red-500 text-white rounded">
                            Refuser
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Notifications;
