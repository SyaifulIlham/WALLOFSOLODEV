const express = require('express');
require('dotenv').config();
const cors = require('cors');
const { errorMiddleware } = require('./utils/ErrorHandler');
const app = express();
const port = process.env.PORT || 3000;

// MIDDLEWARE
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    credentials: true
}));
app.use(express.json());

// ROUTES
const apiRoutes = require('./routes/api');

app.use('/', apiRoutes);
// 404 handler for unknown routes
app.use((req, res, next) => {
  const error = new Error('Route tidak ditemukan');
  error.statusCode = 404;
  next(error);
});

// Centralized error handler
app.use(errorMiddleware);

app.listen(port, () => {
  console.log(`Soloflixx server berjalan di http://localhost:${port}`);
});

