import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Header from "./pages/Header";
import HomePage from "./pages/HomePage";
import Login from "./auth/Login";
import SignUp from "./auth/SignUp";
import NotationsPage from "./notations/NotationsPage";
import ColisDetails from "./colis/ColisDetails";
import AnnonceList from "./annonces/AnnonceList";
import CreateAnnonce from "./annonces/CreateAnnonce";
import { UserProvider } from "./context/UserContext";
import Footer from "./pages/Footer";
import "./App.css";
import AnnonceDetail from "./annonces/AnnonceDetail";
import UserProfile from "./userProfile/UserProfile";
import CreateVoyage from "./voyages/CreateVoyage";
import TransferCreation from "./transfertEnChaine/pagesEnchaine/TransferCreation";
import TransferDetails from "./transfertEnChaine/pagesEnchaine/TransferDetails";
import DashboardLayout from "./admin/components/DashboardLayout";
import AdminUsers from "./admin/pages/AdminUsers";
import AdminAnnonces from "./admin/pages/AdminAnnonces";
import TousLesAvis from "./notations/TousLesAvis";
import { useUserContext } from "./context/UserContext";
import { NotationsProvider } from "./context/NotationsContext";
import AdminNotationComments from "./admin/pages/AdminNotationComments";
import {ProfileProvider} from "./context/ProfileContext";
import MessagingApp from './Messageries/MessagingApp';

function App() {
    return (
        <UserProvider>
            <ProfileProvider>
            <NotationsProvider>
                <Router>
                    <div className="flex flex-col min-h-screen main-container"> {/* Appliquer la classe ici */}
                        <Header />
                        <main className="flex-grow pb-20">
                            <Routes>
                                {/* Routes publiques */}
                                <Route path="/" element={<HomePage />} />
                                <Route path="/login" element={<Login />} />
                                <Route path="/register" element={<SignUp />} />
                                <Route path="/annonces" element={<AnnonceList />} />
                                <Route path="/tous-les-avis" element={<TousLesAvis />} />
                                <Route path="/notations" element={<NotationsPage />} />
                                <Route path="/create-transfer" element={<TransferCreation />} />
                                <Route path="/transfert-details" element={<TransferDetails />} />
                                {/* Routes pour les messageries */}
                                <Route path="/conversation" element={<MessagingApp />} />

                                {/* Routes dynamiques pour les annonces (IDs multiples) */}
                                <Route
                                    path="/annonces/*" // Permet d'accepter plusieurs segments
                                    element={<AnnonceDetail />}
                                />

                                {/* Routes protégées */}
                                <Route
                                    path="/create-voyage"
                                    element={<CreateVoyage />}
                                />
                                <Route
                                    path="/create-annonce/:id"
                                    element={<CreateAnnonce />}
                                />
                                <Route
                                    path="/colis/details/:annonceId"
                                    element={<ColisDetails />}
                                />
                                <Route
                                    path="/user-profile"
                                    element={<UserProfile />}
                                />

                                {/* Admin Routes */}
                                <Route
                                    path="/admin"
                                    element={<DashboardLayout />}
                                >
                                    <Route path="users" element={<AdminUsers />} />
                                    <Route path="annonces" element={<AdminAnnonces />} />
                                    <Route path="comments" element={<AdminNotationComments />} />
                                </Route>
                            </Routes>
                        </main>
                        <Footer />
                    </div>
                </Router>
            </NotationsProvider>
            </ProfileProvider>
        </UserProvider>
    );
}

const PrivateRoute = ({ children }) => {
    const { isAuthenticated } = useUserContext();
    return isAuthenticated ? children : <Navigate to="/login" replace />;
};

const AdminRoute = ({ children }) => {
    const { isAuthenticated, user } = useUserContext();
    const userType = user ? user.role : null;
    return isAuthenticated && userType === "admin" ? children : <Navigate to="/" replace />;
};

export default App;
