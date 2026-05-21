import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import SidebarAdmin from '../../components/SidebarAdmin';

const AddFilm = () => {
    const [film, setFilm] = useState({
        judul_film: '',
        id_kategori: '1',
        genre: '',
        durasi: '',
        deskripsi: '',
        poster: '',
        trailer_url: '',
        created_by: '1',
        status: 'Sedang Tayang'
    });

    const navigate = useNavigate();

    const handleChange = (e) => {
        setFilm({ ...film, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:3000/films', film);
            alert('Film Berhasil Ditambahkan!');
            navigate('/admin/Getfilms');
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="d-flex bg-dark-primary" style={{ minHeight: '100vh', color: '#fff', fontFamily: 'Inter, sans-serif' }}>
            <SidebarAdmin activeMenu="add" />

            <div className="flex-grow-1 bg-dark-secondary p-5">
                <div className="mx-auto" style={{ maxWidth: '850px' }}>
                    <div className="mb-4 text-center">
                        <h2 className="fw-bold m-0 text-white">Tambah Film Baru</h2>
                        <p className="text-secondary mt-1">Masukkan detail film untuk ditambahkan ke katalog SoloFlixx.</p>
                    </div>

                    <div className="shadow-lg bg-dark-tertiary rounded-3 p-5" style={{ border: '1px solid #1f2636' }}>
                        <form onSubmit={handleSubmit}>
                            <div className="row g-4">
                                <div className="col-md-12">
                                    <label className="form-label admin-label">Judul Film</label>
                                    <input type="text" name="judul_film" className="form-control admin-input" placeholder="Contoh: Avengers: Endgame" onChange={handleChange} required />
                                </div>

                                <div className="col-md-6">
                                    <label className="form-label admin-label">Genre</label>
                                    <input type="text" name="genre" className="form-control admin-input" placeholder="Action, Sci-Fi" onChange={handleChange} required />
                                </div>

                                <div className="col-md-6">
                                    <label className="form-label admin-label">Durasi (Menit)</label>
                                    <input type="text" name="durasi" className="form-control admin-input" placeholder="120" onChange={handleChange} required />
                                </div>

                                <div className="col-md-12">
                                    <label className="form-label admin-label">URL Poster</label>
                                    <input type="text" name="poster" className="form-control admin-input" placeholder="https://link-gambar-poster.jpg" onChange={handleChange} required />
                                </div>

                                {/* ← BARU: Field Trailer URL */}
                                <div className="col-md-12">
                                    <label className="form-label admin-label">
                                        URL Trailer
                                        <span className="text-muted small" style={{ marginLeft: '8px', fontWeight: 'normal', textTransform: 'none' }}>
                                            (opsional — bisa link MP4 atau YouTube)
                                        </span>
                                    </label>
                                    <input
                                        type="text"
                                        name="trailer_url"
                                        className="form-control admin-input"
                                        placeholder="https://nos.jkt-1.neo.id/.../trailer.mp4  atau  https://youtu.be/xxxxx"
                                        onChange={handleChange}
                                    />
                                    {film.trailer_url && (
                                        <small className="mt-2 d-block text-primary">
                                            {film.trailer_url.includes('youtube') || film.trailer_url.includes('youtu.be')
                                                ? '📺 Terdeteksi: Link YouTube'
                                                : '🎬 Terdeteksi: Link Video MP4'}
                                        </small>
                                    )}
                                </div>

                                <div className="col-md-12">
                                    <label className="form-label admin-label">Status Tayang</label>
                                    <select name="status" className="form-select admin-input" onChange={handleChange} value={film.status} style={{ cursor: 'pointer' }}>
                                        <option value="Sedang Tayang">Sedang Tayang (Muncul di Beranda Utama)</option>
                                        <option value="Akan Datang">Akan Datang (Segera Hadir)</option>
                                    </select>
                                </div>

                                <div className="col-md-12">
                                    <label className="form-label admin-label">Deskripsi Film / Sinopsis</label>
                                    <textarea name="deskripsi" className="form-control admin-input" rows="5" placeholder="Tulis sinopsis singkat film di sini..." onChange={handleChange} required></textarea>
                                </div>
                            </div>

                            <div className="d-flex justify-content-center gap-3 mt-5 border-top pt-4">
                                <button type="submit" className="btn fw-bold px-5 btn-primary-dark">
                                    Simpan Film
                                </button>
                                <Link to="/admin" className="btn fw-bold px-5 btn-secondary-dark">
                                    Batal
                                </Link>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            <style>{`
                .admin-label { color: #a1a1aa; font-size: 0.85rem; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 600; margin-bottom: 8px; }
                .admin-input { background-color: #0d1119 !important; border: 1px solid #1f2636 !important; color: #fff !important; border-radius: 8px; padding: 12px 15px; box-shadow: none !important; transition: 0.3s; }
                .admin-input:focus { border-color: #2f80ed !important; }
                .admin-input::placeholder { color: #4a5568 !important; }
                select.admin-input option { background-color: #0d1119; color: #fff; }
            `}</style>
        </div>
    );
};

export default AddFilm;