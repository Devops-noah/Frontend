import React, { useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import './TransferDetails.css'; // Ajout du fichier CSS pour le style

const TransferDetails = () => {
    // Récupérer l'état passé par le composant précédent
    const location = useLocation();
    const navigate = useNavigate();
    const { segments } = location.state || {};

    console.log('Segments dans TransferDetails:', segments);

    // Vérifier si segments existe et est un tableau
    useEffect(() => {
        if (!segments || !Array.isArray(segments)) {
            alert('Aucun segment trouvé.');
            navigate('/'); // Rediriger l'utilisateur si aucun segment trouvé
        }
    }, [segments, navigate]);

    const genererUrlAnnonces = () => {
        if (!segments || !Array.isArray(segments)) return '';
        // Récupérer tous les annonceId des segments (via segment.annonce.id)
        const ids = segments.map(segment => segment.annonce ? segment.annonce.id : null).filter(id => id).join('/');
        return `/annonces/${ids}`;
    };

    const voirDetailsTousSegments = () => {
        const url = genererUrlAnnonces();
        if (url) {
            navigate(url); // Rediriger vers l'URL des annonces
        } else {
            alert('Aucune annonce disponible pour cette chaîne.');
        }
    };

    return (
        <div className="transfer-details-container">
            {/* Message principal */}
            <div className="welcome-message">
                <h1>🎉 Bravo, vous avez choisi une chaîne de transfert !</h1>
                <p>
                    Il vous reste à consulter les détails des segments (voyages) pour valider votre transfert. 📦
                </p>
            </div>

            {segments && Array.isArray(segments) ? (
                <div className="segments-list">
                    <h2>🚀 Vos segments de transfert :</h2>
                    <ul>
                        {segments.map((segment, index) => (
                            <li key={index} className="segment-item">
                                <div className="segment-info">
                                    {/* Informations du segment */}
                                    <div className="segment-details">
                                        <p>
                                            <span className="point">
                                                {segment.pointDepart}
                                            </span>{' '}
                                            ➡️{' '}
                                            <span className="point">
                                                {segment.pointArrivee}
                                            </span>{' '}
                                            <br />
                                            Voyageur :{' '}
                                            <strong>
                                                {segment.voyageur
                                                    ? segment.voyageur.nom
                                                    : 'Voyageur inconnu'}
                                            </strong>
                                        </p>

                                        {/* Lien vers le détail de l'annonce */}
                                        {segment.annonce && segment.annonce.id ? (
                                            <Link
                                                to={`/annonces/${segment.annonce.id}`}
                                                className="btn btn-primary"
                                            >
                                                Voir Détail Annonce
                                            </Link>
                                        ) : (
                                            <span className="no-annonce">
                                                Aucune annonce associée
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>

                    {/* Bouton pour voir les détails de tous les segments */}
                    <button
                        className="btn btn-secondary voir-details-tous"
                        onClick={voirDetailsTousSegments}
                    >
                        Voir Détails Annonces
                    </button>
                </div>
            ) : (
                <p>Aucun segment trouvé pour cette chaîne.</p>
            )}
        </div>
    );
};

export default TransferDetails;
