const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const jwt = require('jsonwebtoken');
const { ErrorHandler } = require('../utils/ErrorHandler');
const AuthModel = require('../models/Authmodel');

// Generate token
const signToken = (id) => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET tidak dikonfigurasi di environment!');
  }
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '1d',
  });
  return jwt.sign(
    { id },
    process.env.JWT_SECRET || 'secret_key_fallback',
    {
      expiresIn: process.env.JWT_EXPIRES_IN || '1d',
    }
  );
};

const getuser = async (req, res, next) => {
  try {
    const users = await AuthModel.findAllUsers();
    if (users.length === 0) {
      return next(new ErrorHandler(404, 'Tidak ada pengguna yang ditemukan!'));
    }
    res.status(200).json({
      success: true,
      data: users,
      message: 'Daftar pengguna berhasil ditemukan dari database',
    });
  } catch (err) {
    next(new ErrorHandler(500, err.message || 'Server error'));
  }
};

// Register User
const registerUser = async (req, res, next) => {
  const { nama, email, password, no_hp } = req.body;

  try {
    const existingUser = await AuthModel.findUserByEmail(email);

    if (existingUser.length > 0) {
      return next(new ErrorHandler(400, 'Email sudah digunakan!'));
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    await AuthModel.createUser({
      nama,
      email,
      password: hashedPassword,
      no_hp
    });

    res.status(201).json({
      success: true,
      message: 'Registrasi berhasil!'
    });

  } catch (err) {
    next(new ErrorHandler(500, err.message || 'Server error'));
  }
};

// Login User
const loginUser = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const userRows = await AuthModel.findUserByEmail(email);

    if (userRows.length === 0) {
      return next(new ErrorHandler(401, 'Email atau password salah!'));
    }

    const user = userRows[0];

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return next(new ErrorHandler(401, 'Email atau password salah!'));
    }

    const token = signToken(user.id_user);

    res.status(200).json({
      success: true,
      message: 'Login berhasil!',
      token,
      data: {
        id: user.id_user,
        nama: user.nama,
        email: user.email
      }
    });

  } catch (err) {
    next(new ErrorHandler(500, err.message || 'Server error'));
  }
};
// ✅ BENAR - pakai AuthModel
const getAdmin = async (req, res, next) => {
  try {
    const admins = await AuthModel.findAllAdmins();
    if (admins.length === 0) {
      return res.json({ success: false, message: 'Admin tidak ditemukan' });
    }
    res.status(200).json({ success: true, data: admins });
  } catch (error) {
    console.error('Error fetching admin:', error);
    next(new ErrorHandler(500, 'Server error'));
  }
};

// Login Admin
const loginAdmin = async (req, res, next) => {
  const { username, password } = req.body;

  try {
    const adminRows = await AuthModel.findAdminByUsername(username);

    if (adminRows.length === 0) {
      return next(new ErrorHandler(401, 'Username atau password salah!'));
    }

    const admin = adminRows[0];

    // Plain text comparison — gunakan ini jika password di DB belum di-hash
    const isMatch = password === admin.password;

    const isMatch = password === admin.password;

    if (!isMatch) {
      return next(new ErrorHandler(401, 'Username atau password salah!'));
    }

    const token = signToken(admin.id_admin);

    res.status(200).json({
  success: true,
  message: 'Login Admin berhasil!',
  token,
  data: {
    id_admin: admin.id_admin,
    username: admin.username
  }
});

  } catch (err) {
    next(new ErrorHandler(500, err.message || 'Server error'));
  }
};

module.exports = { registerUser, loginUser, loginAdmin, getuser , getAdmin};
module.exports = {
  registerUser,
  loginUser,
  loginAdmin
};