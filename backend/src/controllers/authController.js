const connection = require('../bd/connexion');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const login = async (req, res) => {
  const { email, password } = req.body;
  const [rows] = await connection.query('SELECT * FROM users WHERE email = ?', [email]);

  if (rows.length === 0) {
    return res.status(401).json({ message: 'Crédentials invalides' });
  }

  const user = rows[0];
  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    return res.status(401).json({ message: 'Crédentials invalides' });
  }

  const token = jwt.sign({ id: user.id, email: user.email }, 'secret', { expiresIn: '1h' });
  res.json({ token });
};

const register = async (req, res) => {
  const { email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  await connection.query('INSERT INTO users (email, password) VALUES (?, ?)', [email, hashedPassword]);
  res.status(201).json({ message: 'User enregistrés' });
};

module.exports = { login, register };