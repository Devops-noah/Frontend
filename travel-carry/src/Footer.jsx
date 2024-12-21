import React from 'react';
import './Footer.css';
import { FaInstagram, FaFacebook, FaTiktok } from 'react-icons/fa'; // Icons for social media

const Footer = () => {
    return (
        <footer className="footer bg-blue-500 text-white p-6">
            <div className="container mx-auto text-center">
                {/* Logo et description */}
                <p className="mb-4 text-lg font-semibold">
                    © 2024 <span style={{ color: "#004080", fontWeight: "bold" }}>Travel Carry</span>. Tous droits réservés.
                </p>

                {/* Réseaux sociaux */}
                <div className="flex justify-center space-x-6 mb-4">
                    <a
                        href="https://www.instagram.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-gray-300 transition"
                        aria-label="Instagram"
                    >
                        <FaInstagram size={28} />
                    </a>
                    <a
                        href="https://www.facebook.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-gray-300 transition"
                        aria-label="Facebook"
                    >
                        <FaFacebook size={28} />
                    </a>
                    <a
                        href="https://www.tiktok.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-gray-300 transition"
                        aria-label="TikTok"
                    >
                        <FaTiktok size={28} />
                    </a>
                </div>

                {/* Texte d'assurance */}
                <p className="text-sm font-light">
                    Travel Carry assure la sécurité et la fiabilité de vos envois à travers le monde. Transportez vos colis avec confiance !
                </p>
            </div>
        </footer>
    );
};

export default Footer;
