import React from 'react';

const SearchResult = ({ annonces }) => {
    return (
        <div className="p-4 bg-gray-100 rounded shadow-md">
            <h2 className="text-xl font-bold mb-4">Résultats de la Recherche</h2>
            {annonces.length === 0 ? (
                <p className="text-gray-600">Aucune annonce ne correspond à vos critères.</p>
            ) : (
                <table className="w-full bg-white rounded-lg shadow">
                    <thead className="bg-blue-600 text-white">
                    <tr>
                        <th className="p-2 text-left">ID</th>
                        <th className="p-2 text-left">Poids</th>
                        <th className="p-2 text-left">Prix</th>
                        <th className="p-2 text-left">Date de Départ</th>
                        <th className="p-2 text-left">Destination</th>
                    </tr>
                    </thead>
                    <tbody>
                    {annonces.map((annonce, index) => (
                        <tr
                            key={annonce.id}
                            className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}
                        >
                            <td className="p-2">{annonce.id}</td>
                            <td className="p-2">{annonce.poids} kg</td>
                            <td className="p-2">{annonce.prix} €</td>
                            <td className="p-2">{annonce.dateDepart}</td>
                            <td className="p-2">{annonce.destinationNom}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default SearchResult;
