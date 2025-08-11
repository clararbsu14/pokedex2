const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');

// Connexion MySQL (MAMP)
const pool = mysql.createPool({
  host: '127.0.0.1',
  port: 8889,                // MAMP
  user: 'pokedex_user',
  password: 'password123',
  database: 'pokedex',       // ta base
  waitForConnections: true,
  connectionLimit: 5,
});

async function createAdminUser(email, password) {
  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    // Existe déjà ?
    const [existing] = await pool.query('SELECT id FROM users WHERE email = ?', [email]);
    if (existing.length > 0) {
      console.log(`Un utilisateur avec l'email "${email}" existe déjà.`);
      return;
    }

    // Création
    await pool.query(
      'INSERT INTO users (email, password, role) VALUES (?, ?, ?)',
      [email, hashedPassword, 'admin']
    );

    console.log(`Utilisateur admin créé avec succès : ${email}`);
  } catch (error) {
    console.error("Erreur lors de la création de l'utilisateur admin :", error);
  } finally {
    try { await pool.end(); } catch { }
  }
}

// Valeurs par défaut (modifiable via variables d'env si tu veux)
const email = process.env.ADMIN_EMAIL || 'admin@example.com';
const password = process.env.ADMIN_PASSWORD || 'admin123';

createAdminUser(email, password);
