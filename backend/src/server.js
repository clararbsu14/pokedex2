const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const pokemonRoutes = require('./routes/pokemonRoutes');
const db = require('./bd/connection'); // <-- connexion MySQL unique

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Sanity checks
app.get('/', (_req, res) => res.send('API up'));
app.get('/ping', (_req, res) => res.send('pong'));

// Debug DB: vérifie la connexion + table "pokemon"
app.get('/debug/db', async (_req, res) => {
  try {
    const [r] = await db.query('SELECT COUNT(*) AS n FROM pokemon'); // adapte le nom si besoin
    res.json(r[0]);
  } catch (e) {
    console.error('DEBUG/DB ERROR:', e);
    res.status(500).json({ error: e.message, code: e.code });
  }
});

// Routes métier
app.use('/api/pokemons', pokemonRoutes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
