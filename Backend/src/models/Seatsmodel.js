const db = require('../config/connect');
 
const SeatsModel = {
 
    getAll: async () => {
        const [rows] = await db.query('SELECT * FROM seats ORDER BY baris, nomor_kursi');
        return rows;
    },
 
    getById: async (id) => {
        const [rows] = await db.query('SELECT * FROM seats WHERE id_seat = ?', [id]);
        return rows[0];
    },
 
    getBySchedule: async (id_jadwal) => {
        const [rows] = await db.query('SELECT * FROM seats ORDER BY baris ASC, CAST(REGEXP_REPLACE(nomor_kursi, "[^0-9]", "") AS UNSIGNED) ASC');
        return rows;
    },
 
    create: async ({ nomor_kursi, baris, status = 'tersedia' }) => {
        const [result] = await db.query(
            'INSERT INTO seats (nomor_kursi, baris, status) VALUES (?, ?, ?)',
            [nomor_kursi, baris, status]
        );
        return result.insertId;
    },
 
    generateBulk: async (baris_awal, baris_akhir, jumlah_per_baris) => {
        const startCode = baris_awal.toUpperCase().charCodeAt(0);
        const endCode   = baris_akhir.toUpperCase().charCodeAt(0);
        const values = [];
        for (let b = startCode; b <= endCode; b++) {
            const baris = String.fromCharCode(b);
            for (let n = 1; n <= jumlah_per_baris; n++) {
                values.push([`${baris}${n}`, baris, 'tersedia']);
            }
        }
        const [result] = await db.query(
            'INSERT INTO seats (nomor_kursi, baris, status) VALUES ?',
            [values]
        );
        return result.affectedRows;
    },
 
    update: async (id, { nomor_kursi, baris, status }) => {
        const [result] = await db.query(
            'UPDATE seats SET nomor_kursi = ?, baris = ?, status = ? WHERE id_seat = ?',
            [nomor_kursi, baris, status, id]
        );
        return result.affectedRows;
    },
 
    updateStatus: async (id, status) => {
        const [result] = await db.query(
            'UPDATE seats SET status = ? WHERE id_seat = ?',
            [status, id]
        );
        return result.affectedRows;
    },
 
    delete: async (id) => {
        const [result] = await db.query('DELETE FROM seats WHERE id_seat = ?', [id]);
        return result.affectedRows;
    },
 
    deleteAll: async () => {
        const [result] = await db.query('DELETE FROM seats');
        return result.affectedRows;
    },
};
 
module.exports = SeatsModel;
