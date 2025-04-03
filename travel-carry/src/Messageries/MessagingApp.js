import { useEffect, useState, useRef } from "react";
import { ref, remove, update } from "firebase/database";
import { db, listenForMessages, sendMessageToFirebase, getConversationsFromFirebase } from "../FirebaseConfig/firebase-config";

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

        const result = await response.text();
        console.log("Réponse de l'API :", result);

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
    const messagesEndRef = useRef(null);

    const token = localStorage.getItem("token");
    let decodeToken = null;
    let userEmail = null;
    let userId = null;

    if (!token) {
        console.error("Erreur : Aucun token trouvé dans le localStorage");
    } else {
        try {
            decodeToken = JSON.parse(atob(token.split('.')[1]));
            userEmail = decodeToken.sub;
            userId = localStorage.getItem("userId");
        } catch (error) {
            console.error("Erreur lors du décodage du token :", error);
        }
    }

    useEffect(() => {
        if (!userEmail) return;
        const fetchConversations = async () => {
            const conversationsData = await getConversationsFromFirebase(userEmail);
            setConversations(Array.isArray(conversationsData) ? conversationsData : []);
        };
        fetchConversations();
    }, [userEmail]);

    useEffect(() => {
        if (!selectedConversation) return;
        listenForMessages(selectedConversation.id, (newMessages) => {
            if (!Array.isArray(newMessages)) return;
            setMessages((prevMessages) => {
                const newMessagesFiltered = newMessages.filter((msg) => !prevMessages.some((existingMsg) => existingMsg.id === msg.id));
                return [...prevMessages, ...newMessagesFiltered];
            });
        });
    }, [selectedConversation]);

    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);

    const sendMessage = async () => {
        if (!newMessage.trim() || !selectedConversation) return;
        const newMsg = { content: newMessage, senderId: userId, timestamp: Date.now(), id: Date.now().toString() };
        setMessages((prevMessages) => [...prevMessages, newMsg]);
        await sendMessageToFirebase(selectedConversation.id, newMessage);
        setNewMessage("");
    };

    const deleteMessage = async (messageId) => {
        try {
            await remove(ref(db, `conversations/${selectedConversation.id}/chat/${messageId}`));
            setMessages((prevMessages) => prevMessages.filter(msg => msg.id !== messageId));
        } catch (error) {
            console.error("Erreur suppression message:", error);
        }
    };

    const deleteAllMessages = async () => {
        if (!selectedConversation) return;
        try {
            await remove(ref(db, `conversations/${selectedConversation.id}/chat`));
            setMessages([]);
        } catch (error) {
            console.error("Erreur suppression tous messages", error);
        }
    };

    const startEditing = (message) => {
        setEditingMessage(message.id);
        setEditedContent(message.content);
    };

    const saveEdit = async (messageId) => {
        if (!editedContent.trim()) return;
        try {
            await update(ref(db, `conversations/${selectedConversation.id}/chat/${messageId}`), {
                content: editedContent,
                timestamp: Date.now(),
            });
            setMessages((prevMessages) => prevMessages.map((msg) => msg.id === messageId ? { ...msg, content: editedContent } : msg));
            setEditingMessage(null);
        } catch (error) {
            console.error("Erreur modification message:", error);
        }
    };

    const cancelEdit = () => {
        setEditingMessage(null);
        setEditedContent("");
    };

    return (
        <div className="min-h-screen w-screen flex flex-col bg-white">
            <div className="bg-white shadow px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-center justify-between">
                <h2 className="text-xl font-bold mb-2 sm:mb-0">Messagerie</h2>
                <div className="flex space-x-2">
                    <button onClick={processAcceptedRequests} className="bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded">Synchroniser</button>
                    <button onClick={deleteAllMessages} className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded hidden">Supprimer tous</button>
                </div>
            </div>

            <div className="flex flex-1 flex-col sm:flex-row overflow-hidden">
                <aside className="w-full sm:w-1/4 bg-gradient-to-b from-emerald-200 to-emerald-50 border-r overflow-y-auto p-4">
                    <h3 className="font-semibold text-lg mb-4">Conversations</h3>
                    {conversations.length > 0 ? conversations.map((conv) => (
                        <div key={conv.id} className={`p-3 rounded-lg cursor-pointer mb-2 hover:bg-emerald-100 ${selectedConversation?.id === conv.id ? 'bg-emerald-200' : ''}`} onClick={() => setSelectedConversation(conv)}>
                            {conv.utilisateurA === userEmail ? conv.utilisateurB : conv.utilisateurA}
                        </div>
                    )) : <p className="text-sm text-gray-500">Aucune conversation trouvée.</p>}
                </aside>

                <main className="flex-1 flex flex-col bg-white">
                    {selectedConversation ? (
                        <>
                            <div className="flex-1 overflow-y-auto space-y-4 px-2 py-4" style={{ maxHeight: 'calc(100vh - 170px)' }}>
                                {messages.map((msg) => {
                                    const isUser = msg.senderId === userId;
                                    return (
                                        <div key={msg.id} className={`flex items-end ${isUser ? 'justify-end' : 'justify-start'}`}>
                                            {!isUser && (
                                                <img src="https://i.pravatar.cc/30?u=receiver" alt="avatar" className="rounded-full w-7 h-7 mr-2" />
                                            )}
                                            <div className={`max-w-xs px-4 py-2 rounded-2xl text-sm ${isUser ? 'bg-indigo-600 text-white' : 'bg-green-100 text-black'}`}>
                                                {editingMessage === msg.id ? (
                                                    <>
                                                        <input type="text" value={editedContent} onChange={(e) => setEditedContent(e.target.value)} className="w-full p-1 text-black border rounded mb-1" />
                                                        <div className="flex space-x-2 text-xs">
                                                            <button onClick={() => saveEdit(msg.id)} className="text-white hover:underline">Save</button>
                                                            <button onClick={cancelEdit} className="text-white hover:underline">Cancel</button>
                                                        </div>
                                                    </>
                                                ) : (
                                                    <>
                                                        <p>{msg.content}</p>
                                                        {isUser && (
                                                            <div className="flex space-x-2 mt-1 text-xs">
                                                                {editingMessage !== msg.id && <button onClick={() => startEditing(msg)} className="text-yellow-200 hover:underline">Edit</button>}
                                                                <button onClick={() => deleteMessage(msg.id)} className="text-red-200 hover:underline">Delete</button>
                                                            </div>
                                                        )}
                                                    </>
                                                )}
                                                <div className="text-[0.6rem] mt-1 text-right text-gray-400">{new Date(msg.timestamp).toLocaleString()}</div>
                                            </div>
                                            {isUser && (
                                                <img src="https://i.pravatar.cc/30?u=sender" alt="avatar" className="rounded-full w-7 h-7 ml-2" />
                                            )}
                                        </div>
                                    );
                                })}
                                <div ref={messagesEndRef} />
                            </div>

                            <div className="p-2 sm:p-4 bg-white border-t flex gap-2 w-full sticky bottom-0 z-10">
                                <input
                                    type="text"
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    placeholder="Écrire un message..."
                                    className="flex-1 p-2 border rounded"
                                />
                                <button onClick={sendMessage} className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">
                                    Envoyer
                                </button>
                            </div>
                        </>
                    ) : (
                        <div className="flex items-center justify-center h-full text-gray-500">Sélectionnez une conversation pour commencer à discuter.</div>
                    )}
                </main>
            </div>
        </div>
    );
}
