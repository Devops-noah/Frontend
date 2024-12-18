import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import logo from './logo.svg';
import './App.css';
import Header from "./Header";
import HomePage from "./HomePage";
import Login from "./auth/Login";
import SignUp from "./auth/SignUp";
import NotationsPage from "./NotationsPage"; // Import de la page Notations
import AnnonceList from "./AnnonceList";
import { UserProvider } from "./context/UserContext";

function App() {
    return (
        <Router>
            <UserProvider>
                <Header />
                <div className="App">

                    <AnnonceList />

                    <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<SignUp />} />
                        <Route path="/notations" element={<NotationsPage />} />
                    </Routes>
                </div>
            </UserProvider>
        </Router>
    );
}

export default App;


