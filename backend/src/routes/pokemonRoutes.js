const express = require('express');
const jwt = require('jsonwebtoken');
const {
    getPokemons,
    getPokemonById,
    addPokemon,
    updatePokemon,
    deletePokemon,
    getLastId
} = require('../controllers/pokemonController');

const router = express.Router();

// --- Middleware d'authentification (JWT)
const JWT_SECRET = process.env.JWT_SECRET || 'change-me-in-.env';

function auth(req, res, next) {
    const h = req.headers.authorization || '';
    const token = h.startsWith('Bearer ') ? h.slice(7) : null;
    if (!token) return res.status(401).json({ error: 'Token manquant' });

    try {
        const payload = jwt.verify(token, JWT_SECRET);
        req.user = payload; // { sub, email, role, iat, exp }
        return next();
    } catch (e) {
        return res.status(401).json({ error: 'Token invalide' });
    }
}

// --- Routes publiques (lecture)
router.get('/list', getPokemons);         // Liste des Pokémon
router.get('/details/:id', getPokemonById); // Détails d'un Pokémon
router.get('/last-id', getLastId);        // Dernier ID

// --- Routes protégées (écriture)
router.post('/add', auth, addPokemon);            // Ajouter un Pokémon
router.put('/update/:id', auth, updatePokemon);   // Modifier un Pokémon
router.delete('/delete/:id', auth, deletePokemon); // Supprimer un Pokémon

module.exports = router;
