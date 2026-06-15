import React, { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import Navbar from '../../components/nav';
import axios from 'axios';
import BASE_URL from '../../api';

const METODE_BAYAR = [
    { id: 'transfer_bca',     kategori: 'Transfer Bank',       nama: 'BCA',            icon: '🏦', detail: 'Kode Virtual Account: 1234-5678-9012' },
    { id: 'transfer_mandiri', kategori: 'Transfer Bank',       nama: 'Mandiri',        icon: '🏦', detail: 'Kode Virtual Account: 9876-5432-1098' },
    { id: 'kartu_visa',       kategori: 'Kartu Kredit/Debit',  nama: 'Visa / Mastercard', icon: '💳', detail: 'Masukkan nomor kartu saat konfirmasi' },
    { id: 'ewallet_gopay',    kategori: 'E-Wallet',            nama: 'GoPay',          icon: '📱', detail: 'Scan QR atau masukkan nomor HP' },
    { id: 'ewallet_ovo',      kategori: 'E-Wallet',            nama: 'OVO',            icon: '📱', detail: 'Scan QR atau masukkan nomor HP' },
    { id: 'ewallet_dana',     kategori: 'E-Wallet',            nama: 'DANA',           icon: '📱', detail: 'Scan QR atau masukkan nomor HP' },
];

const kategoriList = [...new Set(METODE_BAYAR.map(m => m.kategori))];

const Section = ({ title, children }) => (
    <div style={{ background: 'rgba(15,23,42,0.8)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: '24px', marginBottom: 16 }}>
        <h6 style={{ color: '#94a3b8', fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 20 }}>{title}</h6>
        {children}
    </div>
);

const parseTanggal = (dateStr) => {
    if (!dateStr) return new Date();
    const parts = dateStr.split('-');
    if (parts.length === 3 && parts[0].length === 2) {
        return new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);
    }
    return new Date(dateStr);
};

const Checkout = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const state    = location.state;

    const [selectedMetode, setSelectedMetode] = useState(null);
    const [loading, setLoading]               = useState(false);
    const [error, setError]                   = useState(null);

    const id_user = localStorage.getItem('id_user');

    if (!id_user) {
        return (
            <div style={{ backgroundColor: '#0a0b0d', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 16 }}>
                <p style={{ color: '#f87171' }}>Kamu harus login dulu untuk melanjutkan checkout.</p>
                <Link to="/login" style={{ padding: '12px 24px', backgroundColor: '#dc3545', color: '#fff', borderRadius: '8px', textDecoration: 'none', fontWeight: 600 }}>Login Dulu</Link>
            </div>
        );
    }

    if (!state || !state.film) {
        return (
            <div style={{ backgroundColor: '#0a0b0d', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 16 }}>
                <p style={{ color: '#94a3b8' }}>Data pesanan tidak ditemukan.</p>
                <Link to="/" style={{ color: '#38bdf8' }}>Kembali ke Beranda</Link>
            </div>
        );
    }

    const { film, jadwal, selectedSeats, totalHarga, hargaPerKursi } = state;

    const handleBayar = async () => {
        if (!selectedMetode) { setError('Pilih metode pembayaran dulu'); return; }
        
        const id_user = localStorage.getItem('id_user');
        if (!id_user) {
            setError('Kamu harus login dulu');
            return;
        }

        setError(null);
        setLoading(true);
        try {
            // Format tanggal dari DD-MM-YYYY ke YYYY-MM-DD untuk backend
            let tglDB = jadwal.tanggal_tayang;
            const parts = tglDB.split('-');
            if (parts.length === 3 && parts[0].length === 2) {
                tglDB = `${parts[2]}-${parts[1]}-${parts[0]}`;
            }

            const body = {
                id_user: id_user,
                tikets: selectedSeats.map(s => ({
                    id_film: film.id_film,
                    id_seat: s.id_seat,
                    jadwal_tayang: tglDB + ' ' + jadwal.jam_tayang,
                    harga: hargaPerKursi
                }))
            };

            const response = await axios.post(`${BASE_URL}/transaksi`, body);
            const resData = response.data.data || response.data;

            // Langsung update status ke berhasil
            await axios.put(`${BASE_URL}/transaksi/${resData.id_transaksi}/status`, {
                status_pembayaran: 'berhasil'
            });

            navigate('/eticket', {
                state: {
                    film, jadwal, selectedSeats, totalHarga, hargaPerKursi,
                    metode: METODE_BAYAR.find(m => m.id === selectedMetode),
                    id_transaksi: resData.id_transaksi || `TRX-${Date.now()}`,
                    tanggal_transaksi: resData.tanggal_transaksi || new Date().toISOString(),
                }
            });
        } catch (err) {
            console.error('Error bayar:', err);
            setError('Gagal memproses pembayaran. Coba lagi.');
            setLoading(false);
        }
    };

    return (
        <div style={{ backgroundColor: '#0a0b0d', minHeight: '100vh', color: '#fff', fontFamily: "'Inter', sans-serif" }}>
            <style>{`
                @keyframes fadeUp { from { opacity:0; transform:translateY(16px) } to { opacity:1; transform:translateY(0) } }
                @keyframes spin   { to { transform: rotate(360deg) } }
                .fade-up { animation: fadeUp .4s ease both; }
                .metode-card { background:rgba(15,23,42,0.8); border:1px solid rgba(255,255,255,0.07); border-radius:12px; padding:14px 18px; cursor:pointer; transition:all .15s; display:flex; align-items:center; gap:14px; }
                .metode-card:hover { border-color:rgba(56,189,248,0.3); background:rgba(56,189,248,0.05); }
                .metode-card.active { border-color:#38bdf8; background:rgba(56,189,248,0.1); }
                .bayar-btn { width:100%; padding:16px; border-radius:14px; border:none; background:#2563eb; color:#fff; font-size:1rem; font-weight:700; cursor:pointer; transition:background .2s, transform .2s; box-shadow:0 8px 24px rgba(37,99,235,0.3); }
                .bayar-btn:hover:not(:disabled) { background:#1d4ed8; transform:translateY(-1px); }
                .bayar-btn:disabled { opacity:0.6; cursor:not-allowed; transform:none; }
                .back-btn:hover { background:rgba(255,255,255,0.05) !important; }
            `}</style>

            <Navbar />

            <div style={{ maxWidth: 680, margin: '0 auto', padding: '40px 24px 80px' }}>

                {/* Breadcrumb */}
                <p style={{ color: '#64748b', fontSize: '0.85rem', marginBottom: 32 }}>
                    <Link to="/" style={{ color: '#64748b', textDecoration: 'none' }}>Beranda</Link>
                    <span style={{ margin: '0 8px' }}>/</span>
                    <span style={{ cursor: 'pointer', color: '#64748b' }} onClick={() => navigate(-1)}>Pilih Kursi</span>
                    <span style={{ margin: '0 8px' }}>/</span>
                    <span style={{ color: '#fff', fontWeight: 600 }}>Checkout</span>
                </p>

                <h2 style={{ fontWeight: 700, marginBottom: 28, color: '#f1f5f9' }}>Konfirmasi Pesanan</h2>

                {/* ── 1. Detail Pesanan ── */}
                <Section title="Detail Pesanan">
                    {/* Film */}
                    <div style={{ display: 'flex', gap: 16, marginBottom: 20, paddingBottom: 20, borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                        <img
                            src={film.poster} alt={film.judul_film}
                            style={{ width: 64, height: 90, objectFit: 'cover', borderRadius: 8, flexShrink: 0 }}
                            onError={e => { e.target.onerror = null; e.target.src = 'https://placehold.co/64x90/111/333?text=?'; }}
                        />
                        <div>
                            <h5 style={{ margin: '0 0 8px', fontWeight: 700, color: '#f1f5f9', textTransform: 'uppercase', fontSize: '1rem' }}>{film.judul_film}</h5>
                            <p style={{ margin: '0 0 4px', color: '#64748b', fontSize: '0.85rem' }}>🎬 {film.genre} · ⏱ {film.durasi} Menit</p>
                            {jadwal && (
                                <>
                                    <p style={{ margin: '0 0 2px', color: '#94a3b8', fontSize: '0.85rem' }}>
                                        📅 {parseTanggal(jadwal.tanggal_tayang).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                                    </p>
                                    <p style={{ margin: 0, color: '#94a3b8', fontSize: '0.85rem' }}>🕐 {jadwal.jam_tayang}</p>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Kursi */}
                    <div style={{ marginBottom: 20, paddingBottom: 20, borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                        <p style={{ color: '#64748b', fontSize: '0.78rem', marginBottom: 10 }}>Kursi yang dipilih</p>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                            {selectedSeats.map(s => (
                                <span key={s.id_seat} style={{ padding: '4px 14px', borderRadius: 20, backgroundColor: 'rgba(56,189,248,0.12)', color: '#38bdf8', border: '1px solid rgba(56,189,248,0.25)', fontSize: '0.88rem', fontWeight: 600 }}>
                                    {s.nomor_kursi}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Rincian harga */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                        {[
                            { label: 'Harga per kursi', value: `Rp ${hargaPerKursi.toLocaleString('id-ID')}` },
                            { label: 'Jumlah kursi',    value: `${selectedSeats.length} kursi` },
                        ].map(({ label, value }) => (
                            <div key={label} style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span style={{ color: '#94a3b8', fontSize: '0.88rem' }}>{label}</span>
                                <span style={{ color: '#f1f5f9', fontSize: '0.88rem' }}>{value}</span>
                            </div>
                        ))}
                        <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 12, borderTop: '1px solid rgba(255,255,255,0.07)', marginTop: 4 }}>
                            <span style={{ color: '#fff', fontWeight: 700 }}>Total</span>
                            <span style={{ color: '#38bdf8', fontWeight: 800, fontSize: '1.1rem' }}>Rp {totalHarga.toLocaleString('id-ID')}</span>
                        </div>
                    </div>
                </Section>

                {/* ── 2. Metode Pembayaran ── */}
                <Section title="Metode Pembayaran">
                    {kategoriList.map(kategori => (
                        <div key={kategori} style={{ marginBottom: 20 }}>
                            <p style={{ color: '#475569', fontSize: '0.78rem', fontWeight: 600, marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                {kategori}
                            </p>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                                {METODE_BAYAR.filter(m => m.kategori === kategori).map(metode => (
                                    <div
                                        key={metode.id}
                                        className={`metode-card ${selectedMetode === metode.id ? 'active' : ''}`}
                                        onClick={() => { setSelectedMetode(metode.id); setError(null); }}
                                    >
                                        <div style={{
                                            width: 20, height: 20, borderRadius: '50%', flexShrink: 0,
                                            border: `2px solid ${selectedMetode === metode.id ? '#38bdf8' : 'rgba(255,255,255,0.2)'}`,
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        }}>
                                            {selectedMetode === metode.id && (
                                                <div style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: '#38bdf8' }} />
                                            )}
                                        </div>
                                        <span style={{ fontSize: '1.2rem' }}>{metode.icon}</span>
                                        <div style={{ flex: 1 }}>
                                            <p style={{ margin: 0, fontWeight: 600, color: '#f1f5f9', fontSize: '0.9rem' }}>{metode.nama}</p>
                                            <p style={{ margin: 0, color: '#64748b', fontSize: '0.78rem' }}>{metode.detail}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                    {error && <p style={{ color: '#f87171', fontSize: '0.82rem', margin: '4px 0 0' }}>⚠ {error}</p>}
                </Section>

                {/* ── 3. Ringkasan ── */}
                <Section title="Ringkasan">
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 20 }}>
                        {[
                            { label: 'Film',   value: film.judul_film },
                            { label: 'Kursi',  value: selectedSeats.map(s => s.nomor_kursi).join(', ') },
                            jadwal && { label: 'Tanggal', value: parseTanggal(jadwal.tanggal_tayang).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) },
                            jadwal && { label: 'Jam',     value: jadwal.jam_tayang.slice(0, 5) },
                            { label: 'Metode', value: selectedMetode ? METODE_BAYAR.find(m => m.id === selectedMetode)?.nama : 'Belum dipilih', highlight: !!selectedMetode },
                        ].filter(Boolean).map(({ label, value, highlight }) => (
                            <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ color: '#94a3b8', fontSize: '0.88rem' }}>{label}</span>
                                <span style={{ color: highlight ? '#38bdf8' : '#f1f5f9', fontSize: '0.88rem', fontWeight: highlight ? 700 : 500, textAlign: 'right', maxWidth: '60%' }}>{value}</span>
                            </div>
                        ))}
                    </div>

                    {/* Total */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 16, borderTop: '1px solid rgba(255,255,255,0.07)', marginBottom: 20 }}>
                        <span style={{ color: '#fff', fontWeight: 700, fontSize: '1rem' }}>Total Bayar</span>
                        <span style={{ color: '#38bdf8', fontWeight: 800, fontSize: '1.4rem' }}>Rp {totalHarga.toLocaleString('id-ID')}</span>
                    </div>

                    {/* Tombol */}
                    <button className="bayar-btn" onClick={handleBayar} disabled={loading}>
                        {loading ? (
                            <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
                                <span style={{ width: 18, height: 18, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.8s linear infinite', display: 'inline-block' }} />
                                Memproses...
                            </span>
                        ) : '💳 Bayar Sekarang'}
                    </button>

                    <button
                        className="back-btn"
                        onClick={() => navigate(-1)}
                        style={{ width: '100%', marginTop: 10, padding: '12px', borderRadius: 14, border: '1px solid rgba(255,255,255,0.1)', background: 'transparent', color: '#94a3b8', cursor: 'pointer', fontWeight: 600, fontSize: '0.88rem', transition: 'background .15s' }}
                    >
                        ← Kembali Pilih Kursi
                    </button>
                </Section>

            </div>
        </div>
    );
};

export default Checkout;