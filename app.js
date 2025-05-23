// backend/app.js
const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());
// Временный роут
app.get('/', (req, res) => {
  res.send('API działa!');
});

module.exports = app;

const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

const bookRoutes = require('./routes/books');
app.use('/api/books', bookRoutes);