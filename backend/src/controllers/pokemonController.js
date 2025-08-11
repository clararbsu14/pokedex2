const db = require('../bd/connection'); // <-- CORRIGÉ : "connection" (pas "connexion")

// GET /api/pokemons/list
async function getPokemons(req, res) {
  try {
    const { name, type } = req.query;

    let query = 'SELECT * FROM pokemon WHERE 1=1';
    const params = [];

    if (name) {
      query += ' AND name_french LIKE ?';
      params.push(`%${name}%`);
    }
    if (type) {
      query += ' AND FIND_IN_SET(?, types)';
      params.push(type);
    }

    const [rows] = await db.query(query, params);
    res.json(rows);
  } catch (error) {
    console.error('getPokemons error:', error);
    res.status(500).json({ message: 'Erreur serveur', code: error.code });
  }
}

// GET /api/pokemons/details/:id
async function getPokemonById(req, res) {
  try {
    const { id } = req.params;
    const [rows] = await db.query('SELECT * FROM pokemon WHERE id = ?', [id]);
    if (rows.length === 0) return res.status(404).json({ message: 'Pokémon introuvable' });
    res.json(rows[0]);
  } catch (error) {
    console.error('getPokemonById error:', error);
    res.status(500).json({ message: 'Erreur serveur', code: error.code });
  }
}

// GET /api/pokemons/last-id
async function getLastId(_req, res) {
  try {
    const [rows] = await db.query('SELECT MAX(id) AS lastId FROM pokemon');
    res.json({ lastId: rows[0]?.lastId || 0 });
  } catch (error) {
    console.error('getLastId error:', error);
    res.status(500).json({ message: 'Erreur serveur', code: error.code });
  }
}

// POST /api/pokemons/add
async function addPokemon(req, res) {
  try {
    const {
      id,
      name_french,
      types,
      abilities,
      hp,
      attack,
      defense,
      sp_attack,
      sp_defense,
      speed,
      description,
      height,
      weight,
      hires,
    } = req.body;

    const [existing] = await db.query('SELECT 1 FROM pokemon WHERE name_french = ?', [name_french]);
    if (existing.length > 0) {
      return res.status(400).json({ message: `Un Pokémon avec le nom "${name_french}" existe déjà.` });
    }

    await db.query(
      `INSERT INTO pokemon
       (id, name_french, types, abilities, hp, attack, defense, sp_attack, sp_defense, speed, description, height, weight, hires)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        name_french,
        Array.isArray(types) ? types.join(',') : types ?? null,
        Array.isArray(abilities) ? abilities.join(',') : abilities ?? null,
        hp ?? null,
        attack ?? null,
        defense ?? null,
        sp_attack ?? null,
        sp_defense ?? null,
        speed ?? null,
        description ?? null,
        height ?? null,
        weight ?? null,
        hires ?? null,
      ]
    );

    res.status(201).json({ message: 'Pokémon bien ajouté' });
  } catch (error) {
    console.error('addPokemon error:', error);
    res.status(500).json({ message: 'Erreur serveur', code: error.code });
  }
}

// PUT /api/pokemons/update/:id
async function updatePokemon(req, res) {
  try {
    const { id } = req.params;
    const {
      name_french,
      types,
      abilities,
      hp,
      attack,
      defense,
      sp_attack,
      sp_defense,
      speed,
      description,
      height,
      weight,
      hires,
    } = req.body;

    await db.query(
      `UPDATE pokemon
       SET name_french=?, types=?, abilities=?, hp=?, attack=?, defense=?, sp_attack=?, sp_defense=?, speed=?, description=?, height=?, weight=?, hires=?
       WHERE id=?`,
      [
        name_french,
        Array.isArray(types) ? types.join(',') : types ?? null,
        Array.isArray(abilities) ? abilities.join(',') : abilities ?? null,
        hp ?? null,
        attack ?? null,
        defense ?? null,
        sp_attack ?? null,
        sp_defense ?? null,
        speed ?? null,
        description ?? null,
        height ?? null,
        weight ?? null,
        hires ?? null,
        id,
      ]
    );

    res.json({ message: 'Pokémon mis à jour avec succès' });
  } catch (error) {
    console.error('updatePokemon error:', error);
    res.status(500).json({ message: 'Erreur serveur', code: error.code });
  }
}

// DELETE /api/pokemons/delete/:id
async function deletePokemon(req, res) {
  try {
    const { id } = req.params;
    await db.query('DELETE FROM pokemon WHERE id = ?', [id]);
    res.json({ message: 'Pokémon supprimé avec succès' });
  } catch (error) {
    console.error('deletePokemon error:', error);
    res.status(500).json({ message: 'Erreur serveur', code: error.code });
  }
}

module.exports = {
  getPokemons,
  getPokemonById,
  getLastId,
  addPokemon,
  updatePokemon,
  deletePokemon,
};
