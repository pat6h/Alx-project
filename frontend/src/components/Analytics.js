import React, { useEffect, useState } from "react";
import axios from "axios";

export default function Analytics({ token }) {
  const [portfolio, setPortfolio] = useState([]);
  const [prices, setPrices] = useState({});
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    const fetchPortfolio = async () => {
      const { data } = await axios.get('http://localhost:5000/api/portfolio', { headers });
      setPortfolio(data);
      if (data.length) fetchPrices(data.map(x => x.symbol));
    };
    const fetchPrices = async (symbols) => {
      const { data } = await axios.post('http://localhost:5000/api/portfolio/prices', { symbols }, { headers });
      setPrices(data);
    };
    fetchPortfolio();
  }, [token, headers]);

  return (
    <div style={{
      background: "rgba(20, 25, 40, 0.93)",
      padding: 30,
      borderRadius: 20,
      maxWidth: 800,
      margin: "38px auto",
      color: "#fff",
      boxShadow: "0 8px 40px #0006"
    }}>
      <h2 style={{ color: "#ffe484", marginBottom: 20 }}>Portfolio Analytics</h2>
      <table style={{ width: "100%", background: "#172036cc", borderRadius: 10 }}>
        <thead>
          <tr>
            <th style={{ color: "#ffe484" }}>Coin</th>
            <th style={{ color: "#ffe484" }}>Amount</th>
            <th style={{ color: "#ffe484" }}>Date Added</th>
            <th style={{ color: "#ffe484" }}>Initial Price</th>
            <th style={{ color: "#ffe484" }}>Current Price</th>
            <th style={{ color: "#ffe484" }}>Initial Value</th>
            <th style={{ color: "#ffe484" }}>Current Value</th>
            <th style={{ color: "#ffe484" }}>P/L %</th>
          </tr>
        </thead>
        <tbody>
          {portfolio.map(item => {
            const initValue = (item.initial_price ?? 0) * (item.initial_amount ?? 0);
            const currValue = (prices[item.symbol]?.usd ?? 0) * item.amount;
            const gain = (currValue - initValue);
            const gainPct = initValue ? (gain / initValue) * 100 : 0;
            return (
              <tr key={item.symbol}>
                <td>{item.symbol}</td>
                <td>{item.amount}</td>
                <td>{item.date_added ? new Date(item.date_added).toLocaleString() : "-"}</td>
                <td>${item.initial_price ?? "-"}</td>
                <td>${prices[item.symbol]?.usd ?? "-"}</td>
                <td>${initValue ? initValue.toFixed(2) : "-"}</td>
                <td>${currValue ? currValue.toFixed(2) : "-"}</td>
                <td style={{ color: gainPct >= 0 ? "#2bff8a" : "#ff3b3b", fontWeight: 700 }}>
                  {gainPct ? gainPct.toFixed(2) : "0.00"}%
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

