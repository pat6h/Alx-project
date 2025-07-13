const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

module.exports = (db) => {
  const router = express.Router();

  // Register
  router.post('/register', (req, res) => {
    const { username, password } = req.body;
    db.get('SELECT * FROM users WHERE username = ?', [username], (err, user) => {
      if (user) return res.status(400).json({ msg: 'Username already exists' });
      const hashed = bcrypt.hashSync(password, 10);
      db.run('INSERT INTO users (username, password) VALUES (?, ?)', [username, hashed], function(err) {
        if (err) return res.status(500).json({ msg: 'Server error' });
        res.json({ msg: 'Registered!' });
      });
    });
  });

  // Login
  router.post('/login', (req, res) => {
    const { username, password } = req.body;
    db.get('SELECT * FROM users WHERE username = ?', [username], (err, user) => {
      if (!user) return res.status(400).json({ msg: 'Invalid credentials' });
      if (!bcrypt.compareSync(password, user.password)) return res.status(400).json({ msg: 'Invalid credentials' });
      const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '24h' });
      res.json({ token });
    });
  });

  return router;
};

