import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./Header";
import HomePage from "./HomePage";
import Login from "./auth/Login";
import SignUp from "./auth/SignUp";
import { UserProvider } from "./context/UserContext";
import AnnonceList from "./AnnonceList";
import AnnonceForm from "./AnnonceForm";

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
                        <Route path="/annonces" element={<AnnonceList />} />
                        <Route path="/create-new" element={<AnnonceForm />} />
                        <Route path="/" element={<HomePage />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<SignUp />} />
                        <Route path="/annonces" element={<AnnonceList />} />
                        <Route path="/annonce/new" element={<AnnonceForm />} />


                    </Routes>
                </div>
            </Router>
        </UserProvider>
    );
}

export default App;
