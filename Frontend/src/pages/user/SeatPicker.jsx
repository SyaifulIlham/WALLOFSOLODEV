import React, { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../../components/nav';

const API = 'http://localhost:3000';

const SeatPicker = () => {
    const { id }                        = useParams(); // id_film
    const [searchParams]                = useSearchParams();
    const jadwalId                      = searchParams.get('jadwal');
    const navigate                      = useNavigate();

    const [seats, setSeats]             = useState([]);
    const [selected, setSelected]       = useState([]); // array id_seat yang dipilih
    const [loading, setLoading]         = useState(true);
    const [film, setFilm]               = useState(null);
    const [jadwal, setJadwal]           = useState(null);

    // ── Fetch data ─────────────────────────────────────────────────────────────
    useEffect(() => {
        const fetchAll = async () => {
            try {
                const [seatsRes, filmRes] = await Promise.all([
                    axios.get(`${API}/seats`),
                    axios.get(`${API}/films/${id}`),
                ]);
                setSeats(seatsRes.data.data || []);
                setFilm(filmRes.data.data);

                // Fetch jadwal jika ada id jadwal
                if (jadwalId) {
                    const jadwalRes = await axios.get(`${API}/films/${id}/schedules`);
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

    // ── Kelompokkan kursi per baris ────────────────────────────────────────────
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

    // Bagi baris jadi 2 kolom (kiri & kanan) seperti referensi
    const leftRows  = sortedRows.filter((_, i) => i % 2 === 0);
    const rightRows = sortedRows.filter((_, i) => i % 2 === 1);

    // ── Toggle pilih kursi ─────────────────────────────────────────────────────
    const toggleSeat = (seat) => {
        if (seat.status === 'dipesan') return; // tidak bisa dipilih
        setSelected(prev =>
            prev.includes(seat.id_seat)
                ? prev.filter(id => id !== seat.id_seat)
                : [...prev, seat.id_seat]
        );
    };

    // ── Harga total ────────────────────────────────────────────────────────────
    const hargaPerKursi = jadwal ? Number(jadwal.harga_tiket) : 0;
    const totalHarga    = hargaPerKursi * selected.length;

    const selectedSeats = seats.filter(s => selected.includes(s.id_seat));

    // ── Render 1 kursi ─────────────────────────────────────────────────────────
    const SeatBox = ({ seat }) => {
        const isSelected = selected.includes(seat.id_seat);
        const isBooked   = seat.status === 'dipesan';

        let bg, border, color, cursor;
        if (isBooked) {
            bg = 'rgba(255,255,255,0.08)'; border = 'rgba(255,255,255,0.15)'; color = 'rgba(255,255,255,0.3)'; cursor = 'not-allowed';
        } else if (isSelected) {
            bg = 'rgba(56,189,248,0.35)'; border = '#38bdf8'; color = '#fff'; cursor = 'pointer';
        } else {
            bg = 'rgba(30,58,138,0.8)'; border = '#1e40af'; color = '#93c5fd'; cursor = 'pointer';
        }

        return (
            <div
                onClick={() => toggleSeat(seat)}
                title={isBooked ? `${seat.nomor_kursi} — Dipesan` : `${seat.nomor_kursi} — Klik untuk pilih`}
                style={{
                    width: 40, height: 40, borderRadius: 8,
                    backgroundColor: bg,
                    border: `2px solid ${border}`,
                    color, cursor,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '0.65rem', fontWeight: 700,
                    transition: 'all .15s',
                    userSelect: 'none',
                    transform: isSelected ? 'scale(1.1)' : 'scale(1)',
                    boxShadow: isSelected ? '0 0 12px rgba(56,189,248,0.5)' : 'none',
                }}
            >
                {seat.nomor_kursi}
            </div>
        );
    };

    // ── Render baris kursi ─────────────────────────────────────────────────────
    const renderRows = (rows) => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {rows.map(baris => (
                <div key={baris} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    {/* Label baris */}
                    <div style={{ width: 18, color: '#64748b', fontSize: '0.72rem', fontWeight: 700, textAlign: 'center', flexShrink: 0 }}>
                        {baris}
                    </div>
                    {/* Kursi */}
                    <div style={{ display: 'flex', gap: 4 }}>
                        {seatsByRow[baris].map(seat => (
                            <SeatBox key={seat.id_seat} seat={seat} />
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );

    if (loading) return (
        <div className="d-flex align-items-center justify-content-center" style={{ backgroundColor: '#060b18', minHeight: '100vh' }}>
            <div className="spinner-border text-primary" role="status" />
        </div>
    );

    return (
        <div style={{ backgroundColor: '#060b18', minHeight: '100vh', color: '#fff', fontFamily: "'Inter', sans-serif" }}>
            <Navbar />

            <div className="container py-5 px-3" style={{ paddingBottom: '80px' }}>

                {/* Header film */}
                {film && (
                    <div className="d-flex align-items-center gap-3 mb-4">
                        <img src={film.poster} alt={film.judul_film} className="rounded" style={{ width: 48, height: 68, objectFit: 'cover' }} onError={e => { e.target.onerror = null; e.target.src = 'https://placehold.co/48x68/111/333?text=?'; }} />
                        <div>
                            <h5 className="m-0 fw-bold" style={{ color: '#f1f5f9' }}>{film.judul_film}</h5>
                            {jadwal && (
                                <p className="m-0 text-muted small">
                                    {new Date(jadwal.tanggal_tayang).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })} · {jadwal.jam_tayang} · Rp {hargaPerKursi.toLocaleString('id-ID')} / kursi
                                </p>
                            )}
                        </div>
                    </div>
                )}

                {/* Grid kursi */}
                <div className="bg-gradient-dark rounded-4 p-5" style={{ border: '1px solid rgba(255,255,255,0.07)' }}>

                    {/* Legend */}
                    <div className="d-flex gap-5 justify-content-center mb-5 flex-wrap">
                        {[
                            { label: 'Available', bg: 'rgba(30,58,138,0.8)',    border: '#1e40af',  color: '#93c5fd' },
                            { label: 'Reserved',  bg: 'rgba(255,255,255,0.08)', border: 'rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.3)' },
                            { label: 'Selected',  bg: 'rgba(56,189,248,0.35)',  border: '#38bdf8',  color: '#fff' },
                        ].map(l => (
                            <div key={l.label} className="d-flex align-items-center gap-2">
                                <div style={{ width: 22, height: 22, borderRadius: 5, backgroundColor: l.bg, border: `2px solid ${l.border}` }} />
                                <span style={{ color: '#94a3b8', fontSize: '0.82rem' }}>{l.label}</span>
                            </div>
                        ))}
                    </div>

                    {/* Kursi — 2 panel kiri kanan */}
                    <div style={{ display: 'flex', gap: 32, justifyContent: 'center', overflowX: 'auto' }}>
                        {renderRows(leftRows)}

                        {/* Lorong tengah */}
                        <div style={{ width: 24, flexShrink: 0 }} />

                        {renderRows(rightRows)}
                    </div>

                    {/* Layar bioskop */}
                    <div className="text-center mt-5">
                        <div className="bg-gradient-screen d-inline-block rounded mb-2" style={{ width: '60%', height: '6px' }} />
                        <p className="m-0 text-muted" style={{ fontSize: '0.78rem', letterSpacing: '3px', textTransform: 'uppercase' }}>Movie Screen</p>
                    </div>
                </div>

                {/* Panel bawah — ringkasan & tombol */}
                {selected.length > 0 && (
                    <div className="fixed-bottom-panel">
                        <div>
                            <p className="m-0 text-muted small">Kursi dipilih</p>
                            <p className="m-0 text-white fw-bold" style={{ fontSize: '1rem' }}>
                                {selectedSeats.map(s => s.nomor_kursi).join(', ')}
                            </p>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <p className="m-0 text-muted small">Total Harga</p>
                            <p className="m-0 fw-bold" style={{ color: '#38bdf8', fontSize: '1.2rem' }}>
                                Rp {totalHarga.toLocaleString('id-ID')}
                            </p>
                        </div>
                        <button
                            onClick={() => {
                                // Nanti bisa navigate ke halaman pembayaran
                                alert(`Kursi dipilih: ${selectedSeats.map(s => s.nomor_kursi).join(', ')}\nTotal: Rp ${totalHarga.toLocaleString('id-ID')}`);
                            }}
                            className="btn btn-primary fw-bold px-5"
                            style={{
                                backgroundColor: '#2563eb',
                                boxShadow: '0 8px 24px rgba(37,99,235,0.3)',
                            }}
                        >
                            Lanjut Bayar →
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SeatPicker;