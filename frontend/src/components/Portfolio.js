import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Chart from './Chart';
import { motion } from 'framer-motion';

// Coin definitions (with icon paths)
const coins = [
  { id: 'bitcoin', name: 'Bitcoin', icon: '/coins/bitcoin.png' },
  { id: 'ethereum', name: 'Ethereum', icon: '/coins/ethereum.png' },
  { id: 'solana', name: 'Solana', icon: '/coins/solana.png' },
  { id: 'dogecoin', name: 'Dogecoin', icon: '/coins/dogecoin.png' }
];

export default function Portfolio({ token, logout }) {
  const [portfolio, setPortfolio] = useState([]);
  const [prices, setPrices] = useState({});
  const [symbol, setSymbol] = useState('bitcoin');
  const [amount, setAmount] = useState('');
  const [msg, setMsg] = useState('');
  const [apiError, setApiError] = useState('');

  const headers = { Authorization: `Bearer ${token}` };

  // Fetches the user's portfolio (initial and after changes)
  const fetchPortfolio = async () => {
    try {
      const { data } = await axios.get('http://localhost:5000/api/portfolio', { headers });
      setPortfolio(data);
      if (data.length) fetchPrices(data.map(x => x.symbol));
      else setPrices({});
    } catch (err) {
      setApiError('Could not load your portfolio.');
    }
  };

  // Fetches live crypto prices
  const fetchPrices = async (symbols) => {
    if (!symbols || !symbols.length) return;
    try {
      const { data } = await axios.post(
        'http://localhost:5000/api/portfolio/prices',
        { symbols },
        { headers }
      );
      setPrices(data);
      setApiError('');
    } catch (err) {
      setApiError('Could not fetch live prices. Please wait and try again.');
    }
  };

  // Fetch portfolio initially
  useEffect(() => {
    fetchPortfolio();
    // eslint-disable-next-line
  }, []);

  // Live price refresh every 3 seconds (safer for CoinGecko)
  useEffect(() => {
    if (!portfolio.length) return;
    const refresh = setInterval(() => {
      fetchPrices(portfolio.map(x => x.symbol));
    }, 3000); // 3 seconds
    return () => clearInterval(refresh);
    // eslint-disable-next-line
  }, [portfolio]);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!amount || isNaN(amount) || amount <= 0) {
      setMsg('Please enter a valid amount!');
      return;
    }
    try {
      await axios.post(
        'http://localhost:5000/api/portfolio',
        { symbol, amount: parseFloat(amount) },
        { headers }
      );
      setMsg('Updated!');
      setAmount('');
      fetchPortfolio();
    } catch (err) {
      setMsg('Failed to update portfolio.');
    }
  };

  const totalValue = portfolio.reduce((sum, item) => {
    const price = prices[item.symbol]?.usd || 0;
    return sum + (item.amount * price);
  }, 0);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6 }}
    >
      <motion.button
        whileHover={{ scale: 1.07, backgroundColor: "#ffe484", color: "#0f2027" }}
        whileTap={{ scale: 0.97 }}
        onClick={logout}
        style={{
          float: 'right',
          background: 'transparent',
          color: "#fff",
          border: '1.5px solid #ffe484',
          borderRadius: 7,
          padding: "6px 16px",
          cursor: "pointer",
          fontWeight: 600,
          marginBottom: 18,
          marginTop: 2,
          transition: "background 0.2s, color 0.2s"
        }}
      >Logout</motion.button>
      <h2 style={{ marginBottom: 22, letterSpacing: 1, fontWeight: 700, color: "#ffe484" }}>Your Portfolio</h2>
      <form onSubmit={handleAdd} style={{ marginBottom: 25, display: "flex", gap: 10 }}>
        <select value={symbol} onChange={e => setSymbol(e.target.value)}
          style={{
            borderRadius: 7,
            padding: 8,
            minWidth: 130,
            background: "#232a3a",
            color: "#ffe484",
            fontWeight: 600,
            border: "1px solid #36d1c4"
          }}>
          {coins.map(c => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
        <input
          type="number"
          placeholder="Amount"
          min="0"
          value={amount}
          onChange={e => setAmount(e.target.value)}
          style={{
            borderRadius: 7,
            padding: 8,
            minWidth: 90,
            background: "#232a3a",
            color: "#fff",
            border: "1px solid #36d1c4"
          }}
        />
        <motion.button
          whileHover={{ scale: 1.09, backgroundColor: "#36d1c4", color: "#232c31" }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          style={{
            background: "#36a2eb",
            color: "#fff",
            border: "none",
            borderRadius: 7,
            padding: "8px 22px",
            fontWeight: 700,
            cursor: "pointer",
            letterSpacing: 1,
            boxShadow: "0 1px 6px #232a3a40"
          }}
        >Add / Update</motion.button>
      </form>
      <div style={{ color: "#2bff8a", marginBottom: 12, minHeight: 16 }}>{msg}</div>
      {apiError && (
        <div style={{
          background: "#ffe6e6",
          color: "#d92b2b",
          border: "1px solid #fbb",
          borderRadius: 7,
          padding: "7px 13px",
          marginBottom: 14,
          fontWeight: 600,
          fontSize: 15
        }}>
          {apiError}
        </div>
      )}
      <div style={{ overflowX: "auto" }}>
        <table style={{
          width: "100%",
          background: "#16212fbb",
          borderRadius: 14,
          padding: 10,
          marginBottom: 16,
          boxShadow: "0 2px 10px #2ad7b833",
          borderCollapse: "collapse"
        }}>
          <thead>
            <tr>
              <th style={{
                color: "#ffe484",
                textAlign: "left",
                padding: "8px 6px",
                fontWeight: 700,
                fontSize: "1rem"
              }}>Coin</th>
              <th style={{
                color: "#ffe484", padding: "8px 6px"
              }}>Amount</th>
              <th style={{
                color: "#ffe484", padding: "8px 6px"
              }}>Price (USD)</th>
              <th style={{
                color: "#ffe484", padding: "8px 6px"
              }}>Value (USD)</th>
            </tr>
          </thead>
          <tbody>
            {portfolio.map(item => (
              <tr key={item.symbol}
                style={{
                  transition: "background 0.18s",
                  borderBottom: "1px solid #36d1c430",
                  background: "rgba(36, 223, 196, 0.04)"
                }}
              >
                <td style={{ display: "flex", alignItems: "center", gap: 8, padding: "7px 6px" }}>
                  <img
                    src={coins.find(c => c.id === item.symbol)?.icon}
                    alt={item.symbol}
                    width={26}
                    height={26}
                    style={{
                      borderRadius: 5,
                      border: "1px solid #282c34",
                      background: "#fff",
                      boxShadow: "0 2px 8px #1113"
                    }}
                  />
                  <b style={{ color: "#ffe484" }}>{item.symbol}</b>
                </td>
                <td style={{ color: "#fff", fontWeight: 500 }}>{item.amount}</td>
                <td style={{ color: "#b0e1f7" }}>{prices[item.symbol]?.usd || '-'}</td>
                <td style={{ color: "#2bff8a", fontWeight: 600 }}>
                  {((prices[item.symbol]?.usd || 0) * item.amount).toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <h3 style={{
        color: "#ffe484",
        marginBottom: 20,
        marginTop: 0,
        letterSpacing: 1.2,
        textShadow: "0 2px 12px #1112"
      }}>
        Total Value: ${totalValue.toFixed(2)}
      </h3>
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9 }}>
        <Chart data={portfolio} prices={prices} />
      </motion.div>
    </motion.div>
  );
}

