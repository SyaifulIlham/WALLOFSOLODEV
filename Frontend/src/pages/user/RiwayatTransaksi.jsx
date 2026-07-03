import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import BASE_URL from '../../api';
import Navbar from '../../components/nav';

// ── Skeleton loading card ──────────────────────────────────────────────────────
const SkeletonCard = () => (
    <div style={{
        background: 'rgba(15,23,42,0.8)', border: '1px solid rgba(255,255,255,0.07)',
        borderRadius: 16, padding: 24, display: 'flex', gap: 16,
    }}>
        {[80, 240, 120, 100].map((w, i) => (
            <div key={i} style={{
                width: w, height: 20, borderRadius: 6, flexShrink: 0,
                background: 'linear-gradient(90deg,#1e2330 25%,#262d40 50%,#1e2330 75%)',
                backgroundSize: '200% 100%', animation: 'shimmer 1.4s infinite',
            }} />
        ))}
        <style>{`@keyframes shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}`}</style>
    </div>
);

// ── Print Modal (e-ticket) ─────────────────────────────────────────────────────
const PrintModal = ({ transaksi, onClose }) => {
    if (!transaksi) return null;

    const handlePrint = () => window.print();

    return (
        <>
            {/* ── Print-only e-ticket (hidden on screen, shown on print) ── */}
            <div id="print-ticket" style={{ display: 'none' }}>
                <style>{`
                    @media print {
                        body * { visibility: hidden; }
                        #print-ticket, #print-ticket * { visibility: visible; }
                        #print-ticket {
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
                            src={transaksi.tikets?.[0]?.poster}
                            alt={transaksi.tikets?.[0]?.judul_film}
                            style={{ width: 50, height: 72, objectFit: 'cover', borderRadius: 6, flexShrink: 0 }}
                        />
                        <div>
                            <p style={{ color: '#94a3b8', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '1px', margin: '0 0 2px' }}>E-Ticket</p>
                            <h4 style={{ fontWeight: 800, color: '#1e293b', margin: '0 0 6px', textTransform: 'uppercase', fontSize: '0.95rem' }}>
                                {transaksi.tikets?.[0]?.judul_film || '-'}
                            </h4>
                            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                                {transaksi.tikets?.[0]?.genre && (
                                    <span style={{ padding: '2px 8px', borderRadius: 16, backgroundColor: '#e0f2fe', color: '#0284c7', border: '1px solid #bae6fd', fontSize: '0.7rem', fontWeight: 600 }}>
                                        {transaksi.tikets[0].genre}
                                    </span>
                                )}
                                {transaksi.tikets?.[0]?.durasi && (
                                    <span style={{ padding: '2px 8px', borderRadius: 16, backgroundColor: '#f1f5f9', color: '#64748b', border: '1px solid #e2e8f0', fontSize: '0.7rem' }}>
                                        {transaksi.tikets[0].durasi} Menit
                                    </span>
                                )}
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
                                    {transaksi.tikets?.[0]?.jadwal_tayang ? new Date(transaksi.tikets[0].jadwal_tayang).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }) : '-'}
                                </p>
                            </div>
                            <div>
                                <p style={{ color: '#94a3b8', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.5px', margin: '0 0 2px' }}>Jam Tayang</p>
                                <p style={{ color: '#1e293b', fontWeight: 600, fontSize: '0.82rem', margin: 0 }}>
                                    {transaksi.tikets?.[0]?.jadwal_tayang ? new Date(transaksi.tikets[0].jadwal_tayang).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) : '-'}
                                </p>
                            </div>
                            <div>
                                <p style={{ color: '#94a3b8', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.5px', margin: '0 0 2px' }}>Jumlah Kursi</p>
                                <p style={{ color: '#1e293b', fontWeight: 600, fontSize: '0.82rem', margin: 0 }}>{(transaksi.tikets || []).length} Kursi</p>
                            </div>
                            <div>
                                <p style={{ color: '#94a3b8', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.5px', margin: '0 0 2px' }}>Harga / Kursi</p>
                                <p style={{ color: '#1e293b', fontWeight: 600, fontSize: '0.82rem', margin: 0 }}>
                                    {transaksi.tikets?.[0]?.harga ? `Rp ${Number(transaksi.tikets[0].harga).toLocaleString('id-ID')}` : '-'}
                                </p>
                            </div>
                        </div>

                        {/* Nomor kursi */}
                        <div style={{ marginBottom: 16, paddingBottom: 16, borderBottom: '1px dashed #e2e8f0' }}>
                            <p style={{ color: '#94a3b8', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.5px', margin: '0 0 8px' }}>Nomor Kursi</p>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                                {(transaksi.tikets || []).map((t, i) => (
                                    <span key={i} style={{
                                        padding: '4px 12px', borderRadius: 16, fontWeight: 700, fontSize: '0.78rem',
                                        backgroundColor: '#e0f2fe', color: '#0284c7', border: '1px solid #bae6fd',
                                    }}>
                                        {t.nomor_kursi || `Kursi ${i + 1}`}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Transaction info */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 16, paddingBottom: 16, borderBottom: '1px dashed #e2e8f0' }}>
                            <div>
                                <p style={{ color: '#94a3b8', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.5px', margin: '0 0 2px' }}>ID Transaksi</p>
                                <p style={{ color: '#1e293b', fontWeight: 600, fontSize: '0.82rem', margin: 0, fontFamily: 'monospace' }}>{transaksi.id_transaksi}</p>
                            </div>
                            <div>
                                <p style={{ color: '#94a3b8', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.5px', margin: '0 0 2px' }}>Metode Bayar</p>
                                <p style={{ color: '#1e293b', fontWeight: 600, fontSize: '0.82rem', margin: 0 }}>{transaksi.metode_bayar || 'OVO'}</p>
                            </div>
                            <div>
                                <p style={{ color: '#94a3b8', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.5px', margin: '0 0 2px' }}>Tanggal Bayar</p>
                                <p style={{ color: '#1e293b', fontWeight: 600, fontSize: '0.82rem', margin: 0 }}>
                                    {transaksi.tanggal_transaksi ? new Date(transaksi.tanggal_transaksi).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '-'}
                                </p>
                            </div>
                            <div>
                                <p style={{ color: '#94a3b8', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.5px', margin: '0 0 2px' }}>Status</p>
                                <span style={{
                                    padding: '2px 10px', borderRadius: 16, fontSize: '0.75rem', fontWeight: 700,
                                    backgroundColor: transaksi.status_pembayaran === 'berhasil' ? '#dcfce7' : '#fef9c3',
                                    color: transaksi.status_pembayaran === 'berhasil' ? '#16a34a' : '#ca8a04',
                                    border: `1px solid ${transaksi.status_pembayaran === 'berhasil' ? '#bbf7d0' : '#fde68a'}`,
                                }}>
                                    {transaksi.status_pembayaran === 'berhasil' ? '● Berhasil' : '● Pending'}
                                </span>
                            </div>
                        </div>

                        {/* Total */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ color: '#64748b', fontWeight: 600, fontSize: '0.88rem' }}>Total Pembayaran</span>
                            <span style={{ color: '#0f172a', fontWeight: 800, fontSize: '1.2rem' }}>
                                Rp {Number(transaksi.total_harga || 0).toLocaleString('id-ID')}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── On-screen dark modal (hidden on print) ── */}
            <div className="screen-only" style={{
                position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.8)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                zIndex: 9999, padding: 24,
            }} onClick={onClose}>
                <div style={{
                    background: '#0f172a', border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: 20, width: '100%', maxWidth: 560,
                    maxHeight: '90vh', overflowY: 'auto',
                }} onClick={e => e.stopPropagation()}>

                    {/* Header modal */}
                    <div style={{
                        background: 'linear-gradient(135deg, #1e3a5f, #0f2744)',
                        padding: '20px 24px', borderRadius: '20px 20px 0 0',
                        display: 'flex', alignItems: 'center', gap: 16,
                    }}>
                        <img
                            src={transaksi.tikets?.[0]?.poster}
                            alt={transaksi.tikets?.[0]?.judul_film}
                            style={{ width: 56, height: 80, objectFit: 'cover', borderRadius: 8, flexShrink: 0 }}
                            onError={e => { e.target.onerror = null; e.target.src = 'https://placehold.co/56x80/111/333?text=?'; }}
                        />
                        <div>
                            <p style={{ color: '#64748b', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '1px', margin: '0 0 4px' }}>E-Ticket</p>
                            <h5 style={{ fontWeight: 800, color: '#f1f5f9', margin: '0 0 6px', textTransform: 'uppercase', fontSize: '0.95rem' }}>
                                {transaksi.tikets?.[0]?.judul_film || '-'}
                            </h5>
                            <span style={{
                                padding: '3px 10px', borderRadius: 20, fontSize: '0.72rem', fontWeight: 700,
                                backgroundColor: transaksi.status_pembayaran === 'berhasil' ? 'rgba(34,197,94,0.15)' : 'rgba(234,179,8,0.15)',
                                color: transaksi.status_pembayaran === 'berhasil' ? '#4ade80' : '#facc15',
                                border: `1px solid ${transaksi.status_pembayaran === 'berhasil' ? 'rgba(34,197,94,0.3)' : 'rgba(234,179,8,0.3)'}`,
                            }}>
                                {transaksi.status_pembayaran === 'berhasil' ? '● Berhasil' : '● Pending'}
                            </span>
                        </div>
                    </div>

                    {/* Body */}
                    <div style={{ padding: '20px 24px' }}>

                        {/* Grid info */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
                            {[
                                { label: 'ID Transaksi',    value: transaksi.id_transaksi, mono: true },
                                { label: 'Tanggal Bayar',   value: transaksi.tanggal_transaksi ? new Date(transaksi.tanggal_transaksi).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : '-' },
                                { label: 'Jam Tayang',      value: transaksi.tikets?.[0]?.jadwal_tayang ? new Date(transaksi.tikets[0].jadwal_tayang).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) : '-' },
                                { label: 'Tanggal Tayang',  value: transaksi.tikets?.[0]?.jadwal_tayang ? new Date(transaksi.tikets[0].jadwal_tayang).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long' }) : '-' },
                            ].map(({ label, value, mono }) => (
                                <div key={label}>
                                    <p style={{ color: '#475569', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.5px', margin: '0 0 4px' }}>{label}</p>
                                    <p style={{ color: '#f1f5f9', fontWeight: 600, fontSize: '0.85rem', margin: 0, fontFamily: mono ? 'monospace' : 'inherit' }}>{value}</p>
                                </div>
                            ))}
                        </div>

                        {/* Kursi */}
                        <div style={{ marginBottom: 20, paddingBottom: 20, borderBottom: '1px dashed rgba(255,255,255,0.08)' }}>
                            <p style={{ color: '#475569', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.5px', margin: '0 0 10px' }}>Nomor Kursi</p>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                                {(transaksi.tikets || []).map((t, i) => (
                                    <span key={i} style={{
                                        padding: '5px 14px', borderRadius: 20, fontWeight: 700, fontSize: '0.85rem',
                                        backgroundColor: 'rgba(56,189,248,0.12)', color: '#38bdf8',
                                        border: '1px solid rgba(56,189,248,0.25)',
                                    }}>
                                        {t.nomor_kursi || `Kursi ${i + 1}`}
                                    </span>
                                ))}
                                {(!transaksi.tikets || transaksi.tikets.length === 0) && (
                                    <span style={{ color: '#475569', fontSize: '0.85rem' }}>-</span>
                                )}
                            </div>
                        </div>

                        {/* Total */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                            <span style={{ color: '#94a3b8', fontWeight: 600 }}>Total Pembayaran</span>
                            <span style={{ color: '#38bdf8', fontWeight: 800, fontSize: '1.2rem' }}>
                                Rp {Number(transaksi.total_harga || 0).toLocaleString('id-ID')}
                            </span>
                        </div>

                        {/* Tombol */}
                        <div style={{ display: 'flex', gap: 10 }}>
                            <button
                                onClick={onClose}
                                style={{ flex: 1, padding: '12px', borderRadius: 12, border: '1px solid rgba(255,255,255,0.1)', background: 'transparent', color: '#94a3b8', cursor: 'pointer', fontWeight: 600, fontSize: '0.88rem' }}
                            >
                                Tutup
                            </button>
                            <button
                                onClick={handlePrint}
                                style={{ flex: 1, padding: '12px', borderRadius: 12, border: 'none', background: '#2563eb', color: '#fff', cursor: 'pointer', fontWeight: 700, fontSize: '0.88rem' }}
                            >
                                🖨️ Print Tiket
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

// ── Main Component ─────────────────────────────────────────────────────────────
const RiwayatTransaksi = () => {
    const navigate = useNavigate();

    const [transaksiList, setTransaksiList] = useState([]);
    const [loading, setLoading]             = useState(true);
    const [error, setError]                 = useState(null);
    const [selectedTransaksi, setSelectedTransaksi] = useState(null);
    const [filterStatus, setFilterStatus]   = useState('semua'); // 'semua' | 'berhasil' | 'pending'

    useEffect(() => {
        const fetchRiwayat = async () => {
            const userId = localStorage.getItem('id_user');
            if (!userId) {
                setError('Kamu harus login untuk melihat riwayat');
                setLoading(false);
                return;
            }

            try {
                const res = await axios.get(`${BASE_URL}/users/${userId}/transaksi`);
                const transaksiListRes = res.data.data || [];
                
                // Fetch detail lengkap untuk tiap transaksi
                const detailedTransaksi = await Promise.all(
                    transaksiListRes.map(async (trx) => {
                        try {
                            const detailRes = await axios.get(`${BASE_URL}/transaksi/${trx.id_transaksi}`);
                            return detailRes.data.data;
                        } catch (detailErr) {
                            console.error(`Gagal memuat detail trx ${trx.id_transaksi}`, detailErr);
                            return trx; 
                        }
                    })
                );

                setTransaksiList(detailedTransaksi);
            } catch (err) {
                console.error(err);
                setError('Gagal memuat riwayat transaksi.');
            } finally {
                setLoading(false);
            }
        };
        fetchRiwayat();
    }, []);

    const filtered = transaksiList.filter(t =>
        filterStatus === 'semua' ? true : t.status_pembayaran === filterStatus
    );

    return (
        <div style={{ backgroundColor: '#0a0b0d', minHeight: '100vh', color: '#fff', fontFamily: "'Inter', sans-serif" }}>
            <style>{`
                @keyframes fadeUp { from { opacity:0; transform:translateY(12px) } to { opacity:1; transform:translateY(0) } }
                @keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }
                .trx-card { background:rgba(15,23,42,0.8); border:1px solid rgba(255,255,255,0.07); border-radius:16px; padding:20px 24px; transition:border-color .2s, transform .2s; animation: fadeUp .4s ease both; }
                .trx-card:hover { border-color:rgba(56,189,248,0.25); transform:translateY(-2px); }
                .filter-btn { padding:8px 18px; border-radius:20px; border:1px solid rgba(255,255,255,0.1); background:transparent; color:#94a3b8; cursor:pointer; font-size:0.82rem; font-weight:600; transition:all .15s; }
                .filter-btn.active { background:rgba(56,189,248,0.15); border-color:rgba(56,189,248,0.4); color:#38bdf8; }
                .detail-btn { padding:8px 18px; border-radius:10px; border:1px solid rgba(56,189,248,0.25); background:rgba(56,189,248,0.08); color:#38bdf8; cursor:pointer; font-size:0.82rem; font-weight:600; transition:all .15s; }
                .detail-btn:hover { background:rgba(56,189,248,0.15); }
            `}</style>

            <Navbar />

            <div style={{ maxWidth: 760, margin: '0 auto', padding: '40px 24px 80px' }}>

                {/* Header */}
                <div style={{ marginBottom: 32 }}>
                    <p style={{ color: '#64748b', fontSize: '0.85rem', marginBottom: 16 }}>
                        <Link to="/" style={{ color: '#64748b', textDecoration: 'none' }}>Beranda</Link>
                        <span style={{ margin: '0 8px' }}>/</span>
                        <span style={{ color: '#fff', fontWeight: 600 }}>Riwayat Transaksi</span>
                    </p>
                    <h2 style={{ fontWeight: 700, color: '#f1f5f9', margin: '0 0 6px' }}>Riwayat Transaksi</h2>
                    <p style={{ color: '#64748b', margin: 0, fontSize: '0.88rem' }}>Semua tiket yang pernah kamu beli</p>
                </div>

                {/* Filter */}
                <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
                    {['semua', 'berhasil', 'pending'].map(f => (
                        <button
                            key={f}
                            className={`filter-btn ${filterStatus === f ? 'active' : ''}`}
                            onClick={() => setFilterStatus(f)}
                        >
                            {f === 'semua' ? 'Semua' : f === 'berhasil' ? '✅ Berhasil' : '⏳ Pending'}
                        </button>
                    ))}
                </div>

                {/* Content */}
                {loading ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                        {[1, 2, 3, 4].map(i => <SkeletonCard key={i} />)}
                    </div>
                ) : error ? (
                    <div style={{ textAlign: 'center', padding: '48px 0', color: '#f87171' }}>
                        <p style={{ fontSize: '2rem', marginBottom: 12 }}>⚠️</p>
                        <p>{error}</p>
                    </div>
                ) : filtered.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '64px 0', border: '1px dashed rgba(255,255,255,0.08)', borderRadius: 16 }}>
                        <p style={{ fontSize: '3rem', marginBottom: 12 }}>🎟️</p>
                        <p style={{ color: '#64748b', margin: 0 }}>
                            {filterStatus === 'semua' ? 'Belum ada transaksi.' : `Tidak ada transaksi dengan status "${filterStatus}".`}
                        </p>
                        <button
                            onClick={() => navigate('/')}
                            style={{ marginTop: 16, padding: '10px 24px', borderRadius: 12, border: 'none', background: '#2563eb', color: '#fff', cursor: 'pointer', fontWeight: 600 }}
                        >
                            Cari Film
                        </button>
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                        {filtered.map((trx, idx) => (
                            <div key={trx.id_transaksi} className="trx-card" style={{ animationDelay: `${idx * 0.05}s` }}>
                                <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>

                                    {/* Poster */}
                                    <img
                                        src={trx.tikets?.[0]?.poster}
                                        alt={trx.tikets?.[0]?.judul_film}
                                        style={{ width: 52, height: 74, objectFit: 'cover', borderRadius: 8, flexShrink: 0 }}
                                        onError={e => { e.target.onerror = null; e.target.src = 'https://placehold.co/52x74/111/333?text=?'; }}
                                    />

                                    {/* Info */}
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8, flexWrap: 'wrap', gap: 8 }}>
                                            <h6 style={{ margin: 0, fontWeight: 700, color: '#f1f5f9', fontSize: '0.95rem', textTransform: 'uppercase' }}>
                                                {trx.tikets?.[0]?.judul_film || '-'}
                                            </h6>
                                            <span style={{
                                                padding: '3px 12px', borderRadius: 20, fontSize: '0.75rem', fontWeight: 700, flexShrink: 0,
                                                backgroundColor: trx.status_pembayaran === 'berhasil' ? 'rgba(34,197,94,0.12)' : 'rgba(234,179,8,0.12)',
                                                color: trx.status_pembayaran === 'berhasil' ? '#4ade80' : '#facc15',
                                                border: `1px solid ${trx.status_pembayaran === 'berhasil' ? 'rgba(34,197,94,0.25)' : 'rgba(234,179,8,0.25)'}`,
                                            }}>
                                                {trx.status_pembayaran === 'berhasil' ? '● Berhasil' : '● Pending'}
                                            </span>
                                        </div>

                                        {/* Detail baris */}
                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px 20px', marginBottom: 12 }}>
                                            {[
                                                { icon: '📅', val: trx.tikets?.[0]?.jadwal_tayang ? new Date(trx.tikets[0].jadwal_tayang).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : '-' },
                                                { icon: '🕐', val: trx.tikets?.[0]?.jadwal_tayang ? new Date(trx.tikets[0].jadwal_tayang).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) : '-' },
                                                { icon: '🪑', val: (trx.tikets || []).map(t => t.nomor_kursi).join(', ') || '-' },
                                            ].map(({ icon, val }) => (
                                                <span key={icon} style={{ color: '#64748b', fontSize: '0.82rem' }}>{icon} {val}</span>
                                            ))}
                                        </div>

                                        {/* Footer */}
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <div>
                                                <p style={{ margin: 0, color: '#475569', fontSize: '0.72rem' }}>Total Bayar</p>
                                                <p style={{ margin: 0, color: '#38bdf8', fontWeight: 800, fontSize: '1rem' }}>
                                                    Rp {Number(trx.total_harga || 0).toLocaleString('id-ID')}
                                                </p>
                                            </div>
                                            <button
                                                className="detail-btn"
                                                onClick={() => setSelectedTransaksi(trx)}
                                            >
                                                🎟️ Lihat Tiket
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Print Modal */}
            {selectedTransaksi && (
                <PrintModal
                    transaksi={selectedTransaksi}
                    onClose={() => setSelectedTransaksi(null)}
                />
            )}
        </div>
    );
};

export default RiwayatTransaksi;