import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function UserProfile() {
    const [profile, setProfile] = useState(null); // State to store user profile
    const [loading, setLoading] = useState(true); // State to show loading indicator
    const [error, setError] = useState(null); // State to handle errors
    const navigate = useNavigate(); // Use navigate hook to navigate to different routes

    useEffect(() => {
        // Fetch the user profile based on authentication
        const fetchProfile = async () => {
            try {
                // Retrieve token from localStorage or cookies
                const token = localStorage.getItem("token");

                if (!token) {
                    throw new Error("User is not authenticated");
                }

                const response = await fetch("http://localhost:8080/api/utilisateurs/profile", {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`, // Attach token in Authorization header
                        "Content-Type": "application/json",
                    },
                });

                if (!response.ok) {
                    throw new Error("Failed to fetch profile data");
                }

                const data = await response.json();
                setProfile(data); // Set profile data
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    if (loading) {
        return <p className="text-center py-5">Loading...</p>;
    }

    if (error) {
        return <p className="text-center py-5 text-red-500">Error: {error}</p>;
    }


    return (
        <section className="bg-gray-100 py-5">
            <div className="container mx-auto">
                <div className="flex flex-col lg:flex-row gap-4">
                    {/* Profile Card */}
                    <div className="lg:w-1/3">
                        <div className="bg-white rounded-lg shadow-md p-4 text-center">
                            <img
                                src={profile.avatar || "https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava3.webp"}
                                alt="avatar"
                                className="rounded-full w-36 mx-auto mb-4"
                            />
                            <p className="text-lg font-semibold">
                                {profile.nom} {profile.prenom}
                            </p>
                            <p className="text-gray-500 mb-4">{profile.type === "voyageur" ? "Voyageur" : "Expediteur"}</p>
                            <div className="flex justify-center gap-2">
                                {profile.type === "voyageur" ? (
                                    <>
                                        <button
                                            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                                            onClick={() => {
                                                // Check if there is any annonce
                                                if (profile.annonces && profile.annonces.length > 0) {
                                                    const voyageId = profile.annonces[0].voyageId; // Access the first annonce's voyageId
                                                    navigate(`/create-annonce/${voyageId}`);
                                                } else {
                                                    // Handle case where no annonces exist
                                                    alert("No available voyage to create annonce.");
                                                }
                                            }}
                                        >
                                            Create Annonce
                                        </button>
                                        <button
                                            className="border border-gray-300 px-4 py-2 rounded hover:bg-gray-100"
                                            onClick={() => navigate("/create-voyage")}
                                        >
                                            Mes voyages
                                        </button>
                                    </>
                                ) : profile.type === "expediteur" ? (
                                    <button
                                        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                                        onClick={() => navigate("/colis/details")}
                                    >
                                        Mes colis
                                    </button>
                                ) : null}
                            </div>
                        </div>
                    </div>

                    {/* Details Card */}
                    <div className="lg:w-2/3">
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <hr className="my-4" />
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-y-4">
                                <p className="font-medium">Email</p>
                                <p className="text-gray-500 col-span-2">{profile.email}</p>
                            </div>
                            <hr className="my-4" />
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-y-4">
                                <p className="font-medium">Telephone</p>
                                <p className="text-gray-500 col-span-2">{profile.telephone || "N/A"}</p>
                            </div>
                            <hr className="my-4" />
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-y-4">
                                <p className="font-medium">Address</p>
                                <p className="text-gray-500 col-span-2">{profile.adresse || "N/A"}</p>
                            </div>
                            <hr className="my-4" />
                            {profile.type === "expediteur" && profile.message && (
                                <div className="text-center text-red-500 mt-4">
                                    <p>{profile.message}</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
