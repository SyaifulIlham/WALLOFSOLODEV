import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams, Link } from 'react-router-dom';
import SidebarAdmin from '../../components/SidebarAdmin';

const EditSchedule = () => {
  const [films, setFilms] = useState([]);
  const [schedule, setSchedule] = useState({
    id_film: '',
    tanggal_tayang: '',
    jam_tayang: '',
    harga_tiket: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [filmsRes, scheduleRes] = await Promise.all([
          axios.get('http://localhost:3000/films'),
          axios.get(`http://localhost:3000/schedules/${id}`)
        ]);
        setFilms(filmsRes.data.data || []);
        const data = scheduleRes.data.data || {};
        setSchedule({
          id_film: data.id_film || '',
          tanggal_tayang: data.tanggal_tayang || '',
          jam_tayang: data.jam_tayang || '',
          harga_tiket: data.harga_tiket || ''
        });
      } catch (err) {
        console.error('Error loading schedule:', err);
      }
    };
    fetchData();
  }, [id]);

  const handleChange = (e) => {
    setSchedule({ ...schedule, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!schedule.id_film || !schedule.tanggal_tayang || !schedule.jam_tayang || !schedule.harga_tiket) {
      setError('Semua field wajib diisi');
      return;
    }

    try {
      await axios.put(`http://localhost:3000/schedules/${id}`, {
        ...schedule,
        harga_tiket: Number(schedule.harga_tiket)
      });
      navigate('/admin/schedules');
    } catch (err) {
      console.error(err);
      setError('Gagal memperbarui jadwal');
    }
  };

  return (
    <div className="d-flex" style={{ backgroundColor: '#131722', minHeight: '100vh', color: '#fff', fontFamily: 'Inter, sans-serif' }}>
      <SidebarAdmin activeMenu="schedule" />

      <div className="flex-grow-1" style={{ backgroundColor: '#0d1119', padding: '40px 50px', overflowY: 'auto' }}>
        <div className="mx-auto" style={{ maxWidth: '850px' }}>
          <div className="mb-4 text-center">
            <h2 className="fw-bold m-0 text-white">Edit Jadwal</h2>
            <p className="text-secondary mt-1">Perbarui data jadwal tayang film.</p>
          </div>

          <div className="shadow-lg" style={{ backgroundColor: '#151f30', borderRadius: '12px', padding: '40px', border: '1px solid #1f2636' }}>
            <form onSubmit={handleSubmit}>
              <div className="row g-4">
                <div className="col-md-12">
                  <label className="form-label admin-label">Pilih Film</label>
                  <select name="id_film" value={schedule.id_film} onChange={handleChange} className="form-select admin-input" required>
                    <option value="">Pilih film...</option>
                    {films.map((film) => (
                      <option key={film.id_film} value={film.id_film}>{film.judul_film}</option>
                    ))}
                  </select>
                </div>

                <div className="col-md-4">
                  <label className="form-label admin-label">Tanggal Tayang</label>
                  <input type="date" name="tanggal_tayang" value={schedule.tanggal_tayang} onChange={handleChange} className="form-control admin-input" required />
                </div>

                <div className="col-md-4">
                  <label className="form-label admin-label">Jam Tayang</label>
                  <input type="time" name="jam_tayang" value={schedule.jam_tayang} onChange={handleChange} className="form-control admin-input" required />
                </div>

                <div className="col-md-4">
                  <label className="form-label admin-label">Harga Tiket</label>
                  <input type="number" name="harga_tiket" value={schedule.harga_tiket} onChange={handleChange} className="form-control admin-input" required />
                </div>

                {error && (
                  <div className="col-12">
                    <div className="alert alert-danger py-2" role="alert">{error}</div>
                  </div>
                )}
              </div>

              <div className="d-flex justify-content-center gap-3 mt-5 border-top pt-4" style={{ borderColor: '#1f2636 !important' }}>
                <Link to="/admin/schedules" className="btn fw-bold px-5" style={{ backgroundColor: '#1a2639', color: '#a1a1aa', border: '1px solid #2a364a', borderRadius: '8px' }}>
                  Batal
                </Link>
                <button type="submit" className="btn fw-bold px-5" style={{ backgroundColor: '#29b474', color: '#fff', borderRadius: '8px' }}>
                  Simpan Perubahan
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditSchedule;
