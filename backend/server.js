const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const sqlite3 = require('sqlite3').verbose();

dotenv.config();

const app = express();
const db = new sqlite3.Database('./db.sqlite');
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Create tables if they don't exist
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE,
    password TEXT
  )`);
  db.run(`CREATE TABLE IF NOT EXISTS portfolio (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    symbol TEXT,
    amount REAL,
    FOREIGN KEY(user_id) REFERENCES users(id)
  )`);
});

// Routes
const authRoutes = require('./routes/auth')(db);
const portfolioRoutes = require('./routes/portfolio')(db);

app.use('/api/auth', authRoutes);
app.use('/api/portfolio', portfolioRoutes);

app.listen(PORT, () => console.log(`Backend running on http://localhost:${PORT}`));

