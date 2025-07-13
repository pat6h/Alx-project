import React, { useState } from 'react';
import Auth from './components/Auth';
import Portfolio from './components/Portfolio';
import { motion } from 'framer-motion';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));

  const handleLogin = (tk) => {
    localStorage.setItem('token', tk);
    setToken(tk);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(120deg, #232526 0%, #414345 40%, #36d1c4 100%)",
      color: "#fff",
      fontFamily: "Segoe UI, Arial, sans-serif"
    }}>
      <motion.div
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        style={{ textAlign: "center", padding: "32px 0 0 0" }}
      >
        <img src="/logo192.png" alt="Logo" width={90} style={{ marginBottom: 16 }} />
        <motion.h1
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.8 }}
          style={{
            fontWeight: "bold",
            fontSize: "2.7rem",
            letterSpacing: 1,
            marginBottom: 10,
            color: "#ffe484",
            textShadow: "0 2px 16px #1a1a1a50"
          }}
        >
          Crypto Portfolio Tracker 🚀
        </motion.h1>
        <p style={{ color: "#b0b5b7" }}>
          Monitor your investments live.<br />
          Modern gradient style, animated cards, and real-time crypto icons!
        </p>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9 }}
        style={{
          background: "rgba(20, 25, 40, 0.93)",
          margin: "32px auto 0",
          padding: 32,
          borderRadius: 20,
          boxShadow: "0 8px 40px #0008",
          maxWidth: 580
        }}
      >
        {!token ? (
          <Auth onLogin={handleLogin} />
        ) : (
          <Portfolio token={token} logout={logout} />
        )}
      </motion.div>
    </div>
  );
}

export default App;
