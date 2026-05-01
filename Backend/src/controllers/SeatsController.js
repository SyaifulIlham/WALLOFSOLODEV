const SeatsModel = require('../models/Seatsmodel');
 
const SeatsController = {
 
    // GET /seats
    getAllSeats: async (req, res) => {
        try {
            const seats = await SeatsModel.getAll();
            res.json({ success: true, data: seats });
        } catch (err) {
            res.status(500).json({ success: false, message: err.message });
        }
    },
 
    // GET /seats/:id
    getSeatById: async (req, res) => {
        try {
            const seat = await SeatsModel.getById(req.params.id);
            if (!seat) return res.status(404).json({ success: false, message: 'Kursi tidak ditemukan' });
            res.json({ success: true, data: seat });
        } catch (err) {
            res.status(500).json({ success: false, message: err.message });
        }
    },
 
    // GET /seats/:id/seats (untuk user — kursi berdasarkan jadwal, placeholder)
    getSeatsBySchedule: async (req, res) => {
        try {
            const seats = await SeatsModel.getAll();
            res.json({ success: true, data: seats });
        } catch (err) {
            res.status(500).json({ success: false, message: err.message });
        }
    },
 
    // POST /seats
    createSeat: async (req, res) => {
        try {
            const { nomor_kursi, baris, status } = req.body;
            if (!nomor_kursi || !baris)
                return res.status(400).json({ success: false, message: 'nomor_kursi dan baris wajib diisi' });
 
            const id = await SeatsModel.create({ nomor_kursi, baris, status });
            res.status(201).json({ success: true, message: 'Kursi berhasil ditambahkan', id_seat: id });
        } catch (err) {
            res.status(500).json({ success: false, message: err.message });
        }
    },
 
    // POST /seats/generate
    generateSeats: async (req, res) => {
        try {
            const { baris_awal, baris_akhir, jumlah_per_baris } = req.body;
            if (!baris_awal || !baris_akhir || !jumlah_per_baris)
                return res.status(400).json({ success: false, message: 'baris_awal, baris_akhir, jumlah_per_baris wajib diisi' });
 
            const count = await SeatsModel.generateBulk(baris_awal, baris_akhir, parseInt(jumlah_per_baris));
            res.status(201).json({ success: true, message: `${count} kursi berhasil digenerate` });
        } catch (err) {
            res.status(500).json({ success: false, message: err.message });
        }
    },
 
    // PUT /seats/:id
    updateSeat: async (req, res) => {
        try {
            const { nomor_kursi, baris, status } = req.body;
            const affected = await SeatsModel.update(req.params.id, { nomor_kursi, baris, status });
            if (!affected) return res.status(404).json({ success: false, message: 'Kursi tidak ditemukan' });
            res.json({ success: true, message: 'Kursi berhasil diupdate' });
        } catch (err) {
            res.status(500).json({ success: false, message: err.message });
        }
    },
 
    // PUT /seats/:id/status  (ubah status saja)
    updateSeatStatus: async (req, res) => {
        try {
            const { status } = req.body;
            if (!['tersedia', 'dipesan'].includes(status))
                return res.status(400).json({ success: false, message: 'Status harus tersedia atau dipesan' });
 
            const affected = await SeatsModel.updateStatus(req.params.id, status);
            if (!affected) return res.status(404).json({ success: false, message: 'Kursi tidak ditemukan' });
            res.json({ success: true, message: 'Status kursi berhasil diupdate' });
        } catch (err) {
            res.status(500).json({ success: false, message: err.message });
        }
    },
 
    // DELETE /seats/:id
    deleteSeat: async (req, res) => {
        try {
            const affected = await SeatsModel.delete(req.params.id);
            if (!affected) return res.status(404).json({ success: false, message: 'Kursi tidak ditemukan' });
            res.json({ success: true, message: 'Kursi berhasil dihapus' });
        } catch (err) {
            res.status(500).json({ success: false, message: err.message });
        }
    },
 
    // DELETE /seats (hapus semua)
    deleteAllSeats: async (req, res) => {
        try {
            const count = await SeatsModel.deleteAll();
            res.json({ success: true, message: `${count} kursi berhasil dihapus` });
        } catch (err) {
            res.status(500).json({ success: false, message: err.message });
        }
    },
};
 
module.exports = SeatsController;
 