// File: Backend/src/routes/api.js
const express = require('express');
const router = express.Router();

// Panggil fungsi controller yang sudah kita pisah
const filmController = require('../controllers/filmController'); 

// Rute untuk mengelola Film (Lebih rapi dan bersih!)
router.get('/films', filmController.getAllFilms);
router.post('/films', filmController.addFilm);
router.delete('/films/:id', filmController.deleteFilm);
router.get('/films/:id', filmController.getFilmById);
router.put('/films/:id', filmController.updateFilm);

// Rute untuk mengambil nama Admin
router.get('/admins', filmController.getAdmin);

module.exports = router;