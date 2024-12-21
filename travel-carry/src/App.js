import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Header from "./Header";
import HomePage from "./HomePage";
import Login from "./auth/Login";
import SignUp from "./auth/SignUp";
import NotationsPage from "./NotationsPage";
import ColisDetails from "./colis/ColisDetails";
import AnnonceList from "./AnnonceList";
import CreateAnnonce from "./CreateAnnonce";
import { UserProvider } from "./context/UserContext";
import Footer from "./Footer";
import "./App.css";
import AnnonceDetail from "./AnnonceDetail";

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
                                path="/create-annonce"
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
                        </Routes>
                    </main>
                    <Footer />
                </div>
            </Router>
        </UserProvider>
    );
}

export default App;
