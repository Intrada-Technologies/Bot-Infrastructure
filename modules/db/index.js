const { createPool } = require('mysql2/promise');

const db = createPool({
  host: process.env.HOST,
  user: process.env.MYUSER,
  password: process.env.MYPASS,
  database: process.env.DB,
});

module.exports = db;
