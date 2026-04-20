import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import MainLayout from '../../layouts/MainLayout';

const Home = () => {
    const [films, setFilms] = useState([]);

    useEffect(() => {
        const fetchFilms = async () => {
            try {
                const res = await axios.get('http://localhost:3000/films');
                setFilms(res.data.data);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };
        fetchFilms();
    }, []);

    // Filter Data
    const sedangTayang = films.filter(f => f.status === 'Sedang Tayang' || !f.status);
    const akanDatang = films.filter(f => f.status === 'Akan Datang');

    return (
        <MainLayout>

            <div className="container py-4">
                
                {/* --- SECTION 1: SEDANG TAYANG --- */}
                <div id="sedang-tayang" className="mb-5 pt-3">
                    <div className="d-flex align-items-center mb-4">
                        <div style={{ width: '5px', height: '30px', backgroundColor: '#dc3545', marginRight: '15px', borderRadius: '5px' }}></div>
                        <h3 className="fw-bold m-0 text-uppercase" style={{ letterSpacing: '1px' }}>Sedang Tayang</h3>
                    </div>

                    <div className="row row-cols-2 row-cols-md-3 row-cols-lg-5 g-4">
                        {sedangTayang.length > 0 ? (
                            sedangTayang.map(f => (
                                <div className="col" key={f.id_film}>
                                    <Link to={`/movie/${f.id_film}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                        <div className="film-card">
                                            {/* Poster ala TIX ID (Sudut lebih melengkung) */}
                                            <div className="img-container mb-3 position-relative shadow-sm" style={{ overflow: 'hidden', aspectRatio: '2/3', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
                                                <img src={f.poster} className="w-100 h-100 object-fit-cover" alt={f.judul_film} />
                                                <div className="overlay-grad"></div>
                                            </div>
                                            {/* Hanya Judul Film yang ditampilkan */}
                                            <h6 className="fw-bold text-uppercase mb-1" style={{ fontSize: '0.95rem', lineHeight: '1.4' }}>
                                                {f.judul_film}
                                            </h6>
                                        </div>
                                    </Link>
                                </div>
                            ))
                        ) : (
                            <div className="col-12"><p className="text-secondary">Tidak ada film di kategori ini.</p></div>
                        )}
                    </div>
                </div>

                <hr className="my-5" style={{ borderColor: 'rgba(255,255,255,0.1)' }} />

                {/* --- SECTION 2: AKAN DATANG --- */}
                <div id="akan-datang" className="mb-5 pt-3">
                    <div className="d-flex align-items-center mb-4">
                        <div style={{ width: '5px', height: '30px', backgroundColor: '#0dcaf0', marginRight: '15px', borderRadius: '5px' }}></div>
                        <h3 className="fw-bold m-0 text-uppercase" style={{ letterSpacing: '1px' }}>Akan Datang</h3>
                    </div>

                    <div className="row row-cols-2 row-cols-md-3 row-cols-lg-5 g-4">
                        {akanDatang.length > 0 ? (
                            akanDatang.map(f => (
                                <div className="col" key={f.id_film}>
                                    <Link to={`/movie/${f.id_film}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                        <div className="film-card" style={{ opacity: 0.85 }}>
                                            {/* Poster ala TIX ID dengan efek Grayscale untuk film mendatang */}
                                            <div className="img-container mb-3 position-relative shadow-sm" style={{ overflow: 'hidden', aspectRatio: '2/3', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
                                                <img src={f.poster} className="w-100 h-100 object-fit-cover" alt={f.judul_film} style={{ filter: 'grayscale(40%)' }} />
                                            </div>
                                            {/* Hanya Judul Film yang ditampilkan */}
                                            <h6 className="fw-bold text-uppercase mb-1" style={{ fontSize: '0.95rem', color: '#0dcaf0', lineHeight: '1.4' }}>
                                                {f.judul_film}
                                            </h6>
                                        </div>
                                    </Link>
                                </div>
                            ))
                        ) : (
                            <div className="col-12"><p className="text-secondary">Belum ada jadwal film mendatang.</p></div>
                        )}
                    </div>
                </div>

            </div>

            <footer className="text-center py-4 mt-5" style={{ backgroundColor: '#050505', borderTop: '1px solid #111' }}>
                <p className="text-secondary small m-0">© 2026 SoloFlixx - Cinema Application</p>
            </footer>

            <style>
                {`
                    .film-card { transition: all 0.3s ease; text-align: left; }
                    .film-card:hover { transform: translateY(-8px); cursor: pointer; }
                    
                    .img-container { transition: all 0.3s ease; background-color: #111; }
                    
                    .overlay-grad {
                        position: absolute; bottom: 0; left: 0; right: 0; height: 40%;
                        background: linear-gradient(to top, rgba(10,11,13,0.9), transparent);
                        opacity: 0; transition: opacity 0.3s ease;
                    }
                    
                    /* Hover List Sedang Tayang */
                    #sedang-tayang .film-card:hover .img-container { border-color: #dc3545 !important; box-shadow: 0 10px 25px rgba(220, 53, 69, 0.3) !important; }
                    #sedang-tayang .film-card:hover .overlay-grad { opacity: 1; }

                    /* Hover List Akan Datang */
                    #akan-datang .film-card:hover .img-container { border-color: #0dcaf0 !important; box-shadow: 0 10px 25px rgba(13, 202, 240, 0.3) !important; }
                    #akan-datang .film-card:hover img { filter: grayscale(0%) !important; }

                    #sedang-tayang, #akan-datang { scroll-margin-top: 90px; } 
                `}
            </style>
        </MainLayout>
    );
};

export default Home;