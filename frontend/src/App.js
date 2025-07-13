import React, { useState } from "react";
import Auth from "./components/Auth";
import Portfolio from "./components/Portfolio";
import TopCoins from "./components/TopCoins";
import Analytics from "./components/Analytics";

function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [page, setPage] = useState("dashboard");

  const handleLogin = (tk) => {
    localStorage.setItem("token", tk);
    setToken(tk);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setPage("dashboard");
  };

  if (!token)
    return (
      <div style={{
        minHeight: "100vh",
        background: "linear-gradient(120deg, #232526 0%, #414345 40%, #36d1c4 100%)"
      }}>
        <Auth onLogin={handleLogin} />
      </div>
    );

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(120deg, #232526 0%, #414345 40%, #36d1c4 100%)"
    }}>
      <nav style={{ textAlign: "center", padding: 20 }}>
        <button onClick={() => setPage("dashboard")}
          style={{
            background: page === "dashboard" ? "#36a2eb" : "#232a3a",
            color: "#ffe484",
            border: "none",
            borderRadius: 8,
            padding: "10px 22px",
            marginRight: 6,
            fontWeight: 700,
            fontSize: 17,
            cursor: "pointer"
          }}>
          Portfolio
        </button>
        <button onClick={() => setPage("topcoins")}
          style={{
            background: page === "topcoins" ? "#36a2eb" : "#232a3a",
            color: "#ffe484",
            border: "none",
            borderRadius: 8,
            padding: "10px 22px",
            marginRight: 6,
            fontWeight: 700,
            fontSize: 17,
            cursor: "pointer"
          }}>
          Top Coins
        </button>
        <button onClick={() => setPage("analytics")}
          style={{
            background: page === "analytics" ? "#36a2eb" : "#232a3a",
            color: "#ffe484",
            border: "none",
            borderRadius: 8,
            padding: "10px 22px",
            fontWeight: 700,
            fontSize: 17,
            cursor: "pointer"
          }}>
          Analytics
        </button>
        <button onClick={logout}
          style={{
            float: "right",
            background: "#ffe484",
            color: "#222a36",
            border: "none",
            borderRadius: 8,
            padding: "10px 22px",
            fontWeight: 700,
            fontSize: 17,
            cursor: "pointer",
            marginLeft: 16
          }}>
          Logout
        </button>
      </nav>
      {page === "dashboard" && <Portfolio token={token} />}
      {page === "topcoins" && <TopCoins />}
      {page === "analytics" && <Analytics token={token} />}
    </div>
  );
}

export default App;

