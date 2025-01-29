import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

export const NotationsContext = createContext();

export const NotationsProvider = ({ children }) => {
    const [notations, setNotations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const token = localStorage.getItem("token");

    useEffect(() => {
        const fetchNotations = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await axios.get("http://localhost:8080/api/admin/notations/get-notations", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (!Array.isArray(response.data)) {
                    throw new Error("Données reçues invalides");
                }
                const sortedNotations = response.data.sort((a, b) => {
                    const dateA = new Date(a.datePublication);
                    const dateB = new Date(b.datePublication);
                    return dateB - dateA; // Tri par date décroissante
                });
                setNotations(sortedNotations);
            } catch (err) {
                setError(err.message || "Erreur inconnue");
                console.error("Erreur lors du fetch des notations :", err);
            } finally {
                setLoading(false);
            }
        };

        fetchNotations();
    }, []);

    const updateNotations = (newNotations) => {
        setNotations(newNotations);
    };

    const addNotation = (newNotation) => {
        setNotations((prevNotations) => [...prevNotations, newNotation]);
    };

    return (
        <NotationsContext.Provider value={{ notations, updateNotations, addNotation, loading, error }}>
            {children}
        </NotationsContext.Provider>
    );
};
