const db = require('../config/connect');

const getAllSchedules = async () => {
  return await db.query(
    'SELECT j.*, f.judul_film FROM jadwal_film j LEFT JOIN films f ON j.id_film = f.id_film ORDER BY j.tanggal_tayang, j.jam_tayang'
  );
};

const getScheduleById = async (id) => {
  return await db.query('SELECT * FROM jadwal_film WHERE id_jadwal = ?', [id]);
};

const getSchedulesByFilm = async (filmId) => {
  return await db.query('SELECT * FROM jadwal_film WHERE id_film = ? ORDER BY tanggal_tayang, jam_tayang', [filmId]);
};

const createSchedule = async ({ id_film, tanggal_tayang, jam_tayang, harga_tiket }) => {
  return await db.query(
    'INSERT INTO jadwal_film (id_film, tanggal_tayang, jam_tayang, harga_tiket) VALUES (?, ?, ?, ?)',
    [id_film, tanggal_tayang, jam_tayang, harga_tiket]
  );
};

const updateSchedule = async ({ id_jadwal, id_film, tanggal_tayang, jam_tayang, harga_tiket }) => {
  return await db.query(
    'UPDATE jadwal_film SET id_film = ?, tanggal_tayang = ?, jam_tayang = ?, harga_tiket = ? WHERE id_jadwal = ?',
    [id_film, tanggal_tayang, jam_tayang, harga_tiket, id_jadwal]
  );
};

const deleteSchedule = async (id) => {
  return await db.query('DELETE FROM jadwal_film WHERE id_jadwal = ?', [id]);
};

module.exports = {
  getAllSchedules,
  getScheduleById,
  getSchedulesByFilm,
  createSchedule,
  updateSchedule,
  deleteSchedule,
};
