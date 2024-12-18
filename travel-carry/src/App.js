import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./Header";
import HomePage from "./HomePage";
import Login from "./auth/Login";
import SignUp from "./auth/SignUp";
import { UserProvider } from "./context/UserContext";
import AnnonceList from "./AnnonceList";

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
                        <Route path="/" element={<AnnonceList />} />
                    </Routes>
                </div>
            </Router>
        </UserProvider>
    );
}

export default App;
