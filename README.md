# Crypto Portfolio Tracker

A modern full-stack web application for tracking cryptocurrency investments in real time.

[View on GitHub](https://github.com/pat6h/Alx-project)

---

## Table of Contents

- [About](#about)
- [Features](#features)
- [Screenshots](#screenshots)
- [Tech Stack](#tech-stack)
- [Setup & Usage](#setup--usage)
- [API Key / Rate Limits](#api-key--rate-limits)
- [Troubleshooting](#troubleshooting)
- [Credits](#credits)

---

## About

This Crypto Portfolio Tracker was developed by **Ayoub Zeroual** as a final project for the ALX Software Engineering program.

It allows users to:
- Track their crypto portfolio
- View live prices and top coins
- Add, edit, convert, and delete assets
- See pie chart allocation and profit/loss analytics
- Register/login securely with JWT authentication

---

## Features

- **User Authentication:** Register and login securely
- **Portfolio Management:** Add, update, convert, and delete cryptocurrencies
- **Live Price Data:** Real-time prices (uses CoinGecko API)
- **Analytics:** See allocation (pie chart), performance, P/L, and more
- **Top Coins Page:** Live prices for the top 20 cryptos
- **Modern UI:** Responsive, animated, and visually appealing

---

## Tech Stack

- **Frontend:** React (with Axios, Recharts, Framer Motion)
- **Backend:** Node.js (Express)
- **Database:** SQLite (for user data and portfolios)
- **Authentication:** JWT tokens (stateless)
- **APIs:** [CoinGecko Public API](https://www.coingecko.com/en/api)

---

### Prerequisites

- Node.js & npm

### 1. **Clone the repo**

git clone https://github.com/pat6h/Alx-project.git
cd Alx-project

2. Install backend dependencies

cd backend
 npm install
 npm start
 This will start the API at http://localhost:5000

4. Install frontend dependencies
Open a new terminal:

cd ../frontend
 npm install
 npm start
 This will start the frontend at http://localhost:3000


4. Usage
Register a new account

Add your crypto coins and amounts (must use correct CoinGecko IDs!)

View, convert, and manage your portfolio

Check analytics and top coins

API Key / Rate Limits
This app uses CoinGecko's free public API for live data.
Warning: CoinGecko enforces strict rate limits.

Avoid rapid reloading or running multiple browser tabs.

If you see "rate limit" errors, wait a minute before trying again.

For production, consider using your own CoinGecko API key or another crypto API.

Troubleshooting
Live prices or analytics show blank or errors:
You have hit the CoinGecko rate limit. Wait a minute and reload, or limit usage.

Cannot add a coin:
Make sure you are using a correct CoinGecko ID (see https://www.coingecko.com/en/coins/all)

Backend errors:
Ensure your database and backend are running with npm start in the /backend folder.

Credits
Ayoub Zeroual — Developer (@pat6h on GitHub)

ALX Software Engineering Program — Capstone Project

CoinGecko API for live crypto data

License
This project is for educational use as part of the ALX SE program.
