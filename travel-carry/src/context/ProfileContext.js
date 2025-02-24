import React, { createContext, useContext, useEffect, useState } from "react";

const ProfileContext = createContext();

export const ProfileProvider = ({ children }) => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProfile = async () => {
            const token = localStorage.getItem("token");
            if (!token) {
                setError("User is not authenticated");
                setLoading(false);
                return;
            }

            try {
                const response = await fetch("http://localhost:8080/api/utilisateurs/profile", {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                });

                if (!response.ok) {
                    throw new Error("Failed to fetch profile data");
                }

                const data = await response.json();
                setProfile(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    return (
        <ProfileContext.Provider value={{ profile, loading, error }}>
            {children}
        </ProfileContext.Provider>
    );
};

// Custom hook to use the profile context
export const useProfile = () => useContext(ProfileContext);
