import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getMessaging, onMessage } from "firebase/messaging";
import { getDatabase, ref, onChildAdded, push, set, get } from "firebase/database";

const token = localStorage.getItem("token");

let decodeToken = null;
let userEmail = null;

if (!token) {
    console.error("Aucun token trouvé dans localStorage !");
} else {
    try{
        decodeToken = JSON.parse(atob(token.split('.')[1]));
        userEmail = decodeToken.sub; // L'email de l'utilisateur connecté
    } catch (error) {
        console.error("Erreur lors du décodage du token JWT :", error);
    }
}

const userId = localStorage.getItem("userId");

if (!userId) {
    console.error("⚠ Aucun ID utilisateur trouvé dans localStorage !");
}

const firebaseConfig = {
    apiKey: "AIzaSyB5BR5NHL727FJ_gQKvzqX-SSU_yw-zlDU",
    authDomain: "travelc-messaging.firebaseapp.com",
    databaseURL: "https://travelc-messaging-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "travelc-messaging",
    storageBucket: "travelc-messaging.firebasestorage.app",
    messagingSenderId: "201695941738",
    appId: "1:201695941738:web:240acb93fe87f32ab3e613",
    measurementId: "G-J14FT7Z7LR"
};
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const messaging = getMessaging(app);
const db = getDatabase(app);

//  Fonction pour écouter les messages et éviter les duplications par message ID unique


export const listenForMessages = (conversationId, setMessages) => {
    if (!conversationId) {
        console.error("Erreur : conversationId est invalide !");
        return;
    }

    const chatRef = ref(db, `conversations/${conversationId}/chat`);

    // Utiliser once pour récupérer les messages une seule fois lors du démarrage
    get(chatRef).then((snapshot) => {
        if (snapshot.exists()) {
            const messages = [];
            snapshot.forEach((childSnapshot) => {
                messages.push({ id: childSnapshot.key, ...childSnapshot.val() });
            });

            // Toujours renvoyer un tableau à setMessages
            setMessages(messages);
        }
    }).catch((error) => {
        console.error("Erreur lors de la récupération des messages : ", error);
    });

    // Écoute des nouveaux messages
    onChildAdded(chatRef, (snapshot) => {
        const message = snapshot.val();
        const newMessage = { id: snapshot.key, ...message };

        // Toujours envoyer un tableau à setMessages
        setMessages((prevMessages) => {
            // Vérification si le message existe déjà
            const messageExists = prevMessages.some((msg) => msg.id === newMessage.id);
            if (messageExists) return prevMessages; // Si le message existe, ne pas le rajouter

            return [...prevMessages, newMessage]; // Sinon, ajouter le nouveau message
        });
    });
};

// Fonction pour envoyer un message
export const sendMessageToFirebase = async (conversationId, messageContent) => {
    if (!userId) {
        console.error("Erreur : Aucun utilisateur connecté !");
        return;
    }
    if (!conversationId || !messageContent) {
        console.error("Erreur : conversationId ou messageContent est invalide !");
        return;
    }

    try {
        console.log(`Envoi du message : "${messageContent}" à la conversation ${conversationId}`);


        const messagesRef = ref(db, `conversations/${conversationId}/chat`);

        const newMessageRef = push(messagesRef);

        // Vérifier si le message avec cet ID existe déjà
        const snapshot = await get(messagesRef);
        const existingMessages = snapshot.exists() ? snapshot.val() : {};

        if (Object.keys(existingMessages).some((msgKey) => msgKey === newMessageRef.key)) {
            console.warn("Message avec cet ID déjà existant !");
            return;
        }

        await set(newMessageRef, {
            content: messageContent,
            senderId: userId,
            timestamp: Date.now()
        });

        console.log("Message envoyé avec succès !");
    } catch (error) {
        console.error(" Erreur lors de l'envoi à Firebase :", error);
    }
};

// Gestion des messages en premier plan
onMessage(messaging, (payload) => {
    console.log("Message reçu en premier plan :", payload);
});



//code modifier par Hawa ici regarde oumar
// Fonction pour récupérer les conversations d'un utilisateur

export const getConversationsFromFirebase = async (userEmail) => {
    if (!userEmail) {
        console.error(" Erreur : Aucun ID utilisateur fourni !");
        return [];
    }

    try {
        const conversationsRef = ref(db, "conversations");
        const snapshot = await get(conversationsRef);

        if (snapshot.exists()) {
            const conversations = [];
            const conversationsData = snapshot.val();

            Object.keys(conversationsData).forEach((key) => {
                const conversationData = conversationsData[key];
                if (
                    conversationData.utilisateurA === userEmail ||
                    conversationData.utilisateurB === userEmail
                ) {
                    conversations.push({
                        id: key,
                        ...conversationData
                    });
                }
            });

            return conversations;

        } else {
            console.log("⚠ Aucune conversation trouvée pour cet utilisateur.");
            return [];
        }
    } catch (error) {
        console.error("Erreur lors de la récupération des conversations :", error);
        return [];
    }
};

export { app, analytics, messaging, db };