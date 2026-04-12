const express = require('express');
const cors = require('cors'); // Pastikan ini ada
const app = express();
const port = 3000;

// KONFIGURASI CORS SUPER TERBUKA
app.use(cors({
    origin: '*', // Mengizinkan semua frontend mengakses ini
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Mengizinkan aksi CRUD
}));

app.use(express.json());

// Pastikan path ini sesuai dengan letak folder routes kamu ya
// Jika api.js ada di dalam folder src/routes/, ubah jadi require('./src/routes/api')
const filmRoutes = require('./routes/api'); 
app.use('/', filmRoutes);

app.listen(port, () => {
<<<<<<< HEAD
  console.log(`Soloflixx server berjalan di http://localhost:${port}`);
=======
  console.log(`CineGo server berjalan di http://localhost:${port}`);
>>>>>>> ed3bb03b2a5a86f1cdb6a39c2735f129f05e0355
});