import React from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import Navbar from '../../components/nav';

const formatTanggalTayang = (dateStr) => {
    if (!dateStr) return '-';
    // Coba parse format DD-MM-YYYY dulu
    const parts = dateStr.split('-');
    let date;
    if (parts.length === 3 && parts[0].length === 2) {
        // DD-MM-YYYY
        date = new Date(parts[2], parts[1] - 1, parts[0]);
    } else {
        // YYYY-MM-DD atau format lain
        date = new Date(dateStr);
    }
    if (isNaN(date.getTime())) return dateStr;
    return date.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
};

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
                    body * { visibility: hidden; }
                    #print-ticket-eticket, #print-ticket-eticket * { visibility: visible; }
                    #print-ticket-eticket {
                        display: block !important;
                        position: absolute; left: 0; top: 0; width: 100%;
                        margin: 0; padding: 24px 40px;
                        background: #fff !important;
                        color: #000 !important;
                        font-family: 'Inter', 'Segoe UI', sans-serif;
                    }
                    .screen-only { display: none !important; }
                }
            `}</style>

            {/* ── Print-only white e-ticket (hidden on screen) ── */}
            <div id="print-ticket-eticket" style={{ display: 'none' }}>
                {/* Success header */}
                <div style={{ textAlign: 'center', marginBottom: 28 }}>
                    <div style={{
                        width: 56, height: 56, borderRadius: '50%',
                        backgroundColor: '#e0f7ea', border: '2px solid #4ade80',
                        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                        marginBottom: 12, fontSize: '1.5rem',
                    }}>
                        ✅
                    </div>
                    <h2 style={{ fontWeight: 800, color: '#1e293b', margin: '0 0 4px', fontSize: '1.2rem' }}>Pembayaran Berhasil!</h2>
                    <p style={{ color: '#64748b', fontSize: '0.82rem', margin: 0 }}>
                        Tiketmu sudah siap. Tunjukkan e-ticket ini saat masuk bioskop.
                    </p>
                </div>

                {/* Ticket card */}
                <div style={{ border: '1px solid #e2e8f0', borderRadius: 16, overflow: 'hidden', maxWidth: 480, margin: '0 auto' }}>
                    {/* Header with poster */}
                    <div style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 14, borderBottom: '1px solid #e2e8f0' }}>
                        <img
                            src={film.poster} alt={film.judul_film}
                            style={{ width: 50, height: 72, objectFit: 'cover', borderRadius: 6, flexShrink: 0 }}
                        />
                        <div>
                            <p style={{ color: '#94a3b8', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '1px', margin: '0 0 2px' }}>E-Ticket</p>
                            <h4 style={{ fontWeight: 800, color: '#1e293b', margin: '0 0 6px', textTransform: 'uppercase', fontSize: '0.95rem' }}>
                                {film.judul_film}
                            </h4>
                            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                                <span style={{ padding: '2px 8px', borderRadius: 16, backgroundColor: '#e0f2fe', color: '#0284c7', border: '1px solid #bae6fd', fontSize: '0.7rem', fontWeight: 600 }}>
                                    {film.genre}
                                </span>
                                <span style={{ padding: '2px 8px', borderRadius: 16, backgroundColor: '#f1f5f9', color: '#64748b', border: '1px solid #e2e8f0', fontSize: '0.7rem' }}>
                                    {film.durasi} Menit
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Body */}
                    <div style={{ padding: '16px 20px' }}>
                        {/* Info grid */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 16 }}>
                            <div>
                                <p style={{ color: '#94a3b8', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.5px', margin: '0 0 2px' }}>Tanggal Tayang</p>
                                <p style={{ color: '#1e293b', fontWeight: 600, fontSize: '0.82rem', margin: 0 }}>
                                    {jadwal ? formatTanggalTayang(jadwal.tanggal_tayang) : '-'}
                                </p>
                            </div>
                            <div>
                                <p style={{ color: '#94a3b8', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.5px', margin: '0 0 2px' }}>Jam Tayang</p>
                                <p style={{ color: '#1e293b', fontWeight: 600, fontSize: '0.82rem', margin: 0 }}>
                                    {jadwal?.jam_tayang?.slice(0, 5) || '-'}
                                </p>
                            </div>
                            <div>
                                <p style={{ color: '#94a3b8', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.5px', margin: '0 0 2px' }}>Jumlah Kursi</p>
                                <p style={{ color: '#1e293b', fontWeight: 600, fontSize: '0.82rem', margin: 0 }}>{selectedSeats.length} Kursi</p>
                            </div>
                            <div>
                                <p style={{ color: '#94a3b8', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.5px', margin: '0 0 2px' }}>Harga / Kursi</p>
                                <p style={{ color: '#1e293b', fontWeight: 600, fontSize: '0.82rem', margin: 0 }}>
                                    Rp {hargaPerKursi.toLocaleString('id-ID')}
                                </p>
                            </div>
                        </div>

                        {/* Nomor kursi */}
                        <div style={{ marginBottom: 16, paddingBottom: 16, borderBottom: '1px dashed #e2e8f0' }}>
                            <p style={{ color: '#94a3b8', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.5px', margin: '0 0 8px' }}>Nomor Kursi</p>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                                {selectedSeats.map(s => (
                                    <span key={s.id_seat} style={{
                                        padding: '4px 12px', borderRadius: 16, fontWeight: 700, fontSize: '0.78rem',
                                        backgroundColor: '#e0f2fe', color: '#0284c7', border: '1px solid #bae6fd',
                                    }}>
                                        {s.nomor_kursi}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Transaction info */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 16, paddingBottom: 16, borderBottom: '1px dashed #e2e8f0' }}>
                            <div>
                                <p style={{ color: '#94a3b8', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.5px', margin: '0 0 2px' }}>ID Transaksi</p>
                                <p style={{ color: '#1e293b', fontWeight: 600, fontSize: '0.82rem', margin: 0, fontFamily: 'monospace' }}>{id_transaksi}</p>
                            </div>
                            <div>
                                <p style={{ color: '#94a3b8', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.5px', margin: '0 0 2px' }}>Metode Bayar</p>
                                <p style={{ color: '#1e293b', fontWeight: 600, fontSize: '0.82rem', margin: 0 }}>{metode?.nama || '-'}</p>
                            </div>
                            <div>
                                <p style={{ color: '#94a3b8', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.5px', margin: '0 0 2px' }}>Tanggal Bayar</p>
                                <p style={{ color: '#1e293b', fontWeight: 600, fontSize: '0.82rem', margin: 0 }}>{formatTanggal(tanggal_transaksi)}</p>
                            </div>
                            <div>
                                <p style={{ color: '#94a3b8', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.5px', margin: '0 0 2px' }}>Status</p>
                                <span style={{
                                    padding: '2px 10px', borderRadius: 16, fontSize: '0.75rem', fontWeight: 700,
                                    backgroundColor: '#dcfce7', color: '#16a34a', border: '1px solid #bbf7d0',
                                }}>
                                    ● Berhasil
                                </span>
                            </div>
                        </div>

                        {/* Total */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ color: '#64748b', fontWeight: 600, fontSize: '0.88rem' }}>Total Pembayaran</span>
                            <span style={{ color: '#0f172a', fontWeight: 800, fontSize: '1.2rem' }}>
                                Rp {totalHarga.toLocaleString('id-ID')}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── On-screen content (hidden on print) ── */}
            <div className="screen-only">
                <Navbar />
            </div>

            <div className="screen-only" style={{ maxWidth: 680, margin: '0 auto', padding: '40px 24px 80px' }}>

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
                <div className="ticket-container" style={{
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
                                { label: 'Tanggal Tayang', value: jadwal ? formatTanggalTayang(jadwal.tanggal_tayang) : '-' },
                                { label: 'Jam Tayang',     value: jadwal?.jam_tayang?.slice(0, 5) || '-' },
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
                <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
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