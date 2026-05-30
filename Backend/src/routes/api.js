const express = require('express');
const router = express.Router();

const filmController = require('../controllers/filmController');
const authController = require('../controllers/AuthController');
const scheduleController = require('../controllers/ScheduleController');
const SeatsController = require('../controllers/SeatsController');
const TransaksiController = require('../controllers/TransaksiController');
const {
  validateCreateFilm,
  validateUpdateFilm,
  validateRegister,
  validateLoginUser,   
  validateLoginAdmin,
  validateCreateTransaksi,
  validateUpdateStatusTransaksi,
  validateDeletetransaksi,
} = require('../utils/Validator');

// Rute untuk mengelola Film
router.get('/films', filmController.getAllFilms);
router.post('/films', validateCreateFilm, filmController.addFilm);
router.delete('/films/:id', filmController.deleteFilm);
router.get('/films/:id', filmController.getFilmById);
router.put('/films/:id', validateUpdateFilm, filmController.updateFilm);

// Rute untuk mengambil nama Admin
router.get('/admins', authController.getAdmin);

//untuk cek user
router.get('/user', authController.getuser);

router.post('/register', validateRegister, authController.registerUser);
router.post('/login/user', validateLoginUser, authController.loginUser);    
router.post('/login/admin', validateLoginAdmin, authController.loginAdmin); 

// Rute jadwal film
router.get('/schedules', scheduleController.getAllSchedules);
router.get('/schedules/:id', scheduleController.getScheduleById);
router.post('/schedules', scheduleController.createSchedule);
router.put('/schedules/:id', scheduleController.updateSchedule);
router.delete('/schedules/:id', scheduleController.deleteSchedule);
router.get('/films/:id/schedules', scheduleController.getSchedulesByFilm);

// Rute kursi
router.get('/seats', SeatsController.getAllSeats);
router.get('/seats/:id', SeatsController.getSeatById);
router.get('/seats/:id/seats', SeatsController.getSeatsBySchedule);
router.post('/seats', SeatsController.createSeat);          
router.post('/seats/generate', SeatsController.generateSeats);
router.put('/seats/:id', SeatsController.updateSeat);       
router.delete('/seats/:id', SeatsController.deleteSeat);    
router.put('/seats/:id/status', SeatsController.updateSeatStatus);
router.delete('/seats', SeatsController.deleteAllSeats);

router.get('/transaksi', TransaksiController.getAllTransaksi);
router.get('/transaksi/:id', TransaksiController.getTransaksiById);
router.post('/transaksi', validateCreateTransaksi, TransaksiController.createTransaksi);
router.put('/transaksi/:id/status', validateUpdateStatusTransaksi, TransaksiController.updateStatusPembayaran);
router.delete('/transaksi/:id', validateDeletetransaksi, TransaksiController.deleteTransaksi);
router.get('/users/:id_user/transaksi', TransaksiController.getTransaksiByUser);


module.exports = router;