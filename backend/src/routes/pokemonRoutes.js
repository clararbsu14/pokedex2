const express = require('express');
const { getPokemons, getPokemonById, addPokemon, updatePokemon, deletePokemon, getLastId } = require('../controllers/pokemonController');
const router = express.Router();

router.get('/list', getPokemons); // Liste des Pokémon avec pagination et filtres
router.get('/details/:id', getPokemonById); // Détails d'un Pokémon
router.get('/last-id', getLastId); // Récupérer le dernier ID
router.post('/add', addPokemon); // Ajouter un Pokémon
router.put('/update/:id', updatePokemon); // Modifier un Pokémon
router.delete('/delete/:id', deletePokemon); // Supprimer un Pokémon

module.exports = router;