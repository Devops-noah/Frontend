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
        axios.get("http://localhost:8080/api/notifications/unread", {
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
        console.log("notification collis: ", notification)
        setSelectedNotification(notification);  // Afficher les détails de la demande
        toggleDropdown();  // Fermer le dropdown
    };

    const handleAccept = (demandeId) => {
        axios.put(`http://localhost:8080/api/demandes/${demandeId}/status`, { status: "ACCEPTE" },
            {headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,}
        })
            .then(() => alert("Demande acceptée"))
            .catch((error) => console.error("Erreur lors de l'acceptation"));
    };

    const handleReject = (demandeId) => {
        axios.put(`http://localhost:8080/api/demandes/${demandeId}/status`, { status: "REFUSE" },
            {headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,}})
            .then(() => alert("Demande refusée"))
            .catch((error) => console.error("Erreur lors du rejet"));
        
    };

    console.log("selected notificaion: " + JSON.stringify(notifications))
    return (
        <div className="relative">
            <button onClick={toggleDropdown} className="text-white font-bold px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded">
                Notifications [{notifications.length}]
            </button>

            {isDropdownOpen && (
                <div
                    className="absolute right-0 mt-2 bg-cyan-950 w-80 shadow-md rounded p-4 z-50"
                    onClick={(e) => e.stopPropagation()} // Prevent dropdown from closing when clicking inside
                >
                    {error && <p className="text-red-500">{error}</p>}
                    {notifications.length === 0 ? (
                        <p className="text-gray-500">Aucune notification</p>
                    ) : (
                        notifications.map((notification) => {
                            // Safely access nested properties
                            const informationColis = notification?.demande?.informationColis;

                            return (
                                <div
                                    key={notification.id}
                                    className="border-b py-2 cursor-pointer"
                                    onClick={() => handleNotificationClick(notification)}
                                >
                                    <p className="font-semibold">{notification.message}</p>
                                    {informationColis ? (
                                        <>
                                            <p>Dimensions: {informationColis.dimensions}</p>
                                            <p>Poids: {informationColis.poids}g</p>
                                            <p>Nature: {informationColis.nature}</p>
                                            <p>Catégorie: {informationColis.categorie}</p>
                                            <p>Date prise en charge: {informationColis.datePriseEnCharge}</p>
                                            <p>Plage horaire: {informationColis.plageHoraire}</p>
                                        </>
                                    ) : (
                                        <p className="text-gray-500">Informations colis indisponibles</p>
                                    )}
                                </div>
                            );
                        })
                    )}
                </div>
            )}


            {selectedNotification && (
                <div className="modal">
                    <h3>Détails de la demande</h3>
                    {selectedNotification?.demande?.informationColis ? (
                        <>
                            <p>Nature: {selectedNotification.demande.informationColis.nature}</p>
                            <p>Dimensions: {selectedNotification.demande.informationColis.dimensions}</p>
                            <p>Poids: {selectedNotification.demande.informationColis.poids} kg</p>
                        </>
                    ) : (
                        <p className="text-gray-500">Informations colis indisponibles</p>
                    )}
                    <div className="flex justify-between mt-2">
                        <button
                            onClick={() => handleAccept(selectedNotification.id)}
                            className="px-2 py-1 bg-green-500 text-white rounded"
                        >
                            Accepter
                        </button>
                        <button
                            onClick={() => handleReject(selectedNotification.id)}
                            className="px-2 py-1 bg-red-500 text-white rounded"
                        >
                            Refuser
                        </button>
                    </div>
                </div>
            )}

        </div>
    );
};

export default Notifications;
