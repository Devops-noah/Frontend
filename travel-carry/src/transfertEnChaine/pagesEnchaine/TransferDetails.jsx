import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import './TransferDetails.css'; // Ajout du fichier CSS pour le style

const TransferDetails = () => {
    // Récupérer l'état passé par le composant précédent
    const location = useLocation();
    const { segments } = location.state || {};

    console.log('Segments dans TransferDetails:', segments);

    return (
        <div className="transfer-details-container">
            {/* Message principal */}
            <div className="welcome-message">
                <h1>🎉 Bravo, vous avez choisi une chaîne de transfert !</h1>
                <p>
                    Ils vous reste à consulter les détails des segments (voyages) pour valider votre transfert. 📦
                </p>
            </div>

            {segments && Array.isArray(segments) ? (
                <div className="segments-list">
                    <h2>🚀 Vos segments de transfert :</h2>
                    <ul>
                        {segments.map((segment, index) => (
                            <li key={index} className="segment-item">
                                <div className="segment-info">
                                    {/* Logo "Colis en transfert" dans le cercle */}
                                    <div className="segment-image">
                                        Colis <br /> en Transfert
                                    </div>

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
                                        {segment.annonceId ? (
                                            <Link
                                                to={`/annonces/${segment.annonceId}`}
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
                </div>
            ) : (
                <p>Aucun segment trouvé pour cette chaîne.</p>
            )}
        </div>
    );
};

export default TransferDetails;
