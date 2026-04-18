const { ErrorHandler } = require('../utils/ErrorHandler');
const ScheduleModel = require('../models/Schedulemodel');

const formatDate = (dateString) => {
  let str;
  if (dateString instanceof Date) {
    str = dateString.toISOString().split('T')[0]; // Get YYYY-MM-DD
  } else if (typeof dateString === 'string') {
    str = dateString;
  } else {
    return dateString;
  }
  const parts = str.split('-');
  if (parts.length === 3) {
    return `${parts[2]}-${parts[1]}-${parts[0]}`;
  }
  return str;
};

const getAllSchedules = async (req, res, next) => {
  try {
    const [rows] = await ScheduleModel.getAllSchedules();
    const formattedRows = rows.map(row => ({
      ...row,
      tanggal_tayang: formatDate(row.tanggal_tayang)
    }));
    res.json({ success: true, data: formattedRows });
  } catch (err) {
    next(new ErrorHandler(500, err.message || 'Server error'));
  }
};

const getScheduleById = async (req, res, next) => {
  try {
    const [rows] = await ScheduleModel.getScheduleById(req.params.id);
    if (rows.length === 0) {
      return next(new ErrorHandler(404, 'Jadwal tidak ditemukan'));
    }
    const formattedData = {
      ...rows[0],
      tanggal_tayang: formatDate(rows[0].tanggal_tayang)
    };
    res.json({ success: true, data: formattedData });
  } catch (err) {
    next(new ErrorHandler(500, err.message || 'Server error'));
  }
};

const getSchedulesByFilm = async (req, res, next) => {
  try {
    const [rows] = await ScheduleModel.getSchedulesByFilm(req.params.id);
    const formattedRows = rows.map(row => ({
      ...row,
      tanggal_tayang: formatDate(row.tanggal_tayang)
    }));
    res.json({ success: true, data: formattedRows });
  } catch (err) {
    next(new ErrorHandler(500, err.message || 'Server error'));
  }
};

const createSchedule = async (req, res, next) => {
  try {
    const { id_film, tanggal_tayang, jam_tayang, harga_tiket } = req.body;

    if (!id_film || !tanggal_tayang || !jam_tayang || harga_tiket === undefined) {
      return next(new ErrorHandler(400, 'Semua field jadwal wajib diisi'));
    }

    const [result] = await ScheduleModel.createSchedule({ id_film, tanggal_tayang, jam_tayang, harga_tiket });
    res.status(201).json({ success: true, message: 'Jadwal berhasil dibuat', data: { id_jadwal: result.insertId } });
  } catch (err) {
    next(new ErrorHandler(500, err.message || 'Server error'));
  }
};

const updateSchedule = async (req, res, next) => {
  try {
    const { id_film, tanggal_tayang, jam_tayang, harga_tiket } = req.body;
    const id_jadwal = req.params.id;

    if (!id_film || !tanggal_tayang || !jam_tayang || harga_tiket === undefined) {
      return next(new ErrorHandler(400, 'Semua field jadwal wajib diisi'));
    }

    const [result] = await ScheduleModel.updateSchedule({ id_jadwal, id_film, tanggal_tayang, jam_tayang, harga_tiket });
    if (result.affectedRows === 0) {
      return next(new ErrorHandler(404, 'Jadwal tidak ditemukan'));
    }
    res.json({ success: true, message: 'Jadwal berhasil diubah' });
  } catch (err) {
    next(new ErrorHandler(500, err.message || 'Server error'));
  }
};

const deleteSchedule = async (req, res, next) => {
  try {
    const [result] = await ScheduleModel.deleteSchedule(req.params.id);
    if (result.affectedRows === 0) {
      return next(new ErrorHandler(404, 'Jadwal tidak ditemukan'));
    }
    res.json({ success: true, message: 'Jadwal berhasil dihapus' });
  } catch (err) {
    next(new ErrorHandler(500, err.message || 'Server error'));
  }
};

module.exports = {
  getAllSchedules,
  getScheduleById,
  getSchedulesByFilm,
  createSchedule,
  updateSchedule,
  deleteSchedule,
};
