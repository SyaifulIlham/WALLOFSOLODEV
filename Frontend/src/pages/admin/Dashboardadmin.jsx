import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import AdminLayout from '../../layouts/AdminLayout';

const ListFilm = () => {
    const [films, setFilms] = useState([]);
    const [schedules, setSchedules] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [filmsRes, schedulesRes] = await Promise.all([
                    axios.get('http://localhost:3000/films'),
                    axios.get('http://localhost:3000/schedules')
                ]);

                setFilms(filmsRes.data.data || []);
                setSchedules(schedulesRes.data.data || []);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    const deleteFilm = async (id) => {
        if (!window.confirm('Yakin ingin menghapus film ini?')) return;

        try {
            await axios.delete(`http://localhost:3000/films/${id}`);
            setFilms((current) => current.filter((film) => film.id_film !== id));
        } catch (error) {
            console.error('Error deleting data:', error);
        }
    };

    const filteredFilms = useMemo(() => {
        const query = searchQuery.toLowerCase();
        return films.filter((film) =>
            film.judul_film.toLowerCase().includes(query) ||
            film.genre.toLowerCase().includes(query)
        );
    }, [films, searchQuery]);

    const stats = {
        totalFilms: films.length,
        showing: films.filter((film) => film.status === 'Sedang Tayang').length,
        upcoming: films.filter((film) => film.status === 'Akan Datang').length,
        totalSchedules: schedules.length,
        potentialRevenue: schedules.reduce((sum, item) => sum + Number(item.harga_tiket || 0), 0)
    };

    return (
        <AdminLayout activeMenu="catalog">
            <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                <header style={{ marginBottom: '38px' }}>
                    <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center justify-content-between gap-3">
                        <div>
                            <p style={{ margin: 0, color: '#7c8da3', letterSpacing: '1px', textTransform: 'uppercase', fontSize: '0.8rem' }}>Admin Dashboard</p>
                            <h1 style={{ margin: '12px 0', fontSize: '2.5rem', lineHeight: 1.05, color: '#f8fafc' }}>Data Film & Jadwal di SoloFlixx</h1>
                            <p style={{ margin: 0, color: '#cbd5e1', maxWidth: '760px' }}>Kelola katalog film, pantau jadwal tayang, dan kontrol konten dengan tampilan yang lebih modern dan mudah dipahami.</p>
                        </div>
                        <div className="d-flex flex-wrap gap-3 align-items-center">
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Cari judul atau genre..."
                                style={{
                                    minWidth: '240px',
                                    borderRadius: '16px',
                                    border: '1px solid rgba(148, 163, 184, 0.2)',
                                    padding: '14px 16px',
                                    backgroundColor: '#0e1630',
                                    color: '#e2e8f0'
                                }}
                            />
                        </div>
                    </div>
                </header>

                <section className="dashboard-stats" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: '20px', marginBottom: '36px' }}>
                    {[
                        { label: 'Total Film', value: stats.totalFilms, accent: '#6366f1' },
                        { label: 'Sedang Tayang', value: stats.showing, accent: '#14b8a6' },
                        { label: 'Akan Datang', value: stats.upcoming, accent: '#f97316' },
                        { label: 'Total Jadwal', value: stats.totalSchedules, accent: '#38bdf8' }
                    ].map((card) => (
                        <div key={card.label} style={{ padding: '24px', borderRadius: '24px', background: '#111827', border: '1px solid rgba(148, 163, 184, 0.12)' }}>
                            <span style={{ display: 'block', marginBottom: '10px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '1px', fontSize: '0.75rem' }}>{card.label}</span>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
                                <strong style={{ fontSize: '2rem', color: '#fff' }}>{card.value}</strong>
                                <span style={{ width: '10px', height: '10px', backgroundColor: card.accent, borderRadius: '999px' }} />
                            </div>
                        </div>
                    ))}
                </section>

                <section style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px', marginBottom: '36px' }}>
                    <div style={{ padding: '24px', borderRadius: '24px', background: '#111827', border: '1px solid rgba(148, 163, 184, 0.12)' }}>
                        <div className="d-flex justify-content-between align-items-start mb-4">
                            <div>
                                <h2 style={{ margin: 0, fontSize: '1.2rem', color: '#f8fafc' }}>Film Terbaru</h2>
                                <p style={{ margin: '8px 0 0', color: '#94a3b8' }}>Film terbaru di katalog berdasarkan data terakhir.</p>
                            </div>
                            <span style={{ color: '#38bdf8', fontWeight: 700 }}>{filteredFilms.length} Film</span>
                        </div>
                        <div style={{ display: 'grid', gap: '16px' }}>
                            {filteredFilms.slice(0, 5).map((film) => (
                                <div key={film.id_film} style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '16px', borderRadius: '18px', background: '#0d1322' }}>
                                    <img src={film.poster} alt={film.judul_film} style={{ width: '70px', height: '98px', objectFit: 'cover', borderRadius: '14px', border: '1px solid rgba(148, 163, 184, 0.12)' }} />
                                    <div style={{ minWidth: 0 }}>
                                        <div style={{ color: '#fff', fontWeight: 700, marginBottom: '4px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{film.judul_film}</div>
                                        <div style={{ color: '#94a3b8', fontSize: '0.9rem' }}>{film.genre || 'Genre kosong'}</div>
                                        <div style={{ marginTop: '10px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                            <span style={{ color: '#fff', background: 'rgba(59, 130, 246, 0.12)', padding: '6px 10px', borderRadius: '999px', fontSize: '0.78rem' }}>{film.status}</span>
                                            <span style={{ color: '#94a3b8', fontSize: '0.78rem' }}>{film.durasi} menit</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div style={{ padding: '24px', borderRadius: '24px', background: '#111827', border: '1px solid rgba(148, 163, 184, 0.12)' }}>
                        <h2 style={{ margin: 0, fontSize: '1.2rem', color: '#f8fafc' }}>Pendapatan Potensial</h2>
                        <p style={{ margin: '10px 0 20px', color: '#94a3b8' }}>Estimasi total dari harga tiket semua jadwal saat ini.</p>
                        <div style={{ fontSize: '2.5rem', fontWeight: 700, color: '#38bdf8' }}>Rp {stats.potentialRevenue.toLocaleString('id-ID')}</div>
                        <div style={{ marginTop: '24px', color: '#cbd5e1' }}>
                            <div style={{ marginBottom: '10px' }}><strong>{stats.totalSchedules}</strong> Jadwal aktif</div>
                            <div><strong>{stats.upcoming}</strong> Film datang segera</div>
                        </div>
                    </div>
                </section>
            </div>
        </AdminLayout>
    );
};

export default ListFilm;
