import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import BASE_URL from '../../api';
import Navbar from '../../components/nav';

const getYouTubeEmbedUrl = (url) => {
  try {
    const shortMatch = url.match(/youtu\.be\/([^?&]+)/);
    if (shortMatch) return `https://www.youtube.com/embed/${shortMatch[1]}?autoplay=1&rel=0`;

    const longMatch = url.match(/youtube\.com\/watch\?v=([^&]+)/);
    if (longMatch) return `https://www.youtube.com/embed/${longMatch[1]}?autoplay=1&rel=0`;

    if (url.includes('youtube.com/embed/')) return url.includes('autoplay') ? url : `${url}?autoplay=1`;
  } catch {
    return null;
  }
  return null;
};

const getTrailerType = (url) => {
  if (!url) return null;
  if (url.includes('youtube.com') || url.includes('youtu.be')) return 'youtube';
  return 'mp4';
};

const TrailerModal = ({ trailerUrl, filmTitle, onClose }) => {
  const trailerType = getTrailerType(trailerUrl);

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  useEffect(() => {
    const handleKeyDown = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [onClose]);

  return (
    <div className="modal-dark" onClick={handleBackdropClick}>
      <div style={{ position: 'relative', width: '100%', maxWidth: '900px' }}>
        <button
          onClick={onClose}
          className="btn btn-link text-white p-2"
          style={{ position: 'absolute', top: '-48px', right: '0', fontSize: '2rem', lineHeight: 1 }}
        >
          ✕
        </button>

        <p className="mb-3" style={{ color: '#aaa', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
          🎬 Trailer — {filmTitle}
        </p>

        <div className="rounded-3" style={{
          position: 'relative', paddingBottom: '56.25%', height: 0,
          overflow: 'hidden', backgroundColor: '#000',
          boxShadow: '0 25px 60px rgba(0,0,0,0.8)',
        }}>
          {trailerType === 'youtube' ? (
            <iframe
              src={getYouTubeEmbedUrl(trailerUrl)}
              title={`Trailer ${filmTitle}`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' }}
            />
          ) : (
            <video
              src={trailerUrl}
              controls autoPlay
              style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'contain' }}
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                e.currentTarget.nextSibling.style.display = 'flex';
              }}
            />
          )}
          <div className="d-none position-absolute top-0 start-0 w-100 h-100 d-flex flex-column align-items-center justify-content-center gap-3" style={{ color: '#aaa' }}>
            <span style={{ fontSize: '3rem' }}>⚠️</span>
            <p className="m-0">Trailer tidak dapat diputar.</p>
            <a href={trailerUrl} target="_blank" rel="noopener noreferrer" style={{ color: '#0dcaf0', fontSize: '0.9rem' }}>
              Buka di tab baru →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

const DetailFilm = () => {
  const { id } = useParams();
  const [film, setFilm] = useState(null);
  const [schedules, setSchedules] = useState([]);
  const [scheduleLoading, setScheduleLoading] = useState(true);
  const [scheduleError, setScheduleError] = useState(null);
  const [activeTab, setActiveTab] = useState('jadwal');
  const [showTrailer, setShowTrailer] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);

  const parseDate = (dateStr) => {
    if (!dateStr) return null;
    const [day, month, year] = dateStr.split('-');
    return new Date(year, month - 1, day);
  };

  const formatDisplayDate = (dateStr) => {
    if (!dateStr) return '';
    const date = parseDate(dateStr);
    if (!date) return dateStr;
    return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const getDayName = (dateStr) => {
    if (!dateStr) return '';
    const date = parseDate(dateStr);
    if (!date) return '';
    const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    return days[date.getDay()];
  };

  useEffect(() => {
    const fetchFilmDetail = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/films/${id}`);
        setFilm(res.data.data);
      } catch (error) {
        console.error("Error fetching detail:", error);
      }
    };

    const fetchFilmSchedules = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/films/${id}/schedules`);
        const data = res.data.data || [];
        setSchedules(data);
        if (data.length > 0) setSelectedDate(data[0].tanggal_tayang);
      } catch (error) {
        console.error("Error fetching schedules:", error);
        setScheduleError('Tidak dapat memuat jadwal saat ini.');
      } finally {
        setScheduleLoading(false);
      }
    };

    fetchFilmDetail();
    fetchFilmSchedules();
  }, [id]);

  const uniqueDates = schedules.length > 0
    ? [...new Set(schedules.map(s => s.tanggal_tayang))].sort((a, b) => parseDate(a) - parseDate(b))
    : [];

  const filteredSchedules = selectedDate
    ? schedules.filter(s => s.tanggal_tayang === selectedDate)
    : [];

  if (!film) {
    return (
      <div className="d-flex align-items-center justify-content-center" style={{ backgroundColor: '#0a0b0d', minHeight: '100vh' }}>
        <div className="spinner-border text-danger" role="status"></div>
      </div>
    );
  }

  const hasTrailer  = Boolean(film.trailer_url);
  const isTayang    = film.status !== 'Akan Datang';

  return (
    <div style={{ backgroundColor: '#0a0b0d', minHeight: '100vh', color: '#fff', fontFamily: "'Segoe UI', sans-serif" }}>

      <style>{`
        .hover-white:hover { color: #ffffff !important; }

        /* ── Hero bg blur ── */
        .hero-bg {
          position: fixed; inset: 0; z-index: 0;
          background-size: cover; background-position: center top;
          filter: blur(80px) brightness(0.12) saturate(1.4);
          transform: scale(1.15);
          pointer-events: none;
        }

        /* ── Tabs ── */
        .df-tab {
          background: none; border: none; cursor: pointer;
          padding: 12px 0; font-size: 1rem; font-weight: 600;
          transition: color .2s;
          border-bottom: 3px solid transparent;
        }
        .df-tab.active  { color: #fff !important; border-bottom-color: #dc3545; }
        .df-tab:not(.active) { color: #6c757d; }
        .df-tab:hover:not(.active) { color: #adb5bd; }

        /* ── Date pill ── */
        .date-pill {
          padding: 10px 16px; border-radius: 10px; border: 1px solid rgba(255,255,255,0.15);
          background: transparent; color: #fff; cursor: pointer;
          transition: all .2s; text-align: center; min-width: 90px;
        }
        .date-pill:hover { border-color: rgba(255,255,255,0.4); background: rgba(255,255,255,0.05); }
        .date-pill.active { background: #dc3545 !important; border-color: #dc3545 !important; color: #fff !important; }

        /* ── Schedule card ── */
        .sched-card {
          background: rgba(17,22,31,0.85);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 16px;
          padding: 22px;
          transition: border-color .2s, transform .2s, box-shadow .2s;
        }
        .sched-card:hover {
          border-color: rgba(220,53,69,0.35);
          transform: translateY(-3px);
          box-shadow: 0 12px 32px rgba(220,53,69,0.1);
        }

        /* ── Pesan btn ── */
        .pesan-btn {
          display: block; width: 100%; text-align: center; text-decoration: none;
          background: #dc3545; color: #fff; font-weight: 700;
          padding: 11px; border-radius: 10px; font-size: 0.92rem;
          margin-top: 16px; transition: background .2s, transform .2s;
        }
        .pesan-btn:hover { background: #b02a37 !important; color: #fff; transform: scale(1.02); }

        /* ── Trailer btn ── */
        .trailer-btn {
          display: inline-flex; align-items: center; gap: 10px;
          border-radius: 50px; padding: 10px 22px;
          font-size: 0.95rem; font-weight: 600; cursor: pointer;
          transition: all .25s ease;
        }

        @keyframes fadeUp { from { opacity:0; transform:translateY(20px) } to { opacity:1; transform:translateY(0) } }
        .fade-up { animation: fadeUp .5s ease both; }
      `}</style>

      {/* Hero background blur dari poster */}
      <div
        className="hero-bg"
        style={{ backgroundImage: `url(${film.poster})` }}
      />

      <div style={{ position: 'relative', zIndex: 1 }}>
        <Navbar />
        <div style={{ height: '100px' }} />

        {/* Breadcrumb */}
        <div className="container text-start">
          <p className="mb-3" style={{ color: '#aaa', fontSize: '0.9rem' }}>
            <Link to="/" className="text-decoration-none hover-white" style={{ color: '#aaa' }}>Beranda</Link>
            <span className="mx-2">/</span>
            <Link to="/movies" className="text-decoration-none hover-white" style={{ color: '#aaa' }}>Film</Link>
            <span className="mx-2">/</span>
            <span style={{ color: '#fff', fontWeight: 'bold' }}>{film.judul_film}</span>
          </p>
        </div>

        <div className="container text-start fade-up" style={{ padding: '20px 15px 100px' }}>

          {/* ── POSTER + INFO ── */}
          <div className="row mb-5 align-items-start">

            {/* Poster */}
            <div className="col-md-3 col-sm-5 mb-4 mb-md-0">
              <div style={{ position: 'relative', display: 'inline-block' }}>
                <img
                  src={film.poster}
                  alt={film.judul_film}
                  className="img-fluid rounded-4"
                  style={{
                    width: '100%', maxWidth: '260px', display: 'block',
                    border: '1px solid rgba(255,255,255,0.1)',
                    boxShadow: '0 20px 60px rgba(0,0,0,0.7), 0 0 40px rgba(220,53,69,0.2)',
                  }}
                />
                {/* Status badge di poster */}
                <span style={{
                  position: 'absolute', top: 12, left: 12,
                  padding: '4px 12px', borderRadius: 20, fontSize: '0.72rem', fontWeight: 700,
                  backgroundColor: isTayang ? '#dc3545' : '#0dcaf0',
                  color: isTayang ? '#fff' : '#000',
                  textTransform: 'uppercase', letterSpacing: '0.5px',
                  boxShadow: '0 2px 12px rgba(0,0,0,0.5)',
                }}>
                  {isTayang ? '● Tayang' : '● Segera'}
                </span>
              </div>
            </div>

            {/* Info */}
            <div className="col-md-9 col-sm-7 px-md-4">

              {/* Status label */}
              <div className="mb-2">
                <span className="fw-bold text-uppercase" style={{ letterSpacing: '1px', fontSize: '0.85rem', color: isTayang ? '#dc3545' : '#0dcaf0' }}>
                  {isTayang ? '🔴 SEDANG TAYANG' : '🔵 SEGERA HADIR'}
                </span>
              </div>

              {/* Judul */}
              <h1 className="fw-bold text-white mb-3 text-uppercase" style={{
                fontSize: 'clamp(1.8rem, 4vw, 3rem)',
                letterSpacing: '-1px', lineHeight: 1.1,
                textShadow: '0 2px 20px rgba(0,0,0,0.6)',
              }}>
                {film.judul_film}
              </h1>

              {/* Badges */}
              <div className="d-flex flex-wrap gap-2 mt-2 mb-4">
                {film.nama_kategori && (
                  <span className="px-3 py-1 rounded-pill" style={{ backgroundColor: 'rgba(13,202,240,0.1)', color: '#0dcaf0', border: '1px solid rgba(13,202,240,0.25)', fontSize: '0.88rem', fontWeight: 600 }}>
                    🎭 {film.nama_kategori}
                  </span>
                )}
                <span className="px-3 py-1 rounded-pill" style={{ backgroundColor: 'rgba(255,255,255,0.08)', color: '#c9d1d9', border: '1px solid rgba(255,255,255,0.15)', fontSize: '0.88rem' }}>
                  🎬 {film.genre}
                </span>
                <span className="px-3 py-1 rounded-pill" style={{ backgroundColor: 'rgba(255,255,255,0.08)', color: '#c9d1d9', border: '1px solid rgba(255,255,255,0.15)', fontSize: '0.88rem' }}>
                  ⏱ {film.durasi} Menit
                </span>
              </div>

              {/* Tombol Trailer */}
              <button
                onClick={() => hasTrailer && setShowTrailer(true)}
                disabled={!hasTrailer}
                className="trailer-btn"
                style={{
                  backgroundColor: hasTrailer ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.04)',
                  border: `1px solid ${hasTrailer ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.1)'}`,
                  color: hasTrailer ? '#fff' : '#555',
                  cursor: hasTrailer ? 'pointer' : 'not-allowed',
                }}
                onMouseEnter={e => { if (hasTrailer) { e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.18)'; e.currentTarget.style.transform = 'scale(1.03)'; }}}
                onMouseLeave={e => { if (hasTrailer) { e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)'; e.currentTarget.style.transform = 'scale(1)'; }}}
              >
                <span style={{
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                  width: 32, height: 32, borderRadius: '50%',
                  backgroundColor: hasTrailer ? '#fff' : '#333',
                }}>
                  <svg width="12" height="14" viewBox="0 0 12 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1 1L11 7L1 13V1Z" fill={hasTrailer ? '#000' : '#555'} stroke={hasTrailer ? '#000' : '#555'} strokeWidth="1.5" strokeLinejoin="round" />
                  </svg>
                </span>
                Lihat Trailer
                {!hasTrailer && <span style={{ fontSize: '0.75rem', color: '#666' }}>(belum tersedia)</span>}
              </button>
            </div>
          </div>

          {/* ── TABS ── */}
          <div className="row mt-3">
            <div className="col-12">
              <div style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', display: 'flex', gap: 28, marginBottom: 28 }}>
                {['jadwal', 'detail'].map(tab => (
                  <button
                    key={tab}
                    className={`df-tab ${activeTab === tab ? 'active' : ''}`}
                    onClick={() => setActiveTab(tab)}
                  >
                    {tab === 'jadwal' ? 'Jadwal' : 'Detail'}
                  </button>
                ))}
              </div>

              {/* ── TAB DETAIL ── */}
              {activeTab === 'detail' && (
                <div className="mt-2" style={{ maxWidth: 720 }}>
                  <div style={{ marginBottom: 32, paddingBottom: 32, borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                    <h5 className="fw-bold text-white mb-3">Sinopsis</h5>
                    <p className="text-secondary" style={{ fontSize: '1.05rem', lineHeight: '1.85', whiteSpace: 'pre-line' }}>
                      {film.deskripsi || "Sinopsis belum tersedia untuk film ini."}
                    </p>
                  </div>

                  {/* Info rows */}
                  {[
                    { label: 'Kategori', value: film.nama_kategori },
                    { label: 'Genre',    value: film.genre },
                    { label: 'Durasi',   value: film.durasi ? `${film.durasi} Menit` : null },
                    { label: 'Status',   value: film.status },
                  ].filter(item => item.value).map(({ label, value }) => (
                    <div key={label} style={{ marginBottom: 24, paddingBottom: 24, borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                      <h6 style={{ color: '#fff', fontWeight: 700, fontSize: '0.95rem', marginBottom: 6 }}>{label}</h6>
                      <p style={{ color: '#999', fontSize: '0.95rem', margin: 0 }}>{value}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* ── TAB JADWAL ── */}
              {activeTab === 'jadwal' && (
                <div className="mt-2">
                  {scheduleLoading ? (
                    <div className="text-secondary py-4">Memuat jadwal...</div>
                  ) : scheduleError ? (
                    <div className="text-danger py-4">{scheduleError}</div>
                  ) : schedules.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '48px 0', border: '1px dashed rgba(255,255,255,0.1)', borderRadius: 12, color: 'rgba(255,255,255,0.3)' }}>
                      🎞️ Belum ada jadwal tayang untuk film ini.
                    </div>
                  ) : (
                    <div>
                      {/* Pilihan Tanggal */}
                      <p style={{ color: '#888', fontSize: '0.85rem', marginBottom: 12 }}>Pilih Tanggal Tayang</p>
                      <div className="d-flex flex-wrap gap-2 mb-5">
                        {uniqueDates.map((date) => (
                          <button
                            key={date}
                            className={`date-pill ${selectedDate === date ? 'active' : ''}`}
                            onClick={() => setSelectedDate(date)}
                          >
                            <div style={{ fontSize: '0.72rem', letterSpacing: '0.5px', textTransform: 'uppercase', color: selectedDate === date ? '#fff' : '#888', marginBottom: 2 }}>
                              {getDayName(date)}
                            </div>
                            <div style={{ fontWeight: 600, fontSize: '0.88rem' }}>
                              {formatDisplayDate(date)}
                            </div>
                          </button>
                        ))}
                      </div>

                      {/* Jadwal untuk tanggal terpilih */}
                      {filteredSchedules.length === 0 ? (
                        <div className="text-secondary py-4 text-center">
                          Tidak ada jadwal tayang pada tanggal yang dipilih.
                        </div>
                      ) : (
                        <div className="row row-cols-1 row-cols-md-2 g-4">
                          {filteredSchedules.map((schedule) => (
                            <div key={schedule.id_jadwal} className="col">
                              <div className="sched-card">
                                <div className="d-flex justify-content-between align-items-start">
                                  <div>
                                    <p style={{ color: '#888', fontSize: '0.78rem', margin: '0 0 2px' }}>Jam Tayang</p>
                                    <p className="text-white fw-bold mb-0" style={{ fontSize: '1.6rem', lineHeight: 1.2 }}>
                                      {schedule.jam_tayang}
                                    </p>
                                  </div>
                                  <div style={{ textAlign: 'right' }}>
                                    <p style={{ color: '#888', fontSize: '0.78rem', margin: '0 0 4px' }}>Harga Tiket</p>
                                    <span style={{
                                      display: 'inline-block', padding: '6px 14px', borderRadius: 20,
                                      backgroundColor: 'rgba(220,53,69,0.15)', color: '#f87171',
                                      border: '1px solid rgba(220,53,69,0.3)', fontWeight: 700, fontSize: '0.9rem',
                                    }}>
                                      Rp {Number(schedule.harga_tiket).toLocaleString('id-ID')}
                                    </span>
                                  </div>
                                </div>

                                <Link
                                  to={`/pesan/${id}?jadwal=${schedule.id_jadwal}`}
                                  className="pesan-btn"
                                >
                                  🎫 Pesan Tiket
                                </Link>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

            </div>
          </div>

        </div>
      </div>

      {/* Modal Trailer */}
      {showTrailer && film.trailer_url && (
        <TrailerModal
          trailerUrl={film.trailer_url}
          filmTitle={film.judul_film}
          onClose={() => setShowTrailer(false)}
        />
      )}
    </div>
  );
};

export default DetailFilm;