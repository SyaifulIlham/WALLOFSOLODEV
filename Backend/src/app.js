const express = require('express');
require('dotenv').config();
const cors = require('cors');
const { errorMiddleware } = require('./utils/ErrorHandler');
const apiRoutes = require('./routes/api');

const app = express();
const port = process.env.PORT || 3000;

app.disable('x-powered-by');

app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    status: 'ok',
    timestamp: new Date().toISOString()
  });
});

app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'SoloFlix API berjalan',
    version: '1.0.0'
  });
});

app.use('/', apiRoutes);

app.use((req, res, next) => {
  const error = new Error('Route tidak ditemukan');
  error.statusCode = 404;
  next(error);
});

app.use(errorMiddleware);

if (require.main === module) {
  app.listen(port);
}

module.exports = app;

