const SeatsModel = require('../models/seatsmodel');

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

    // GET /seats/:id/seats
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

            // Validasi wajib diisi
            if (!nomor_kursi || !baris) {
                return res.status(400).json({ success: false, message: 'Nomor kursi dan baris wajib diisi' });
            }

            // Validasi format baris: hanya 1 huruf A-Z
            if (!/^[A-Za-z]$/.test(baris)) {
                return res.status(400).json({ success: false, message: 'Baris harus berupa 1 huruf (A-Z)' });
            }

            // Validasi format nomor_kursi: huruf diikuti angka, contoh A1, B10
            if (!/^[A-Za-z]\d+$/.test(nomor_kursi)) {
                return res.status(400).json({ success: false, message: 'Format nomor kursi tidak valid. Contoh: A1, B10' });
            }

            // Validasi nomor kursi harus sesuai baris
            const barisFromNomor = nomor_kursi.charAt(0).toUpperCase();
            if (barisFromNomor !== baris.toUpperCase()) {
                return res.status(400).json({ success: false, message: `Nomor kursi harus dimulai dengan baris ${baris.toUpperCase()}` });
            }

            // Validasi status
            if (status && !['tersedia', 'dipesan'].includes(status)) {
                return res.status(400).json({ success: false, message: 'Status harus tersedia atau dipesan' });
            }

            // Cek duplikat nomor kursi
            const allSeats = await SeatsModel.getAll();
            const isDuplicate = allSeats.some(s => s.nomor_kursi.toUpperCase() === nomor_kursi.toUpperCase());
            if (isDuplicate) {
                return res.status(400).json({ success: false, message: `Kursi ${nomor_kursi.toUpperCase()} sudah ada` });
            }

            const id = await SeatsModel.create({
                nomor_kursi: nomor_kursi.toUpperCase(),
                baris: baris.toUpperCase(),
                status: status || 'tersedia'
            });
            res.status(201).json({ success: true, message: 'Kursi berhasil ditambahkan', id_seat: id });
        } catch (err) {
            res.status(500).json({ success: false, message: err.message });
        }
    },

    // POST /seats/generate
    generateSeats: async (req, res) => {
        try {
            const { baris_awal, baris_akhir, jumlah_per_baris } = req.body;

            // Validasi wajib diisi
            if (!baris_awal || !baris_akhir || !jumlah_per_baris) {
                return res.status(400).json({ success: false, message: 'baris_awal, baris_akhir, dan jumlah_per_baris wajib diisi' });
            }

            // Validasi format baris
            if (!/^[A-Za-z]$/.test(baris_awal) || !/^[A-Za-z]$/.test(baris_akhir)) {
                return res.status(400).json({ success: false, message: 'Baris awal dan akhir harus berupa 1 huruf (A-Z)' });
            }

            // Validasi baris akhir >= baris awal
            const startCode = baris_awal.toUpperCase().charCodeAt(0);
            const endCode   = baris_akhir.toUpperCase().charCodeAt(0);
            if (endCode < startCode) {
                return res.status(400).json({ success: false, message: 'Baris akhir harus sama atau lebih besar dari baris awal' });
            }

            // Validasi jumlah per baris
            const jumlah = parseInt(jumlah_per_baris);
            if (isNaN(jumlah) || jumlah < 1 || jumlah > 30) {
                return res.status(400).json({ success: false, message: 'Jumlah per baris harus antara 1 sampai 30' });
            }

            // Cek duplikat — kursi yang akan digenerate vs yang sudah ada
            const existingSeats = await SeatsModel.getAll();
            const existingNomors = new Set(existingSeats.map(s => s.nomor_kursi.toUpperCase()));
            const duplicates = [];
            for (let b = startCode; b <= endCode; b++) {
                const baris = String.fromCharCode(b);
                for (let n = 1; n <= jumlah; n++) {
                    const nomor = `${baris}${n}`;
                    if (existingNomors.has(nomor)) duplicates.push(nomor);
                }
            }
            if (duplicates.length > 0) {
                return res.status(400).json({
                    success: false,
                    message: `Kursi berikut sudah ada: ${duplicates.slice(0, 5).join(', ')}${duplicates.length > 5 ? ` dan ${duplicates.length - 5} lainnya` : ''}`
                });
            }

            const count = await SeatsModel.generateBulk(baris_awal, baris_akhir, jumlah);
            res.status(201).json({ success: true, message: `${count} kursi berhasil digenerate (${baris_awal.toUpperCase()}–${baris_akhir.toUpperCase()}, ${jumlah} per baris)` });
        } catch (err) {
            res.status(500).json({ success: false, message: err.message });
        }
    },

    // PUT /seats/:id
    updateSeat: async (req, res) => {
        try {
            const { nomor_kursi, baris, status } = req.body;
            const { id } = req.params;

            // Validasi wajib diisi
            if (!nomor_kursi || !baris) {
                return res.status(400).json({ success: false, message: 'Nomor kursi dan baris wajib diisi' });
            }

            // Validasi format baris
            if (!/^[A-Za-z]$/.test(baris)) {
                return res.status(400).json({ success: false, message: 'Baris harus berupa 1 huruf (A-Z)' });
            }

            // Validasi format nomor_kursi
            if (!/^[A-Za-z]\d+$/.test(nomor_kursi)) {
                return res.status(400).json({ success: false, message: 'Format nomor kursi tidak valid. Contoh: A1, B10' });
            }

            // Validasi nomor kursi sesuai baris
            const barisFromNomor = nomor_kursi.charAt(0).toUpperCase();
            if (barisFromNomor !== baris.toUpperCase()) {
                return res.status(400).json({ success: false, message: `Nomor kursi harus dimulai dengan baris ${baris.toUpperCase()}` });
            }

            // Validasi status
            if (status && !['tersedia', 'dipesan'].includes(status)) {
                return res.status(400).json({ success: false, message: 'Status harus tersedia atau dipesan' });
            }

            // Cek duplikat (exclude kursi yang sedang diedit)
            const allSeats = await SeatsModel.getAll();
            const isDuplicate = allSeats.some(s =>
                s.nomor_kursi.toUpperCase() === nomor_kursi.toUpperCase() &&
                s.id_seat != id
            );
            if (isDuplicate) {
                return res.status(400).json({ success: false, message: `Kursi ${nomor_kursi.toUpperCase()} sudah ada` });
            }

            const affected = await SeatsModel.update(id, {
                nomor_kursi: nomor_kursi.toUpperCase(),
                baris: baris.toUpperCase(),
                status
            });
            if (!affected) return res.status(404).json({ success: false, message: 'Kursi tidak ditemukan' });
            res.json({ success: true, message: 'Kursi berhasil diupdate' });
        } catch (err) {
            res.status(500).json({ success: false, message: err.message });
        }
    },

    // PUT /seats/:id/status
    updateSeatStatus: async (req, res) => {
        try {
            const { status } = req.body;
            if (!['tersedia', 'dipesan'].includes(status)) {
                return res.status(400).json({ success: false, message: 'Status harus tersedia atau dipesan' });
            }
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

    // DELETE /seats
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