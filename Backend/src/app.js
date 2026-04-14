const express = require('express');
const cors = require('cors');
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

app.listen(port, () => {
  console.log(`Soloflixx server berjalan di http://localhost:${port}`);
});