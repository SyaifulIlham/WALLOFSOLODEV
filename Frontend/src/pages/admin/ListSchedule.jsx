import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import SidebarAdmin from '../../components/SidebarAdmin';

const ListSchedule = () => {
  const [schedules, setSchedules] = useState([]);

  useEffect(() => {
    fetchSchedules();
  }, []);

  const fetchSchedules = async () => {
    try {
      const res = await axios.get('http://localhost:3000/schedules');
      setSchedules(res.data.data || []);
    } catch (error) {
      console.error('Error fetching schedules:', error);
    }
  };

  const deleteSchedule = async (id) => {
    const confirmed = window.confirm('Yakin ingin menghapus jadwal ini?');
    if (!confirmed) return;

    try {
      await axios.delete(`http://localhost:3000/schedules/${id}`);
      fetchSchedules();
    } catch (error) {
      console.error('Error deleting schedule:', error);
    }
  };

  return (
    <div className="d-flex" style={{ backgroundColor: '#131722', minHeight: '100vh', color: '#fff', fontFamily: 'Inter, sans-serif' }}>
      <SidebarAdmin activeMenu="schedule" />

      <div className="flex-grow-1" style={{ backgroundColor: '#0d1119', padding: '40px 50px' }}>
        <div className="d-flex justify-content-between align-items-center mb-5">
          <div>
            <h2 className="fw-bold m-0 text-white">Jadwal Film</h2>
            <p className="text-secondary mt-1">Kelola jadwal tayang dan harga tiket film.</p>
          </div>
          <div className="d-flex gap-3 align-items-center">
            <Link to="/admin/schedules/add" className="btn fw-bold d-flex align-items-center gap-2 shadow-sm" style={{ backgroundColor: '#2f80ed', color: '#fff', borderRadius: '8px', padding: '8px 20px' }}>
              <span style={{ fontSize: '1.2rem', lineHeight: '1' }}>+</span> Tambah Jadwal
            </Link>
          </div>
        </div>

        <div className="row px-4 mb-3 text-secondary text-uppercase fw-bold" style={{ fontSize: '0.75rem', letterSpacing: '1px' }}>
          <div className="col-1">ID</div>
          <div className="col-3">Film</div>
          <div className="col-2">Tanggal</div>
          <div className="col-2">Jam</div>
          <div className="col-2">Harga</div>
          <div className="col-2 text-end">Aksi</div>
        </div>

        <div className="d-flex flex-column gap-3">
          {schedules.length > 0 ? (
            schedules.map((schedule, index) => (
              <div key={schedule.id_jadwal} className="row px-4 py-3 align-items-center admin-row shadow-sm">
                <div className="col-1 text-secondary fw-semibold">{index + 1}</div>
                <div className="col-3 text-white fw-semibold">{schedule.judul_film || `Film ${schedule.id_film}`}</div>
                <div className="col-2 text-light">{schedule.tanggal_tayang}</div>
                <div className="col-2 text-light">{schedule.jam_tayang}</div>
                <div className="col-2 text-light">Rp {Number(schedule.harga_tiket).toLocaleString('id-ID')}</div>
                <div className="col-2 text-end d-flex justify-content-end gap-2">
                  <Link to={`/admin/schedules/edit/${schedule.id_jadwal}`} className="btn btn-sm fw-bold d-flex align-items-center" style={{ backgroundColor: 'rgba(47, 128, 237, 0.1)', color: '#2f80ed', borderRadius: '6px' }}>
                    Edit
                  </Link>
                  <button onClick={() => deleteSchedule(schedule.id_jadwal)} className="btn btn-sm fw-bold border-0 d-flex align-items-center" style={{ backgroundColor: 'rgba(235, 87, 87, 0.1)', color: '#eb5757', borderRadius: '6px' }}>
                    Hapus
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-5">
              <h5 className="text-secondary">Belum ada jadwal tayang.</h5>
            </div>
          )}
        </div>
      </div>

      <style>
        {`
          .admin-row { background-color: #151f30; border-radius: 12px; transition: all 0.2s ease; border: 1px solid transparent; }
          .admin-row:hover { background-color: #1a2639; border-color: #2f80ed; }
          .btn-add-movie { transition: 0.3s; }
          .btn-add-movie:hover { background-color: #256bca !important; transform: translateY(-2px); }
        `}
      </style>
    </div>
  );
};

export default ListSchedule;
