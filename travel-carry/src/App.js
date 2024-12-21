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

function App() {
    // Vérifie si l'utilisateur est connecté
    const isAuthenticated = !!localStorage.getItem("token");

    return (
        <UserProvider>
            <Router>
                <Header />
                <div className="container">
                    <Routes>
                        {/* Routes publiques */}
                        <Route path="/" element={<HomePage />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<SignUp />} />

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
                            path="/annonces"
                            element={
                                isAuthenticated ? (
                                    <AnnonceList />
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
                    </Routes>
                </div>
            </Router>
        </UserProvider>
    );
}

export default App;
