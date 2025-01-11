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
import CreateVoyage from "./voyages/CreateVoyage";
import DashboardLayout from "./admin/components/DashboardLayout";
import AdminUsers from "./admin/pages/AdminUsers";
import AdminAnnonces from "./admin/pages/AdminAnnonces";
import BackgroundSlideshow from "./components/BackgroundSlideshow"; // Ajouté ici

function App() {
    const isAuthenticated = !!localStorage.getItem("token");
    const userType = localStorage.getItem("userType");

    const ProtectedRoute = ({ children }) => {
        if (!isAuthenticated || userType !== "admin") {
            return <Navigate to="/" replace />;
        }
        return children;
    };

    return (
        <UserProvider>
            <Router>
                <div className="flex flex-col min-h-screen">
                    <BackgroundSlideshow /> {/* Ajouté ici */}
                    <Header />
                    <main className="flex-grow pb-20">
                        <Routes>
                            <Route path="/" element={<HomePage />} />
                            <Route path="/login" element={<Login />} />
                            <Route path="/register" element={<SignUp />} />
                            <Route path="/annonces" element={<AnnonceList />} />
                            <Route
                                path="/create-voyage"
                                element={
                                    isAuthenticated ? (
                                        <CreateVoyage />
                                    ) : (
                                        <Navigate to="/login" replace />
                                    )
                                }
                            />
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
                                path="/colis/details/:annonceId"
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
                            <Route
                                path="/admin"
                                element={
                                    isAuthenticated && userType === "admin" ? (
                                        <DashboardLayout />
                                    ) : (
                                        <Navigate to="/" replace />
                                    )
                                }
                            >
                                <Route
                                    path="users"
                                    element={
                                        <ProtectedRoute>
                                            <AdminUsers />
                                        </ProtectedRoute>
                                    }
                                />
                                <Route
                                    path="annonces"
                                    element={
                                        <ProtectedRoute>
                                            <AdminAnnonces />
                                        </ProtectedRoute>
                                    }
                                />
                            </Route>
                        </Routes>
                    </main>
                    <Footer />
                </div>
            </Router>
        </UserProvider>
    );
}

export default App;
