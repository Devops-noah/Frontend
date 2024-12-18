# 🚀 Travel Carry - Frontend  
Ce projet est la partie Frontend de l'application **Travel Carry**, développée avec **React.js** pour faciliter la gestion des colis et des voyages.  

## 📦 **Structure du Projet**  

```
Frontend/
├── public/                              # Fichiers publics et modèles HTML
│   ├── index.html                       # Fichier HTML principal
│   └── assets/                          # Ressources statiques comme les images
├── src/
│   ├── api/                             # Appels API vers le backend
│   │   ├── userService.js               # API pour les utilisateurs
│   │   ├── annonceService.js            # API pour les annonces
│   │   └── voyageService.js             # API pour les voyages
│   ├── assets/                          # Ressources globales (images, styles, icônes)
│   ├── components/                      # Composants réutilisables
│   │   ├── Header.js                    # Barre de navigation principale
│   │   ├── Footer.js                    # Pied de page
│   │   ├── Notification.js              # Notifications utilisateur
│   │   ├── Profile.js                   # Composant du profil utilisateur
│   │   └── FormInput.js                 # Input générique pour les formulaires
│   ├── context/                         # Gestion des états globaux
│   │   ├── UserContext.js               # Context pour l'authentification utilisateur
│   │   └── NotificationContext.js       # Context pour les notifications
│   ├── hooks/                           # Hooks personnalisés
│   │   └── useFetch.js                  # Hook pour les appels API
│   ├── pages/                           # Pages principales de l'application
│   │   ├── HomePage.js                  # Page d'accueil
│   │   ├── Login.js                     # Page de connexion
│   │   ├── Register.js                  # Page d'inscription
│   │   ├── Annonces.js                  # Page pour lister les annonces
│   │   ├── Voyages.js                   # Page pour lister les voyages
│   │   ├── ColisDetails.js              # Page pour remplir les informations du colis
│   │   └── NotificationsPage.js         # Page pour afficher les notifications
│   ├── services/                        # Services pour les appels API
│   │   ├── axiosConfig.js               # Configuration globale d'Axios
│   │   ├── userService.js               # Service pour les utilisateurs
│   │   ├── colisService.js              # Service pour les informations colis
│   │   └── demandeService.js            # Service pour les demandes
│   ├── styles/                          # Styles CSS globaux
│   │   └── global.css                   # Fichier CSS global
│   ├── utils/                           # Fonctions utilitaires
│   │   └── validation.js                # Fonctions pour valider les formulaires
│   ├── App.js                           # Composant principal avec les routes
│   ├── index.js                         # Point d'entrée principal pour React
│   └── tailwind.config.js               # Configuration Tailwind CSS (si utilisé)
├── .gitignore                           # Fichiers à ignorer par Git
├── package.json                         # Dépendances et scripts NPM
└── README.md                            # Documentation du projet

```

📄 Description des Dossiers et Fichiers
public/

    index.html : Fichier HTML principal qui sert de point de montage pour React.
    assets/ : Contient les ressources statiques (images, icônes, etc.).

src/

    api/ : Services pour interagir avec le backend via Axios.
    assets/ : Stocke les fichiers globaux (images, icônes, etc.).
    components/ : Composants réutilisables comme Header, Footer, Notification.
    context/ : Utilise React Context API pour gérer les états globaux (authentification et notifications).
    hooks/ : Contient les hooks personnalisés pour des opérations spécifiques comme useFetch.
    pages/ : Pages principales de l'application.
        HomePage : Page d'accueil.
        Login / Register : Pages d'authentification.
        ColisDetails : Formulaire pour remplir les informations colis.
        NotificationsPage : Liste des notifications utilisateur.
    services/ : Fichiers pour configurer et appeler des APIs via Axios.
    styles/ : Fichiers CSS globaux.
    utils/ : Fonctions d'aide comme la validation de formulaire.
    App.js : Composant principal contenant les routes de l'application.
    index.js : Point d'entrée principal pour l'application React.

# 🛠️ Technologies Utilisées

    React.js : Bibliothèque principale pour la construction de l'interface utilisateur.
    React Router : Gestion des routes dans l'application.
    Axios : Gestion des appels API vers le backend.
    React Context API : Gestion des états globaux (authentification, notifications).
    Tailwind CSS (optionnel) : Framework pour le style.
    HTML5 / CSS3 : Structure et mise en forme.

# 🚀 Installation et Lancement
1. Prérequis

    Node.js installé sur votre machine.
    Un backend opérationnel.

2. Installation des dépendances

Clonez le projet et installez les dépendances avec npm :

git clone https://github.com/Devops-noah/Frontend.git
cd Frontend
npm install

3. Exécution de l'application

Pour démarrer l'application en local :

npm start

L'application sera accessible sur http://localhost:3000.
# 🔧 Configuration

Pour configurer les variables d'environnement, créez un fichier .env dans le dossier root :

REACT_APP_API_URL=http://localhost:8080/api

# 📢 Fonctionnalités Principales

    Connexion et Inscription :
        Authentification sécurisée avec gestion de sessions.

    Gestion des Colis :
        Remplir les détails d'un colis.
        Soumettre les demandes.

    Notifications :
        Recevoir des feedbacks sur les demandes envoyées.

    Pages Dynamiques :
        Page pour voir les annonces et voyages disponibles.

 # 🎥 Lien vers la Vidéo YouTube

