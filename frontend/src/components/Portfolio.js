import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Chart from './Chart';

// Default coins with icons
const defaultCoins = [
  { id: 'bitcoin', name: 'Bitcoin', icon: '/coins/bitcoin.png' },
  { id: 'ethereum', name: 'Ethereum', icon: '/coins/ethereum.png' },
  { id: 'solana', name: 'Solana', icon: '/coins/solana.png' },
  { id: 'dogecoin', name: 'Dogecoin', icon: '/coins/dogecoin.png' }
];

export default function Portfolio({ token }) {
  const [portfolio, setPortfolio] = useState([]);
  const [prices, setPrices] = useState({});
  const [symbol, setSymbol] = useState('bitcoin');
  const [amount, setAmount] = useState('');
  const [msg, setMsg] = useState('');
  const [apiError, setApiError] = useState('');
  const [customCoin, setCustomCoin] = useState('');
  const [coinList, setCoinList] = useState([...defaultCoins]);
  const [converting, setConverting] = useState(null);
  const [convertTo, setConvertTo] = useState('bitcoin');
  const [convertAmount, setConvertAmount] = useState('');
  const [convertMsg, setConvertMsg] = useState('');
  const [deleteQueue, setDeleteQueue] = useState([]); // for 3s delete animation

  const headers = { Authorization: `Bearer ${token}` };

  // Fetch portfolio and set up coinList
  const fetchPortfolio = async () => {
    try {
      const { data } = await axios.get('http://localhost:5000/api/portfolio', { headers });
      setPortfolio(data);
      // Add custom coins to coinList
      const notInList = data.filter(
        x => !coinList.find(c => c.id === x.symbol)
      ).map(x => ({ id: x.symbol, name: x.symbol.charAt(0).toUpperCase() + x.symbol.slice(1), icon: '/coins/coin-default.png' }));
      if (notInList.length) setCoinList([...defaultCoins, ...notInList]);
      if (data.length) fetchPrices(data.map(x => x.symbol));
      else setPrices({});
    } catch (error) {
      setApiError('Could not load your portfolio.');
    }
  };

  // Fetch prices for listed symbols (called only on load/portfolio change)
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
    } catch (error) {
      setApiError('Could not fetch live prices. ' + (error?.response?.data?.msg ? error.response.data.msg : ''));
    }
  };

  useEffect(() => {
    fetchPortfolio();
    // eslint-disable-next-line
  }, []);

  // Remove interval: only call fetchPrices in fetchPortfolio or after add/delete/convert

  // Add/Update coin
  const handleAdd = async (e) => {
    e.preventDefault();
    let coinToAdd = symbol === 'custom' ? customCoin.trim().toLowerCase() : symbol;
    if (!coinToAdd) return setMsg('Please enter a coin id!');
    if (!amount || isNaN(amount) || amount <= 0) return setMsg('Please enter a valid amount!');
    try {
      await axios.post(
        'http://localhost:5000/api/portfolio',
        { symbol: coinToAdd, amount: parseFloat(amount) },
        { headers }
      );
      setMsg('Updated!');
      setAmount('');
      setSymbol('bitcoin');
      setCustomCoin('');
      if (!coinList.find(c => c.id === coinToAdd)) {
        setCoinList([...coinList, { id: coinToAdd, name: coinToAdd.charAt(0).toUpperCase() + coinToAdd.slice(1), icon: '/coins/coin-default.png' }]);
      }
      fetchPortfolio();
    } catch (error) {
      setMsg('Failed to update portfolio.' + (error?.response?.data?.msg ? ' ' + error.response.data.msg : ''));
    }
  };

  // Handle Delete with animation
  const handleDelete = async (symbol) => {
    setDeleteQueue((dq) => [...dq, symbol]);
    setTimeout(async () => {
      try {
        await axios.delete('http://localhost:5000/api/portfolio', { headers, data: { symbol } });
        setMsg('Coin deleted.');
        fetchPortfolio();
      } catch {
        setMsg('Could not delete.');
      }
      setDeleteQueue((dq) => dq.filter((s) => s !== symbol));
    }, 3000); // 3 seconds
  };

  // Convert coin logic: user can only convert coins they have (except target)
  const handleConvert = async (e) => {
    e.preventDefault();
    setConvertMsg('Converting...');
    try {
      const res = await axios.post('http://localhost:5000/api/portfolio/convert', {
        fromSymbol: converting,
        toSymbol: convertTo,
        amount: parseFloat(convertAmount)
      }, { headers });
      setConvertMsg(`Converted! You received ≈ ${res.data.toAmount.toFixed(8)} ${convertTo.toUpperCase()}.`);
      setConverting(null);
      fetchPortfolio();
    } catch (err) {
      setConvertMsg(err.response?.data?.msg || "Error");
    }
  };

  const totalValue = portfolio.reduce((sum, item) => {
    const price = prices[item.symbol]?.usd || 0;
    return sum + (item.amount * price);
  }, 0);

  // Filter available coins for convert dropdown
  const availableCoins = portfolio.map(x => x.symbol);

  return (
    <div>
      <h2 style={{ marginBottom: 22, fontWeight: 700, color: "#ffe484" }}>Your Portfolio</h2>
      <form onSubmit={handleAdd} style={{ marginBottom: 25, display: "flex", gap: 10 }}>
        <select value={symbol} onChange={e => setSymbol(e.target.value)}
          style={{ borderRadius: 7, padding: 8, minWidth: 130, background: "#232a3a", color: "#ffe484", fontWeight: 600, border: "1px solid #36d1c4" }}>
          {coinList.map(c => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
          <option value="custom">Add new coin...</option>
        </select>
        {symbol === 'custom' && (
          <input
            placeholder="CoinGecko coin id (e.g. pepe)"
            value={customCoin}
            onChange={e => setCustomCoin(e.target.value)}
            style={{ borderRadius: 6, padding: 6, minWidth: 120 }}
            required
          />
        )}
        <input
          type="number"
          placeholder="Amount"
          min="0"
          value={amount}
          onChange={e => setAmount(e.target.value)}
          style={{ borderRadius: 7, padding: 8, minWidth: 90, background: "#232a3a", color: "#fff", border: "1px solid #36d1c4" }}
        />
        <button
          type="submit"
          style={{
            background: "#36a2eb", color: "#fff", border: "none",
            borderRadius: 7, padding: "8px 22px", fontWeight: 700, cursor: "pointer"
          }}
        >Add / Update</button>
      </form>
      <div style={{ color: "#2bff8a", marginBottom: 12, minHeight: 16 }}>{msg}</div>
      {apiError && (
        <div style={{
          background: "#ffe6e6", color: "#d92b2b", border: "1px solid #fbb",
          borderRadius: 7, padding: "7px 13px", marginBottom: 14, fontWeight: 600, fontSize: 15
        }}>
          {apiError}
        </div>
      )}
      <div style={{ overflowX: "auto" }}>
        <table style={{
          width: "100%", background: "#16212fbb", borderRadius: 14,
          padding: 10, marginBottom: 16, boxShadow: "0 2px 10px #2ad7b833", borderCollapse: "collapse"
        }}>
          <thead>
            <tr>
              <th style={{ color: "#ffe484", textAlign: "left", padding: "8px 6px", fontWeight: 700, fontSize: "1rem" }}>Coin</th>
              <th style={{ color: "#ffe484", padding: "8px 6px" }}>Amount</th>
              <th style={{ color: "#ffe484", padding: "8px 6px" }}>Price (USD)</th>
              <th style={{ color: "#ffe484", padding: "8px 6px" }}>Value (USD)</th>
              <th style={{ color: "#ffe484", padding: "8px 6px" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {portfolio.map(item => (
              <tr key={item.symbol}
                style={{
                  transition: "background 0.18s, opacity 0.8s",
                  opacity: deleteQueue.includes(item.symbol) ? 0.3 : 1,
                  borderBottom: "1px solid #36d1c430",
                  background: "rgba(36, 223, 196, 0.04)"
                }}>
                <td style={{ display: "flex", alignItems: "center", gap: 8, padding: "7px 6px" }}>
                  <img
                    src={coinList.find(c => c.id === item.symbol)?.icon || '/coins/coin-default.png'}
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
                <td>
                  <button
                    onClick={() => {
                      setConverting(item.symbol);
                      setConvertTo(availableCoins.find(c => c !== item.symbol) || 'bitcoin');
                      setConvertAmount('');
                      setConvertMsg('');
                    }}
                    style={{
                      background: "#36a2eb", color: "#fff", border: "none", borderRadius: 7,
                      padding: "5px 10px", fontWeight: 600, cursor: "pointer"
                    }}
                  >
                    Convert
                  </button>
                  <button onClick={() => handleDelete(item.symbol)}
                    style={{
                      background: "none", border: "none", color: "#ff3b3b", cursor: "pointer", fontSize: 20, marginLeft: 6
                    }}
                    title="Delete"
                    disabled={deleteQueue.includes(item.symbol)}
                  >
                    🗑
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {converting && (
        <div style={{
          background: "#232a3a", color: "#fff", borderRadius: 10, padding: 18, margin: "20px auto", maxWidth: 420
        }}>
          <h4>Convert {converting.toUpperCase()}</h4>
          <form onSubmit={handleConvert}>
            <div>
              <label style={{ color: "#ffe484" }}>Amount:</label>
              <input type="number" min="0" max={portfolio.find(x => x.symbol === converting)?.amount || ''} value={convertAmount}
                onChange={e => setConvertAmount(e.target.value)}
                style={{ marginLeft: 7, borderRadius: 6, padding: 5, width: 90 }} required />
            </div>
            <div style={{ marginTop: 7 }}>
              <label style={{ color: "#ffe484" }}>To coin (you hold or any id):</label>
              <select value={convertTo} onChange={e => setConvertTo(e.target.value)}
                style={{ marginLeft: 7, borderRadius: 6, padding: 5, width: 140 }}>
                {coinList
                  .filter(c => c.id !== converting)
                  .map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
              </select>
            </div>
            <button type="submit"
              style={{ marginTop: 12, background: "#2bff8a", color: "#0f2027", border: "none", borderRadius: 7, padding: "7px 18px", fontWeight: 700, cursor: "pointer" }}>
              Confirm Convert
            </button>
            <button type="button" onClick={() => setConverting(null)}
              style={{ marginLeft: 9, color: "#ff3b3b", background: "none", border: "none", fontWeight: 700, cursor: "pointer" }}>
              Cancel
            </button>
            <div style={{ color: "#2bff8a", marginTop: 7 }}>{convertMsg}</div>
          </form>
        </div>
      )}
      <h3 style={{ color: "#ffe484", marginBottom: 20, marginTop: 0, letterSpacing: 1.2, textShadow: "0 2px 12px #1112" }}>
        Total Value: ${totalValue.toFixed(2)}
      </h3>
      <Chart data={portfolio} prices={prices} />
    </div>
  );
}

