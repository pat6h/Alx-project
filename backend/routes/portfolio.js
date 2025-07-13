const express = require('express');
const axios = require('axios');
const auth = require('../middleware/auth');

module.exports = (db) => {
  const router = express.Router();

  // Get user's portfolio
  router.get('/', auth, (req, res) => {
    db.all('SELECT symbol, amount FROM portfolio WHERE user_id = ?', [req.user], (err, rows) => {
      if (err) return res.status(500).json({ msg: 'Error' });
      res.json(rows);
    });
  });

  // Add/update crypto in portfolio
  router.post('/', auth, (req, res) => {
    const { symbol, amount } = req.body;
    db.get('SELECT * FROM portfolio WHERE user_id = ? AND symbol = ?', [req.user, symbol], (err, row) => {
      if (row) {
        db.run('UPDATE portfolio SET amount = ? WHERE user_id = ? AND symbol = ?', [amount, req.user, symbol]);
      } else {
        db.run('INSERT INTO portfolio (user_id, symbol, amount) VALUES (?, ?, ?)', [req.user, symbol, amount]);
      }
      res.json({ msg: 'Updated' });
    });
  });

  // Get current crypto prices (CoinGecko API)
  router.post('/prices', auth, async (req, res) => {
    try {
      const { symbols } = req.body; // e.g. ['bitcoin', 'ethereum']
      const ids = symbols.join('%2C');
      const url = `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd`;
      const { data } = await axios.get(url);
      res.json(data);
    } catch {
      res.status(500).json({ msg: 'API error' });
    }
  });

  return router;
};

