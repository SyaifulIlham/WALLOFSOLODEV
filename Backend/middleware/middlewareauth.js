// Cek apakah user sudah login
const cekauth = (req, res, next) => {
    if (req.session.user) {
        next();
    } else {
        res.status(401).json({ success: false, message: 'Unauthorized' });
    }
};

// Cek apakah password sudah diverifikasi (contoh: untuk aksi sensitif)
const cekpassword = (req, res, next) => {
    if (req.session.passwordVerified) { // logika berbeda dari cekauth
        next();
    } else {
        res.status(403).json({ success: false, message: 'Password verification required' });
    }
};

// Remember me: set session agar persist lebih lama
const rememberme = (req, res, next) => {
    if (req.session.user) {
        req.session.cookie.maxAge = 30 * 24 * 60 * 60 * 1000; // 30 hari
        next(); // lanjut ke middleware/handler berikutnya
    } else {
        res.status(401).json({ success: false, message: 'Unauthorized' });
    }
};

module.exports = { cekauth, cekpassword, rememberme };