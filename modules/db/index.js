const { createPool } = require('mysql2/promise');

const db = createPool({
  host: process.env.HOST,
  user: process.env.USER,
  password: process.env.PASS,
  database: process.env.DB,
});

module.exports = db;
