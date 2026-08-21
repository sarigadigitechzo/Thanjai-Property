const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Basic Test Route
app.get('/api/health', (req, res) => {
  res.json({ status: 'success', message: 'Thanjai Property API is running' });
});

// Database Connection Test Route
app.get('/api/db-test', async (req, res) => {
  try {
    const db = require('./config/db');
    const [rows] = await db.query('SELECT 1 + 1 AS solution');
    res.json({ status: 'success', message: 'Database connected!', solution: rows[0].solution });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Database connection failed', error: error.message });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🌐 API Health Check: http://localhost:${PORT}/api/health`);
});
