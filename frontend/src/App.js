import React, { useState } from 'react';
import Auth from './components/Auth';
import Portfolio from './components/Portfolio';

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
    <div>
      <h1>Crypto Portfolio Tracker</h1>
      {!token ? (
        <Auth onLogin={handleLogin} />
      ) : (
        <Portfolio token={token} logout={logout} />
      )}
    </div>
  );
}

export default App;

