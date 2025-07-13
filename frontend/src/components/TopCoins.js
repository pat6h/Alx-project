import React, { useEffect, useState } from "react";
import axios from "axios";

export default function TopCoins() {
  const [coins, setCoins] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCoins = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get(
          "https://api.coingecko.com/api/v3/coins/markets",
          {
            params: {
              vs_currency: "usd",
              order: "market_cap_desc",
              per_page: 20,
              page: 1,
            },
          }
        );
        setCoins(data);
        setLoading(false);
      } catch {
        setLoading(false);
      }
    };

    fetchCoins();
    const interval = setInterval(fetchCoins, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{
      background: "rgba(20, 25, 40, 0.93)",
      padding: 28,
      borderRadius: 18,
      boxShadow: "0 8px 40px #0006",
      maxWidth: 900,
      margin: "32px auto"
    }}>
      <h2 style={{ color: "#ffe484", marginBottom: 22, fontWeight: 700 }}>Top 20 Coins (Live)</h2>
      {loading ? (
        <div style={{ color: "#36d1c4" }}>Loading...</div>
      ) : (
        <table style={{ width: "100%", borderRadius: 10, background: "#172036cc", color: "#fff" }}>
          <thead>
            <tr>
              <th style={{ color: "#ffe484", textAlign: "left" }}>#</th>
              <th style={{ color: "#ffe484", textAlign: "left" }}>Coin</th>
              <th style={{ color: "#ffe484" }}>Price (USD)</th>
              <th style={{ color: "#ffe484" }}>24h %</th>
              <th style={{ color: "#ffe484" }}>Market Cap</th>
            </tr>
          </thead>
          <tbody>
            {coins.map((c, idx) => (
              <tr key={c.id}>
                <td>{idx + 1}</td>
                <td style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <img src={c.image} alt={c.symbol} width={24} />
                  <b>{c.name}</b>
                  <span style={{ color: "#b0e1f7", marginLeft: 4, fontWeight: 400 }}>{c.symbol.toUpperCase()}</span>
                </td>
                <td>${c.current_price.toLocaleString()}</td>
                <td style={{ color: c.price_change_percentage_24h > 0 ? "#28e17a" : "#ff6677" }}>
                  {c.price_change_percentage_24h?.toFixed(2)}%
                </td>
                <td>${c.market_cap.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

