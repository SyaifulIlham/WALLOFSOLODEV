const db = require('../config/connect');

const TransaksiModel = {

    getAll: async () => {
        const [rows] = await db.query(`
            SELECT 
                t.id_transaksi,
                t.tanggal_transaksi,
                t.total_harga,
                t.status_pembayaran,
                u.id_user,
                u.nama AS nama_user,
                u.email AS email_user
            FROM transaksi t
            LEFT JOIN users u ON t.id_user = u.id_user
            ORDER BY t.tanggal_transaksi DESC
        `);
        return rows;
    },

    getById: async (id) => {
        const [transaksiRows] = await db.query(`
            SELECT 
                t.id_transaksi,
                t.tanggal_transaksi,
                t.total_harga,
                t.status_pembayaran,
                u.id_user,
                u.nama AS nama_user,
                u.email AS email_user
            FROM transaksi t
            LEFT JOIN users u ON t.id_user = u.id_user
            WHERE t.id_transaksi = ?
        `, [id]);

        if (!transaksiRows[0]) return null;

        const [tiketRows] = await db.query(`
            SELECT 
                tk.id_tiket,
                tk.jadwal_tayang,
                tk.harga,
                f.judul_film,
                s.nomor_kursi,
                s.baris
            FROM tickets tk
            LEFT JOIN films f ON tk.id_film = f.id_film
            LEFT JOIN seats s ON tk.id_seat = s.id_seat
            WHERE tk.id_transaksi = ?
        `, [id]);

        return { ...transaksiRows[0], tikets: tiketRows };
    },

    getByUserId: async (id_user) => {
        const [rows] = await db.query(`
            SELECT 
                t.id_transaksi,
                t.tanggal_transaksi,
                t.total_harga,
                t.status_pembayaran
            FROM transaksi t
            WHERE t.id_user = ?
            ORDER BY t.tanggal_transaksi DESC
        `, [id_user]);
        return rows;
    },

    create: async ({ id_user, tikets }) => {
        const conn = await db.getConnection();
        try {
            await conn.beginTransaction();

            const total_harga = tikets.reduce((sum, t) => sum + Number(t.harga), 0);
            const tanggal_transaksi = new Date();

            const [transaksiResult] = await conn.query(
                `INSERT INTO transaksi (id_user, tanggal_transaksi, total_harga, status_pembayaran)
                 VALUES (?, ?, ?, 'pending')`,
                [id_user, tanggal_transaksi, total_harga]
            );
            const id_transaksi = transaksiResult.insertId;

            for (const tiket of tikets) {
                const { id_film, id_seat, jadwal_tayang, harga } = tiket;
                await conn.query(
                    `INSERT INTO tickets (id_transaksi, id_film, id_seat, jadwal_tayang, harga)
                     VALUES (?, ?, ?, ?, ?)`,
                    [id_transaksi, id_film, id_seat, jadwal_tayang, harga]
                );
                await conn.query(
                    `UPDATE seats SET status = 'dipesan' WHERE id_seat = ?`,
                    [id_seat]
                );
            }

            await conn.commit();
            return { id_transaksi, total_harga };
        } catch (err) {
            await conn.rollback();
            throw err;
        } finally {
            conn.release();
        }
    },

    updateStatus: async (id, status_pembayaran) => {
        const [result] = await db.query(
            `UPDATE transaksi SET status_pembayaran = ? WHERE id_transaksi = ?`,
            [status_pembayaran, id]
        );
        return result.affectedRows;
    },

    delete: async (id) => {
    const conn = await db.getConnection();
    try {
        await conn.beginTransaction();

        // Hapus tiket dulu sebelum hapus transaksi
        await conn.query('DELETE FROM tickets WHERE id_transaksi = ?', [id]);

        const [result] = await conn.query(
            'DELETE FROM transaksi WHERE id_transaksi = ?', [id]
        );

        await conn.commit();
        return result.affectedRows;
    } catch (err) {
        await conn.rollback();
        throw err;
    } finally {
        conn.release();
    }
},
};

module.exports = TransaksiModel;