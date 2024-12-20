import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';

// Importation des composants
import AnnonceList from './AnnonceList';
import AnnonceForm from './AnnonceForm';
import AnnonceDetail from './AnnonceDetail';
import FiltrageForm from './FiltrageForm';
import SearchResult from './SearchResult';
import MessageList from './MessageList';
import MessageForm from './MessageForm';
import AnnonceUpdateForm from './AnnonceUpdateForm';
import AnnonceStatus from './AnnonceStatus';
import UserProfile from './UserProfile';
import AcceptAnnonce from './AcceptAnnonce';
import AnnonceItem from './AnnonceItem';
import NoAnnonceFound from './NoAnnonceFound';

function AppOumar() {
    return (
        <Router>
            <div className="App">
                {/* Navigation */}
                <nav className="p-4 bg-blue-600 text-white">
                    <ul className="flex gap-4 justify-center">
                        <li>
                            <Link to="/" className="hover:underline">Liste des Annonces</Link>
                        </li>
                        <li>
                            <Link to="/annonce/new" className="hover:underline">Créer une Annonce</Link>
                        </li>
                        <li>
                            <Link to="/user/profile" className="hover:underline">Profil</Link>
                        </li>
                    </ul>
                </nav>

                {/* Définition des routes */}
                <Routes>
                    <Route path="/" element={<AnnonceList />} />
                    <Route path="/annonce/new" element={<AnnonceForm />} />
                    <Route path="/annonce/:id" element={<AnnonceDetail />} />
                    <Route path="/annonce/update/:id" element={<AnnonceUpdateForm />} />
                    <Route path="/search" element={<SearchResult />} />
                    <Route path="/user/profile" element={<UserProfile />} />
                    <Route path="/accept/:id" element={<AcceptAnnonce />} />
                    <Route path="/filtrage" element={<FiltrageForm />} />
                    <Route path="/messages/:id" element={<MessageList />} />
                    <Route path="/messages/:id/send" element={<MessageForm />} />
                    <Route path="/annonce/status/:id" element={<AnnonceStatus />} />
                    <Route path="/noannonce" element={<NoAnnonceFound />} />
                    {/* Route de secours pour les pages non trouvées */}
                    <Route path="*" element={<NoAnnonceFound />} />
                </Routes>
            </div>
        </Router>
    );
}

export default AppOumar;
