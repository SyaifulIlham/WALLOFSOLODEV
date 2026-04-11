import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../../components/nav'; 

const DetailFilm = () => {
    const { id } = useParams();
    const [film, setFilm] = useState(null);

    useEffect(() => {
        const fetchFilmDetail = async () => {
            try {
                const res = await axios.get(`http://localhost:3000/films/${id}`);
                setFilm(res.data.data);
            } catch (error) {
                console.error("Error fetching detail:", error);
            }
        };
        fetchFilmDetail();
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
                    </div>
                </div>

            </div>
        </div>
    );
};

export default DetailFilm;