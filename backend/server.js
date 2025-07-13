const express = require('express');
const cors = require('cors');
const app = express();
require('dotenv').config();

const authRoutes = require('./routes/auth');
const portfolioRoutes = require('./routes/portfolio');

app.use(cors());
app.use(express.json());

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/portfolio', portfolioRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log('Backend running on port', PORT);
});

