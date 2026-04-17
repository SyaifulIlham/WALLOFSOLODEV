const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const db = require('../config/connect');
const { ErrorHandler } = require('../utils/ErrorHandler');
const { validateRegister, validateLogin } = require('../utils/Validator');

// ========================
// REGISTER USER
// ========================
router.post('/register', validateRegister, async (req, res, next) => {
    const { nama, email, password, no_hp } = req.body;

    try {
        // Cek email sudah terdaftar
        const [existingUser] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
        if (existingUser.length > 0) {
            return next(new ErrorHandler(400, 'Email sudah digunakan!'));
        }

        // Hash Password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Simpan ke DB
        const query = 'INSERT INTO users (nama, email, password, no_hp) VALUES (?, ?, ?, ?)';
        await db.query(query, [nama, email, hashedPassword, no_hp]);

        res.status(201).json({ message: 'Registrasi berhasil!' });
    } catch (err) {
        next(new ErrorHandler(500, err.message || 'Server error'));
    }
});

// ========================
// LOGIN ADMIN
// ========================
router.post('/login/admin', validateLogin, async (req, res, next) => {
    const { username, password } = req.body;

    try {
        // Cek username ada di tabel admins
        const [rows] = await db.query('SELECT * FROM admins WHERE username = ?', [username]);
        if (rows.length === 0) {
            return next(new ErrorHandler(401, 'Username atau password salah!'));
        }

        const admin = rows[0];

        // Cek password (plain text dulu, nanti bisa upgrade ke bcrypt)
        const isMatch = password === admin.password;
        if (!isMatch) {
            return next(new ErrorHandler(401, 'Username atau password salah!'));
        }

        res.status(200).json({ 
            message: 'Login berhasil!',
            data: { id_admin: admin.id_admin, username: admin.username }
        });
    } catch (err) {
        next(new ErrorHandler(500, err.message || 'Server error'));
    }
});

module.exports = router;