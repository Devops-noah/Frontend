# 🚀 Travel Carry - Frontend  
Ce projet est la partie Frontend de l'application **Travel Carry**, développée avec **React.js** pour faciliter la gestion des colis et des voyages.  

## 📦 **Structure du Projet**  

```
Frontend/
│
├── .idea/                   # Dossier de configuration de l'IDE (par exemple, IntelliJ ou WebStorm)
├── travel-carry/            # Dossier principal de l'application
│   ├── node_modules/        # Dossier contenant les dépendances de l'application
│   ├── public/              # Dossier contenant les fichiers publics (index.html, assets, etc.)
│   └── src/                 # Dossier contenant tout le code source
│       ├── admin/           # Dossier pour les composants/admin
│       │   ├── components/  # Composants réutilisables pour l'administration
│       │   │   ├── DashboardLayout.jsx  # Mise en page du dashboard
│       │   │   └── Sidebar.jsx          # Sidebar du tableau de bord
│       │   └── pages/       # Pages spécifiques à l'admin
│       │       ├── AdminAnnonces.jsx     # Page pour la gestion des annonces admin
│       │       ├── AdminNotationComm.jsx # Page pour les notations admin
│       │       └── AdminUsers.jsx         # Page pour la gestion des utilisateurs admin
│       ├── annonces/        # Dossier pour la gestion des annonces
│       │   ├── AnnonceDetail.jsx         # Détail d'une annonce
│       │   ├── AnnounceList.jsx          # Liste des annonces
│       │   ├── AnnounceUpdateForm.jsx    # Formulaire de mise à jour d'une annonce
│       │   └── CreateAnnounce.jsx        # Page pour créer une annonce
│       ├── assets/          # Dossier pour les fichiers statiques (images, icônes, etc.)
│       ├── auth/            # Dossier pour l'authentification (login, signup, etc.)
│       │   ├── Login.jsx    # Page de connexion
│       │   └── SignUp.jsx   # Page d'inscription
│       ├── colis/           # Dossier pour la gestion des colis
│       │   └── ColisDetails.jsx # Détail d'un colis
│       ├── components/      # Composants réutilisables dans tout le projet
│       │   └── BackgroundSlideshow.jsx  # Composant pour le diaporama d'arrière-plan
│       ├── context/         # Dossier pour les contextes React (gestion d'état global)
│       │   ├── NotationsContext.js  # Contexte pour gérer les notations
│       │   └── UserContext.js       # Contexte pour gérer les utilisateurs
│       ├── demandes/        # Dossier pour les demandes de services
│       │   └── DemandesList.jsx  # Liste des demandes
│       ├── notations/       # Dossier pour la gestion des notations
│       │   ├── NotationsPage.css   # Styles pour la page des notations
│       │   ├── NotationsPage.jsx   # Composant de la page des notations
│       │   └── TousLesAvis.jsx      # Composant affichant tous les avis
│       ├── notifications/   # Dossier pour la gestion des notifications
│       │   └── Notifications.js  # Gestion des notifications
│       ├── pages/           # Dossier pour les pages principales de l'application
│       │   ├── Footer.css         # Styles du footer
│       │   ├── Footer.jsx         # Composant footer
│       │   ├── Header.css         # Styles du header
│       │   ├── Header.jsx         # Composant header
│       │   ├── HomePage.css       # Styles pour la page d'accueil
│       │   └── HomePage.jsx       # Composant de la page d'accueil
│       ├── transfertEnChaine/ # Dossier pour la gestion des transferts en chaîne
│       │   ├── __tests__/           # Tests pour les transferts en chaîne
│       │   └── pagesEnchaine/       # Pages relatives au transfert en chaîne
│       │       ├── TransferCreation.css  # Styles pour la création de transfert
│       │       ├── TransferCreation.jsx  # Composant de création de transfert
│       │       ├── TransferDetails.css   # Styles pour les détails du transfert
│       │       └── TransferDetails.jsx   # Composant pour les détails du transfert
│       ├── services/         # Dossier pour les services de l'application
│       │   └── transferService.js  # Service pour la gestion des transferts
│       ├── userProfile/      # Dossier pour la gestion des profils utilisateurs
│       │   ├── UpdateUserProfileImage.js # Mise à jour de l'image du profil
│       │   └── UserProfile.jsx  # Affichage du profil utilisateur
│       ├── voyages/          # Dossier pour la gestion des voyages
│       │   └── CreateVoyage.jsx   # Page pour créer un voyage
│       ├── App.css           # Fichier de styles principaux de l'application
│       ├── App.js            # Composant principal de l'application
│       ├── App.test.js       # Fichier de tests pour le composant App
│       ├── FiltrageForm.jsx  # Composant pour le formulaire de filtrage
│       ├── index.css         # Fichier CSS principal de l'application
│       ├── index.js          # Point d'entrée principal de l'application React
│       ├── logo.svg          # Fichier pour le logo de l'application
│       ├── NoAnnounceFound.jsx # Composant affiché si aucune annonce n'est trouvée
│       ├── reportWebVitals.js # Fichier pour mesurer les performances de l'application
│       ├── setupTests.js     # Configuration pour les tests
│       ├── TravelAnimation.jsx # Composant pour l'animation des voyages
│       └── tailwind.config.js  # Fichier de configuration de Tailwind CSS
├── .gitignore               # Liste des fichiers et dossiers à ignorer par Git
├── package.json             # Fichier de gestion des dépendances et des scripts npm
├── package-lock.json        # Fichier qui verrouille les versions des dépendances
└── LICENSE                  # Fichier de licence du projet


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
    Tailwind CSS  : Framework pour le style.
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


# 📢 Fonctionnalités Principales

    Gestion des annonces :
        Création, affichage et recherche des annonces.

    Gestion des Colis :
        Remplir les détails d'un colis.
        Soumettre les demandes.

    Notifications :
        Recevoir des feedbacks sur les demandes envoyées.

    Gestion des profils :
        Permet de gérer les différents profils utilisateur

    Transfert en chaîne :
        Permet d'achéminer un colis lorsque aucune ne couvre l'intégralité de trajet souhaité.

 # 🎥 Lien vers la Vidéo YouTube
 

