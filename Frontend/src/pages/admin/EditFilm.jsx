import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams, Link } from 'react-router-dom';
// IMPORT KOMPONEN SIDEBAR
import SidebarAdmin from '../../components/SidebarAdmin'; // Sesuaikan path foldernya

const EditFilm = () => {
    const [film, setFilm] = useState({ 
        judul_film: '', 
        id_kategori: '', 
        genre: '', 
        durasi: '', 
        deskripsi: '', 
        poster: '',
        status: '' 
    });
    
    const navigate = useNavigate();
    const { id } = useParams();

    useEffect(() => {
        const getFilmById = async () => {
            try {
                const res = await axios.get(`http://localhost:3000/films/${id}`);
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
            await axios.put(`http://localhost:3000/films/${id}`, film);
            alert('Perubahan Berhasil Disimpan!');
            navigate('/admin'); 
        } catch (error) {
            console.error("Error updating data:", error);
        }
    };

    return (
        <div className="d-flex" style={{ backgroundColor: '#131722', minHeight: '100vh', color: '#fff', fontFamily: 'Inter, sans-serif' }}>
            
            {/* CUKUP PANGGIL 1 BARIS INI! (activeMenu diset ke 'catalog' karena Edit adalah turunan dari Catalog) */}
            <SidebarAdmin activeMenu="catalog" />

            {/* ================= KONTEN KANAN ================= */}
            <div className="flex-grow-1" style={{ backgroundColor: '#0d1119', padding: '40px 50px', overflowY: 'auto' }}>
                
                <div className="mx-auto" style={{ maxWidth: '950px' }}>
                    
                    <div className="mb-4 text-center">
                        <h2 className="fw-bold m-0 text-white">Edit Film</h2>
                        <p className="text-secondary mt-1">Perbarui informasi film pilihan Anda di katalog SoloFlixx.</p>
                    </div>

                    {/* Form Container */}
                    <div className="shadow-lg" style={{ backgroundColor: '#151f30', borderRadius: '12px', padding: '40px', border: '1px solid #1f2636' }}>
                        <form onSubmit={handleSubmit}>
                            <div className="row g-5 align-items-start">
                                
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

                            <div className="d-flex justify-content-end gap-3 mt-5 border-top pt-4" style={{ borderColor: '#1f2636 !important' }}>
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

            {/* CSS sisa untuk Form saja */}
            <style>
                {`
                    .admin-label { color: #a1a1aa; font-size: 0.85rem; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 600; margin-bottom: 8px; }
                    .admin-input { background-color: #0d1119 !important; border: 1px solid #1f2636 !important; color: #fff !important; border-radius: 8px; padding: 12px 15px; box-shadow: none !important; transition: 0.3s; }
                    .admin-input:focus { border-color: #2f80ed !important; }
                    select.admin-input option { background-color: #0d1119; color: #fff; }
                `}
            </style>
        </div>
    );
};

export default EditFilm;