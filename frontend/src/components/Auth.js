import React, { useState } from "react";
import axios from "axios";

export default function Auth({ onLogin }) {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");

  const handleAuth = async (e) => {
    e.preventDefault();
    setMsg("...");
    try {
      const url = `http://localhost:5000/api/auth/${isLogin ? "login" : "register"}`;
      const { data } = await axios.post(url, { username, password });
      if (isLogin && data.token) {
        setMsg("Logged in!");
        onLogin(data.token);
      } else if (!isLogin) {
        setMsg("Registered! You can login now.");
        setIsLogin(true);
      }
    } catch (err) {
      setMsg(err.response?.data?.msg || "Auth error");
    }
  };

  return (
    <div style={{
      maxWidth: 350, margin: "100px auto", background: "#21243a", padding: 28,
      borderRadius: 16, color: "#ffe484", boxShadow: "0 2px 24px #0008"
    }}>
      <h2 style={{ textAlign: "center" }}>{isLogin ? "Login" : "Register"}</h2>
      <form onSubmit={handleAuth} style={{ display: "flex", flexDirection: "column", gap: 14, marginTop: 22 }}>
        <input
          type="text"
          placeholder="Username"
          autoFocus
          value={username}
          onChange={e => setUsername(e.target.value)}
          style={{ borderRadius: 8, border: "1px solid #36d1c4", padding: 9, background: "#292e49", color: "#fff" }}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          style={{ borderRadius: 8, border: "1px solid #36d1c4", padding: 9, background: "#292e49", color: "#fff" }}
          required
        />
        <button type="submit"
          style={{ borderRadius: 8, border: "none", background: "#36d1c4", color: "#222", padding: "10px 0", fontWeight: 700, fontSize: 18, cursor: "pointer" }}>
          {isLogin ? "Login" : "Register"}
        </button>
      </form>
      <div style={{ margin: "18px 0 7px 0", color: "#2bff8a", minHeight: 18, textAlign: "center" }}>{msg}</div>
      <div style={{ textAlign: "center", color: "#b0e1f7", cursor: "pointer" }}
        onClick={() => setIsLogin(!isLogin)}>
        {isLogin ? "Need an account? Register" : "Already registered? Login"}
      </div>
    </div>
  );
}

