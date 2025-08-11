const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

// Connexion MySQL MAMP (port 8889)
const connection = mysql.createPool({
  host: '127.0.0.1',
  port: 8889,                 // MAMP
  user: 'pokedex_user',
  password: 'password123',
  database: 'pokedex',       // ← mets "pokedex" si ta DB s'appelle ainsi
  waitForConnections: true,
  connectionLimit: 5,
});

async function insertPokemon(pokemon) {
  const { id, name, type, base = {}, description = null, profile = {}, image = {} } = pokemon;

  // Déjà présent ?
  const [existingPokemon] = await connection.query('SELECT id FROM pokemon WHERE id = ?', [id]);
  if (existingPokemon.length > 0) return;

  // Données à insérer
  const types = Array.isArray(type) ? type.join(',') : null;
  const abilities = Array.isArray(profile?.ability)
    ? profile.ability
      .map(([abilityName, isHidden]) => `${abilityName}${isHidden === 'true' ? '(hidden)' : ''}`)
      .join(',')
    : null;

  await connection.query(
    `INSERT INTO pokemon (
      id, name_french, types, abilities, hp, attack, defense, sp_attack, sp_defense, speed, description, height, weight, hires
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      id,
      name?.french ?? null,
      types,
      abilities,
      base.HP ?? null,
      base.Attack ?? null,
      base.Defense ?? null,
      base['Sp. Attack'] ?? null,
      base['Sp. Defense'] ?? null,
      base.Speed ?? null,
      description ?? null,
      profile.height ?? null,
      profile.weight ?? null,
      image.hires ?? null,
    ]
  );
}

async function importData() {
  try {
    // pokedex.json (dans backend OU à la racine)
    const candidates = [
      path.join(__dirname, 'pokedex.json'),
      path.join(__dirname, '..', 'pokedex.json'),
    ];
    const dataPath = candidates.find(p => fs.existsSync(p));
    if (!dataPath) throw new Error('pokedex.json introuvable');
    const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

    for (const pokemon of data) {
      await insertPokemon(pokemon);
    }
    console.log('Importation des données terminée avec succès.');

    // créer un user après import si nécessaire
    exec('node create_user.js', (error, stdout, stderr) => {
      if (error) return console.error(`Erreur create_user.js : ${error.message}`);
      if (stderr) return console.error(`Erreur : ${stderr}`);
      console.log(`create_user.js exécuté : ${stdout}`);
    });
  } catch (err) {
    console.error("Erreur lors de l'importation des données :", err);
  } finally {
    try { await connection.end(); } catch { }
  }
}

importData().catch(err => console.error(err));
