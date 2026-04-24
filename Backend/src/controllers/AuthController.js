const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken'); 
const { ErrorHandler } = require('../utils/ErrorHandler');
const AuthModel = require('../models/Authmodel');

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'secret_key_fallback', {
    expiresIn: process.env.JWT_EXPIRES_IN || '1d',
  });
};

const registerUser = async (req, res, next) => {
  const { nama, email, password, no_hp } = req.body;
  try {
    const existingUser = await AuthModel.findUserByEmail(email);
    if (existingUser.length > 0) {
      return next(new ErrorHandler(400, 'Email sudah digunakan!'));
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    await AuthModel.createUser({ nama, email, password: hashedPassword, no_hp });
    res.status(201).json({ success: true, message: 'Registrasi berhasil!' });
  } catch (err) {
    next(new ErrorHandler(500, err.message || 'Server error'));
  }
};

const loginUser = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    // 1. Cek apakah user ada
    const userRows = await AuthModel.findUserByEmail(email);
    if (userRows.length === 0) {
      return next(new ErrorHandler(401, 'Email atau password salah!'));
    }

    const user = userRows[0];

    // 2. Validasi password pakai bcrypt
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return next(new ErrorHandler(401, 'Email atau password salah!'));
    }

    // 3. Generate JWT Token
    const token = signToken(user.id_user);

    // 4. Kirim Response
    res.status(200).json({
      success: true,
      message: 'Login berhasil!',
      token,
      data: { id: user.id_user, nama: user.nama, email: user.email }
    });
  } catch (err) {
    next(new ErrorHandler(500, err.message || 'Server error'));
  }
};

const loginAdmin = async (req, res, next) => {
  const { username, password } = req.body;
  try {
    const adminRows = await AuthModel.findAdminByUsername(username);
    if (adminRows.length === 0) {
      return next(new ErrorHandler(401, 'Username atau password salah!'));
    }

    const admin = adminRows[0];
    
    // Gunakan bcrypt.compare jika password admin di DB sudah di-hash
    // Jika masih plain text (untuk sementara), biarkan === tapi disarankan di-hash juga
    const isMatch = password === admin.password; 
    
    if (!isMatch) {
      return next(new ErrorHandler(401, 'Username atau password salah!'));
    }

    const token = signToken(admin.id_admin);

    res.status(200).json({
      success: true,
      message: 'Login Admin berhasil!',
      token,
      data: { id_admin: admin.id_admin, username: admin.username }
    });
  } catch (err) {
    next(new ErrorHandler(500, err.message || 'Server error'));
  }
};

module.exports = {
  registerUser,
  loginUser,
  loginAdmin,
};