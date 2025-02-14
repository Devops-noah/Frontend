import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { GoPackage } from "react-icons/go";
import useWebSocket from "react-use-websocket";
import { ReadyState } from "react-use-websocket";
import { RiNotification2Fill } from "react-icons/ri";

const Notifications = () => {
    const [notifications, setNotifications] = useState([]);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [selectedNotification, setSelectedNotification] = useState(null);
    const [error, setError] = useState(null);
    const [message, setMessage] = useState(""); // Confirmation message state
    const [isMessageVisible, setIsMessageVisible] = useState(false); // Control message visibility
    const [expediteurNames, setExpediteurNames] = useState({});

    const token = localStorage.getItem("token");
    const decodeToken = JSON.parse(atob(token.split('.')[1]));
    const userId = localStorage.getItem("userId");

    // WebSocket setup
    const { lastMessage, readyState } = useWebSocket(
        `ws://localhost:8080/ws?userId=${userId}`,
        {
            shouldReconnect: () => true,
            reconnectAttempts: 10,
            reconnectInterval: 3000,
        }
    );

    // Handle WebSocket messages
    useEffect(() => {
        if (lastMessage !== null) {
            try {
                const newNotification = JSON.parse(lastMessage.data);

                setNotifications(prev => {
                    // Remove notification if it's read
                    if (newNotification.read) {
                        return prev.filter(n => n.id !== newNotification.id);
                    }

                    // Add notification if it's new
                    if (!prev.some(n => n.id === newNotification.id)) {
                        return [newNotification, ...prev];
                    }
                    return prev;
                });

                const expediteurId = newNotification?.demande?.expediteurId;
                if (expediteurId && !expediteurNames[expediteurId]) {
                    fetchExpediteurName(expediteurId);
                }
            } catch (err) {
                console.error("Error parsing WebSocket message:", err);
            }
        }
    }, [lastMessage]);

    // Initial fetch of notifications
    useEffect(() => {
        fetchNotifications();
    }, []);

    const fetchNotifications = async () => {
        try {
            const response = await axios.get(
                "http://localhost:8080/api/notifications/unread",
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );
            setNotifications(response.data);
            fetchExpediteurNames(response.data);
        } catch (error) {
            setError("Impossible de charger les notifications.");
        }
    };

    const fetchExpediteurNames = async (notifications) => {
        const expediteurIds = notifications
            .map((notification) => notification?.demande?.expediteurId)
            .filter(Boolean);

        const namesMap = {};
        const fetchPromises = expediteurIds.map(async (id) => {
            if (!expediteurNames[id]) {
                try {
                    const res = await axios.get(
                        `http://localhost:8080/api/utilisateurs/expediteur/${id}`,
                        {
                            headers: {
                                Authorization: `Bearer ${localStorage.getItem("token")}`,
                            },
                        }
                    );
                    namesMap[id] = res.data;
                } catch (error) {
                    console.error(`Error fetching expediteur name for ID: ${id}`, error);
                }
            }
        });

        await Promise.all(fetchPromises);
        setExpediteurNames((prev) => ({ ...prev, ...namesMap }));
    };

    const fetchExpediteurName = async (expediteurId) => {
        try {
            const res = await axios.get(
                `http://localhost:8080/api/utilisateurs/expediteur/${expediteurId}`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );
            setExpediteurNames((prev) => ({
                ...prev,
                [expediteurId]: res.data,
            }));
        } catch (error) {
            console.error(`Error fetching expediteur name for ID: ${expediteurId}`, error);
        }
    };

    const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

    const handleNotificationClick = (notification) => {
        setSelectedNotification(notification); // Show the details of the notification
        toggleDropdown(); // Close the dropdown
    };

    console.log("notification result: " + JSON.stringify(notifications));

    const markNotificationAsRead = async (notificationId) => {
        try {
            await axios.put(`http://localhost:8080/api/notifications/read/${notificationId}`, {}, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });
        } catch (error) {
            console.error("Error marking notification as read", error);
        }
    };

    const handleAccept = (demandeId, notificationId) => {
        if (!demandeId) {
            console.error("demandeId is undefined! Cannot proceed.");
            return;
        }

        axios
            .put(
                `http://localhost:8080/api/demandes/${demandeId}/status`,
                { status: "ACCEPTE" },
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            )
            .then(() => {
                setMessage("Demande acceptée"); // Display success message
                setIsMessageVisible(true); // Show the confirmation message immediately

                // Mark notification as read in the database
                markNotificationAsRead(notificationId);

                // Close the modal and hide the message after a short delay
                setTimeout(() => {
                    setSelectedNotification(null); // Close the modal
                    setIsMessageVisible(false); // Hide the message
                }, 3000); // 3-second delay

                // Remove notification dynamically
                setNotifications(prev => prev.filter(n => n.id !== notificationId));
            })
            .catch((error) => {
                console.error("Erreur lors de l'acceptation", error.response?.data || error.message);
            });
    };

    const handleReject = (demandeId, notificationId) => {
        axios
            .put(
                `http://localhost:8080/api/demandes/${demandeId}/status`,
                { status: "REFUSE" },
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            )
            .then(() => {
                setMessage("Demande refusée"); // Display failure message
                setIsMessageVisible(true); // Show the confirmation message immediately

                // Mark notification as read in the database
                markNotificationAsRead(notificationId);

                // Close the modal and hide the message after a short delay
                setTimeout(() => {
                    setSelectedNotification(null); // Close the modal
                    setIsMessageVisible(false); // Hide the message
                }, 3000); // 3-second delay

                // Remove notification dynamically
                setNotifications(prev => prev.filter(n => n.id !== notificationId));
            })
            .catch((error) => console.error("Erreur lors du rejet"));
    };

    const modalRef = useRef(null);
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (modalRef.current && !modalRef.current.contains(event.target)) {
                setSelectedNotification(null); // Close modal if click is outside
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);


    return (
        <div className="relative inline-block">
            {/* Notification Icon */}
            <div className="relative">
                <RiNotification2Fill
                    className="text-white text-2xl cursor-pointer"
                    onClick={toggleDropdown}
                />
                <div
                    className={`absolute -top-2 -right-2 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full 
                ${readyState === ReadyState.OPEN ? 'bg-pink-600' : 'bg-red-600'}`}
                    title={readyState === ReadyState.OPEN ? 'Connected' : 'Disconnected'}
                >
                    {notifications.length > 0 ? notifications.length : ""}
                </div>
            </div>

            {/* Notifications Dropdown */}
            {isDropdownOpen && (
                <div
                    className="absolute left-1/2 transform -translate-x-1/2 mt-2 w-60 bg-white shadow-lg rounded-lg max-h-96 overflow-auto z-50
        sm:w-72 md:w-80 lg:w-96
        sm:max-h-80 md:max-h-96 lg:max-h-[28rem]
        sm:text-sm md:text-base"
                    onClick={(e) => e.stopPropagation()}
                >
                    {error && <p className="text-red-500 text-center py-1 px-2 text-sm">{error}</p>}
                    {notifications.length === 0 ? (
                        <p className="text-center text-gray-400 py-2 text-sm">Aucune notification</p>
                    ) : (
                        <div className="space-y-1">
                            {notifications.map((notification) => {
                                const expediteurId = notification?.demande?.expediteurId;
                                const expediteurNom = expediteurNames[expediteurId] || "Expéditeur inconnu";

                                return (
                                    <div
                                        key={notification.id}
                                        className="flex items-center justify-between p-2 hover:bg-amber-400 rounded cursor-pointer"
                                        onClick={() => handleNotificationClick(notification)}
                                    >
                                        <div className="flex items-center space-x-1">
                                            <GoPackage className="text-blue-500"/>
                                            <p className="font-medium text-sm text-gray-800">
                                                {`Colis proposé par ${expediteurNom}`}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            )}

            {/* Modal for Accepting/Rejecting */}
            {selectedNotification && (
                <div className="modal fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
                    <div ref={modalRef}
                         className="bg-white p-6 shadow-lg rounded-lg w-full max-w-lg relative transform transition-all duration-300">
                        {/* Confirmation Message Inside Modal */}
                        {isMessageVisible && (
                            <span
                                className={`absolute top-2 right-4 text-center font-medium w-auto max-w-xs 
        ${message === 'Demande acceptée' ? 'text-green-500' : message === 'Demande refusée' ? 'text-red-500' : 'text-violet-950'} p-2 shadow-lg shadow-sky-300 opacity-60`}>
                                {message}
                            </span>
                        )}

                        <h3 className="text-2xl font-semibold text-gray-800 mb-4">Détails de la demande</h3>
                        {selectedNotification?.demande?.informationColis ? (
                            <>
                                <p className="text-gray-800">
                                    <strong>Nature:</strong> {selectedNotification.demande.informationColis.nature}</p>
                                <p className="text-gray-800">
                                    <strong>Dimensions:</strong> {selectedNotification.demande.informationColis.dimensions}
                                </p>
                                <p className="text-gray-800">
                                    <strong>Poids:</strong> {selectedNotification.demande.informationColis.poids} kg</p>
                                <p className="text-gray-800">
                                    <strong>Catégorie:</strong> {selectedNotification.demande.informationColis.categorie}
                                </p>
                                <p className="text-gray-800"><strong>Date prise en
                                    charge:</strong> {selectedNotification.demande.informationColis.datePriseEnCharge}
                                </p>
                                <p className="text-gray-800"><strong>Plage
                                    horaire:</strong> {selectedNotification.demande.informationColis.plageHoraire}</p>
                            </>
                        ) : (
                            <p className="text-red-500 text-center">Détails du colis indisponibles</p>
                        )}

                        <div className="flex justify-center space-x-20 mt-6">
                            <button
                                className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700"
                                onClick={() => handleAccept(selectedNotification.demande.id, selectedNotification.id)}
                            >
                                Accepter
                            </button>
                            <button
                                className="bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700"
                                onClick={() => handleReject(selectedNotification.demande.id, selectedNotification.id)}
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
