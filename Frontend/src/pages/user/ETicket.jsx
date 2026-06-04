import React from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import Navbar from '../../components/nav';

const ETicket = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const state    = location.state;

    if (!state || !state.film) {
        return (
            <div style={{ backgroundColor: '#0a0b0d', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 16 }}>
                <p style={{ color: '#94a3b8' }}>Data tiket tidak ditemukan.</p>
                <Link to="/" style={{ color: '#38bdf8' }}>Kembali ke Beranda</Link>
            </div>
        );
    }

    const { film, jadwal, selectedSeats, totalHarga, hargaPerKursi, metode, id_transaksi, tanggal_transaksi } = state;

    const formatTanggal = (isoStr) => {
        if (!isoStr) return '-';
        return new Date(isoStr).toLocaleDateString('id-ID', {
            weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
            hour: '2-digit', minute: '2-digit',
        });
    };

    return (
        <div style={{ backgroundColor: '#0a0b0d', minHeight: '100vh', color: '#fff', fontFamily: "'Inter', sans-serif" }}>
            <style>{`
                @keyframes fadeUp { from { opacity:0; transform:translateY(20px) } to { opacity:1; transform:translateY(0) } }
                @keyframes checkPop { 0% { transform:scale(0); opacity:0 } 60% { transform:scale(1.2) } 100% { transform:scale(1); opacity:1 } }
                .ticket-container { animation: fadeUp .5s ease both; }
                .print-btn:hover { background: rgba(255,255,255,0.1) !important; }
                .home-btn:hover { background: #1d4ed8 !important; }
                @media print {
                    .no-print { display: none !important; }
                    body { background: #fff !important; color: #000 !important; }
                    .ticket-body { background: #fff !important; color: #000 !important; border: 1px solid #ddd !important; }
                }
            `}</style>

            <div className="no-print">
                <Navbar />
            </div>

            <div style={{ maxWidth: 680, margin: '0 auto', padding: '40px 24px 80px' }}>

                {/* Success header */}
                <div style={{ textAlign: 'center', marginBottom: 40, animation: 'fadeUp .4s ease' }}>
                    <div style={{
                        width: 72, height: 72, borderRadius: '50%',
                        backgroundColor: 'rgba(34,197,94,0.15)',
                        border: '2px solid rgba(34,197,94,0.4)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        margin: '0 auto 16px',
                        animation: 'checkPop .5s ease .2s both',
                        fontSize: '2rem',
                    }}>
                        ✅
                    </div>
                    <h2 style={{ fontWeight: 800, color: '#f1f5f9', marginBottom: 8 }}>Pembayaran Berhasil!</h2>
                    <p style={{ color: '#64748b', fontSize: '0.9rem', margin: 0 }}>
                        Tiketmu sudah siap. Tunjukkan e-ticket ini saat masuk bioskop.
                    </p>
                </div>

                {/* Tiket */}
                <div className="ticket-container ticket-body" style={{
                    background: 'rgba(15,23,42,0.9)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: 20,
                    overflow: 'hidden',
                }}>
                    {/* Header tiket */}
                    <div style={{
                        background: 'linear-gradient(135deg, #1e3a5f, #0f2744)',
                        padding: '24px',
                        display: 'flex', alignItems: 'center', gap: 16,
                        borderBottom: '1px dashed rgba(255,255,255,0.1)',
                    }}>
                        <img
                            src={film.poster} alt={film.judul_film}
                            style={{ width: 70, height: 100, objectFit: 'cover', borderRadius: 8, flexShrink: 0, boxShadow: '0 4px 16px rgba(0,0,0,0.5)' }}
                            onError={e => { e.target.onerror = null; e.target.src = 'https://placehold.co/70x100/111/333?text=?'; }}
                        />
                        <div>
                            <p style={{ color: '#64748b', fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '1px', margin: '0 0 6px' }}>E-Ticket</p>
                            <h4 style={{ fontWeight: 800, color: '#f1f5f9', margin: '0 0 8px', textTransform: 'uppercase', fontSize: '1.1rem' }}>{film.judul_film}</h4>
                            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                                <span style={{ padding: '3px 10px', borderRadius: 20, backgroundColor: 'rgba(56,189,248,0.12)', color: '#38bdf8', border: '1px solid rgba(56,189,248,0.2)', fontSize: '0.75rem', fontWeight: 600 }}>
                                    {film.genre}
                                </span>
                                <span style={{ padding: '3px 10px', borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.06)', color: '#94a3b8', border: '1px solid rgba(255,255,255,0.1)', fontSize: '0.75rem' }}>
                                    {film.durasi} Menit
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Body tiket */}
                    <div style={{ padding: '24px' }}>

                        {/* Grid info */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 24 }}>
                            {[
                                { label: 'Tanggal Tayang', value: jadwal ? new Date(jadwal.tanggal_tayang).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }) : '-' },
                                { label: 'Jam Tayang',     value: jadwal?.jam_tayang || '-' },
                                { label: 'Jumlah Kursi',   value: `${selectedSeats.length} Kursi` },
                                { label: 'Harga / Kursi',  value: `Rp ${hargaPerKursi.toLocaleString('id-ID')}` },
                            ].map(({ label, value }) => (
                                <div key={label}>
                                    <p style={{ color: '#475569', fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.5px', margin: '0 0 4px' }}>{label}</p>
                                    <p style={{ color: '#f1f5f9', fontWeight: 600, fontSize: '0.92rem', margin: 0 }}>{value}</p>
                                </div>
                            ))}
                        </div>

                        {/* Nomor kursi */}
                        <div style={{ marginBottom: 24, paddingBottom: 24, borderBottom: '1px dashed rgba(255,255,255,0.08)' }}>
                            <p style={{ color: '#475569', fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.5px', margin: '0 0 10px' }}>Nomor Kursi</p>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                                {selectedSeats.map(s => (
                                    <span key={s.id_seat} style={{
                                        padding: '6px 16px', borderRadius: 20,
                                        backgroundColor: 'rgba(56,189,248,0.12)', color: '#38bdf8',
                                        border: '1px solid rgba(56,189,248,0.25)',
                                        fontSize: '0.9rem', fontWeight: 700,
                                    }}>
                                        {s.nomor_kursi}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Info transaksi */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 24, paddingBottom: 24, borderBottom: '1px dashed rgba(255,255,255,0.08)' }}>
                            <div>
                                <p style={{ color: '#475569', fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.5px', margin: '0 0 4px' }}>ID Transaksi</p>
                                <p style={{ color: '#f1f5f9', fontWeight: 600, fontSize: '0.85rem', margin: 0, fontFamily: 'monospace' }}>{id_transaksi}</p>
                            </div>
                            <div>
                                <p style={{ color: '#475569', fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.5px', margin: '0 0 4px' }}>Metode Bayar</p>
                                <p style={{ color: '#f1f5f9', fontWeight: 600, fontSize: '0.85rem', margin: 0 }}>{metode?.nama || '-'}</p>
                            </div>
                            <div>
                                <p style={{ color: '#475569', fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.5px', margin: '0 0 4px' }}>Tanggal Bayar</p>
                                <p style={{ color: '#f1f5f9', fontWeight: 600, fontSize: '0.85rem', margin: 0 }}>{formatTanggal(tanggal_transaksi)}</p>
                            </div>
                            <div>
                                <p style={{ color: '#475569', fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.5px', margin: '0 0 4px' }}>Status</p>
                                <span style={{ padding: '3px 12px', borderRadius: 20, backgroundColor: 'rgba(34,197,94,0.12)', color: '#4ade80', border: '1px solid rgba(34,197,94,0.25)', fontSize: '0.82rem', fontWeight: 700 }}>
                                    ● Berhasil
                                </span>
                            </div>
                        </div>

                        {/* Total */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ color: '#94a3b8', fontWeight: 600 }}>Total Pembayaran</span>
                            <span style={{ color: '#38bdf8', fontWeight: 800, fontSize: '1.3rem' }}>Rp {totalHarga.toLocaleString('id-ID')}</span>
                        </div>
                    </div>
                </div>

                {/* Tombol aksi */}
                <div className="no-print" style={{ display: 'flex', gap: 12, marginTop: 24 }}>
                    <button
                        className="print-btn"
                        onClick={() => window.print()}
                        style={{ flex: 1, padding: '14px', borderRadius: 14, border: '1px solid rgba(255,255,255,0.15)', background: 'transparent', color: '#94a3b8', cursor: 'pointer', fontWeight: 600, fontSize: '0.9rem', transition: 'background .15s' }}
                    >
                        🖨️ Print Tiket
                    </button>
                    <button
                        className="home-btn"
                        onClick={() => navigate('/')}
                        style={{ flex: 1, padding: '14px', borderRadius: 14, border: 'none', background: '#2563eb', color: '#fff', cursor: 'pointer', fontWeight: 700, fontSize: '0.9rem', transition: 'background .15s', boxShadow: '0 8px 24px rgba(37,99,235,0.3)' }}
                    >
                        🏠 Kembali ke Beranda
                    </button>
                </div>

            </div>
        </div>
    );
};

export default ETicket;