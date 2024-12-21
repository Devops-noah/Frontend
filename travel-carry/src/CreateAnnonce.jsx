import React, { useState } from 'react';
import axios from 'axios';

const CreateAnnonce = () => {
    const [formData, setFormData] = useState({
        description: '',
        poids: '',
        dimensions: '',
        dateDepart: '',
        paysDepart: '',
        paysDestination: '',
    });

    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:8080/api/annonces', formData, {
                headers: { 'Content-Type': 'application/json' },
            });
            setMessage('Annonce créée avec succès !');
            setError('');
            setFormData({
                description: '',
                poids: '',
                dimensions: '',
                dateDepart: '',
                paysDepart: '',
                paysDestination: '',
            });
        } catch (err) {
            console.error('Erreur lors de la création de l\'annonce :', err);
            setMessage('');
            setError('Impossible de créer l\'annonce. Veuillez réessayer.');
        }
    };

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <div className="w-1/2 mx-auto bg-white p-6 rounded-lg shadow">
                <h2 className="text-2xl font-semibold text-center text-blue-600 mb-6">Créer une Annonce</h2>

                {message && <p className="text-green-500 text-center mb-4">{message}</p>}
                {error && <p className="text-red-500 text-center mb-4">{error}</p>}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="text"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        placeholder="Description"
                        className="w-full p-2 border border-gray-300 rounded"
                        required
                    />
                    <input
                        type="number"
                        name="poids"
                        value={formData.poids}
                        onChange={handleChange}
                        placeholder="Poids (kg)"
                        className="w-full p-2 border border-gray-300 rounded"
                        required
                    />
                    <input
                        type="text"
                        name="dimensions"
                        value={formData.dimensions}
                        onChange={handleChange}
                        placeholder="Dimensions (Lxlxh)"
                        className="w-full p-2 border border-gray-300 rounded"
                    />
                    <input
                        type="date"
                        name="dateDepart"
                        value={formData.dateDepart}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded"
                        required
                    />
                    <input
                        type="text"
                        name="paysDepart"
                        value={formData.paysDepart}
                        onChange={handleChange}
                        placeholder="Pays de départ"
                        className="w-full p-2 border border-gray-300 rounded"
                        required
                    />
                    <input
                        type="text"
                        name="paysDestination"
                        value={formData.paysDestination}
                        onChange={handleChange}
                        placeholder="Pays de destination"
                        className="w-full p-2 border border-gray-300 rounded"
                        required
                    />
                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition"
                    >
                        Créer l'Annonce
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CreateAnnonce;
