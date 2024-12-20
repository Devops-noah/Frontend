import React from 'react';

const AnnonceStatus = ({ status }) => {
    const getStatusClass = () => {
        switch (status) {
            case 'disponible':
                return 'bg-green-500 text-white';
            case 'acceptée':
                return 'bg-blue-500 text-white';
            case 'désactivée':
                return 'bg-gray-500 text-white';
            default:
                return 'bg-gray-200 text-gray-600';
        }
    };

    const getStatusLabel = () => {
        switch (status) {
            case 'disponible':
                return 'Disponible';
            case 'acceptée':
                return 'Acceptée';
            case 'désactivée':
                return 'Désactivée';
            default:
                return 'Statut inconnu';
        }
    };

    return (
        <span className={`px-4 py-2 rounded-full ${getStatusClass()}`}>
      {getStatusLabel()}
    </span>
    );
};

export default AnnonceStatus;
