// Frontend/src/pages/admin/GetFilm.jsx
import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import BASE_URL from '../../api';
import { Link } from 'react-router-dom';
import AdminLayout from "../../layouts/AdminLayout";

const GetFilm = () => {
    const [films, setFilms] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);  // ← tambah loading state

    useEffect(() => {
        const fetchFilms = async () => {
            try {
                const response = await axios.get(`${BASE_URL}/films`);
                setFilms(response.data.data || []);
            } catch (error) {
                console.error('Error fetching films:', error);
            } finally {
                setLoading(false);  // ← selalu matikan loading
            }
        };
        fetchFilms();
    }, []);

    const deleteFilm = async (id) => {
        if (!window.confirm('Yakin ingin menghapus film ini?')) return;
        try {
            await axios.delete(`${BASE_URL}/films/${id}`);
            setFilms((current) => current.filter((film) => film.id_film !== id));
        } catch (error) {
            console.error('Error deleting film:', error);
        }
    };

    const filteredFilms = useMemo(() => {
        const query = searchQuery.toLowerCase();
        return films.filter((film) =>
            film.judul_film?.toLowerCase().includes(query) ||
            film.genre?.toLowerCase().includes(query)
        );
    }, [films, searchQuery]);

    return (
        <AdminLayout activeMenu="films">
            <div className="container-fluid">
                <div className="p-5 rounded-4" style={{ background: '#111827', border: '1px solid rgba(148, 163, 184, 0.12)', width: '100%' }}>
                    
                    {/* Header */}
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <div>
                            <h2 className="m-0 text-white" style={{ fontSize: '1.3rem' }}>Katalog Film</h2>
                            <p style={{ margin: '8px 0 0', color: '#e2e8f0', fontSize: '0.875rem' }}>Ubah, lihat, atau hapus film dari daftar katalog.</p>
                        </div>
                        <Link to="/admin/add" className="btn btn-primary fw-bold" style={{
                            boxShadow: '0 16px 40px rgba(245, 245, 245, 0.18)'
                        }}>
                            + Tambah Film
                        </Link>
                    </div>

                    {/* ← SEARCH BAR (yang tadinya ada di logic tapi tidak ditampilkan) */}
                    <div className="mb-4 px-1">
                        <input
                            type="text"
                            placeholder="Cari film berdasarkan judul atau genre..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="form-control"
                            style={{
                                borderRadius: '12px',
                                border: '1px solid rgba(148, 163, 184, 0.2)',
                                backgroundColor: '#0f1726',
                                color: '#f8fafc',
                            }}
                        />
                    </div>

                    {/* Header tabel */}
                    <div className="row px-4 mb-3 text-uppercase fw-bold small" style={{ color: '#94a3b8', letterSpacing: '1px' }}>
                        <div className="col-1">No</div>
                        <div className="col-4">Film</div>
                        <div className="col-2">Genre</div>
                        <div className="col-2 text-center">Status</div>
                        <div className="col-3 text-end">Aksi</div>
                    </div>

                    {/* Isi tabel */}
                    <div className="d-flex flex-column gap-3">

                        {/* ← LOADING STATE */}
                        {loading ? (
                            <div className="text-center py-5">
                                <div className="spinner-border text-primary" role="status"></div>
                                <p style={{ color: '#94a3b8', marginTop: '12px' }}>Memuat data film...</p>
                            </div>

                        ) : filteredFilms.length > 0 ? (
                            filteredFilms.map((film, index) => (
                                <div key={film.id_film} className="row px-4 py-3 align-items-center admin-row shadow-sm">
                                    <div className="col-1" style={{ color: '#94a3b8', fontWeight: 600 }}>{index + 1}</div>
                                    <div className="col-4 d-flex align-items-center gap-3">
                                        <img src={film.poster} alt={film.judul_film} style={{ width: '44px', height: '62px', objectFit: 'cover', borderRadius: '8px' }} />
                                        <div>
                                            <div style={{ color: '#fff', fontWeight: 600 }}>{film.judul_film}</div>
                                            <div style={{ color: '#94a3b8', fontSize: '0.82rem' }}>{film.created_by ? `Oleh admin ${film.created_by}` : 'Belum di-set'}</div>
                                        </div>
                                    </div>
                                    <div className="col-2" style={{ color: '#cbd5e1', fontSize: '0.9rem' }}>{film.genre}</div>
                                    <div className="col-2 text-center">
                                        <span style={{
                                            color: film.status === 'Akan Datang' ? '#fb7185' : '#34d399',
                                            fontSize: '0.9rem',
                                            fontWeight: 600
                                        }}>{film.status}</span>
                                    </div>
                                    <div className="col-3 text-end d-flex justify-content-end gap-2">
                                        <Link to={`/movie/${film.id_film}`} className="action-btn" style={{ backgroundColor: 'rgba(56, 189, 248, 0.12)', color: '#38bdf8' }}>Lihat</Link>
                                        <Link to={`/admin/edit/${film.id_film}`} className="action-btn" style={{ backgroundColor: 'rgba(59, 130, 246, 0.12)', color: '#60a5fa' }}>Edit</Link>
                                        <button onClick={() => deleteFilm(film.id_film)} className="action-btn" style={{ backgroundColor: 'rgba(248, 113, 113, 0.12)', color: '#fb7185' }}>Hapus</button>
                                    </div>
                                </div>
                            ))

                        ) : films.length === 0 ? (
                            // ← DATABASE MEMANG KOSONG
                            <div className="text-center py-5">
                                <p style={{ fontSize: '2.5rem', marginBottom: '8px' }}>🎬</p>
                                <h5 style={{ color: '#f8fafc' }}>Belum ada film</h5>
                                <p style={{ color: '#94a3b8' }}>Klik tombol "+ Tambah Film" untuk menambahkan film pertama.</p>
                            </div>
                        ) : (
                            // ← ADA DATA TAPI SEARCH TIDAK KETEMU
                            <div className="text-center py-5">
                                <p style={{ fontSize: '2.5rem', marginBottom: '8px' }}>🔍</p>
                                <h5 style={{ color: '#f8fafc' }}>Film tidak ditemukan</h5>
                                <p style={{ color: '#94a3b8' }}>Tidak ada film yang cocok dengan "<strong style={{ color: '#fff' }}>{searchQuery}</strong>"</p>
                                <button
                                    onClick={() => setSearchQuery('')}
                                    style={{ background: 'none', border: '1px solid #94a3b8', color: '#94a3b8', padding: '8px 20px', borderRadius: '8px', cursor: 'pointer', marginTop: '8px' }}
                                >
                                    Reset pencarian
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <style>{`
                .admin-row { background-color: #0f1726; border-radius: 16px; transition: all 0.25s ease; border: 1px solid transparent; }
                .admin-row:hover { background-color: #111827; border-color: rgba(56, 189, 248, 0.18); }
                .action-btn { display: inline-flex; align-items: center; justify-content: center; min-width: 76px; padding: 10px 14px; border-radius: 12px; border: none; font-weight: 600; cursor: pointer; transition: transform 0.2s ease, filter 0.2s ease; text-decoration: none; }
                .action-btn:hover { transform: translateY(-1px); filter: brightness(1.05); }
                input::placeholder { color: #94a3b8 !important; }
                input:focus { border-color: rgba(56, 189, 248, 0.4) !important; }
            `}</style>
        </AdminLayout>
    );
};

export default GetFilm;