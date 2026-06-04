import React, { useEffect, useState, useMemo, useRef, useCallback } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import BASE_URL from "../../api";
import Navbar from '../../components/nav';

const SeatPicker = () => {
    const { id } = useParams();
    const [searchParams] = useSearchParams();
    const jadwalId = searchParams.get('jadwal');
    const navigate = useNavigate();

    const [seats, setSeats] = useState([]);
    const [selected, setSelected] = useState([]);
    const [loading, setLoading] = useState(true);
    const [film, setFilm] = useState(null);
    const [jadwal, setJadwal] = useState(null);

    // ── Zoom ──────────────────────────────────────────────────────────────────
    const [zoom, setZoom] = useState(1);
    const MIN_ZOOM = 0.6, MAX_ZOOM = 1.8;

    // ── Drag-select ───────────────────────────────────────────────────────────
    const [isDragging, setIsDragging] = useState(false);
    const [dragMode, setDragMode] = useState(null);
    const draggedSeats = useRef(new Set());

    // ── Tooltip ───────────────────────────────────────────────────────────────
    const [tooltip, setTooltip] = useState(null);
    const tooltipRef = useRef(null);

    // ── Fetch ─────────────────────────────────────────────────────────────────
    useEffect(() => {
        const fetchAll = async () => {
            try {
                const [seatsRes, filmRes] = await Promise.all([
                    axios.get(`${BASE_URL}/seats`),
                    axios.get(`${BASE_URL}/films/${id}`),
                ]);
                setSeats(seatsRes.data.data || []);
                setFilm(filmRes.data.data);
                if (jadwalId) {
                    const jadwalRes = await axios.get(`${BASE_URL}/films/${id}/schedules`);
                    const found = (jadwalRes.data.data || []).find(j => j.id_jadwal == jadwalId);
                    if (found) setJadwal(found);
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchAll();
    }, [id, jadwalId]);

    // ── Group seats by row ────────────────────────────────────────────────────
    const seatsByRow = useMemo(() => {
        const map = {};
        seats.forEach(s => {
            if (!map[s.baris]) map[s.baris] = [];
            map[s.baris].push(s);
        });
        Object.keys(map).forEach(b => {
            map[b].sort((a, z) => {
                const na = parseInt(a.nomor_kursi.replace(/\D/g, ''));
                const nz = parseInt(z.nomor_kursi.replace(/\D/g, ''));
                return na - nz;
            });
        });
        return map;
    }, [seats]);

    const sortedRows = useMemo(() => Object.keys(seatsByRow).sort(), [seatsByRow]);
    const leftRows = sortedRows.filter((_, i) => i % 2 === 0);
    const rightRows = sortedRows.filter((_, i) => i % 2 === 1);

    // ── Harga ─────────────────────────────────────────────────────────────────
    const hargaPerKursi = jadwal ? Number(jadwal.harga_tiket) : 0;
    const totalHarga = hargaPerKursi * selected.length;
    const selectedSeats = seats.filter(s => selected.includes(s.id_seat));

    // ── Drag handlers ─────────────────────────────────────────────────────────
    const handleSeatMouseDown = useCallback((e, seat) => {
        if (seat.status === 'dipesan') return;
        e.preventDefault();
        setIsDragging(true);
        const mode = selected.includes(seat.id_seat) ? 'deselect' : 'select';
        setDragMode(mode);
        draggedSeats.current = new Set([seat.id_seat]);
        setSelected(prev =>
            mode === 'select'
                ? [...new Set([...prev, seat.id_seat])]
                : prev.filter(id => id !== seat.id_seat)
        );
    }, [selected]);

    const handleSeatMouseEnter = useCallback((seat) => {
        if (!isDragging || seat.status === 'dipesan') return;
        if (draggedSeats.current.has(seat.id_seat)) return;
        draggedSeats.current.add(seat.id_seat);
        setSelected(prev =>
            dragMode === 'select'
                ? [...new Set([...prev, seat.id_seat])]
                : prev.filter(id => id !== seat.id_seat)
        );
    }, [isDragging, dragMode]);

    useEffect(() => {
        const handleMouseUp = () => {
            setIsDragging(false);
            draggedSeats.current = new Set();
        };
        window.addEventListener('mouseup', handleMouseUp);
        return () => window.removeEventListener('mouseup', handleMouseUp);
    }, []);

    // ── Zoom handlers ─────────────────────────────────────────────────────────
    const zoomIn = () => setZoom(z => Math.min(z + 0.1, MAX_ZOOM));
    const zoomOut = () => setZoom(z => Math.max(z - 0.1, MIN_ZOOM));
    const zoomReset = () => setZoom(1);

    const handleWheel = useCallback((e) => {
        if (!e.ctrlKey) return;
        e.preventDefault();
        setZoom(z => {
            const next = z + (e.deltaY < 0 ? 0.08 : -0.08);
            return Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, next));
        });
    }, []);

    // ── Tooltip handlers ──────────────────────────────────────────────────────
    const handleMouseEnterSeat = useCallback((e, seat) => {
        const rect = e.currentTarget.getBoundingClientRect();
        setTooltip({ seat, x: rect.left + rect.width / 2, y: rect.top - 8 });
    }, []);

    const handleMouseLeaveSeat = useCallback(() => setTooltip(null), []);

    if (loading) return (
        <div className="d-flex align-items-center justify-content-center" style={{ backgroundColor: '#060b18', minHeight: '100vh' }}>
            <div className="spinner-border text-primary" role="status" />
        </div>
    );

    // ── SeatBox ───────────────────────────────────────────────────────────────
    const SeatBox = ({ seat }) => {
        const isSelected = selected.includes(seat.id_seat);
        const isBooked = seat.status === 'dipesan';

        let bg, border, color, cursor, shadow;
        if (isBooked) {
            bg = 'rgba(255,255,255,0.06)'; border = 'rgba(255,255,255,0.12)';
            color = 'rgba(255,255,255,0.2)'; cursor = 'not-allowed'; shadow = 'none';
        } else if (isSelected) {
            bg = 'rgba(56,189,248,0.3)'; border = '#38bdf8';
            color = '#fff'; cursor = 'pointer';
            shadow = '0 0 14px rgba(56,189,248,0.55)';
        } else {
            bg = 'rgba(30,58,138,0.75)'; border = '#1e40af';
            color = '#93c5fd'; cursor = 'pointer'; shadow = 'none';
        }

        return (
            <div
                onMouseDown={e => handleSeatMouseDown(e, seat)}
                onMouseEnter={e => {
                    handleSeatMouseEnter(seat);
                    handleMouseEnterSeat(e, seat);
                }}
                onMouseLeave={handleMouseLeaveSeat}
                style={{
                    width: 40, height: 40, borderRadius: 8,
                    backgroundColor: bg, border: `2px solid ${border}`,
                    color, cursor,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '0.63rem', fontWeight: 700,
                    transition: 'all .12s ease',
                    userSelect: 'none', WebkitUserSelect: 'none',
                    transform: isSelected ? 'scale(1.12)' : 'scale(1)',
                    boxShadow: shadow,
                }}
            >
                {seat.nomor_kursi}
            </div>
        );
    };

    const renderRows = (rows) => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {rows.map(baris => (
                <div key={baris} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <div style={{ width: 20, color: '#475569', fontSize: '0.72rem', fontWeight: 700, textAlign: 'center', flexShrink: 0 }}>
                        {baris}
                    </div>
                    <div style={{ display: 'flex', gap: 6 }}>
                        {seatsByRow[baris].map(seat => (
                            <SeatBox key={seat.id_seat} seat={seat} />
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );

    return (
        <div
            style={{ backgroundColor: '#060b18', minHeight: '100vh', color: '#fff', fontFamily: "'Inter', sans-serif" }}
            onWheel={handleWheel}
        >
            <style>{`
                @keyframes slideUp { from { opacity:0; transform:translateY(20px) } to { opacity:1; transform:translateY(0) } }
                @keyframes fadeIn  { from { opacity:0 } to { opacity:1 } }
                .zoom-btn { width:36px; height:36px; border-radius:10px; border:1px solid rgba(255,255,255,0.15); background:rgba(255,255,255,0.06); color:#fff; font-size:1.1rem; cursor:pointer; display:flex; align-items:center; justify-content:center; transition:background .15s; }
                .zoom-btn:hover { background:rgba(255,255,255,0.14); }
                .bottom-panel { position:fixed; bottom:0; left:0; right:0; background:rgba(6,11,24,0.96); backdrop-filter:blur(14px); border-top:1px solid rgba(255,255,255,0.08); padding:14px 28px; display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:12px; z-index:100; animation: slideUp .3s ease; }
                .cancel-btn:hover { background:rgba(255,255,255,0.08) !important; }
            `}</style>

            <Navbar />

            {/* ── Wrapper lebih lebar ── */}
            <div style={{ maxWidth: 1400, margin: '0 auto', padding: '32px 40px 120px' }}>

                {/* Film header */}
                {film && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24, animation: 'fadeIn .4s ease' }}>
                        <img
                            src={film.poster} alt={film.judul_film}
                            style={{ width: 52, height: 74, objectFit: 'cover', borderRadius: 8, boxShadow: '0 4px 16px rgba(0,0,0,0.5)' }}
                            onError={e => { e.target.onerror = null; e.target.src = 'https://placehold.co/52x74/111/333?text=?'; }}
                        />
                        <div>
                            <h5 style={{ margin: 0, fontWeight: 700, color: '#f1f5f9' }}>{film.judul_film}</h5>
                            {jadwal ? (
                                <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748b' }}>
                                    📅 {new Date(jadwal.tanggal_tayang).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                                    &nbsp;·&nbsp;🕐 {jadwal.jam_tayang}
                                    &nbsp;·&nbsp;<span style={{ color: '#38bdf8', fontWeight: 600 }}>Rp {hargaPerKursi.toLocaleString('id-ID')}</span> / kursi
                                </p>
                            ) : (
                                <p style={{ margin: 0, fontSize: '0.85rem', color: '#475569' }}>Pilih kursi untuk film ini</p>
                            )}
                        </div>
                    </div>
                )}

                {/* ── Grid area ── */}
                <div style={{
                    background: 'linear-gradient(135deg, #0d1526 0%, #0f1e3a 100%)',
                    borderRadius: 20, border: '1px solid rgba(255,255,255,0.07)',
                    padding: '40px 60px 48px',
                    minHeight: '70vh',
                    position: 'relative',
                }}>
                    {/* Zoom controls */}
                    <div style={{ position: 'absolute', top: 16, right: 20, display: 'flex', gap: 6, zIndex: 10 }}>
                        <button className="zoom-btn" onClick={zoomOut} title="Zoom out">−</button>
                        <button
                            onClick={zoomReset}
                            style={{ padding: '0 14px', height: 36, borderRadius: 10, border: '1px solid rgba(255,255,255,0.15)', background: 'rgba(255,255,255,0.06)', color: '#94a3b8', fontSize: '0.78rem', cursor: 'pointer' }}
                        >
                            {Math.round(zoom * 100)}%
                        </button>
                        <button className="zoom-btn" onClick={zoomIn} title="Zoom in">+</button>
                    </div>

                    {/* Hint */}
                    <p style={{ textAlign: 'center', color: '#334155', fontSize: '0.72rem', marginBottom: 24, letterSpacing: '0.3px' }}>
                        💡 Klik kursi untuk memilih · Tahan &amp; drag untuk pilih banyak · Ctrl+Scroll untuk zoom
                    </p>

                    {/* Legend */}
                    <div style={{ display: 'flex', gap: 32, justifyContent: 'center', marginBottom: 36, flexWrap: 'wrap' }}>
                        {[
                            { label: 'Available', bg: 'rgba(30,58,138,0.75)', border: '#1e40af' },
                            { label: 'Reserved', bg: 'rgba(255,255,255,0.06)', border: 'rgba(255,255,255,0.12)' },
                            { label: 'Selected', bg: 'rgba(56,189,248,0.3)', border: '#38bdf8' },
                        ].map(l => (
                            <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                <div style={{ width: 20, height: 20, borderRadius: 5, backgroundColor: l.bg, border: `2px solid ${l.border}` }} />
                                <span style={{ color: '#94a3b8', fontSize: '0.82rem' }}>{l.label}</span>
                            </div>
                        ))}
                    </div>

                    {/* Seat grid */}
                    <div style={{ overflowX: 'auto', paddingBottom: 8 }}>
                        <div style={{
                            transform: `scale(${zoom})`,
                            transformOrigin: 'top center',
                            display: 'flex', gap: 48, justifyContent: 'center',
                            minWidth: 'max-content', margin: '0 auto',
                            marginBottom: zoom < 1 ? `${(zoom - 1) * 300}px` : 0,
                            transition: 'transform .2s ease',
                        }}>
                            {renderRows(leftRows)}
                            <div style={{ width: 40, flexShrink: 0 }} />
                            {renderRows(rightRows)}
                        </div>
                    </div>

                    {/* Movie screen */}
                    <div style={{ textAlign: 'center', marginTop: 48 }}>
                        <div style={{
                            display: 'inline-block', width: '60%', height: 5,
                            background: 'linear-gradient(90deg,transparent,rgba(148,163,184,0.35),transparent)',
                            borderRadius: 4, marginBottom: 8,
                        }} />
                        <p style={{ color: '#334155', fontSize: '0.72rem', letterSpacing: '3px', margin: 0, textTransform: 'uppercase' }}>
                            Movie Screen
                        </p>
                    </div>
                </div>
            </div>

            {/* ── Tooltip ── */}
            {tooltip && (
                <div
                    ref={tooltipRef}
                    style={{
                        position: 'fixed',
                        left: tooltip.x, top: tooltip.y,
                        transform: 'translate(-50%, -100%)',
                        backgroundColor: '#1e293b',
                        border: '1px solid rgba(255,255,255,0.12)',
                        borderRadius: 8, padding: '6px 12px',
                        fontSize: '0.78rem', color: '#f1f5f9',
                        pointerEvents: 'none', zIndex: 9999,
                        whiteSpace: 'nowrap',
                        boxShadow: '0 4px 16px rgba(0,0,0,0.4)',
                        animation: 'fadeIn .1s ease',
                    }}
                >
                    <span style={{ fontWeight: 700 }}>{tooltip.seat.nomor_kursi}</span>
                    <span style={{ margin: '0 6px', color: '#475569' }}>·</span>
                    <span style={{
                        color: tooltip.seat.status === 'dipesan' ? '#f87171' :
                            selected.includes(tooltip.seat.id_seat) ? '#38bdf8' : '#4ade80'
                    }}>
                        {tooltip.seat.status === 'dipesan' ? 'Dipesan' :
                            selected.includes(tooltip.seat.id_seat) ? 'Dipilih' : 'Tersedia'}
                    </span>
                    {tooltip.seat.status !== 'dipesan' && hargaPerKursi > 0 && (
                        <>
                            <span style={{ margin: '0 6px', color: '#475569' }}>·</span>
                            <span style={{ color: '#94a3b8' }}>Rp {hargaPerKursi.toLocaleString('id-ID')}</span>
                        </>
                    )}
                    <div style={{
                        position: 'absolute', bottom: -6, left: '50%', transform: 'translateX(-50%)',
                        width: 10, height: 6, background: '#1e293b',
                        clipPath: 'polygon(0 0, 100% 0, 50% 100%)',
                    }} />
                </div>
            )}

            {/* ── Bottom panel ── */}
            {selected.length > 0 && (
                <div className="bottom-panel">
                    <div>
                        <p style={{ margin: 0, color: '#64748b', fontSize: '0.78rem' }}>Kursi dipilih ({selected.length})</p>
                        <p style={{ margin: 0, color: '#f1f5f9', fontWeight: 700, fontSize: '0.95rem', maxWidth: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {selectedSeats.map(s => s.nomor_kursi).join(', ')}
                        </p>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                        <p style={{ margin: 0, color: '#64748b', fontSize: '0.78rem' }}>Total Harga</p>
                        <p style={{ margin: 0, color: '#38bdf8', fontWeight: 800, fontSize: '1.2rem' }}>
                            Rp {totalHarga.toLocaleString('id-ID')}
                        </p>
                    </div>
                    <div style={{ display: 'flex', gap: 8 }}>
                        <button
                            className="cancel-btn"
                            onClick={() => setSelected([])}
                            style={{ padding: '12px 20px', borderRadius: 12, border: '1px solid rgba(255,255,255,0.15)', background: 'transparent', color: '#94a3b8', cursor: 'pointer', fontWeight: 600, fontSize: '0.88rem', transition: 'background .15s' }}
                        >
                            Batal
                        </button>

                        <button
                            onClick={() => navigate('/checkout', {
                                state: {
                                    film,
                                    jadwal,
                                    selectedSeats,
                                    totalHarga,
                                    hargaPerKursi,
                                }
                            })}
                            
                            style={{ padding: '12px 28px', borderRadius: 12, border: 'none', background: '#2563eb', color: '#fff', cursor: 'pointer', fontWeight: 700, fontSize: '0.95rem', boxShadow: '0 8px 24px rgba(37,99,235,0.35)' }}
                        >
                            Lanjut Bayar →
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SeatPicker;