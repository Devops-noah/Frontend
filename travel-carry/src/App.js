import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Header from "./pages/Header";
import HomePage from "./pages/HomePage";
import Login from "./auth/Login";
import SignUp from "./auth/SignUp";
import NotationsPage from "./NotationsPage";
import ColisDetails from "./colis/ColisDetails";
import AnnonceList from "./annonces/AnnonceList";
import CreateAnnonce from "./annonces/CreateAnnonce";
import { UserProvider } from "./context/UserContext";
import Footer from "./pages/Footer";
import "./App.css";
import AnnonceDetail from "./annonces/AnnonceDetail";
import UserProfile from "./userProfile/UserProfile";

function App() {
    // Vérifie si l'utilisateur est connecté
    const isAuthenticated = !!localStorage.getItem("token");

    return (
        <UserProvider>
            <Router>
                {/* Structure principale avec Flexbox */}
                <div className="flex flex-col min-h-screen">
                    <Header />
                    <main className="flex-grow pb-20">
                        <Routes>
                            {/* Routes publiques */}
                            <Route path="/" element={<HomePage />} />
                            <Route path="/login" element={<Login />} />
                            <Route path="/register" element={<SignUp />} />
                            <Route path="/annonces" element={<AnnonceList />} /> {/* Non protégé */}

                            {/* Routes protégées */}

                            <Route
                                path="/create-annonce/:id"
                                element={
                                    isAuthenticated ? (
                                        <CreateAnnonce />
                                    ) : (
                                        <Navigate to="/login" replace />
                                    )
                                }
                            />
                            <Route
                                path="/annonces/:id"
                                element={
                                    isAuthenticated ? (
                                        <AnnonceDetail />
                                    ) : (
                                        <Navigate to="/login" replace />
                                    )
                                }
                            />
                            <Route
                                path="/notations"
                                element={
                                    isAuthenticated ? (
                                        <NotationsPage />
                                    ) : (
                                        <Navigate to="/login" replace />
                                    )
                                }
                            />
                            <Route
                                path="/colis/details"
                                element={
                                    isAuthenticated ? (
                                        <ColisDetails />
                                    ) : (
                                        <Navigate to="/login" replace />
                                    )
                                }
                            />
                            <Route
                                path="/user-profile"
                                element={
                                    isAuthenticated ? (
                                        <UserProfile />
                                    ) : (
                                        <Navigate to="/login" replace />
                                    )
                                }
                            />
                        </Routes>
                    </main>
                    <Footer />
                </div>
            </Router>
        </UserProvider>
    );
}

export default App;
