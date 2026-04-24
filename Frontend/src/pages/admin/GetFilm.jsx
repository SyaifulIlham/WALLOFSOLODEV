import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import AdminLayout from "../../layouts/AdminLayout";

const GetFilm = () => {
    const [films, setFilms] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const fetchFilms = async () => {
            try {
                const response = await axios.get('http://localhost:3000/films');
                setFilms(response.data.data || []);
            } catch (error) {
                console.error('Error fetching films:', error);
            }
        };

        fetchFilms();
    }, []);

    const deleteFilm = async (id) => {
        if (!window.confirm('Yakin ingin menghapus film ini?')) return;

        try {
            await axios.delete(`http://localhost:3000/films/${id}`);
            setFilms((current) => current.filter((film) => film.id_film !== id));
        } catch (error) {
            console.error('Error deleting film:', error);
        }
    };

    const filteredFilms = useMemo(() => {
        const query = searchQuery.toLowerCase();
        return films.filter((film) =>
            film.judul_film.toLowerCase().includes(query) ||
            film.genre.toLowerCase().includes(query)
        );
    }, [films, searchQuery]);

    return (
        <AdminLayout activeMenu="films">
            <div className="container-fluid width-100%">
                <div style={{ padding: '24px', borderRadius: '24px', background: '#111827', border: '1px solid rgba(148, 163, 184, 0.12)', width: '100%' }}>
                    <div className="d-flex justify-content-between align-items-center mb-4 width-100%">
                        <div>
                            <h2 style={{ margin: 0, fontSize: '1.3rem', color: '#f8fafc' }}>Katalog Film</h2>
                            <p style={{ margin: '8px 0 0', color: '#94a3b8' }}>Ubah, lihat, atau hapus film dari daftar katalog.</p>
                        </div>
                        <Link to="/admin/add" style={{
                                                borderRadius: '16px',
                                                backgroundColor: '#2563eb',
                                                color: '#fff',
                                                padding: '14px 24px',
                                                textDecoration: 'none',
                                                fontWeight: 700,
                                                boxShadow: '0 16px 40px rgba(37, 99, 235, 0.18)'
                                            }}>
                                                + Tambah Film
                                            </Link>
                    </div>

                    <div className="row px-4 mb-3 text-slate-400 text-uppercase fw-bold" style={{ fontSize: '0.75rem', letterSpacing: '1px' }}>
                        <div className="col-1">No</div>
                        <div className="col-4">Film</div>
                        <div className="col-2">Genre</div>
                        <div className="col-2 text-center">Status</div>
                        <div className="col-3 text-end">Aksi</div>
                    </div>

                    <div className="d-flex flex-column gap-3">
                        {filteredFilms.length > 0 ? (
                            filteredFilms.map((film, index) => (
                                <div key={film.id_film} className="row px-4 py-3 align-items-center admin-row shadow-sm">
                                    <div className="col-1 text-slate-400 fw-semibold">{index + 1}</div>
                                    <div className="col-4 d-flex align-items-center gap-3">
                                        <img src={film.poster} alt={film.judul_film} style={{ width: '44px', height: '62px', objectFit: 'cover', borderRadius: '8px' }} />
                                        <div>
                                            <div style={{ color: '#fff', fontWeight: 600 }}>{film.judul_film}</div>
                                            <div style={{ color: '#94a3b8', fontSize: '0.82rem' }}>{film.created_by ? `Oleh admin ${film.created_by}` : 'Belum di-set'}</div>
                                        </div>
                                    </div>
                                    <div className="col-2 text-slate-300" style={{ fontSize: '0.9rem' }}>{film.genre}</div>
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
                        ) : (
                            <div className="text-center py-5">
                                <h5 style={{ color: '#94a3b8' }}>Tidak ada film yang cocok dengan pencarian.</h5>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <style>
                {`
                    .admin-row { background-color: #0f1726; border-radius: 16px; transition: all 0.25s ease; border: 1px solid transparent; }
                    .admin-row:hover { background-color: #111827; border-color: rgba(56, 189, 248, 0.18); }
                    .action-btn { display: inline-flex; align-items: center; justify-content: center; min-width: 76px; padding: 10px 14px; border-radius: 12px; border: none; font-weight: 600; transition: transform 0.2s ease, filter 0.2s ease; }
                    .action-btn:hover { transform: translateY(-1px); filter: brightness(1.05); }
                    input::placeholder { color: #94a3b8 !important; }
                `}
            </style>
        </AdminLayout>
    );
};

export default GetFilm;  