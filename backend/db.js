const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const db = new sqlite3.Database(path.resolve(__dirname, 'crypto.db'), (err) => {
  if (err) console.error('DB open error:', err);
  else console.log('SQLite DB connected');
});

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE,
      password TEXT
    )
  `);
  db.run(`
    CREATE TABLE IF NOT EXISTS portfolio (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      symbol TEXT,
      amount REAL,
      date_added TEXT,
      initial_price REAL,
      initial_amount REAL
    )
  `);
});

module.exports = db;

