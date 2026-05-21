import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
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
        {/* Tombol Close */}
        <button
          onClick={onClose}
          className="btn btn-link text-white p-2"
          style={{
            position: 'absolute', top: '-48px', right: '0',
            fontSize: '2rem', lineHeight: 1,
          }}
        >
          ✕
        </button>

        <p className="mb-3" style={{ color: '#aaa', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
          🎬 Trailer — {filmTitle}
        </p>

        {/* Video Container 16:9 */}
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
              controls
              autoPlay
              style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'contain' }}
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                e.currentTarget.nextSibling.style.display = 'flex';
              }}
            />
          )}

          {/* Fallback jika video error */}
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

  // Fungsi untuk mengubah format tanggal dari DD-MM-YYYY ke comparable format
  const parseDate = (dateStr) => {
    if (!dateStr) return null;
    const [day, month, year] = dateStr.split('-');
    return new Date(year, month - 1, day);
  };

  // Fungsi untuk format tanggal ke DD MMM YYYY
  const formatDisplayDate = (dateStr) => {
    if (!dateStr) return '';
    const date = parseDate(dateStr);
    if (!date) return dateStr;
    const options = { day: 'numeric', month: 'short', year: 'numeric' };
    return date.toLocaleDateString('id-ID', options);
  };

  // Fungsi untuk mendapatkan hari dalam bahasa Indonesia
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
        const res = await axios.get(`http://localhost:3000/films/${id}`);
        setFilm(res.data.data);
      } catch (error) {
        console.error("Error fetching detail:", error);
      }
    };

    const fetchFilmSchedules = async () => {
      try {
        const res = await axios.get(`http://localhost:3000/films/${id}/schedules`);
        const data = res.data.data || [];
        setSchedules(data);
        
        // Set tanggal pertama sebagai default
        if (data.length > 0) {
          setSelectedDate(data[0].tanggal_tayang);
        }
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

  // Dapatkan daftar tanggal unik dari jadwal
  const uniqueDates = schedules.length > 0 
    ? [...new Set(schedules.map(s => s.tanggal_tayang))].sort((a, b) => {
        const dateA = parseDate(a);
        const dateB = parseDate(b);
        return dateA - dateB;
      })
    : [];

  // Filter jadwal berdasarkan tanggal yang dipilih
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

  const hasTrailer = Boolean(film.trailer_url);

  return (
    <div style={{ backgroundColor: '#0a0b0d', minHeight: '100vh', color: '#fff' }}>
      <Navbar />
      <div style={{ height: '100px' }}></div>

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

      <div className="container text-start" style={{ padding: '20px 15px 100px 15px' }}>

        {/* Poster + Info */}
        <div className="row mb-5">
          <div className="col-md-3 col-sm-5 mb-4 mb-md-0">
            <img
              src={film.poster} alt={film.judul_film}
              className="img-fluid rounded-3 shadow-lg"
              style={{ width: '100%', maxWidth: '300px', border: '1px solid #222' }}
            />
          </div>

          <div className="col-md-9 col-sm-7 px-md-4">
            <div className="mb-3">
              <span className="fw-bold text-uppercase" style={{ letterSpacing: '1px', fontSize: '0.85rem', color: film.status === 'Akan Datang' ? '#0dcaf0' : '#dc3545' }}>
                {film.status === 'Akan Datang' ? '🔵 SEGERA HADIR' : '🔴 SEDANG TAYANG'}
              </span>
            </div>

            <h1 className="fw-bold text-white mb-3 text-uppercase" style={{ fontSize: '3.2rem', letterSpacing: '-1px' }}>
              {film.judul_film}
            </h1>

            <div className="d-flex flex-wrap gap-2 mt-2 mb-4">
              <span className="px-3 py-1 rounded-pill" style={{ backgroundColor: 'rgba(255,255,255,0.08)', color: '#c9d1d9', border: '1px solid rgba(255,255,255,0.15)', fontSize: '0.95rem' }}>
                {film.genre}
              </span>
              <span className="px-3 py-1 rounded-pill" style={{ backgroundColor: 'rgba(255,255,255,0.08)', color: '#c9d1d9', border: '1px solid rgba(255,255,255,0.15)', fontSize: '0.95rem' }}>
                {film.durasi} Menit
              </span>
            </div>

            {/* Tombol Lihat Trailer */}
            <button
              onClick={() => hasTrailer && setShowTrailer(true)}
              disabled={!hasTrailer}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '10px',
                backgroundColor: hasTrailer ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.04)',
                border: `1px solid ${hasTrailer ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.1)'}`,
                color: hasTrailer ? '#fff' : '#555',
                padding: '10px 22px', borderRadius: '50px',
                fontSize: '0.95rem', fontWeight: '600',
                cursor: hasTrailer ? 'pointer' : 'not-allowed',
                transition: 'all 0.25s ease',
              }}
              onMouseEnter={e => { if (hasTrailer) { e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.18)'; e.currentTarget.style.transform = 'scale(1.03)'; }}}
              onMouseLeave={e => { if (hasTrailer) { e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)'; e.currentTarget.style.transform = 'scale(1)'; }}}
            >
              <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '32px', height: '32px', borderRadius: '50%', backgroundColor: hasTrailer ? '#fff' : '#333' }}>
                <svg width="12" height="14" viewBox="0 0 12 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M1 1L11 7L1 13V1Z" fill={hasTrailer ? '#000' : '#555'} stroke={hasTrailer ? '#000' : '#555'} strokeWidth="1.5" strokeLinejoin="round" />
                </svg>
              </span>
              Lihat Trailer
              {!hasTrailer && <span style={{ fontSize: '0.75rem', color: '#666' }}>(belum tersedia)</span>}
            </button>
          </div>
        </div>

        {/* Tab Jadwal & Detail */}
        <div className="row mt-5">
          <div className="col-12">
            <div className="border-bottom border-secondary mb-4 pb-2 d-flex gap-4">
              {['jadwal', 'detail'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className="bg-transparent border-0 p-0 pb-2 fw-bold fs-5"
                  style={{
                    color: activeTab === tab ? '#fff' : '#6c757d',
                    borderBottom: activeTab === tab ? '3px solid #0dcaf0' : '3px solid transparent',
                    cursor: 'pointer', transition: 'all 0.3s ease'
                  }}
                >
                  {tab === 'jadwal' ? 'Jadwal' : 'Detail'}
                </button>
              ))}
            </div>

            {activeTab === 'detail' && (
              <div className="mt-4">
                <h5 className="fw-bold text-white mb-3">Sinopsis</h5>
                <p className="text-secondary" style={{ fontSize: '1.1rem', lineHeight: '1.8', whiteSpace: 'pre-line' }}>
                  {film.deskripsi || "Sinopsis belum tersedia untuk film ini."}
                </p>
              </div>
            )}

            {activeTab === 'jadwal' && (
              <div className="mt-4">
                <h5 className="fw-bold text-white mb-1">Jadwal Tayang</h5>
                <p className="text-secondary mb-4">Lihat jam tayang dan harga tiket untuk film ini.</p>

                {scheduleLoading ? (
                  <div className="text-secondary py-4">Memuat jadwal...</div>
                ) : scheduleError ? (
                  <div className="text-danger py-4">{scheduleError}</div>
                ) : schedules.length === 0 ? (
                  <div className="text-secondary py-4">Belum ada jadwal tayang untuk film ini.</div>
                ) : (
                  <div>
                    {/* Pilihan Tanggal */}
                    <div className="mb-5">
                      <p className="text-secondary mb-3">Pilih Tanggal Tayang:</p>
                      <div className="d-flex flex-wrap gap-2">
                        {uniqueDates.map((date) => (
                          <button
                            key={date}
                            onClick={() => setSelectedDate(date)}
                            className={`px-3 py-2 rounded-3 fw-semibold border`}
                            style={{
                              backgroundColor: selectedDate === date ? '#0dcaf0' : 'transparent',
                              color: selectedDate === date ? '#000' : '#fff',
                              border: selectedDate === date ? '1px solid #0dcaf0' : '1px solid rgba(255,255,255,0.2)',
                              cursor: 'pointer',
                              transition: 'all 0.2s ease',
                              fontSize: '0.95rem'
                            }}
                            onMouseEnter={e => {
                              if (selectedDate !== date) {
                                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.4)';
                                e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)';
                              }
                            }}
                            onMouseLeave={e => {
                              if (selectedDate !== date) {
                                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)';
                                e.currentTarget.style.backgroundColor = 'transparent';
                              }
                            }}
                          >
                            <div className="text-uppercase" style={{ fontSize: '0.75rem', letterSpacing: '0.5px' }}>
                              {getDayName(date)}
                            </div>
                            <div>{formatDisplayDate(date)}</div>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Jadwal untuk Tanggal Terpilih */}
                    {filteredSchedules.length === 0 ? (
                      <div className="text-secondary py-4 text-center">
                        <p className="mb-0">Tidak ada jadwal tayang pada tanggal yang dipilih.</p>
                      </div>
                    ) : (
                      <div className="row row-cols-1 row-cols-md-2 g-4">
                        {filteredSchedules.map((schedule) => (
                          <div key={schedule.id_jadwal} className="col">
                            <div className="p-4 rounded-4" style={{ backgroundColor: '#11161f', border: '1px solid rgba(255,255,255,0.08)', transition: 'all 0.3s ease' }}
                              onMouseEnter={e => {
                                e.currentTarget.style.backgroundColor = '#141a23';
                                e.currentTarget.style.borderColor = 'rgba(13,202,240,0.3)';
                                e.currentTarget.style.boxShadow = '0 0 20px rgba(13,202,240,0.1)';
                              }}
                              onMouseLeave={e => {
                                e.currentTarget.style.backgroundColor = '#11161f';
                                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
                                e.currentTarget.style.boxShadow = 'none';
                              }}
                            >
                              <div className="d-flex justify-content-between align-items-start mb-3">
                                <div>
                                  <h6 className="text-white fw-bold mb-2">{schedule.tanggal_tayang}</h6>
                                  <p className="text-secondary mb-1" style={{ fontSize: '0.9rem' }}>Jam tayang</p>
                                  <p className="text-white fw-semibold" style={{ fontSize: '1.3rem' }}>{schedule.jam_tayang}</p>
                                </div>
                                <span className="badge rounded-pill" style={{ backgroundColor: '#0dcaf0', color: '#050505', fontWeight: '700', padding: '0.6rem 0.8rem', fontSize: '0.9rem' }}>
                                  Rp {Number(schedule.harga_tiket).toLocaleString('id-ID')}
                                </span>
                              </div>
                              <Link
                                to={`/pesan/${id}?jadwal=${schedule.id_jadwal}`}
                                className="btn btn-primary w-100 fw-bold"
                                style={{ marginTop: '12px' }}
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

      {/* Modal Trailer */}
      {showTrailer && film.trailer_url && (
        <TrailerModal
          trailerUrl={film.trailer_url}
          filmTitle={film.judul_film}
          onClose={() => setShowTrailer(false)}
        />
      )}

      <style>{`.hover-white:hover { color: #ffffff !important; }`}</style>
    </div>
  );
};

export default DetailFilm;