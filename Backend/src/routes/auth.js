const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const db = require('../config/connect');

// Fungsi validasi format email
const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

// ========================
// REGISTER USER
// ========================
router.post('/register', async (req, res) => {
    const { nama, email, password, no_hp } = req.body;

    // Validasi field kosong
    if (!nama || !email || !password || !no_hp) {
        return res.status(400).json({ message: "Semua field wajib diisi!" });
    }

    // Validasi format email
    if (!isValidEmail(email)) {
        return res.status(400).json({ message: "Format email tidak valid!" });
    }

    try {
        // Cek email sudah terdaftar
        const [existingUser] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
        if (existingUser.length > 0) {
            return res.status(400).json({ message: "Email sudah digunakan!" });
        }

        // Hash Password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Simpan ke DB
        const query = 'INSERT INTO users (nama, email, password, no_hp) VALUES (?, ?, ?, ?)';
        await db.query(query, [nama, email, hashedPassword, no_hp]);

        res.status(201).json({ message: "Registrasi berhasil!" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ========================
// LOGIN ADMIN
// ========================
router.post('/login/admin', async (req, res) => {
    const { username, password } = req.body;

    // Validasi field kosong
    if (!username || !password) {
        return res.status(400).json({ message: "Username dan password wajib diisi!" });
    }

    try {
        // Cek username ada di tabel admins
        const [rows] = await db.query('SELECT * FROM admins WHERE username = ?', [username]);
        if (rows.length === 0) {
            return res.status(401).json({ message: "Username atau password salah!" });
        }

        const admin = rows[0];

        // Cek password (plain text dulu, nanti bisa upgrade ke bcrypt)
        const isMatch = password === admin.password;
        if (!isMatch) {
            return res.status(401).json({ message: "Username atau password salah!" });
        }

        res.status(200).json({ 
            message: "Login berhasil!",
            data: { id_admin: admin.id_admin, username: admin.username }
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;