import React from 'react';

const MessageList = ({ messages }) => {
    return (
        <div className="p-4 bg-gray-100 rounded shadow-md">
            <h2 className="text-xl font-bold mb-4">Messages</h2>
            {messages.length === 0 ? (
                <p className="text-gray-600">Aucun message disponible.</p>
            ) : (
                <ul className="space-y-3">
                    {messages.map((message, index) => (
                        <li
                            key={index}
                            className={`p-3 rounded-lg ${
                                message.sender === 'expéditeur'
                                    ? 'bg-blue-100 text-blue-800'
                                    : 'bg-green-100 text-green-800'
                            }`}
                        >
                            <div className="text-sm">
                                <strong>{message.sender}</strong> : {message.text}
                            </div>
                            <div className="text-xs text-gray-500">{message.timestamp}</div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default MessageList;
