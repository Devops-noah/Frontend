import { useEffect, useState } from "react";
import { ref, remove, update } from "firebase/database";

import { db, listenForMessages, sendMessageToFirebase, getConversationsFromFirebase } from "../FirebaseConfig/firebase-config";
import { getMessaging, onMessage } from "firebase/messaging";

async function processAcceptedRequests() {
    try {
        const response = await fetch("http://localhost:8080/api/conversations/process-accepted-requests", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("token")}`,
                "Content-Type": "application/json"
            },
        });

        if (!response.ok) {
            throw new Error(`Erreur HTTP : ${response.status}`);
        }

        // Essayons de lire la réponse comme texte
        const result = await response.text(); // Utilisation de text() au lieu de json()

        // Si la réponse est en texte, affiche-la
        console.log("Réponse de l'API :", result);

        // Si tu veux vraiment parser du JSON à partir de la réponse, tu peux vérifier
        try {
            const jsonResponse = JSON.parse(result);
            console.log("Réponse JSON :", jsonResponse);
        } catch (jsonError) {
            console.log("La réponse n'est pas du JSON.");
        }

    } catch (error) {
        console.error("Erreur lors de l'appel API:", error);
    }
}


export default function MessagingApp() {
    const [conversations, setConversations] = useState([]);
    const [selectedConversation, setSelectedConversation] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [editingMessage, setEditingMessage] = useState(null);
    const [editedContent, setEditedContent] = useState("");
    //const receivedMessageIds = new Set(); // Pour stocker les IDs des messages déjà traités

    const token = localStorage.getItem("token");
    let decodeToken = null;
    let userEmail = null;
    let userId = null;

    if (!token) {
        console.error("Erreur : Aucun token trouvé dans le localStorage");
    } else {
        try {
            decodeToken = JSON.parse(atob(token.split('.')[1]));
            userEmail = decodeToken.sub; // L'email de l'utilisateur connecté
            userId = localStorage.getItem("userId");
        } catch (error) {
            console.error("Erreur lors du décodage du token :", error);
        }
    }

    // Récupération des conversations lorsque l'utilisateur est connecté
    useEffect(() => {
        if (!userEmail) {
            console.error("Erreur : Aucun ID utilisateur trouvé");
            return;
        }

        const fetchConversations = async () => {
            console.log("Tentative de récupération des conversations pour l'utilisateur :", userEmail);

            const conversationsData = await getConversationsFromFirebase(userEmail);
            console.log("Conversations récupérées depuis Firebase :", conversationsData);

            if (Array.isArray(conversationsData) && conversationsData.length > 0) {
                console.log("ID des conversations récupérées :", conversationsData.map(conv => conv.id));
                setConversations(conversationsData);
            } else {
                console.log("Aucune conversation trouvée ou format incorrect");
                setConversations([]);
            }
        };

        fetchConversations();
    }, [userEmail]);

    useEffect(() => {
        if (!selectedConversation) return;

        // Ajouter une écoute des nouveaux messages pour la conversation sélectionnée
        listenForMessages(selectedConversation.id, (newMessages) => {
            // Vérifier explicitement que newMessages est un tableau
            if (!Array.isArray(newMessages)) {
                console.error("newMessages n'est pas un tableau :", newMessages);
                return;
            }

            // Utilisation de setMessages avec un tableau filtré pour éviter les doublons
            setMessages((prevMessages) => {
                // Vérifier que prevMessages est bien un tableau
                if (!Array.isArray(prevMessages)) {
                    prevMessages = []; // En cas de problème, on initialise prevMessages à un tableau vide
                }

                // Filtrer les nouveaux messages pour ne pas ajouter ceux qui existent déjà
                const newMessagesFiltered = newMessages.filter((msg) => !prevMessages.some((existingMsg) => existingMsg.id === msg.id));

                // Ajouter les nouveaux messages à l'état
                return [...prevMessages, ...newMessagesFiltered];
            });
        });
    }, [selectedConversation]);

    useEffect(() => {
        console.log("Messages dans l'état :", messages);
    }, [messages]);

    const sendMessage = async () => {
        if (!newMessage.trim() || !selectedConversation) return;

        const newMsg = {
            content: newMessage,
            senderId: userId,
            timestamp: Date.now(),
            id: Date.now().toString(),
        };

        setMessages((prevMessages) => [...prevMessages, newMsg]);
        await sendMessageToFirebase(selectedConversation.id, newMessage);
        setNewMessage("");
    };

    const deleteMessage = async (messageId) => {
        console.log(`Tentative de suppression du message avec ID : ${messageId}`);
        try {
            await remove(ref(db, `conversations/${selectedConversation.id}/chat/${messageId}`));
            console.log(`Message avec ID : ${messageId} supprimé avec succès`);

            // Mise à jour de l'état local après la suppression
            setMessages((prevMessages) => prevMessages.filter(msg => msg.id !== messageId));
        } catch (error) {
            console.error(`Erreur lors de la suppression du message avec ID : ${messageId}`, error);
        }
    };

    // Nouvelle fonction pour supprimer tous les messages de la conversation
    const deleteAllMessages = async () => {
        if (!selectedConversation) return;

        try {
            console.log("Tentative de suppression de tous les messages de la conversation");
            await remove(ref(db, `conversations/${selectedConversation.id}/chat`)); // Supprimer tous les messages
            console.log("Tous les messages ont été supprimés avec succès");

            // Mise à jour de l'état local après la suppression
            setMessages([]);
        } catch (error) {
            console.error("Erreur lors de la suppression de tous les messages", error);
        }
    };

    // Démarrage de l'édition d'un message
    const startEditing = (message) => {
        console.log(`Début de l'édition du message avec ID : ${message.id}`);
        setEditingMessage(message.id);
        setEditedContent(message.content); // Assurez-vous de définir le contenu du message à éditer
    };

    // Sauvegarde de l'édition d'un message
    const saveEdit = async (messageId) => {
        console.log(`Tentative de sauvegarde de l'édition du message avec ID : ${messageId}`);
        if (!editedContent.trim()) {
            console.log("Le contenu de l'édition est vide, annulation de la sauvegarde.");
            return; // Vérifier si le contenu n'est pas vide
        }
        try {
            await update(ref(db, `conversations/${selectedConversation.id}/chat/${messageId}`), {
                content: editedContent,
                timestamp: Date.now(),
            });
            console.log(`Message avec ID : ${messageId} modifié avec succès`);

            // Mise à jour de l'état local après l'édition
            setMessages((prevMessages) =>
                prevMessages.map((msg) =>
                    msg.id === messageId ? { ...msg, content: editedContent } : msg
                )
            );
            setEditingMessage(null);
        } catch (error) {
            console.error(`Erreur lors de la modification du message avec ID : ${messageId}`, error);
        }
    };

    // Annulation de l'édition
    const cancelEdit = () => {
        console.log("Annulation de l'édition en cours");
        setEditingMessage(null);
        setEditedContent("");
    };

    return (
        <div className="p-4 w-full max-w-5xl mx-auto bg-white shadow-md rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Messagerie</h2>
            <button
                onClick={processAcceptedRequests}
                className="p-2 bg-green-500 text-white rounded mb-4"
            >
                Synchroniser les conversations
            </button>
            <button
                onClick={deleteAllMessages}
                className="p-2 bg-red-500 text-white rounded mb-4"
            >
                Supprimer tous les messages
            </button>
            <div className="flex">
                <div className="w-1/4 border-r pr-2">
                    <h3 className="font-semibold mb-2">Conversations</h3>
                    {conversations.length > 0 ? (
                        conversations.map((conv) => (
                            <div
                                key={conv.id}
                                className={`p-2 cursor-pointer rounded ${selectedConversation?.id === conv.id ? 'bg-gray-200' : ''}`}
                                onClick={() => setSelectedConversation(conv)}
                            >
                                {conv.utilisateurA === userEmail ? conv.utilisateurB : conv.utilisateurA}

                            </div>
                        ))
                    ) : (
                        <p>Aucune conversation trouvée.</p>
                    )}
                </div>

                <div className="w-3/4 pl-4">
                    {selectedConversation ? (
                        <>
                            <h3 className="font-semibold mb-2">Chat</h3>
                            <div className="space-y-2">
                                {messages.map((msg) => (
                                    <div
                                        key={msg.id}
                                        className={`p-2 rounded-lg max-w-xs ${msg.senderId === userId ? 'bg-blue-500 text-white self-end' : 'bg-gray-200 text-black self-start'}`}
                                        style={{
                                            alignSelf: msg.senderId === userId ? 'flex-end' : 'flex-start',
                                            maxWidth: '80%' // Limite de la largeur des messages
                                        }}
                                    >
                                        {editingMessage === msg.id ? (
                                            <>
                                                <input
                                                    type="text"
                                                    value={editedContent}
                                                    onChange={(e) => setEditedContent(e.target.value)} // Mettre à jour l'état de l'édition
                                                    className="p-1 border rounded"
                                                />
                                                <div className="flex space-x-2 mt-1">
                                                    <button
                                                        onClick={() => saveEdit(msg.id)}
                                                        className="text-white text-sm"
                                                    >
                                                        Sauvegarder
                                                    </button>
                                                    <button
                                                        onClick={cancelEdit}
                                                        className="text-gray-500 text-sm"
                                                    >
                                                        Annuler
                                                    </button>
                                                </div>
                                            </>
                                        ) : (
                                            <p>{msg.content}</p>
                                        )}
                                        {msg.senderId === userId && (
                                            <div className="flex space-x-2 mt-1">
                                                {editingMessage !== msg.id && (
                                                    <button
                                                        onClick={() => startEditing(msg)}
                                                        className="text-yellow-200 text-sm"
                                                    >
                                                        Modifier
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => deleteMessage(msg.id)}
                                                    className="text-red-300 text-sm"
                                                >
                                                    Supprimer
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                            <div className="mt-4 flex">
                                <input
                                    type="text"
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    className="p-2 border rounded flex-grow"
                                    placeholder="Écrire un message..."
                                />
                                <button
                                    onClick={sendMessage}
                                    className="ml-2 p-2 bg-blue-500 text-white rounded"
                                >
                                    Envoyer
                                </button>
                            </div>
                        </>
                    ) : (
                        <p>Sélectionnez une conversation pour commencer à discuter.</p>
                    )}
                </div>
            </div>
        </div>
    );
}
