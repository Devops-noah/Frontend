import React from 'react';

const NoAnnonceFound = () => {
    return (
        <div className="text-center py-8">
            <h2 className="text-xl text-gray-600">Aucune annonce disponible</h2>
            <p className="text-gray-400">Essayez de modifier vos critères de recherche ou revenez plus tard.</p>
        </div>
    );
};

export default NoAnnonceFound;
