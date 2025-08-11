const mysql = require('mysql2/promise');

const connection = mysql.createPool({
  host: 'localhost',
  user: 'pokedex_user',
  password: 'password123',
  database: 'pokedex',
});

module.exports = connection;