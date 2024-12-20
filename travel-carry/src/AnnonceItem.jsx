import React from 'react';
import AcceptAnnonce from './AcceptAnnonce';

const AnnonceItem = ({ annonce, onDelete }) => {
    return (
        <tr className="border-t">
            <td className="px-4 py-2">{annonce.id}</td>
            <td className="px-4 py-2">{annonce.poids}</td>
            <td className="px-4 py-2">{annonce.prix}</td>
            <td className="px-4 py-2">{annonce.dateDepart}</td>
            <td className="px-4 py-2">{annonce.paysDepart}</td>
            <td className="px-4 py-2">{annonce.paysDestination}</td>
            <td className="px-4 py-2">
                {/* Accept / Reject buttons only visible to travelers */}
                <AcceptAnnonce
                    annonceId={annonce.id}
                    onAccept={() => alert('Annonce accepted')}
                    onReject={() => alert('Annonce rejected')}
                />
            </td>
            <td className="px-4 py-2">
                <button
                    onClick={() => onDelete(annonce.id)}
                    className="text-red-500 hover:text-red-700"
                >
                    Supprimer
                </button>
            </td>
        </tr>
    );
};

export default AnnonceItem;
