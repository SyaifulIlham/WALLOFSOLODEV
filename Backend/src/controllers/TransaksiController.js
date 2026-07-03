const TransaksiModel = require('../models/TransaksiModel');
const { ErrorHandler } = require('../utils/ErrorHandler');

const TransaksiController = {

    getAllTransaksi: async (req, res, next) => {
        try {
            const transaksi = await TransaksiModel.getAll();
            res.json({ success: true, data: transaksi });
        } catch (err) {
            next(new ErrorHandler(500, err.message));
        }
    },

    getTransaksiById: async (req, res, next) => {
        try {
            const transaksi = await TransaksiModel.getById(req.params.id);
            if (!transaksi) return next(new ErrorHandler(404, 'Transaksi tidak ditemukan'));
            res.json({ success: true, data: transaksi });
        } catch (err) {
            next(new ErrorHandler(500, err.message));
        }
    },

    getTransaksiByUser: async (req, res, next) => {
        try {
            const transaksi = await TransaksiModel.getByUserId(req.params.id_user);
            
            // Ambil detail (termasuk tiket) untuk setiap transaksi
            const detailTransaksi = await Promise.all(
                transaksi.map(async (t) => {
                    const detail = await TransaksiModel.getById(t.id_transaksi);
                    return detail;
                })
            );

            res.json({ success: true, data: detailTransaksi });
        } catch (err) {
            next(new ErrorHandler(500, err.message));
        }
    },

    createTransaksi: async (req, res, next) => {
        try {
            const { id_user, tikets } = req.body;

            if (!id_user)
                return next(new ErrorHandler(400, 'id_user wajib diisi'));
            if (!Array.isArray(tikets) || tikets.length === 0)
                return next(new ErrorHandler(400, 'tikets wajib diisi dan tidak boleh kosong'));

            for (let i = 0; i < tikets.length; i++) {
                const { id_film, id_seat, jadwal_tayang, harga } = tikets[i];
                if (!id_film || !id_seat || !jadwal_tayang || harga === undefined)
                    return next(new ErrorHandler(400, `Tiket ke-${i + 1}: id_film, id_seat, jadwal_tayang, dan harga wajib diisi`));
            }

            const result = await TransaksiModel.create({ id_user, tikets });
            res.status(201).json({ success: true, message: 'Transaksi berhasil dibuat', data: result });
        } catch (err) {
            next(new ErrorHandler(500, err.message));
        }
    },

    updateStatusPembayaran: async (req, res, next) => {
        try {
            const { status_pembayaran } = req.body;
            if (!['pending', 'berhasil'].includes(status_pembayaran))
                return next(new ErrorHandler(400, 'status_pembayaran harus pending atau berhasil'));

            const affected = await TransaksiModel.updateStatus(req.params.id, status_pembayaran);
            if (!affected) return next(new ErrorHandler(404, 'Transaksi tidak ditemukan'));
            res.json({ success: true, message: 'Status pembayaran berhasil diupdate' });
        } catch (err) {
            next(new ErrorHandler(500, err.message));
        }
    },

    deleteTransaksi: async (req, res, next) => {
        try {
            const affected = await TransaksiModel.delete(req.params.id);
            if (!affected) return next(new ErrorHandler(404, 'Transaksi tidak ditemukan'));
            res.json({ success: true, message: 'Transaksi berhasil dihapus' });
        } catch (err) {
            next(new ErrorHandler(500, err.message));
        }
    },
};

module.exports = TransaksiController;