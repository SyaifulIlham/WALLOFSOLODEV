// File: Backend/src/routes/api.js
const express = require('express');
const router = express.Router();

// Panggil fungsi controller yang sudah kita pisah
const filmController = require('../controllers/filmController');
const { validateCreateFilm, validateUpdateFilm } = require('../utils/Validator');

// Rute untuk mengelola Film (Lebih rapi dan bersih!)
router.get('/films', filmController.getAllFilms);
router.post('/films', validateCreateFilm, filmController.addFilm);
router.delete('/films/:id', filmController.deleteFilm);
router.get('/films/:id', filmController.getFilmById);
router.put('/films/:id', validateUpdateFilm, filmController.updateFilm);

// Rute untuk mengambil nama Admin
router.get('/admins', filmController.getAdmin);

module.exports = router;