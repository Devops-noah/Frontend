import React, { useState } from 'react';
import axios from 'axios';

const AcceptAnnonce = ({ annonceId, onAccept, onReject }) => {
    const [loading, setLoading] = useState(false);

    const handleAccept = async () => {
        setLoading(true);
        try {
            await axios.put(`http://localhost:8080/api/annonces/${annonceId}/accept`);
            onAccept(); // Notifie le parent que l'annonce a été acceptée
        } catch (err) {
            console.error('Error accepting annonce:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleReject = async () => {
        setLoading(true);
        try {
            await axios.put(`http://localhost:8080/api/annonces/${annonceId}/reject`);
            onReject(); // Notifie le parent que l'annonce a été refusée
        } catch (err) {
            console.error('Error rejecting annonce:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex gap-4">
            <button
                onClick={handleAccept}
                className="bg-green-500 text-white rounded-md p-2 hover:bg-green-600 transition"
                disabled={loading}
            >
                {loading ? 'Accepting...' : 'Accepter'}
            </button>
            <button
                onClick={handleReject}
                className="bg-red-500 text-white rounded-md p-2 hover:bg-red-600 transition"
                disabled={loading}
            >
                {loading ? 'Rejecting...' : 'Refuser'}
            </button>
        </div>
    );
};

export default AcceptAnnonce;
