# Frontend

Frontend/
├── public/                              # Public assets and the HTML template
│   ├── index.html                       # Main HTML file
│   └── assets/                          # Static assets like images, icons, etc.
├── src/
│   ├── api/                             # API calls to the backend
│   │   ├── userService.js               # API calls related to users
│   │   ├── annonceService.js            # API calls related to annonces
│   │   └── voyageService.js             # API calls related to voyages
│   ├── components/                      # Reusable components across the app
│   │   ├── Navbar.js                    # Navigation bar
│   │   ├── Footer.js                    # Footer component
│   │   ├── Profile.js                   # User profile component
│   │   ├── AnnonceForm.js               # Form to create an annonce
│   │   └── VoyageForm.js                # Form to create a voyage
│   ├── hooks/                           # Custom hooks (if any)
│   │   └── useFetch.js                  # Hook for fetching data
│   ├── pages/                           # Main application pages
│   │   ├── Home.js                      # Home page
│   │   ├── Login.js                     # Login page
│   │   ├── Register.js                  # Registration page
│   │   ├── Annonces.js                  # List of annonces
│   │   ├── Voyages.js                   # List of voyages
│   │   └── ProfilePage.js               # User profile page
│   ├── styles/                          # CSS or styled components
│   │   └── global.css                   # Global styles
│   ├── App.js                           # Main app component
│   ├── index.js                         # Entry point for React
│   └── utils/                           # Utility functions
│       └── validation.js                # Validation functions
└── package.json                         # Project dependencies and scripts
