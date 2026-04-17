import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../../components/nav'; 

const DetailFilm = () => {
    const { id } = useParams();
    const [film, setFilm] = useState(null);
    const [schedules, setSchedules] = useState([]);
    const [scheduleLoading, setScheduleLoading] = useState(true);
    const [scheduleError, setScheduleError] = useState(null);

    useEffect(() => {
        const fetchFilmDetail = async () => {
            try {
                const res = await axios.get(`http://localhost:3000/films/${id}`);
                setFilm(res.data.data);
            } catch (error) {
                console.error("Error fetching detail:", error);
            }
        };

        const fetchFilmSchedules = async () => {
            try {
                const res = await axios.get(`http://localhost:3000/films/${id}/schedules`);
                setSchedules(res.data.data || []);
            } catch (error) {
                console.error("Error fetching schedules:", error);
                setScheduleError('Tidak dapat memuat jadwal saat ini.');
            } finally {
                setScheduleLoading(false);
            }
        };

        fetchFilmDetail();
        fetchFilmSchedules();
    }, [id]);

    if (!film) {
        return (
            <div style={{ backgroundColor: '#0a0b0d', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <div className="spinner-border text-danger" role="status"></div>
            </div>
        );
    }

    return (
        <div style={{ backgroundColor: '#0a0b0d', minHeight: '100vh', color: '#fff' }}>
            
            {/* Navbar */}
            <Navbar />

            <div className="container text-start" style={{ padding: '50px 15px 100px 15px' }}>
                
                {/* Tombol Kembali */}
                <div className="mb-5">
                    <Link to="/" className="text-decoration-none text-secondary" style={{ transition: '0.3s', fontSize: '1rem' }}>
                        ← Kembali ke Beranda
                    </Link>
                </div>

                {/* --- BAGIAN ATAS (Poster & Info Utama) --- */}
                <div className="row mb-5">
                    {/* Kiri: Poster */}
                    <div className="col-md-3 col-sm-5 mb-4 mb-md-0">
                        <img 
                            src={film.poster} 
                            alt={film.judul_film} 
                            className="img-fluid rounded-3 shadow-lg" 
                            style={{ width: '100%', maxWidth: '300px', border: '1px solid #222' }} 
                        />
                    </div>

                    {/* Kanan: Judul & Genre */}
                    <div className="col-md-9 col-sm-7 px-md-4">
                        <div className="mb-3">
                            <span className="fw-bold text-uppercase" style={{ letterSpacing: '1px', fontSize: '0.85rem', color: film.status === 'Akan Datang' ? '#0dcaf0' : '#dc3545' }}>
                                {film.status === 'Akan Datang' ? '🔵 SEGERA HADIR' : '🔴 SEDANG TAYANG'}
                            </span>
                        </div>
                        
                        <h1 className="fw-bold text-white mb-3 text-uppercase" style={{ fontSize: '3.2rem', letterSpacing: '-1px' }}>
                            {film.judul_film}
                        </h1>
                        
                        {/* 🔥 BAGIAN GENRE & WAKTU YANG DIPERBAGUS 🔥 */}
                        <div className="d-flex flex-wrap gap-2 mt-2">
                            <span className="px-3 py-1 rounded-pill" style={{ backgroundColor: 'rgba(255, 255, 255, 0.08)', color: '#c9d1d9', border: '1px solid rgba(255, 255, 255, 0.15)', fontSize: '0.95rem' }}>
                                {film.genre}
                            </span>
                            <span className="px-3 py-1 rounded-pill" style={{ backgroundColor: 'rgba(255, 255, 255, 0.08)', color: '#c9d1d9', border: '1px solid rgba(255, 255, 255, 0.15)', fontSize: '0.95rem' }}>
                                {film.durasi} Menit
                            </span>
                        </div>
                    </div>
                </div>

                {/* --- BAGIAN BAWAH (Sinopsis) --- */}
                <div className="row mt-5">
                    <div className="col-12">
                        {/* Tab Detail Sederhana */}
                        <div className="border-bottom border-secondary mb-4 pb-2">
                            <span className="text-white fw-bold fs-5" style={{ borderBottom: '3px solid #0dcaf0', paddingBottom: '10px' }}>
                                Detail Film
                            </span>
                        </div>

                        {/* Teks Sinopsis */}
                        <div className="mt-4">
                            <h5 className="fw-bold text-white mb-3">Sinopsis</h5>
                            <p className="text-secondary" style={{ fontSize: '1.1rem', lineHeight: '1.8', whiteSpace: 'pre-line' }}>
                                {film.deskripsi ? film.deskripsi : "Sinopsis belum tersedia untuk film ini."}
                            </p>
                        </div>

                        {/* Jadwal Tayang */}
                        <div className="mt-5">
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <div>
                                    <h5 className="fw-bold text-white mb-1">Jadwal Tayang</h5>
                                    <p className="text-secondary mb-0">Lihat jam tayang dan harga tiket untuk film ini.</p>
                                </div>
                            </div>

                            {scheduleLoading ? (
                                <div className="text-secondary py-4">Memuat jadwal...</div>
                            ) : scheduleError ? (
                                <div className="text-danger py-4">{scheduleError}</div>
                            ) : schedules.length === 0 ? (
                                <div className="text-secondary py-4">Belum ada jadwal tayang untuk film ini.</div>
                            ) : (
                                <div className="row row-cols-1 row-cols-md-2 g-4">
                                    {schedules.map((schedule) => (
                                        <div key={schedule.id_jadwal} className="col">
                                            <div className="p-4 rounded-4" style={{ backgroundColor: '#11161f', border: '1px solid rgba(255,255,255,0.08)' }}>
                                                <div className="d-flex justify-content-between align-items-start mb-3">
                                                    <div>
                                                        <h6 className="text-white fw-bold mb-2">{schedule.tanggal_tayang}</h6>
                                                        <p className="text-secondary mb-1">Jam tayang</p>
                                                        <p className="text-white fw-semibold" style={{ fontSize: '1.1rem' }}>{schedule.jam_tayang}</p>
                                                    </div>
                                                    <span className="badge rounded-pill" style={{ backgroundColor: '#0dcaf0', color: '#050505', fontWeight: '700' }}>
                                                        Rp {Number(schedule.harga_tiket).toLocaleString('id-ID')}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default DetailFilm;