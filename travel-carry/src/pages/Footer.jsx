import React from 'react';
import { FaInstagram, FaFacebook, FaTiktok } from 'react-icons/fa';

const Footer = () => {
    return (
        <footer className="bg-blue-500 text-white py-3 fixed bottom-0 left-0 w-full">
            <div className="container mx-auto text-center">
                {/* Logo and description */}
                <p className="mb-2 text-sm font-semibold">
                    © 2024 <span className="text-blue-800 font-bold">Travel Carry</span>. Tous droits réservés.
                </p>

                {/* Social media icons */}
                <div className="flex justify-center space-x-4 mb-2">
                    <a
                        href="https://www.instagram.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-gray-300 transition"
                        aria-label="Instagram"
                    >
                        <FaInstagram size={22} />
                    </a>
                    <a
                        href="https://www.facebook.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-gray-300 transition"
                        aria-label="Facebook"
                    >
                        <FaFacebook size={22} />
                    </a>
                    <a
                        href="https://www.tiktok.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-gray-300 transition"
                        aria-label="TikTok"
                    >
                        <FaTiktok size={22} />
                    </a>
                </div>

                {/* Assurance text */}
                <p className="text-xs font-light">
                    Travel Carry assure la sécurité et la fiabilité de vos envois à travers le monde. Transportez vos colis avec confiance !
                </p>
            </div>
        </footer>
    );
};

export default Footer;
