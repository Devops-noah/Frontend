import React from "react";
import { Link } from "react-router-dom";

export default function HomePage() {
    return (
        <div className="p-8">
            <p>Bienvenue sur Travel-Carry </p>
            {/* Lien vers la page des détails du colis */}
            <Link
                to="/colis/details"
                className="inline-block mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
                Détails du colis
            </Link>
        </div>
    );
}

