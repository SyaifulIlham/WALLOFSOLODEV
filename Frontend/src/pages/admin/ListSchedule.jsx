import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import AdminLayout from '../../layouts/AdminLayout';

const ListSchedule = () => {
    const [schedules, setSchedules] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const fetchSchedules = async () => {
            try {
                const res = await axios.get('http://localhost:3000/schedules');
                setSchedules(res.data.data || []);
            } catch (error) {
                console.error('Error fetching schedules:', error);
            }
        };

        fetchSchedules();
    }, []);

    const deleteSchedule = async (id) => {
        if (!window.confirm('Yakin ingin menghapus jadwal ini?')) return;

        try {
            await axios.delete(`http://localhost:3000/schedules/${id}`);
            setSchedules((current) => current.filter((item) => item.id_jadwal !== id));
        } catch (error) {
            console.error('Error deleting schedule:', error);
        }
    };

    const filteredSchedules = useMemo(() => {
        const query = searchQuery.toLowerCase();
        return schedules.filter((schedule) =>
            (schedule.judul_film || '').toLowerCase().includes(query) ||
            (schedule.tanggal_tayang || '').toLowerCase().includes(query) ||
            (schedule.jam_tayang || '').toLowerCase().includes(query)
        );
    }, [schedules, searchQuery]);

    const stats = {
        totalSchedules: schedules.length,
        todaySchedules: schedules.filter((schedule) => schedule.tanggal_tayang === new Date().toISOString().split('T')[0]).length,
        averagePrice: schedules.length > 0 ? schedules.reduce((sum, el) => sum + Number(el.harga_tiket || 0), 0) / schedules.length : 0
    };

    return (
        <AdminLayout activeMenu="schedule">
            <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
                <header style={{ marginBottom: '32px' }}>
                    <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center justify-content-between gap-3">
                        <div>
                            <p style={{ margin: 0, color: '#7c8da3', letterSpacing: '1px', textTransform: 'uppercase', fontSize: '0.8rem' }}>Jadwal Admin</p>
                            <h1 style={{ margin: '12px 0', fontSize: '2.2rem', lineHeight: 1.05, color: '#f8fafc' }}>Kelola Jadwal Tayang</h1>
                            <p style={{ margin: 0, color: '#cbd5e1', maxWidth: '720px' }}>Pantau dan ubah jadwal tayang, harga tiket, dan detail pertunjukan dengan tampilan yang lebih jelas.</p>
                        </div>
                        <div className="d-flex flex-wrap gap-3 align-items-center">
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Cari judul film, tanggal, atau jam..."
                                style={{
                                    minWidth: '240px',
                                    borderRadius: '16px',
                                    border: '1px solid rgba(148, 163, 184, 0.2)',
                                    padding: '14px 16px',
                                    backgroundColor: '#0e1630',
                                    color: '#e2e8f0'
                                }}
                            />
                            <Link to="/admin/schedules/add" style={{
                                borderRadius: '16px',
                                backgroundColor: '#2563eb',
                                color: '#fff',
                                padding: '14px 24px',
                                textDecoration: 'none',
                                fontWeight: 700,
                                boxShadow: '0 16px 40px rgba(37, 99, 235, 0.18)'
                            }}>
                                + Tambah Jadwal
                            </Link>
                        </div>
                    </div>
                </header>

                <section style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '20px', marginBottom: '32px' }}>
                    {[
                        { label: 'Total Jadwal', value: stats.totalSchedules, accent: '#38bdf8' },
                        { label: 'Tayang Hari Ini', value: stats.todaySchedules, accent: '#22c55e' },
                        { label: 'Harga Rata-rata', value: `Rp ${Math.round(stats.averagePrice).toLocaleString('id-ID')}`, accent: '#f97316' }
                    ].map((card) => (
                        <div key={card.label} style={{ padding: '24px', borderRadius: '24px', background: '#111827', border: '1px solid rgba(148, 163, 184, 0.12)' }}>
                            <span style={{ display: 'block', marginBottom: '10px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '1px', fontSize: '0.75rem' }}>{card.label}</span>
                            <strong style={{ fontSize: '2rem', color: '#fff' }}>{card.value}</strong>
                        </div>
                    ))}
                </section>

                <div style={{ padding: '24px', borderRadius: '24px', background: '#111827', border: '1px solid rgba(148, 163, 184, 0.12)' }}>
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <div>
                            <h2 style={{ margin: 0, fontSize: '1.3rem', color: '#f8fafc' }}>Daftar Jadwal</h2>
                            <p style={{ margin: '8px 0 0', color: '#94a3b8' }}>Ubah atau hapus jadwal berdasarkan film dan slot yang tersedia.</p>
                        </div>
                        <Link to="/admin" style={{ color: '#38bdf8', textDecoration: 'none', fontWeight: 600 }}>Kembali ke Dashboard ?</Link>
                    </div>

                    <div className="row px-4 mb-3 text-slate-400 text-uppercase fw-bold" style={{ fontSize: '0.75rem', letterSpacing: '1px' }}>
                        <div className="col-1">No</div>
                        <div className="col-3">Film</div>
                        <div className="col-2">Tanggal</div>
                        <div className="col-2">Jam</div>
                        <div className="col-2 text-center">Aksi</div>
                    </div>

                    <div className="d-flex flex-column gap-3">
                        {filteredSchedules.length > 0 ? (
                            filteredSchedules.map((schedule, index) => (
                                <div key={schedule.id_jadwal} className="row px-4 py-3 align-items-center admin-row shadow-sm">
                                    <div className="col-1 text-slate-400 fw-semibold">{index + 1}</div>
                                    <div className="col-3 text-white fw-semibold">{schedule.judul_film || `Film ${schedule.id_film}`}</div>
                                    <div className="col-2 text-slate-300">{schedule.tanggal_tayang}</div>
                                    <div className="col-2 text-slate-300">{schedule.jam_tayang}</div>
                                    <div className="col-2 text-end d-flex justify-content-end gap-2">
                                        <Link to={`/admin/schedules/edit/${schedule.id_jadwal}`} className="action-btn" style={{ backgroundColor: 'rgba(59, 130, 246, 0.12)', color: '#60a5fa' }}>Edit</Link>
                                        <button onClick={() => deleteSchedule(schedule.id_jadwal)} className="action-btn" style={{ backgroundColor: 'rgba(248, 113, 113, 0.12)', color: '#fb7185' }}>Hapus</button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-5">
                                <h5 style={{ color: '#94a3b8' }}>Belum ada jadwal tayang.</h5>
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

export default ListSchedule;
