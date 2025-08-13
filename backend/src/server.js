// backend/server.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const pokemonRoutes = require('./routes/pokemonRoutes');
const db = require('./bd/connection'); // mysql2/promise pool

const app = express();
app.use(cors());
app.use(bodyParser.json());

const JWT_SECRET = process.env.JWT_SECRET || 'change-me-in-.env';
const JWT_EXPIRES_IN = '1d';

// --- helpers
function signToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}
function auth(req, res, next) {
  const h = req.headers.authorization || '';
  const token = h.startsWith('Bearer ') ? h.slice(7) : null;
  if (!token) return res.status(401).json({ error: 'Token manquant' });
  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    return res.status(401).json({ error: 'Token invalide' });
  }
}

// --- sanity
app.get('/', (_req, res) => res.send('API up'));
app.get('/ping', (_req, res) => res.send('pong'));
app.get('/debug/db', async (_req, res) => {
  try {
    const [r] = await db.query('SELECT COUNT(*) AS n FROM pokemon');
    res.json(r[0]);
  } catch (e) {
    console.error('DEBUG/DB ERROR:', e);
    res.status(500).json({ error: e.message, code: e.code });
  }
});

// --- AUTH: signup (stocke un hash bcrypt dans "password")
app.post('/api/signup', async (req, res) => {
  const { email, password, role = 'user' } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'email et password requis' });

  try {
    const [exists] = await db.query('SELECT id FROM users WHERE email = ?', [email]);
    if (exists.length) return res.status(409).json({ error: 'Email déjà utilisé' });

    const hash = await bcrypt.hash(password, 10);
    await db.query(
      'INSERT INTO users (email, password, role, created_at) VALUES (?, ?, ?, NOW())',
      [email, hash, role]
    );

    const [rows] = await db.query('SELECT id, email, role FROM users WHERE email = ?', [email]);
    const user = rows[0];
    const token = signToken({ sub: user.id, email: user.email, role: user.role });
    res.json({ token, user });
  } catch (e) {
    console.error('SIGNUP ERROR:', e);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// --- AUTH: login (normalise email, gère hash OU clair, supprime CR/LF)
app.post('/api/login', async (req, res) => {
  const rawEmail = String(req.body.email ?? '');
  const email = rawEmail.trim().toLowerCase();
  const password = String(req.body.password ?? '');
  if (!email || !password) return res.status(400).json({ error: 'email et password requis' });

  try {
    const [rows] = await db.query(
      'SELECT id, email, role, password FROM users WHERE LOWER(email) = ? LIMIT 1',
      [email]
    );
    if (!rows.length) return res.status(401).json({ error: 'Identifiants invalides' });

    const user = rows[0];
    const stored = String(user.password || '').replace(/\r|\n/g, '').trim();
    const isBcrypt = stored.startsWith('$2a$') || stored.startsWith('$2b$') || stored.startsWith('$2y$');

    const ok = isBcrypt ? await bcrypt.compare(password, stored) : password === stored;
    if (!ok) return res.status(401).json({ error: 'Identifiants invalides' });

    const token = signToken({ sub: user.id, email: user.email, role: user.role });
    res.json({ token, user: { id: user.id, email: user.email, role: user.role } });
  } catch (e) {
    console.error('LOGIN ERROR:', e);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// --- routes métier
app.use('/api/pokemons', pokemonRoutes); // (protège add/update/delete dans pokemonRoutes avec "auth" si besoin)

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
