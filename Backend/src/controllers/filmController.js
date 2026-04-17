// File: Backend/src/controllers/filmController.js
const db = require('../config/connect');
const { ErrorHandler } = require('../utils/ErrorHandler');

// 1. GET ALL FILMS
const getAllFilms = async (req, res, next) => {
  try {
    const [rows] = await db.query('SELECT * FROM films');
    res.json({ success: true, data: rows });
  } catch (error) {
    console.error('Error:', error);
    next(new ErrorHandler(500, 'Server error'));
  }
};

// 2. POST FILM (Tambah Film)
const addFilm = async (req, res, next) => {
  try {
    const { judul_film, id_kategori, genre, durasi, deskripsi, poster, status } = req.body;
    const query = 'INSERT INTO films (judul_film, id_kategori, genre, durasi, deskripsi, poster, created_by, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
    const values = [judul_film, id_kategori || 1, genre, durasi, deskripsi, poster, 1, status || 'Sedang Tayang'];
    
    const [result] = await db.query(query, values);

    res.status(201).json({
      success: true,
      message: 'Film baru berhasil ditambahkan!',
      data: { id_film: result.insertId, judul_film, status: status || 'Sedang Tayang' }
    });
  } catch (error) {
    console.error('Error saat POST film:', error);
    next(new ErrorHandler(500, 'Server error saat menyimpan data'));
  }
};

// 3. DELETE FILM
const deleteFilm = async (req, res, next) => {
  try {
    const idFilm = req.params.id;
    const [result] = await db.query('DELETE FROM films WHERE id_film = ?', [idFilm]);

    if (result.affectedRows === 0) {
      return next(new ErrorHandler(404, 'Film tidak ditemukan'));
    }
    res.json({ success: true, message: 'Film berhasil dihapus!' });
  } catch (error) {
    console.error('Error saat menghapus film:', error);
    next(new ErrorHandler(500, 'Server error'));
  }
};

// 4. GET FILM BY ID
const getFilmById = async (req, res, next) => {
  try {
    const [rows] = await db.query('SELECT * FROM films WHERE id_film = ?', [req.params.id]);
    if (rows.length === 0) {
      return next(new ErrorHandler(404, 'Film tidak ditemukan'));
    }
    res.json({ success: true, data: rows[0] });
  } catch (error) {
    console.error('Error GET film by id:', error);
    next(new ErrorHandler(500, 'Server error'));
  }
};

// 5. PUT FILM (Update Film)
const updateFilm = async (req, res, next) => {
  try {
    const { judul_film, id_kategori, genre, durasi, deskripsi, poster, status } = req.body;
    const idFilm = req.params.id;

    const query = `
      UPDATE films 
      SET judul_film = ?, id_kategori = ?, genre = ?, durasi = ?, deskripsi = ?, poster = ?, status = ? 
      WHERE id_film = ?
    `;
    const values = [judul_film, id_kategori || 1, genre, durasi, deskripsi, poster, status, idFilm];
    
    const [result] = await db.query(query, values);

    if (result.affectedRows === 0) {
      return next(new ErrorHandler(404, 'Film tidak ditemukan'));
    }
    res.json({ success: true, message: 'Data film berhasil diupdate!' });
  } catch (error) {
    console.error('Error saat UPDATE film:', error);
    next(new ErrorHandler(500, 'Server error'));
  }
};

// 6. GET ADMIN
const getAdmin = async (req, res, next) => {
  try {
    const [rows] = await db.query('SELECT * FROM admins LIMIT 1');
    if (rows.length > 0) {
      res.json({ success: true, data: rows[0] });
    } else {
      res.json({ success: false, message: 'Admin tidak ditemukan' });
    }
  } catch (error) {
    console.error('Error fetching admin:', error);
    next(new ErrorHandler(500, 'Server error'));
  }
};

// Export semua fungsinya
module.exports = {
  getAllFilms,
  addFilm,
  deleteFilm,
  getFilmById,
  updateFilm,
  getAdmin
};