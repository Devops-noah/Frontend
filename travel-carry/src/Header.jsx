import React, {useState} from 'react';
import './Header.css';
import { Link } from 'react-router-dom';

const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    console.log("open: ", isMenuOpen)
    return (
        <header className="flex justify-between items-center p-4 bg-blue-500 text-white">
            <div className="text-2xl font-bold">Travel Carry</div>
            <nav className="hidden md:flex space-x-4">
                <Link to="/login">
                    <button className="px-4 py-2 bg-white text-blue-500 font-semibold rounded hover:bg-gray-100">
                        Connexion
                    </button>
                </Link>
            </nav>
            {/* Menu hamburger (Mobile) */}
            <div className="md:hidden">
                <button
                    className="p-2 rounded-md bg-white text-blue-500 hover:bg-gray-200"
                    aria-label="Open Menu"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                    ☰
                </button>
            </div>

            {/* Menu déroulant pour mobile */}
            {isMenuOpen && (
                <div className="absolute top-16 right-4 bg-blue-500 text-white rounded shadow-md p-4 space-y-2">
                    <button className="block w-full text-left px-4 py-2 rounded hover:bg-blue-600">
                        Connexion
                    </button>
                </div>
            )}
        </header>
    );
};

export default Header;
