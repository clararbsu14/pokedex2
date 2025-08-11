const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const pokemonRoutes = require('./routes/pokemonRoutes');
const authRoutes = require('./routes/authRoutes');

const app = express();

// Middleware pour autoriser les requêtes cross-origin
app.use(cors());

// Middleware pour parser les données JSON
app.use(bodyParser.json());

// Routes pour les pokémons
app.use('/api/pokemons', pokemonRoutes);

// Routes pour l'authentification
app.use('/api/auth', authRoutes);

// Lancement du serveur
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
