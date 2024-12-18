import React, { useState, useEffect } from "react";
import axios from "axios";

const NotationsPage = () => {
    const [notations, setNotations] = useState([]);
    const [punctuality, setPunctuality] = useState(0);
    const [objectState, setObjectState] = useState(0);
    const [communication, setCommunication] = useState(0);
    const [comment, setComment] = useState("");

    // Récupération des notations depuis une API
    useEffect(() => {
        const fetchNotations = async () => {
            try {
                const response = await axios.get("http://localhost:8080/api/notations", {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                });
                setNotations(response.data);
            } catch (error) {
                console.error("Erreur lors de la récupération des notations :", error);
            }
        };

        fetchNotations();
    }, []);

    // Calcul dynamique de la note globale
    const calculateGlobalNote = () => {
        return (
            ((Number(punctuality) + Number(objectState) + Number(communication)) / 3).toFixed(1)
        );
    };

    // Gestion de la soumission du formulaire
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validation des valeurs
        if (punctuality < 0 || punctuality > 5 || objectState < 0 || objectState > 5 || communication < 0 || communication > 5) {
            alert("Les notes doivent être comprises entre 0 et 5.");
            return;
        }

        // Création de la nouvelle notation
        const newNotation = {
            notePonctualite: punctuality,
            noteEtatObjet: objectState,
            noteCommunication: communication,
            commentaire: comment,
        };

        try {
            // Envoyer la notation au backend
            const response = await axios.post("http://localhost:8080/api/notations", newNotation, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });

            // Mettre à jour la liste des notations
            setNotations([...notations, response.data]);

            // Réinitialisation du formulaire
            setPunctuality(0);
            setObjectState(0);
            setCommunication(0);
            setComment("");
            alert("Évaluation soumise avec succès !");
        } catch (error) {
            console.error("Erreur lors de la soumission de la notation :", error);
        }
    };

    return (
        <div style={{ textAlign: "center", margin: "20px auto", maxWidth: "800px" }}>
            <h1 className="text-2xl font-bold mb-4">Évaluer le service TravelCarry</h1>

            {/* Formulaire intégré directement */}
            <div className="notation-form-container" style={{ margin: "20px auto", padding: "20px", border: "1px solid #ddd", borderRadius: "8px", backgroundColor: "#f9f9f9" }}>
                <h2>Évaluer le service</h2>
                <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                    <label>
                        Ponctualité :
                        <input
                            type="number"
                            value={punctuality}
                            min="0"
                            max="5"
                            onChange={(e) => setPunctuality(e.target.value)}
                            className="w-full border p-2 rounded"
                            required

                        />
                    </label>
                    <label>
                        État de l'objet :
                        <input
                            type="number"
                            value={objectState}
                            min="0"
                            max="5"
                            onChange={(e) => setObjectState(e.target.value)}
                            className="w-full border p-2 rounded"
                            required

                        />
                    </label>
                    <label>
                        Communication :
                        <input
                            type="number"
                            value={communication}
                            min="0"
                            max="5"
                            onChange={(e) => setCommunication(e.target.value)}
                            className="w-full border p-2 rounded"
                            required
                        />
                    </label>
                    <label>
                        Commentaire :
                        <textarea
                            type="text"
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            className="w-full border p-2 rounded"
                            placeholder="Ajoutez un commentaire..."
                            /*style={{ width: "100%", height: "80px", padding: "8px" }}*/
                        />
                    </label>
                    <div>
                        Note globale : <strong>{calculateGlobalNote()}</strong>
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 font-semibold"
                    >
                        Soumettre
                    </button>
                </form>
            </div>

            {/* Liste des notations existantes */}
            <div className="mt-8">
                <h2>Notations existantes</h2>
                {notations.length === 0 ? (
                    <p>Aucune notation pour le moment.</p>
                ) : (
                    <ul style={{ listStyle: "none", padding: 0 }}>
                        {notations.map((notation, index) => (
                            <li key={index} style={{ marginBottom: "15px", border: "1px solid #ddd", padding: "10px", borderRadius: "8px" }}>
                                <p><strong>Ponctualité :</strong> {notation.notePonctualite} / 5</p>
                                <p><strong>État de l’objet :</strong> {notation.noteEtatObjet} / 5</p>
                                <p><strong>Communication :</strong> {notation.noteCommunication} / 5</p>
                                <p><strong>Note globale :</strong> {notation.noteGlobale} / 5</p>
                                <p><strong>Commentaire :</strong> {notation.commentaire}</p>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default NotationsPage;

