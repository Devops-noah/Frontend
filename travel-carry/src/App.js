import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./Header";
import HomePage from "./HomePage";
import Login from "./auth/Login";
import SignUp from "./auth/SignUp";
import NotationsPage from "./NotationsPage"; // Import de la page Notations
import ColisDetails from "./colis/ColisDetails"; // Import du composant ColisDetails
import AnnonceList from "./AnnonceList"; // Ajout pour conserver la fonctionnalité d'AnnonceList
import { UserProvider } from "./context/UserContext";

function App() {
    return (
        <UserProvider>
            <Router>
                <Header />
                <div className="container">
                    <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<SignUp />} />
                        <Route path="/notations" element={<NotationsPage />} /> {/* Route Notations */}
                        <Route path="/colis/details" element={<ColisDetails />} /> {/* Nouvelle route */}
                        <Route path="/annonces" element={<AnnonceList />} /> {/* Intégration d'AnnonceList */}
                    </Routes>
                </div>
            </Router>
        </UserProvider>
    );
}

export default App;
