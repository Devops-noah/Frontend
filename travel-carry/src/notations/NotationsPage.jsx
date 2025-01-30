import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useUserContext } from "../context/UserContext";

const NotationsPage = () => {
    const { user, isAuthenticated } = useUserContext();
    const [notations, setNotations] = useState(() => {
        const savedNotations = localStorage.getItem("notations");
        return savedNotations ? JSON.parse(savedNotations) : [];
    });
    const [note, setNote] = useState(() => {
        const savedNote = localStorage.getItem("note");
        return savedNote ? JSON.parse(savedNote) : 0;
    });
    const [comment, setComment] = useState(() => {
        const savedComment = localStorage.getItem("comment");
        return savedComment ? JSON.parse(savedComment) : "";
    });
    const [datePublication, setDatePublication] = useState(() => {
        const savedDate = localStorage.getItem("datePublication");
        return savedDate ? JSON.parse(savedDate) : new Date().toISOString().split("T")[0];
    });
    const [confirmationMessage, setConfirmationMessage] = useState("");
    const [warningMessage, setWarningMessage] = useState("");
    const [hasSubmitted, setHasSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const token = localStorage.getItem("token");

    const decodeToken = JSON.parse(atob(token.split('.')[1]));
    const userId = decodeToken.userId;
    console.log("user id value: ", userId)


    // Récupération des notations de l'utilisateur
    useEffect(() => {
        const fetchUserNotations = async () => {
            const token = localStorage.getItem("token");

            if (!token) {
                console.error("Aucun token trouvé, l'utilisateur doit se reconnecter.");
                setWarningMessage("Votre session a expiré. Veuillez vous reconnecter.");
                return;
            }

            console.log("Tentative de récupération des notations pour l'utilisateur:", userId);
            console.log("Token:", token);  // Debug: Check token value

            try {
                const response = await axios.get(`http://localhost:8080/api/notations/user/${userId}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                console.log("Réponse des notations :", response.data);
                setNotations(response.data);

                const userNotations = response.data.filter((notation) => notation.utilisateurId === user.id);
                setHasSubmitted(userNotations.length > 0);
            } catch (error) {
                if (error.response) {
                    console.error("Erreur lors de la récupération des notations :", error.response);
                    if (error.response.status === 403) {
                        // Add a more descriptive message here
                        console.error("Token invalide ou expiré. Veuillez vous reconnecter.");
                        setWarningMessage("Votre session a expiré. Veuillez vous reconnecter.");
                    } else {
                        console.error("Erreur inconnue lors de la récupération des notations.");
                        setWarningMessage("Une erreur est survenue, veuillez réessayer.");
                    }
                } else {
                    console.error("Erreur de communication avec le serveur :", error);
                    setWarningMessage("Une erreur est survenue, veuillez réessayer.");
                }
            }
        };

        if (isAuthenticated) {
            fetchUserNotations();
        }
    }, [isAuthenticated, userId, user]);



    const validateForm = () => {
        if (hasSubmitted) {
            setWarningMessage("Vous avez déjà soumis une notation."); // Mise à jour du warning
            setTimeout(() => setWarningMessage(""), 5000); // Réinitialisation automatique
            return false;
        }

        return true;
    };

    const resetForm = () => {
        setNote(0);
        setComment("");
        setDatePublication(new Date().toISOString().split("T")[0]);
        setConfirmationMessage("Merci pour votre avis !");
        setTimeout(() => setConfirmationMessage(""), 5000);
        localStorage.removeItem("note");
        localStorage.removeItem("comment");
        localStorage.removeItem("datePublication");
    };

    const handleSubmit = async (e) => {

        e.preventDefault();
        if (!validateForm()) return;

        const newNotation = {
            utilisateurId: userId,
            note,
            commentaire: comment,
            datePublication: datePublication,
        };

        setLoading(true);

        try {
            const response = await axios.post("http://localhost:8080/api/notations/create", newNotation, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });

            // Ajoute la nouvelle notation localement
            setNotations((prevNotations) => [...prevNotations, response.data]);
            resetForm();
            setHasSubmitted(true);
        } catch (error) {
            if (error.response && error.response.status === 400) {
                setWarningMessage(error.response.data); // Show "Vous avez déjà soumis une notation."
            } else {
                setConfirmationMessage("Une erreur s'est produite. Veuillez réessayer.");
            }

            setTimeout(() => setConfirmationMessage(""), 3000);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ textAlign: "center", margin: "20px auto", maxWidth: "800px" , marginBottom : "57px"}}>
            <h1 style={{ fontSize: "1.5rem", fontWeight: "bold", marginBottom: "20px" }}>Évaluer le site</h1>

            <div
                style={{
                    margin: "20px auto",
                    padding: "20px",
                    border: "1px solid #ddd",
                    borderRadius: "8px",
                    backgroundColor: "#f9f9f9",
                }}
            >
                <h2 style={{ marginBottom: "15px", fontSize: "1.25rem" }}>Évaluer le site</h2>
                <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                    <label>
                        Note :
                        <input
                            type="number"
                            value={note}
                            min="1"
                            max="5"
                            onChange={(e) => setNote(Number(e.target.value))}
                            style={{
                                width: "100%",
                                padding: "10px",
                                border: "1px solid #ccc",
                                borderRadius: "5px",
                            }}
                            required
                        />
                    </label>
                    <label>
                        Commentaire :
                        <textarea
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            style={{
                                width: "100%",
                                padding: "10px",
                                border: "1px solid #ccc",
                                borderRadius: "5px",
                            }}
                            placeholder="Ajoutez un commentaire..."
                        />
                    </label>
                    <label>
                        Date de publication :
                        <input
                            type="date"
                            value={datePublication}
                            onChange={(e) => setDatePublication(e.target.value)}
                            style={{
                                width: "100%",
                                padding: "10px",
                                border: "1px solid #ccc",
                                borderRadius: "5px",
                            }}
                            required
                        />
                    </label>
                    <button
                        type="submit"
                        style={{
                            width: "100%",
                            backgroundColor: "#007BFF",
                            color: "white",
                            padding: "10px",
                            border: "none",
                            borderRadius: "5px",
                            cursor: "pointer",
                        }}
                        disabled={loading}
                    >
                        {loading ? "Chargement..." : "Soumettre"}
                    </button>
                </form>

                {warningMessage && (
                    <div
                        style={{
                            marginTop: "15px",
                            padding: "10px",
                            backgroundColor: "#f8d7da",
                            color: "#721c24",
                            border: "1px solid #f5c6cb",
                            borderRadius: "5px",
                        }}
                    >
                        {warningMessage}
                    </div>
                )}

                {confirmationMessage && (
                    <div
                        style={{
                            marginTop: "15px",
                            padding: "10px",
                            backgroundColor: "#d4edda",
                            color: "#155724",
                            border: "1px solid #c3e6cb",
                            borderRadius: "5px",
                        }}
                    >
                        {confirmationMessage}
                    </div>
                )}
                
            </div>
        </div>
    );
};

export default NotationsPage;