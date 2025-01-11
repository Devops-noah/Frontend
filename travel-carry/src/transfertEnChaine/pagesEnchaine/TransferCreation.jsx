import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TransferService from '../services/transferService';
import Flag from 'react-world-flags';
import './TransferCreation.css';

const TransferCreation = () => {
    const [paysDepart, setPaysDepart] = useState('');
    const [paysArrivee, setPaysArrivee] = useState('');
    const [segmentsDisponibles, setSegmentsDisponibles] = useState([]);
    const navigate = useNavigate();

    const rechercherSegments = async () => {
        try {
            const response = await TransferService.rechercherSegments(paysDepart, paysArrivee);
            if (!response) {
                console.warn('Aucune donnée retournée par l\'API');
                alert('Aucun segment disponible pour ces paramètres.');
                return;
            }
            console.log('Réponse de l\'API:', response);
            setSegmentsDisponibles(response);
        } catch (error) {
            console.error('Erreur lors de la recherche des segments:', error);
            alert('Une erreur est survenue lors de la recherche des segments.');
        }
    };

    const voirDetails = (segments) => {
        if (!Array.isArray(segments)) {
            console.error('Segments n\'est pas un tableau:', segments);
            alert('Erreur : données invalides pour les segments.');
            return;
        }
        navigate('/transfert-details', { state: { segments } });
    };

    return (
        <div className="transfer-container">
            <h1 className="title">Créer une demande de transfert</h1>

            <div className="input-group">
                <label>
                    Pays de départ:
                    <div className="input-wrapper">
                        <input
                            type="text"
                            value={paysDepart}
                            onChange={(e) => setPaysDepart(e.target.value)}
                            placeholder="Ex : FR (France)"
                            className="input-field"
                        />
                        {paysDepart && <Flag code={paysDepart.toUpperCase()} className="flag" />}
                    </div>
                </label>
            </div>

            <div className="input-group">
                <label>
                    Pays d'arrivée:
                    <div className="input-wrapper">
                        <input
                            type="text"
                            value={paysArrivee}
                            onChange={(e) => setPaysArrivee(e.target.value)}
                            placeholder="Ex : DE (Allemagne)"
                            className="input-field"
                        />
                        {paysArrivee && <Flag code={paysArrivee.toUpperCase()} className="flag" />}
                    </div>
                </label>
            </div>

            <button className="btn btn-primary" onClick={rechercherSegments}>Rechercher les chaînes de transferts</button>

            <div className="segments-container">
                <h2 className="available-chains">Chaînes de transfert disponibles</h2>
                {segmentsDisponibles.length > 0 ? (
                    <ul>
                        {segmentsDisponibles.map((segment, index) => (
                            <li key={index} className="segment-item">
                                <span className="segment-path">
                                    {Array.isArray(segment) ? segment.map((s, idx) => (
                                        <span key={idx}>
                                            {/* Coloration des pays */}
                                            <span className={`pays-${s.pointDepart.toLowerCase()}`}>{s.pointDepart}</span>
                                            {' -> '}
                                            <span className={`pays-${s.pointArrivee.toLowerCase()}`}>{s.pointArrivee}</span>
                                            {' ('}
                                            {/* Coloration des voyageurs */}
                                            <span className={s.voyageur.nom.toLowerCase() === 'dona' ? 'voyageur-dona' : 'voyageur-oumar'}>
                                                {s.voyageur.nom}
                                            </span>
                                            {')'}
                                        </span>
                                    )) : 'Segment non valide'}
                                </span>
                                <button className="btn btn-secondary" onClick={() => voirDetails(segment)}>Voir les détails</button>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>Aucune chaine de transfert disponible disponible.</p>
                )}
            </div>
        </div>
    );
};

export default TransferCreation;
