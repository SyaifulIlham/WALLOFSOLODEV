import React, { useState, useEffect } from 'react';
import axios from 'axios';
import BASE_URL from '../../api';
import { useNavigate, useParams, Link } from 'react-router-dom';
import SidebarAdmin from '../../components/SidebarAdmin';

const EditFilm = () => {
    const [film, setFilm] = useState({
        judul_film: '',
        id_kategori: '',
        genre: '',
        durasi: '',
        deskripsi: '',
        poster: '',
        trailer_url: '',
        status: ''
    });

    const navigate = useNavigate();
    const { id } = useParams();

    useEffect(() => {
        const getFilmById = async () => {
            try {
                const res = await axios.get(`${BASE_URL}/films/${id}`);
                setFilm(res.data.data);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };
        getFilmById();
    }, [id]);

    const handleChange = (e) => {
        setFilm({ ...film, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`${BASE_URL}/films/${id}`, film);
            alert('Perubahan Berhasil Disimpan!');
            navigate('/admin/films');
        } catch (error) {
            console.error("Error updating data:", error);
        }
    };

    return (
        <div className="d-flex bg-dark-primary" style={{ minHeight: '100vh', color: '#fff', fontFamily: 'Inter, sans-serif' }}>
            <SidebarAdmin activeMenu="catalog" />

            <div className="flex-grow-1 bg-dark-secondary p-5">
                <div className="mx-auto" style={{ maxWidth: '950px' }}>
                    <div className="mb-4 text-center">
                        <h2 className="fw-bold m-0 text-white">Edit Film</h2>
                        <p className="text-secondary mt-1">Perbarui informasi film pilihan Anda di katalog SoloFlixx.</p>
                    </div>

                    <div className="shadow-lg bg-dark-tertiary rounded-3 p-5" style={{ border: '1px solid #1f2636' }}>
                        <form onSubmit={handleSubmit}>
                            <div className="row g-5 align-items-start">

                                {/* Preview Poster */}
                                <div className="col-lg-4 text-center">
                                    <label className="form-label admin-label mb-3 d-block">Preview Poster</label>
                                    <div className="p-2 rounded-4 shadow-sm" style={{ backgroundColor: '#0d1119', border: '1px solid #1f2636' }}>
                                        <img
                                            src={film.poster || 'https://via.placeholder.com/300x450?text=Memuat+Gambar...'}
                                            alt="Preview"
                                            className="img-fluid rounded-3"
                                            style={{ width: '100%', aspectRatio: '2/3', objectFit: 'cover' }}
                                        />
                                    </div>
                                </div>

                                {/* Form Fields */}
                                <div className="col-lg-8">
                                    <div className="row g-4">
                                        <div className="col-12">
                                            <label className="form-label admin-label">Judul Film</label>
                                            <input type="text" name="judul_film" className="form-control admin-input" value={film.judul_film || ''} onChange={handleChange} required />
                                        </div>

                                        <div className="col-md-6">
                                            <label className="form-label admin-label">Genre</label>
                                            <input type="text" name="genre" className="form-control admin-input" value={film.genre || ''} onChange={handleChange} required />
                                        </div>

                                        <div className="col-md-6">
                                            <label className="form-label admin-label">Durasi (Menit)</label>
                                            <input type="text" name="durasi" className="form-control admin-input" value={film.durasi || ''} onChange={handleChange} required />
                                        </div>

                                        <div className="col-12">
                                            <label className="form-label admin-label">URL Poster</label>
                                            <input type="text" name="poster" className="form-control admin-input" value={film.poster || ''} onChange={handleChange} required />
                                        </div>

                                        {/* ← BARU: Field Trailer URL */}
                                        <div className="col-12">
                                            <label className="form-label admin-label">
                                                URL Trailer
                                                <span style={{ color: '#4a5568', fontSize: '0.75rem', marginLeft: '8px', fontWeight: 'normal', textTransform: 'none' }}>
                                                    (opsional)
                                                </span>
                                            </label>
                                            <input
                                                type="text"
                                                name="trailer_url"
                                                className="form-control admin-input"
                                                value={film.trailer_url || ''}
                                                placeholder="https://nos.jkt-1.neo.id/.../trailer.mp4  atau  https://youtu.be/xxxxx"
                                                onChange={handleChange}
                                            />
                                            {film.trailer_url && (
                                                <small style={{ color: '#2f80ed', marginTop: '6px', display: 'block' }}>
                                                    {film.trailer_url.includes('youtube') || film.trailer_url.includes('youtu.be')
                                                        ? '📺 Terdeteksi: Link YouTube'
                                                        : '🎬 Terdeteksi: Link Video MP4'}
                                                </small>
                                            )}
                                        </div>

                                        <div className="col-12">
                                            <label className="form-label admin-label">Status Tayang</label>
                                            <select name="status" className="form-select admin-input" value={film.status || 'Sedang Tayang'} onChange={handleChange} style={{ cursor: 'pointer' }}>
                                                <option value="Sedang Tayang">Sedang Tayang</option>
                                                <option value="Akan Datang">Akan Datang</option>
                                            </select>
                                        </div>

                                        <div className="col-12">
                                            <label className="form-label admin-label">Deskripsi Film / Sinopsis</label>
                                            <textarea name="deskripsi" className="form-control admin-input" rows="5" value={film.deskripsi || ''} onChange={handleChange} required></textarea>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="d-flex justify-content-end gap-3 mt-5 border-top pt-4">
                                <Link to="/admin" className="btn fw-bold px-4" style={{ backgroundColor: '#1a2639', color: '#a1a1aa', border: '1px solid #2a364a', borderRadius: '8px' }}>
                                    Batal
                                </Link>
                                <button type="submit" className="btn fw-bold px-4" style={{ backgroundColor: '#29b474', color: '#fff', borderRadius: '8px' }}>
                                    Simpan Perubahan
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            <style>{`
                .admin-label { color: #a1a1aa; font-size: 0.85rem; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 600; margin-bottom: 8px; }
                .admin-input { background-color: #0d1119 !important; border: 1px solid #1f2636 !important; color: #fff !important; border-radius: 8px; padding: 12px 15px; box-shadow: none !important; transition: 0.3s; }
                .admin-input:focus { border-color: #2f80ed !important; }
                select.admin-input option { background-color: #0d1119; color: #fff; }
            `}</style>
        </div>
    );
};

export default EditFilm;