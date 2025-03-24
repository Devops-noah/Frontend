# Utiliser une image de base Node.js
FROM node:18-alpine

# Définir le répertoire de travail
WORKDIR /app

# Copier le package.json et package-lock.json
COPY package*.json ./

# Installer les dépendances
RUN npm install

# Copier tous les fichiers de l'application (les fichiers non ignorés par .dockerignore)
COPY . .

# Construire l'application React
RUN npm run build

# Exposer le port 3000 pour le frontend
EXPOSE 3000

# Lancer l'application React
CMD ["npm", "start"]
