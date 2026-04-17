const express = require('express');
const cors = require('cors');
const { errorMiddleware } = require('./utils/ErrorHandler');
const app = express();
const port = 3000;

// MIDDLEWARE
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
}));
app.use(express.json());

// ROUTES
const filmRoutes = require('./routes/api');
const authRoutes = require('./routes/auth');

app.use('/', filmRoutes);
app.use('/auth', authRoutes);

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