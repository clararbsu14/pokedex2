const connection = require('../bd/connexion');

const getPokemons = async (req, res) => {
  const { name, type} = req.query;

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

  try {
    const [rows] = await connection.query(query, params);
    res.json( rows );
  } catch (error) {
    console.error('Erreur lors de la récupération des Pokémon :', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

const getPokemonById = async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await connection.query('SELECT * FROM pokemon WHERE id = ?', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Pokémon introuvable' });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error('Erreur lors de la récupération du Pokémon :', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

const addPokemon = async (req, res) => {
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

  try {
    // Vérifier si le Pokémon existe déjà par son nom
    const [existingPokemon] = await connection.query('SELECT * FROM pokemon WHERE name_french = ?', [name_french]);
    if (existingPokemon.length > 0) {
      return res.status(400).json({ message: `Un Pokémon avec le nom "${name_french}" existe déjà.` });
    }

    // Ajouter le Pokémon
    await connection.query(
      `INSERT INTO pokemon (id, name_french, types, abilities, hp, attack, defense, sp_attack, sp_defense, speed, description, height, weight, hires)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
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
      ]
    );

    res.status(201).json({ message: 'Pokémon bien ajouté' });
  } catch (error) {
    console.error('Erreur lors de l\'ajout du Pokémon :', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

const updatePokemon = async (req, res) => {
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

  try {
    await connection.query(
      `UPDATE pokemon SET name_french = ?, types = ?, abilities = ?, hp = ?, attack = ?, defense = ?, sp_attack = ?, sp_defense = ?, speed = ?, description = ?, height = ?, weight = ?, hires = ?
      WHERE id = ?`,
      [
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
        id,
      ]
    );

    res.json({ message: 'Pokémon mis à jour avec succès' });
  } catch (error) {
    console.error('Erreur lors de la mise à jour du Pokémon :', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

const deletePokemon = async (req, res) => {
  const { id } = req.params;
  try {
    await connection.query('DELETE FROM pokemon WHERE id = ?', [id]);
    res.json({ message: 'Pokémon supprimé avec succès' });
  } catch (error) {
    console.error('Erreur lors de la suppression du Pokémon :', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

const getLastId = async (req, res) => {
  try {
    const [rows] = await connection.query('SELECT MAX(id) AS lastId FROM pokemon');
    res.json({ lastId: rows[0].lastId || 0 });
  } catch (error) {
    console.error('Erreur lors de la récupération du dernier ID :', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

module.exports = { getPokemons, getPokemonById, addPokemon, updatePokemon, deletePokemon, getLastId };