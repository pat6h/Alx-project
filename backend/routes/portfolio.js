const express = require('express');
const router = express.Router();
const axios = require('axios');
const db = require('../db');
const auth = require('../middleware/auth');

// Add or update coin in portfolio
router.post('/', auth, async (req, res) => {
  const { symbol, amount } = req.body;
  if (!symbol || !amount || isNaN(amount) || amount <= 0) {
    return res.status(400).json({ msg: 'Invalid symbol or amount.' });
  }

  try {
    // For analytics: get current price
    const priceResp = await axios.get(
      `https://api.coingecko.com/api/v3/simple/price?ids=${symbol}&vs_currencies=usd`
    );
    const currentPrice = priceResp.data[symbol]?.usd ?? 0;

    db.get(
      'SELECT * FROM portfolio WHERE user_id = ? AND symbol = ?',
      [req.user, symbol],
      (err, row) => {
        if (err) return res.status(500).json({ msg: 'DB error' });

        const now = new Date().toISOString();

        if (!row) {
          // Insert new coin
          db.run(
            `INSERT INTO portfolio 
              (user_id, symbol, amount, date_added, initial_price, initial_amount)
             VALUES (?, ?, ?, ?, ?, ?)`,
            [req.user, symbol, amount, now, currentPrice, amount],
            function (err) {
              if (err) return res.status(500).json({ msg: 'Insert error' });
              res.json({ msg: 'Added', id: this.lastID });
            }
          );
        } else {
          // Update amount, keep analytics
          db.run(
            `UPDATE portfolio 
             SET amount = ?
             WHERE user_id = ? AND symbol = ?`,
            [amount, req.user, symbol],
            function (err) {
              if (err) return res.status(500).json({ msg: 'Update error' });
              res.json({ msg: 'Updated' });
            }
          );
        }
      }
    );
  } catch (err) {
    res.status(500).json({ msg: 'CoinGecko error', err: String(err) });
  }
});

// Get portfolio
router.get('/', auth, (req, res) => {
  db.all(
    `SELECT symbol, amount, date_added, initial_price, initial_amount
     FROM portfolio WHERE user_id = ?`,
    [req.user],
    (err, rows) => {
      if (err) return res.status(500).json({ msg: 'DB error' });
      res.json(rows);
    }
  );
});

// Get live prices for symbols (robust version, skips unknown coins, never 500s)
router.post('/prices', auth, async (req, res) => {
  try {
    let { symbols } = req.body;
    console.log('Fetching CoinGecko prices for symbols:', symbols);
    symbols = Array.from(new Set((symbols || []).map(x => x.trim().toLowerCase()))).filter(Boolean);
    if (!symbols.length) return res.json({});
    const ids = symbols.join('%2C');
    const url = `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd`;

    let data = {};
    try {
      const resp = await axios.get(url);
      data = resp.data;
    } catch (err) {
      // If CoinGecko fails (e.g., all symbols bad), just return empty object
      console.error('CoinGecko API error:', err?.response?.data || err.message);
      return res.json({});
    }

    // Only return valid price data
    const filtered = {};
    symbols.forEach((sym) => {
      if (data[sym] && data[sym].usd !== undefined) filtered[sym] = data[sym];
    });
    return res.json(filtered);
  } catch (err) {
    console.error('API error:', err);
    return res.json({}); // Never throw 500 here
  }
});

// Delete coin
router.delete('/', auth, (req, res) => {
  const { symbol } = req.body;
  if (!symbol) return res.status(400).json({ msg: 'Missing symbol' });

  db.run(
    'DELETE FROM portfolio WHERE user_id = ? AND symbol = ?',
    [req.user, symbol],
    function (err) {
      if (err) return res.status(500).json({ msg: 'Error deleting' });
      res.json({ msg: 'Deleted' });
    }
  );
});

// Coin-to-coin conversion
router.post('/convert', auth, async (req, res) => {
  const { fromSymbol, toSymbol, amount } = req.body;
  if (!fromSymbol || !toSymbol || !amount || isNaN(amount) || amount <= 0) {
    return res.status(400).json({ msg: 'Invalid input' });
  }

  try {
    // Get both prices
    const ids = [fromSymbol, toSymbol].join('%2C');
    const url = `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd`;

    let data = {};
    try {
      const resp = await axios.get(url);
      data = resp.data;
    } catch (err) {
      return res.status(400).json({ msg: 'Price fetch error' });
    }

    const fromPrice = data[fromSymbol]?.usd;
    const toPrice = data[toSymbol]?.usd;
    if (!fromPrice || !toPrice) return res.status(400).json({ msg: 'Price fetch error' });

    // Value in USD
    const usdValue = amount * fromPrice;
    // Amount of target coin
    const toAmount = usdValue / toPrice;

    db.get(
      'SELECT amount FROM portfolio WHERE user_id = ? AND symbol = ?',
      [req.user, fromSymbol],
      (err, row) => {
        if (err || !row || row.amount < amount) {
          return res.status(400).json({ msg: 'Not enough to convert' });
        }
        const newFromAmount = row.amount - amount;

        db.run('BEGIN TRANSACTION');
        if (newFromAmount <= 0) {
          db.run('DELETE FROM portfolio WHERE user_id = ? AND symbol = ?', [req.user, fromSymbol]);
        } else {
          db.run('UPDATE portfolio SET amount = ? WHERE user_id = ? AND symbol = ?', [newFromAmount, req.user, fromSymbol]);
        }

        db.get('SELECT * FROM portfolio WHERE user_id = ? AND symbol = ?', [req.user, toSymbol], (err2, toRow) => {
          const now = new Date().toISOString();
          if (!toRow) {
            db.run(
              `INSERT INTO portfolio 
                (user_id, symbol, amount, date_added, initial_price, initial_amount)
              VALUES (?, ?, ?, ?, ?, ?)`,
              [req.user, toSymbol, toAmount, now, toPrice, toAmount]
            );
          } else {
            db.run(
              'UPDATE portfolio SET amount = amount + ? WHERE user_id = ? AND symbol = ?',
              [toAmount, req.user, toSymbol]
            );
          }
          db.run('COMMIT');
          res.json({ msg: 'Converted', toAmount });
        });
      }
    );
  } catch (err) {
    res.status(500).json({ msg: 'Conversion error', err: String(err) });
  }
});

module.exports = router;

