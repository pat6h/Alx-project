const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const db = require('../db');
const bcrypt = require('bcrypt');

// Register
router.post('/register', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ msg: 'Missing fields' });
  const hash = await bcrypt.hash(password, 10);

  db.get('SELECT * FROM users WHERE username = ?', [username], (err, user) => {
    if (user) return res.status(400).json({ msg: 'User exists' });
    db.run('INSERT INTO users (username, password) VALUES (?, ?)', [username, hash], function(err) {
      if (err) return res.status(500).json({ msg: 'DB error' });
      res.json({ msg: 'Registered' });
    });
  });
});

// Login
router.post('/login', (req, res) => {
  const { username, password } = req.body;
  db.get('SELECT * FROM users WHERE username = ?', [username], async (err, user) => {
    if (!user) return res.status(400).json({ msg: 'No user' });
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ msg: 'Wrong password' });
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET || 'super_secret_key');
    res.json({ token });
  });
});

module.exports = router;

