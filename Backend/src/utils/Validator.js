const { ErrorHandler } = require('./ErrorHandler');

const isNonEmptyString = (value) => typeof value === 'string' && value.trim().length > 0;
const isNumeric = (value) => value !== undefined && value !== null && !Number.isNaN(Number(value));
const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const isValidPhone = (phone) => typeof phone === 'string' && /^[0-9+\-\s]{6,20}$/.test(phone.trim());

const validateFilmPayload = (body) => {
  const errors = [];

  if (!isNonEmptyString(body.judul_film)) {
    errors.push('Judul film wajib diisi');
  }
  if (!isNonEmptyString(body.genre)) {
    errors.push('Genre wajib diisi');
  }
  if (!isNonEmptyString(body.durasi)) {
    errors.push('Durasi wajib diisi');
  }
  if (!isNonEmptyString(body.deskripsi)) {
    errors.push('Deskripsi wajib diisi');
  }
  if (!isNonEmptyString(body.poster)) {
    errors.push('Poster wajib diisi');
  }
  if (body.id_kategori !== undefined && body.id_kategori !== null && !isNumeric(body.id_kategori)) {
    errors.push('id_kategori harus berupa angka');
  }
  if (body.status !== undefined && body.status !== null && body.status !== '' && !isNonEmptyString(body.status)) {
    errors.push('Status film tidak boleh kosong');
  }

  return errors;
};

const validateCreateFilm = (req, res, next) => {
  const errors = validateFilmPayload(req.body);
  if (errors.length) {
    return next(new ErrorHandler(400, errors.join(', ')));
  }
  next();
};

const validateUpdateFilm = (req, res, next) => {
  if (!req.body || Object.keys(req.body).length === 0) {
    return next(new ErrorHandler(400, 'Data update film wajib dikirim')); 
  }
  const errors = validateFilmPayload(req.body);
  if (errors.length) {
    return next(new ErrorHandler(400, errors.join(', ')));
  }
  next();
};

const validateRegister = (req, res, next) => {
  const { nama, email, password, no_hp } = req.body;
  const errors = [];

  if (!isNonEmptyString(nama)) {
    errors.push('Nama wajib diisi');
  }
  if (!isNonEmptyString(email) || !isValidEmail(email)) {
    errors.push('Email tidak valid');
  }
  if (!isNonEmptyString(password) || password.length < 6) {
    errors.push('Password wajib diisi minimal 6 karakter');
  }
  if (!isNonEmptyString(no_hp) || !isValidPhone(no_hp)) {
    errors.push('Nomor HP tidak valid');
  }

  if (errors.length) {
    return next(new ErrorHandler(400, errors.join(', ')));
  }
  next();
};

const validateLogin = (req, res, next) => {
  const { username, password } = req.body;
  const errors = [];

  if (!isNonEmptyString(username)) {
    errors.push('Username wajib diisi');
  }
  if (!isNonEmptyString(password)) {
    errors.push('Password wajib diisi');
  }

  if (errors.length) {
    return next(new ErrorHandler(400, errors.join(', ')));
  }
  next();
};

module.exports = {
  validateCreateFilm,
  validateUpdateFilm,
  validateRegister,
  validateLogin,
};