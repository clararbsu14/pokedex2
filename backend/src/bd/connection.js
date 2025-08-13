const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: '127.0.0.1',   // IMPORTANT: 127.0.0.1 (pas "localhost")
  port: 8889,          // MySQL MAMP
  user: 'root',        // MAMP par défaut
  password: 'root',    // MAMP par défaut
  database: 'pokedex',
  waitForConnections: true,
  connectionLimit: 5,
});

module.exports = pool;


/* #demarrer le frontend 

cd frontend
npm install
npm run dev


#demarrer le backend 

cd /Users/clara/Downloads/pokedex-main/backend
npm install
npm run dev

*/ 