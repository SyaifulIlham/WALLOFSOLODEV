import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import MainLayout from '../../layouts/MainLayout';

const Movies = () => {
    const [films, setFilms] = useState([]);
    const [activeTab, setActiveTab] = useState('sedang-tayang');

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

    const sedangTayang = films.filter(f => f.status === 'Sedang Tayang' || !f.status);
    const akanDatang = films.filter(f => f.status === 'Akan Datang');
    const displayedFilms = activeTab === 'sedang-tayang' ? sedangTayang : akanDatang;

    return (
        <MainLayout>
            <div style={{ height: '100px' }}></div> 
            
            <div className="container py-4 text-start"> 
                
                {/* --- BREADCRUMB (Beranda Bisa Diklik) --- */}
                <p className="text-secondary mb-3" style={{ fontSize: '0.9rem' }}>
                    <Link to="/" className="text-secondary text-decoration-none hover-white">Beranda</Link> 
                    <span className="mx-2">/</span> 
                    <span className="text-white fw-bold">Film</span>
                </p>

                <h1 className="fw-bold mb-4 text-white" style={{ fontSize: '2.5rem' }}>Film</h1>

                {/* --- BARIS TAB (Menu kanan sudah dihapus) --- */}
                <div className="mb-5 border-bottom border-secondary pb-4">
                    <div className="d-flex gap-3">
                        <button 
                            className={`btn rounded-pill px-4 py-2 fw-bold tab-xxi ${activeTab === 'sedang-tayang' ? 'active' : ''}`}
                            onClick={() => setActiveTab('sedang-tayang')}
                        >
                            Lagi tayang
                        </button>
                        <button 
                            className={`btn rounded-pill px-4 py-2 fw-bold tab-xxi ${activeTab === 'akan-datang' ? 'active' : ''}`}
                            onClick={() => setActiveTab('akan-datang')}
                        >
                            Akan tayang
                        </button>
                    </div>
                </div>

                {/* --- GRID FILM --- */}
                <div className="row row-cols-2 row-cols-md-3 row-cols-lg-5 g-4 min-vh-50">
                    {displayedFilms.length > 0 ? (
                        displayedFilms.map(f => (
                            <div className="col" key={f.id_film}>
                                <Link to={`/movie/${f.id_film}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                    <div className="film-card">
                                        <div className="img-container mb-3 position-relative shadow-sm" style={{ overflow: 'hidden', aspectRatio: '2/3', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)' }}>
                                            <img 
                                                src={f.poster} 
                                                className="w-100 h-100 object-fit-cover" 
                                                alt={f.judul_film} 
                                                style={{ filter: activeTab === 'akan-datang' ? 'grayscale(20%)' : 'none' }}
                                            />
                                            <div className="overlay-grad"></div>
                                        </div>
                                        <h6 className="fw-bold text-uppercase mb-1" style={{ fontSize: '0.9rem', lineHeight: '1.4', color: 'white' }}>
                                            {f.judul_film}
                                        </h6>
                                    </div>
                                </Link>
                            </div>
                        ))
                    ) : (
                        <div className="col-12 py-5 text-start">
                            <p className="text-secondary">Tidak ada film di kategori ini.</p>
                        </div>
                    )}
                </div>
            </div>

            <footer className="text-center py-4 mt-5" style={{ backgroundColor: '#050505', borderTop: '1px solid #111' }}>
                <p className="text-secondary small m-0">© 2026 SoloFlixx - Cinema Application</p>
            </footer>

            <style>
                {`
                    /* Style Tab ala XXI */
                    .tab-xxi { 
                        background-color: transparent; 
                        color: #6c757d; 
                        border: 1px solid #333;
                        transition: all 0.3s ease;
                    }
                    .tab-xxi:hover {
                        color: white;
                        border-color: #666;
                    }
                    .tab-xxi.active { 
                        background-color: white; 
                        color: black; 
                        border-color: white;
                    }
                    
                    /* Efek Hover Teks Link */
                    .hover-white {
                        transition: color 0.3s ease;
                    }
                    .hover-white:hover {
                        color: white !important;
                    }

                    /* Efek Kartu Film */
                    .film-card { transition: all 0.3s ease; text-align: left; }
                    .film-card:hover { transform: translateY(-8px); cursor: pointer; }
                    .img-container { transition: all 0.3s ease; background-color: #111; }
                    .overlay-grad {
                        position: absolute; bottom: 0; left: 0; right: 0; height: 50%;
                        background: linear-gradient(to top, rgba(10,11,13,1), transparent);
                        opacity: 0; transition: opacity 0.3s ease;
                    }
                    .film-card:hover .img-container { border-color: #dc3545 !important; box-shadow: 0 10px 25px rgba(220, 53, 69, 0.3) !important; }
                    .film-card:hover .overlay-grad { opacity: 1; }
                `}
            </style>
        </MainLayout>
    );
};

export default Movies;