// File: Backend/src/routes/api.js
const express = require('express');
const router = express.Router();

const filmController = require('../controllers/filmController');
const authController = require('../controllers/AuthController');
const scheduleController = require('../controllers/ScheduleController');
const { validateCreateFilm, validateUpdateFilm, validateRegister, validateLogin } = require('../utils/Validator');

// Rute untuk mengelola Film
router.get('/films', filmController.getAllFilms);
router.post('/films', validateCreateFilm, filmController.addFilm);
router.delete('/films/:id', filmController.deleteFilm);
router.get('/films/:id', filmController.getFilmById);
router.put('/films/:id', validateUpdateFilm, filmController.updateFilm);

// Rute untuk mengambil nama Admin
router.get('/admins', filmController.getAdmin);

// Rute auth di-merge ke api.js
router.post('/register', validateRegister, authController.registerUser);
router.post('/login/admin', validateLogin, authController.loginAdmin);

// Rute jadwal film
router.get('/schedules', scheduleController.getAllSchedules);
router.get('/schedules/:id', scheduleController.getScheduleById);
router.post('/schedules', scheduleController.createSchedule);
router.put('/schedules/:id', scheduleController.updateSchedule);
router.delete('/schedules/:id', scheduleController.deleteSchedule);
router.get('/films/:id/schedules', scheduleController.getSchedulesByFilm);

module.exports = router;