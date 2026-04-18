const db = require('../config/connect');

const getAllFilms = async () => {
  return await db.query('SELECT * FROM films');
};

const getFilmById = async (id) => {
  return await db.query('SELECT * FROM films WHERE id_film = ?', [id]);
};

const addFilm = async ({ judul_film, id_kategori, genre, durasi, deskripsi, poster, created_by, status }) => {
  return await db.query(
    'INSERT INTO films (judul_film, id_kategori, genre, durasi, deskripsi, poster, created_by, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
    [judul_film, id_kategori, genre, durasi, deskripsi, poster, created_by, status]
  );
};

const updateFilm = async ({ judul_film, id_kategori, genre, durasi, deskripsi, poster, status, idFilm }) => {
  return await db.query(
    'UPDATE films SET judul_film = ?, id_kategori = ?, genre = ?, durasi = ?, deskripsi = ?, poster = ?, status = ? WHERE id_film = ?',
    [judul_film, id_kategori, genre, durasi, deskripsi, poster, status, idFilm]
  );
};

const deleteFilm = async (id) => {
  return await db.query('DELETE FROM films WHERE id_film = ?', [id]);
};

const getAdmin = async () => {
  return await db.query('SELECT * FROM admins LIMIT 1');
};

module.exports = {
  getAllFilms,
  getFilmById,
  addFilm,
  updateFilm,
  deleteFilm,
  getAdmin,
};
