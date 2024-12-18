import React, { useState } from 'react';

const MessageForm = ({ onSendMessage }) => {
    const [message, setMessage] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (message.trim() !== '') {
            onSendMessage(message);
            setMessage('');
        }
    };

    return (
        <form className="p-4 bg-white rounded shadow-md" onSubmit={handleSubmit}>
            <h2 className="text-xl font-bold mb-4">Envoyer un Message</h2>
            <div className="flex items-center space-x-3">
                <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="flex-grow border rounded p-2"
                    placeholder="Tapez votre message..."
                />
                <button
                    type="submit"
                    className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition"
                >
                    Envoyer
                </button>
            </div>
        </form>
    );
};

export default MessageForm;
