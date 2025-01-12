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
    const [hasSubmitted, setHasSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    // Sauvegarde des données dans localStorage
    useEffect(() => {
        localStorage.setItem("notations", JSON.stringify(notations));
    }, [notations]);

    useEffect(() => {
        localStorage.setItem("note", JSON.stringify(note));
    }, [note]);

    useEffect(() => {
        localStorage.setItem("comment", JSON.stringify(comment));
    }, [comment]);

    useEffect(() => {
        localStorage.setItem("datePublication", JSON.stringify(datePublication));
    }, [datePublication]);

    // Récupération des notations de l'utilisateur
    useEffect(() => {
        const fetchUserNotations = async () => {
            if (!isAuthenticated || !user) {
                console.warn("Utilisateur non authentifié");
                return;
            }

            try {
                const response = await axios.get(`http://localhost:8080/notations/user/${user.id}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                });
                setNotations(response.data);

                const userNotations = response.data.filter((notation) => notation.utilisateurId === user.id);
                setHasSubmitted(userNotations.length > 0);
            } catch (error) {
                console.error("Erreur lors de la récupération des notations :", error);
            }
        };

        fetchUserNotations();
    }, [isAuthenticated, user]);

    const validateForm = () => {
        if (hasSubmitted) {
            alert("Vous avez déjà soumis une notation.");
            return false;
        }

        if (note < 1 || note > 5) {
            alert("La note doit être comprise entre 1 et 5.");
            return false;
        }

        if (!user) {
            alert("Utilisateur non authentifié.");
            return false;
        }

        return true;
    };

    const resetForm = () => {
        setNote(0);
        setComment("");
        setDatePublication(new Date().toISOString().split("T")[0]);
        setConfirmationMessage("Merci pour votre avis !");
        setTimeout(() => setConfirmationMessage(""), 3000);
        localStorage.removeItem("note");
        localStorage.removeItem("comment");
        localStorage.removeItem("datePublication");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        const newNotation = {
            utilisateurId: user.id,
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
            console.error("Erreur lors de la soumission de la notation :", error);
            setConfirmationMessage("Une erreur s'est produite. Veuillez réessayer.");
            setTimeout(() => setConfirmationMessage(""), 3000);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ textAlign: "center", margin: "20px auto", maxWidth: "800px" }}>
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

            <div style={{ marginTop: "40px" }}>
                <h2 style={{ fontSize: "1.25rem", marginBottom: "20px" }}>Vos notations</h2>
                {notations.length === 0 ? (
                    <p style={{ color: "#555" }}>Vous n'avez soumis aucune notation pour le moment.</p>
                ) : (
                    <ul style={{ listStyle: "none", padding: 0 }}>
                        {notations.map((notation, index) => (
                            <li
                                key={index}
                                style={{
                                    marginBottom: "15px",
                                    padding: "15px",
                                    border: "1px solid #ddd",
                                    borderRadius: "8px",
                                }}
                            >
                                <p>
                                    <strong>Note :</strong> {notation.note} / 5
                                </p>
                                <p>
                                    <strong>Commentaire :</strong> {notation.commentaire}
                                </p>
                                <p style={{ color: "#888", fontSize: "0.9rem" }}>
                                    Publié le {new Date(notation.datePublication).toLocaleDateString("fr-FR")}
                                </p>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default NotationsPage;
