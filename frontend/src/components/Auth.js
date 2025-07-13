import React, { useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';

export default function Auth({ onLogin }) {
  const [mode, setMode] = useState('login');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (mode === 'login') {
        const { data } = await axios.post('http://localhost:5000/api/auth/login', { username, password });
        onLogin(data.token);
      } else {
        await axios.post('http://localhost:5000/api/auth/register', { username, password });
        setMsg('Registered! You can now log in.');
        setMode('login');
      }
    } catch (err) {
      setMsg(err.response?.data?.msg || 'Error');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7 }}
      style={{
        maxWidth: 350,
        margin: "0 auto",
        background: "rgba(28,36,54,0.93)",
        padding: "36px 30px 30px 30px",
        borderRadius: 18,
        boxShadow: "0 8px 40px #0006",
        color: "#fff"
      }}
    >
      <motion.h2
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5 }}
        style={{
          color: "#ffe484",
          fontWeight: "bold",
          fontSize: 28,
          marginBottom: 8,
          letterSpacing: 1
        }}
      >
        {mode === 'login' ? 'Sign in' : 'Create Account'}
      </motion.h2>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 18, marginTop: 22 }}>
        <input
          placeholder="Username"
          value={username}
          onChange={e => setUsername(e.target.value)}
          autoComplete="username"
          required
          style={{
            padding: "11px 12px",
            borderRadius: 7,
            border: "1.2px solid #36d1c4",
            fontSize: 16,
            background: "#252b38",
            color: "#fff"
          }}
        />
        <input
          placeholder="Password"
          type="password"
          value={password}
          autoComplete="current-password"
          onChange={e => setPassword(e.target.value)}
          required
          style={{
            padding: "11px 12px",
            borderRadius: 7,
            border: "1.2px solid #36d1c4",
            fontSize: 16,
            background: "#252b38",
            color: "#fff"
          }}
        />
        <motion.button
          type="submit"
          whileHover={{ scale: 1.04, backgroundColor: "#36d1c4", color: "#232c31" }}
          whileTap={{ scale: 0.98 }}
          style={{
            background: "#36a2eb",
            color: "#fff",
            border: "none",
            borderRadius: 8,
            padding: "12px 0",
            fontWeight: 700,
            fontSize: 18,
            letterSpacing: 1,
            marginTop: 6,
            cursor: "pointer",
            boxShadow: "0 1px 6px #232a3a40"
          }}
        >
          {mode === 'login' ? 'Login' : 'Register'}
        </motion.button>
      </form>
      <button
        onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setMsg(''); }}
        style={{
          marginTop: 18,
          background: "none",
          border: "none",
          color: "#36d1c4",
          textDecoration: "underline",
          cursor: "pointer",
          fontWeight: 500,
          fontSize: 15
        }}
      >
        {mode === 'login' ? 'No account? Create one' : 'Have an account? Sign in'}
      </button>
      <div style={{ color: msg.includes("Registered") ? "#2bff8a" : "#ff6677", marginTop: 7, minHeight: 24, textAlign: "center" }}>{msg}</div>
    </motion.div>
  );
}

