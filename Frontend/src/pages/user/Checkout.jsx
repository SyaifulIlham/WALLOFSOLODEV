import React, { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import Navbar from '../../components/nav';

const METODE_BAYAR = [
    {
        id: 'transfer_bca',
        kategori: 'Transfer Bank',
        nama: 'BCA',
        icon: '🏦',
        detail: 'Kode Virtual Account: 1234-5678-9012',
    },
    {
        id: 'transfer_mandiri',
        kategori: 'Transfer Bank',
        nama: 'Mandiri',
        icon: '🏦',
        detail: 'Kode Virtual Account: 9876-5432-1098',
    },
    {
        id: 'kartu_visa',
        kategori: 'Kartu Kredit/Debit',
        nama: 'Visa / Mastercard',
        icon: '💳',
        detail: 'Masukkan nomor kartu saat konfirmasi',
    },
    {
        id: 'ewallet_gopay',
        kategori: 'E-Wallet',
        nama: 'GoPay',
        icon: '📱',
        detail: 'Scan QR atau masukkan nomor HP',
    },
    {
        id: 'ewallet_ovo',
        kategori: 'E-Wallet',
        nama: 'OVO',
        icon: '📱',
        detail: 'Scan QR atau masukkan nomor HP',
    },
    {
        id: 'ewallet_dana',
        kategori: 'E-Wallet',
        nama: 'DANA',
        icon: '📱',
        detail: 'Scan QR atau masukkan nomor HP',
    },
];

const Checkout = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const state    = location.state;

    const [selectedMetode, setSelectedMetode] = useState(null);
    const [loading, setLoading]               = useState(false);
    const [error, setError]                   = useState(null);

    // Kalau tidak ada state (akses langsung), redirect ke home
    if (!state || !state.film) {
        return (
            <div style={{ backgroundColor: '#0a0b0d', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 16 }}>
                <p style={{ color: '#94a3b8' }}>Data pesanan tidak ditemukan.</p>
                <Link to="/" style={{ color: '#38bdf8' }}>Kembali ke Beranda</Link>
            </div>
        );
    }

    const { film, jadwal, selectedSeats, totalHarga, hargaPerKursi } = state;

    // Kelompokkan metode bayar per kategori
    const kategoriList = [...new Set(METODE_BAYAR.map(m => m.kategori))];

    const handleBayar = async () => {
        if (!selectedMetode) {
            setError('Pilih metode pembayaran dulu');
            return;
        }
        setError(null);
        setLoading(true);

        try {
            // TODO: hit API transaksi setelah teman selesai
            // const userId = localStorage.getItem('id_user');
            // const res = await axios.post(`${BASE_URL}/transaksi`, {
            //     id_user: userId,
            //     id_jadwal: jadwal?.id_jadwal,
            //     seats: selectedSeats.map(s => s.id_seat),
            //     total_harga: totalHarga,
            //     metode_bayar: selectedMetode,
            // });
            // const idTransaksi = res.data.data.id_transaksi;

            // Simulasi delay pembayaran
            await new Promise(resolve => setTimeout(resolve, 1500));

            // Navigate ke e-ticket dengan data
            navigate('/eticket', {
                state: {
                    film,
                    jadwal,
                    selectedSeats,
                    totalHarga,
                    hargaPerKursi,
                    metode: METODE_BAYAR.find(m => m.id === selectedMetode),
                    // id_transaksi: idTransaksi, // TODO: uncomment setelah API siap
                    id_transaksi: `TRX-${Date.now()}`, // sementara pakai timestamp
                    tanggal_transaksi: new Date().toISOString(),
                }
            });
        } catch (err) {
            setError('Gagal memproses pembayaran. Coba lagi.');
            setLoading(false);
        }
    };

    return (
        <div style={{ backgroundColor: '#0a0b0d', minHeight: '100vh', color: '#fff', fontFamily: "'Inter', sans-serif" }}>
            <style>{`
                @keyframes fadeUp { from { opacity:0; transform:translateY(16px) } to { opacity:1; transform:translateY(0) } }
                .fade-up { animation: fadeUp .4s ease both; }
                .metode-card { background: rgba(15,23,42,0.8); border: 1px solid rgba(255,255,255,0.07); border-radius: 12px; padding: 14px 18px; cursor: pointer; transition: all .15s; display: flex; align-items: center; gap: 14px; }
                .metode-card:hover { border-color: rgba(56,189,248,0.3); background: rgba(56,189,248,0.05); }
                .metode-card.active { border-color: #38bdf8; background: rgba(56,189,248,0.1); }
                .bayar-btn { width: 100%; padding: 16px; border-radius: 14px; border: none; background: #2563eb; color: #fff; font-size: 1rem; font-weight: 700; cursor: pointer; transition: background .2s, transform .2s; box-shadow: 0 8px 24px rgba(37,99,235,0.3); }
                .bayar-btn:hover:not(:disabled) { background: #1d4ed8; transform: translateY(-1px); }
                .bayar-btn:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }
            `}</style>

            <Navbar />

            <div style={{ maxWidth: 960, margin: '0 auto', padding: '40px 24px 80px' }}>

                {/* Breadcrumb */}
                <p style={{ color: '#64748b', fontSize: '0.85rem', marginBottom: 32 }}>
                    <Link to="/" style={{ color: '#64748b', textDecoration: 'none' }}>Beranda</Link>
                    <span style={{ margin: '0 8px' }}>/</span>
                    <span style={{ cursor: 'pointer', color: '#64748b' }} onClick={() => navigate(-1)}>Pilih Kursi</span>
                    <span style={{ margin: '0 8px' }}>/</span>
                    <span style={{ color: '#fff', fontWeight: 600 }}>Checkout</span>
                </p>

                <h2 style={{ fontWeight: 700, marginBottom: 32, color: '#f1f5f9' }}>Konfirmasi Pesanan</h2>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 24, alignItems: 'start' }}>

                    {/* ── Kiri: Detail pesanan + metode bayar ── */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

                        {/* Detail pesanan */}
                        <div className="fade-up" style={{ background: 'rgba(15,23,42,0.8)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: '24px' }}>
                            <h6 style={{ color: '#94a3b8', fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 20 }}>Detail Pesanan</h6>

                            {/* Film info */}
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
                                                📅 {new Date(jadwal.tanggal_tayang).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                                            </p>
                                            <p style={{ margin: 0, color: '#94a3b8', fontSize: '0.85rem' }}>🕐 {jadwal.jam_tayang}</p>
                                        </>
                                    )}
                                </div>
                            </div>

                            {/* Kursi */}
                            <div style={{ marginBottom: 16, paddingBottom: 16, borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                                <p style={{ color: '#64748b', fontSize: '0.78rem', marginBottom: 10 }}>Kursi yang dipilih</p>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                                    {selectedSeats.map(s => (
                                        <span key={s.id_seat} style={{ padding: '4px 12px', borderRadius: 20, backgroundColor: 'rgba(56,189,248,0.12)', color: '#38bdf8', border: '1px solid rgba(56,189,248,0.25)', fontSize: '0.85rem', fontWeight: 600 }}>
                                            {s.nomor_kursi}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Rincian harga */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <span style={{ color: '#94a3b8', fontSize: '0.88rem' }}>Harga per kursi</span>
                                    <span style={{ color: '#f1f5f9', fontSize: '0.88rem' }}>Rp {hargaPerKursi.toLocaleString('id-ID')}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <span style={{ color: '#94a3b8', fontSize: '0.88rem' }}>Jumlah kursi</span>
                                    <span style={{ color: '#f1f5f9', fontSize: '0.88rem' }}>{selectedSeats.length} kursi</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 12, borderTop: '1px solid rgba(255,255,255,0.07)', marginTop: 4 }}>
                                    <span style={{ color: '#fff', fontWeight: 700 }}>Total</span>
                                    <span style={{ color: '#38bdf8', fontWeight: 800, fontSize: '1.1rem' }}>Rp {totalHarga.toLocaleString('id-ID')}</span>
                                </div>
                            </div>
                        </div>

                        {/* Metode pembayaran */}
                        <div className="fade-up" style={{ background: 'rgba(15,23,42,0.8)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: '24px' }}>
                            <h6 style={{ color: '#94a3b8', fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 20 }}>Metode Pembayaran</h6>

                            {kategoriList.map(kategori => (
                                <div key={kategori} style={{ marginBottom: 20 }}>
                                    <p style={{ color: '#475569', fontSize: '0.78rem', fontWeight: 600, marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{kategori}</p>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                                        {METODE_BAYAR.filter(m => m.kategori === kategori).map(metode => (
                                            <div
                                                key={metode.id}
                                                className={`metode-card ${selectedMetode === metode.id ? 'active' : ''}`}
                                                onClick={() => { setSelectedMetode(metode.id); setError(null); }}
                                            >
                                                {/* Radio */}
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

                            {error && (
                                <p style={{ color: '#f87171', fontSize: '0.82rem', margin: '8px 0 0' }}>⚠ {error}</p>
                            )}
                        </div>
                    </div>

                    {/* ── Kanan: Summary + Tombol bayar ── */}
                    <div style={{ position: 'sticky', top: 24 }}>
                        <div className="fade-up" style={{ background: 'rgba(15,23,42,0.8)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: '24px' }}>
                            <h6 style={{ color: '#94a3b8', fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 20 }}>Ringkasan</h6>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 24 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span style={{ color: '#94a3b8', fontSize: '0.88rem' }}>Film</span>
                                    <span style={{ color: '#f1f5f9', fontSize: '0.88rem', fontWeight: 600, maxWidth: 180, textAlign: 'right' }}>{film.judul_film}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span style={{ color: '#94a3b8', fontSize: '0.88rem' }}>Kursi</span>
                                    <span style={{ color: '#f1f5f9', fontSize: '0.88rem' }}>{selectedSeats.map(s => s.nomor_kursi).join(', ')}</span>
                                </div>
                                {jadwal && (
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <span style={{ color: '#94a3b8', fontSize: '0.88rem' }}>Jam</span>
                                        <span style={{ color: '#f1f5f9', fontSize: '0.88rem' }}>{jadwal.jam_tayang}</span>
                                    </div>
                                )}
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span style={{ color: '#94a3b8', fontSize: '0.88rem' }}>Metode</span>
                                    <span style={{ color: selectedMetode ? '#38bdf8' : '#475569', fontSize: '0.88rem', fontWeight: 600 }}>
                                        {selectedMetode ? METODE_BAYAR.find(m => m.id === selectedMetode)?.nama : 'Belum dipilih'}
                                    </span>
                                </div>
                            </div>

                            <div style={{ borderTop: '1px solid rgba(255,255,255,0.07)', paddingTop: 16, marginBottom: 20 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span style={{ color: '#fff', fontWeight: 700, fontSize: '0.95rem' }}>Total Bayar</span>
                                    <span style={{ color: '#38bdf8', fontWeight: 800, fontSize: '1.3rem' }}>Rp {totalHarga.toLocaleString('id-ID')}</span>
                                </div>
                            </div>

                            <button className="bayar-btn" onClick={handleBayar} disabled={loading}>
                                {loading ? (
                                    <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
                                        <span style={{ width: 18, height: 18, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.8s linear infinite', display: 'inline-block' }} />
                                        Memproses...
                                    </span>
                                ) : '💳 Bayar Sekarang'}
                            </button>

                            <button
                                onClick={() => navigate(-1)}
                                style={{ width: '100%', marginTop: 10, padding: '12px', borderRadius: 14, border: '1px solid rgba(255,255,255,0.1)', background: 'transparent', color: '#94a3b8', cursor: 'pointer', fontWeight: 600, fontSize: '0.88rem', transition: 'background .15s' }}
                                onMouseEnter={e => e.target.style.background = 'rgba(255,255,255,0.05)'}
                                onMouseLeave={e => e.target.style.background = 'transparent'}
                            >
                                ← Kembali Pilih Kursi
                            </button>
                        </div>
                    </div>

                </div>
            </div>

            <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
        </div>
    );
};

export default Checkout;