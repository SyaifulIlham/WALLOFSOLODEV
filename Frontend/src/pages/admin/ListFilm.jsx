import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
// IMPORT KOMPONEN SIDEBAR YANG BARU DIBUAT
import SidebarAdmin from '../../components/SidebarAdmin'; // Sesuaikan path foldernya ya

const ListFilm = () => {
    const [films, setFilms] = useState([]);

    useEffect(() => { 
        fetchFilms(); 
    }, []);

    const fetchFilms = async () => {
        try {
            const res = await axios.get('http://localhost:3000/films');
            setFilms(res.data.data);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    const deleteFilm = async (id) => {
        if (window.confirm('Yakin ingin menghapus film ini?')) {
            try {
                await axios.delete(`http://localhost:3000/films/${id}`);
                fetchFilms();
            } catch (error) {
                console.error("Error deleting data:", error);
            }
        }
    };

    return (
        <div className="d-flex" style={{ backgroundColor: '#131722', minHeight: '100vh', color: '#fff', fontFamily: 'Inter, sans-serif' }}>
            
            {/* CUKUP PANGGIL 1 BARIS INI UNTUK SIDEBAR! */}
            <SidebarAdmin activeMenu="catalog" />

            {/* ================= KONTEN KANAN ================= */}
            <div className="flex-grow-1" style={{ backgroundColor: '#0d1119', padding: '40px 50px' }}>
                
                <div className="d-flex justify-content-between align-items-center mb-5">
                    <div className="d-flex align-items-baseline gap-3">
                        <h2 className="fw-bold m-0 text-white">Catalog</h2>
                        <span className="text-secondary small">{films.length} total film</span>
                    </div>

                    <div className="d-flex gap-3 align-items-center">
                        <div className="input-group" style={{ width: '250px' }}>
                            <input type="text" className="form-control shadow-none border-0 text-white px-3 py-2" placeholder="Find movie..." style={{ backgroundColor: '#151f30', borderRadius: '8px' }} />
                        </div>
                        <Link to="/admin/schedules" className="btn fw-bold d-flex align-items-center gap-2 shadow-sm" style={{ backgroundColor: '#0dcaf0', color: '#050505', borderRadius: '8px', padding: '8px 20px' }}>
                            Jadwal Film
                        </Link>
                        <Link to="/admin/add" className="btn fw-bold d-flex align-items-center gap-2 shadow-sm btn-add-movie" style={{ backgroundColor: '#2f80ed', color: '#fff', borderRadius: '8px', padding: '8px 20px' }}>
                            <span style={{ fontSize: '1.2rem', lineHeight: '1' }}>+</span> Tambah Film
                        </Link>
                    </div>
                </div>

                <div className="row px-4 mb-3 text-secondary text-uppercase fw-bold" style={{ fontSize: '0.75rem', letterSpacing: '1px' }}>
                    <div className="col-1">ID</div>
                    <div className="col-4">TITLE</div>
                    <div className="col-2">CATEGORY</div>
                    <div className="col-2 text-center">STATUS</div>
                    <div className="col-3 text-end">ACTIONS</div>
                </div>

                <div className="d-flex flex-column gap-3">
                    {films.length > 0 ? (
                        films.map((f, index) => (
                            <div key={f.id_film} className="row px-4 py-3 align-items-center admin-row shadow-sm">
                                <div className="col-1 text-secondary fw-semibold">{index + 1}</div>
                                <div className="col-4 d-flex align-items-center gap-3">
                                    <img src={f.poster} alt={f.judul_film} style={{ width: '40px', height: '55px', objectFit: 'cover', borderRadius: '6px' }} />
                                    <span className="text-white fw-semibold text-truncate">{f.judul_film}</span>
                                </div>
                                <div className="col-2 text-light" style={{ fontSize: '0.9rem' }}>{f.genre}</div>
                                <div className="col-2 text-center">
                                    {f.status === 'Akan Datang' ? (
                                        <span style={{ color: '#eb5757', fontSize: '0.9rem', fontWeight: '500' }}>Akan Datang</span>
                                    ) : (
                                        <span style={{ color: '#29b474', fontSize: '0.9rem', fontWeight: '500' }}>Sedang Tayang</span>
                                    )}
                                </div>
                                <div className="col-3 text-end d-flex justify-content-end gap-2">
                                    <Link to={`/movie/${f.id_film}`} className="btn btn-sm fw-bold d-flex align-items-center" style={{ backgroundColor: 'rgba(41, 180, 116, 0.1)', color: '#29b474', borderRadius: '6px' }}>Lihat</Link>
                                    <Link to={`/admin/edit/${f.id_film}`} className="btn btn-sm fw-bold d-flex align-items-center" style={{ backgroundColor: 'rgba(47, 128, 237, 0.1)', color: '#2f80ed', borderRadius: '6px' }}>Edit</Link>
                                    <button onClick={() => deleteFilm(f.id_film)} className="btn btn-sm fw-bold border-0 d-flex align-items-center" style={{ backgroundColor: 'rgba(235, 87, 87, 0.1)', color: '#eb5757', borderRadius: '6px' }}>Hapus</button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-5">
                            <h5 className="text-secondary">Belum ada data film di katalog.</h5>
                        </div>
                    )}
                </div>
            </div>

            {/* CSS Sisa (Yang tidak dipindah ke Sidebar) */}
            <style>
                {`
                    .admin-row { background-color: #151f30; border-radius: 12px; transition: all 0.2s ease; border: 1px solid transparent; }
                    .admin-row:hover { background-color: #1a2639; border-color: #2f80ed; }
                    .btn-add-movie { transition: 0.3s; }
                    .btn-add-movie:hover { background-color: #256bca !important; transform: translateY(-2px); }
                    input::placeholder { color: #6c757d !important; }
                `}
            </style>
        </div>
    );
};

export default ListFilm;