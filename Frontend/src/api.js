// src/api.js
// ─────────────────────────────────────────────────────────
// Satu-satunya tempat BASE_URL didefinisikan.
// Kalau mau ganti URL (misal deploy ke server), 
// cukup ubah file .env saja — tidak perlu sentuh file lain.
// ─────────────────────────────────────────────────────────

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

export default BASE_URL;