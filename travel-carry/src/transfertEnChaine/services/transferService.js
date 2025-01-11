// Constante pour l'URL de l'API
const API_BASE_URL = 'http://localhost:8080/api/demandeTransfert';

// Récupérer le token d'authentification
const getAuthToken = () => {
    const token = localStorage.getItem('token');
    console.log("Token récupéré:", token); // Vérification du token
    return token;
};

class TransferService {
    // Recherche des segments possibles entre deux pays
    async rechercherSegments(paysDepart, paysArrivee) {
        try {
            const response = await fetch(`${API_BASE_URL}/recherche?paysDepart=${encodeURIComponent(paysDepart)}&paysArrivee=${encodeURIComponent(paysArrivee)}`, {
                method: 'POST'
            });

            if (!response.ok) {
                throw new Error(`Erreur lors de la recherche des segments: ${response.statusText}`);
            }
            return response.json(); // Retourner les données JSON
        } catch (error) {
            console.error('Erreur dans rechercherSegments:', error);
            throw error; // Re-throw pour gestion dans le composant
        }
    }

    // Enregistrer la chaîne de transfert choisie par l'utilisateur
    async enregistrerChaine(segmentsChoisis) {
        try {
            // Vérification du format des segmentsChoisis
            console.log("Segments envoyés au backend:", segmentsChoisis);

            // Assurez-vous que segmentsChoisis est bien une liste d'objets valides
            if (!Array.isArray(segmentsChoisis) || segmentsChoisis.length === 0) {
                throw new Error("Aucun segment n'a été choisi.");
            }

            // Envoi de la requête avec le corps JSON
            const response = await fetch(`${API_BASE_URL}/enregistrer`, {
                method: 'POST',

                body: JSON.stringify(segmentsChoisis), // Corps de la requête
            });

            if (!response.ok) {
                let errorMessage = `Erreur ${response.status}: Détails non fournis`;

                try {
                    const errorResponse = await response.json();
                    errorMessage = errorResponse.message || 'Détails non fournis';
                } catch (error) {
                    console.error('Erreur lors de l\'analyse JSON de la réponse du serveur:', error);
                }

                throw new Error(errorMessage);
            }

            return response.json(); // Retourner les données JSON si succès
        } catch (error) {
            console.error('Erreur dans enregistrerChaine:', error);
            throw error; // Re-throw pour gestion dans le composant
        }
    }
}

const transferService = new TransferService();
export default transferService;
