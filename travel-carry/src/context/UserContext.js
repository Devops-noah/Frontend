import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null); // Contient les informations utilisateur
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const fetchUser = async () => {
            const token = localStorage.getItem("token");
            if (token) {
                try {
                    const response = await axios.get("http://localhost:8080/api/auth/me", {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });
                    console.log("auth me: " + JSON.stringify(response))
                    setUser(response.data); // Récupérer l'utilisateur depuis la réponse
                    setIsAuthenticated(true);
                } catch (error) {
                    console.error("Erreur lors de la récupération des infos utilisateur :", error);
                    setIsAuthenticated(false);

                    // Si l'erreur est liée à l'authentification (token expiré par exemple)
                    if (error.response && error.response.status === 401) {
                        logout();
                    }
                }
            }
        };

        fetchUser();
    }, []);

    const logout = () => {
        localStorage.removeItem("token");
        setUser(null);
        setIsAuthenticated(false);
    };

    return (
        <UserContext.Provider value={{ user, isAuthenticated, logout }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUserContext = () => useContext(UserContext);
