const bcrypt = require('bcrypt');
const { ErrorHandler } = require('../utils/ErrorHandler');
const AuthModel = require('../models/Authmodel');

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

const loginAdmin = async (req, res, next) => {
  const { username, password } = req.body;

  try {
    const adminRows = await AuthModel.findAdminByUsername(username);
    if (adminRows.length === 0) {
      return next(new ErrorHandler(401, 'Username atau password salah!'));
    }

    const admin = adminRows[0];
    const isMatch = password === admin.password;
    if (!isMatch) {
      return next(new ErrorHandler(401, 'Username atau password salah!'));
    }

    res.status(200).json({
      success: true,
      message: 'Login berhasil!',
      data: { id_admin: admin.id_admin, username: admin.username }
    });
  } catch (err) {
    next(new ErrorHandler(500, err.message || 'Server error'));
  }
};

module.exports = {
  registerUser,
  loginAdmin,
};
