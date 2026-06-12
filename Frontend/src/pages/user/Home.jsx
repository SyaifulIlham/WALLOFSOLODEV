import React, { useEffect, useState, useMemo, useRef } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import MainLayout from '../../layouts/MainLayout';

/* ─────────────────────────────────────────────
   SKELETON CARD
───────────────────────────────────────────── */
const SkeletonCard = () => (
    <div className="sf-film-col">
        <div className="sf-skel-poster sf-skel-anim" />
        <div style={{ padding: '10px 0 0' }}>
            <div className="sf-skel-line sf-skel-anim" style={{ width: '80%', height: 11 }} />
            <div className="sf-skel-line sf-skel-anim" style={{ width: '50%', height: 9, marginTop: 7 }} />
        </div>
    </div>
);

/* ─────────────────────────────────────────────
   FILM CARD  — dark mode
───────────────────────────────────────────── */
const FilmCard = ({ film, index, variant = 'now' }) => {
    const isUp = variant === 'upcoming';
    const [loaded, setLoaded] = useState(false);
    return (
        <div className="sf-film-col" style={{ animationDelay: `${index * 0.06}s` }}>
            <Link to={`/movie/${film.id_film}`} className="sf-card-link">
                <div className="sf-card">
                    <div className="sf-card__poster-wrap">
                        {!loaded && (
                            <div className="sf-skel-poster sf-skel-anim" 
                            style={{ position: 'absolute', inset: 0 }}/>
                        )}
                        <img
                            src={film.poster}
                            alt={film.judul_film}
                            className="sf-card__poster"
                            loading="lazy"
                            decoding="async"
                            onLoad={() => setLoaded(true)}
                            style={{ opacity: loaded ? 1 : 0, transition: 'opacity .3s' }}
                        />
                        {/* gradient bottom overlay */}
                        <div className="sf-card__grad" />

                        {/* Nomor urut */}
                        <div className="sf-card__num">{index + 1}</div>

                        {/* Badge */}
                        {isUp && <div className="sf-card__badge">Segera</div>}

                        {/* Hover play btn */}
                        <div className="sf-card__play">
                            <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22">
                                <path d="M8 5v14l11-7z"/>
                            </svg>
                        </div>
                    </div>
                    <div className="sf-card__body">
                        <p className="sf-card__title">{film.judul_film}</p>
                        {film.genre && <p className="sf-card__genre">{film.genre}</p>}
                    </div>
                </div>
            </Link>
        </div>
    );
};

/* ─────────────────────────────────────────────
   PROMO BANNERS
───────────────────────────────────────────── */
const banners = [
    { accent: '#e50914', label: 'Promo Spesial', headline: 'Beli 2 Tiket, Gratis 1 Popcorn!',   sub: 'Berlaku setiap Selasa & Rabu' },
    { accent: '#1db954', label: 'Partner',        headline: 'Bayar Pakai GoPay, Cashback 30%',   sub: 'Maks. Rp 25.000 per transaksi' },
    { accent: '#f5a623', label: 'Eksklusif',      headline: 'Gratis Upsize Snack Combo',          sub: 'Tunjukkan tiket SoloFlixx kamu' },
];

const PromoBanners = () => (
    <div className="sf-banner-grid">
        {banners.map((b, i) => (
            <div key={i} className="sf-banner">
                <div className="sf-banner__glow" style={{ background: b.accent }} />
                <div className="sf-banner__top">
                    <span className="sf-banner__label" style={{ color: b.accent }}>{b.label}</span>
                    <span className="sf-banner__arrow">›</span>
                </div>
                <p className="sf-banner__headline">{b.headline}</p>
                <p className="sf-banner__sub">{b.sub}</p>
            </div>
        ))}
    </div>
);

/* ─────────────────────────────────────────────
   SHORTCUT CATEGORIES
───────────────────────────────────────────── */
const categories = [
    { icon: '🎭', label: 'Bioskop' },
    { icon: '🎬', label: 'Film' },
    { icon: '🍿', label: 'Snack' },
    { icon: '🎟️', label: 'Promo' },
];

/* ─────────────────────────────────────────────
   HOME PAGE
───────────────────────────────────────────── */
const Home = () => {
    const [films, setFilms]         = useState([]);
    const [loading, setLoading]     = useState(true);
    const [error, setError]         = useState(null);
    const [search, setSearch]       = useState('');
    const [activeTab, setActiveTab] = useState('now');
    const searchRef = useRef(null);

    useEffect(() => {
        axios.get('http://localhost:3000/films')
            .then(res => setFilms(res.data.data || []))
            .catch(() => setError('Gagal memuat data. Pastikan server berjalan.'))
            .finally(() => setLoading(false));
    }, []);

    const filtered = useMemo(() => {
        const q = search.toLowerCase().trim();
        if (!q) return films;
        return films.filter(f =>
            f.judul_film?.toLowerCase().includes(q) ||
            f.genre?.toLowerCase().includes(q)
        );
    }, [films, search]);

    const sedangTayang = filtered.filter(f => f.status === 'Sedang Tayang' || !f.status);
    const akanDatang   = filtered.filter(f => f.status === 'Akan Datang');
    const displayed    = activeTab === 'now' ? sedangTayang : akanDatang;

    return (
        <MainLayout>
            <div className="sf-root">

                {/* ══════════════════════
                    HERO — dark cinematic
                ══════════════════════ */}
                <section className="sf-hero">
                    {/* bg layers */}
                    <div className="sf-hero__bg-base" />
                    <div className="sf-hero__bg-radial" />
                    <div className="sf-hero__bg-noise" />

                    <div className="sf-container sf-hero__inner">
                        <p className="sf-hero__eyebrow">
                            <span className="sf-hero__dot" />
                            Bioskop Online Terbaik Indonesia
                        </p>
                        <h1 className="sf-hero__title">Feel the magic beyond</h1>

                        {/* Search */}
                        <div className="sf-search-wrap">
                            <span className="sf-search-icon">
                                <svg width="17" height="17" viewBox="0 0 24 24" fill="none"
                                    stroke="currentColor" strokeWidth="2.2"
                                    strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="11" cy="11" r="8"/>
                                    <line x1="21" y1="21" x2="16.65" y2="16.65"/>
                                </svg>
                            </span>
                            <input
                                ref={searchRef}
                                className="sf-search"
                                type="text"
                                placeholder="Cari film atau bioskop"
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                            />
                            {search && (
                                <button className="sf-search-clear"
                                    onClick={() => { setSearch(''); searchRef.current?.focus(); }}>
                                    ✕
                                </button>
                            )}
                        </div>

                        {/* Shortcut categories */}
                        <div className="sf-cats">
                            {categories.map((c, i) => (
                                <button key={i} className="sf-cat">
                                    <span className="sf-cat__icon">{c.icon}</span>
                                    <span className="sf-cat__label">{c.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ══════════════════════
                    PROMO BANNERS
                ══════════════════════ */}
                <section className="sf-section">
                    <div className="sf-container">
                        <PromoBanners />
                    </div>
                </section>

                {/* ══════════════════════
                    FILM GRID
                ══════════════════════ */}
                <section className="sf-section">
                    <div className="sf-container">

                        {error && <div className="sf-error">⚠️ {error}</div>}

                        {/* Tab header */}
                        <div className="sf-list-header">
                            <div className="sf-tabs">
                                <button
                                    className={`sf-tab ${activeTab === 'now' ? 'sf-tab--active' : ''}`}
                                    onClick={() => setActiveTab('now')}
                                >
                                    Lagi Tayang
                                    {!loading && <span className="sf-tab__count">{sedangTayang.length}</span>}
                                </button>
                                <button
                                    className={`sf-tab ${activeTab === 'upcoming' ? 'sf-tab--active' : ''}`}
                                    onClick={() => setActiveTab('upcoming')}
                                >
                                    Akan Datang
                                    {!loading && <span className="sf-tab__count">{akanDatang.length}</span>}
                                </button>
                            </div>
                            <Link to="/films" className="sf-see-all">Lihat semua ›</Link>
                        </div>

                        {/* Empty search */}
                        {!loading && search && displayed.length === 0 && (
                            <div className="sf-empty">
                                <div className="sf-empty__icon">🎬</div>
                                <p className="sf-empty__title">Film tidak ditemukan</p>
                                <p className="sf-empty__sub">Tidak ada hasil untuk "<b>{search}</b>"</p>
                                <button className="sf-empty__btn" onClick={() => setSearch('')}>Hapus Pencarian</button>
                            </div>
                        )}

                        {/* Grid */}
                        {(!search || displayed.length > 0) && (
                            <div className="sf-film-grid">
                                {loading
                                    ? Array.from({ length: 10 }).map((_, i) => <SkeletonCard key={i} />)
                                    : displayed.map((f, i) => (
                                        <FilmCard key={f.id_film} film={f} index={i} variant={activeTab} />
                                    ))
                                }
                            </div>
                        )}
                    </div>
                </section>

            </div>

            {/* ══ FOOTER ══ */}
            <footer className="sf-footer">
                <div className="sf-container sf-footer__inner">
                    <span className="sf-footer__brand">
                        <span style={{ color: '#e50914' }}>Solo</span>Flixx
                    </span>
                    <p className="sf-footer__copy">© 2026 SoloFlixx · Cinema Application</p>
                </div>
            </footer>

            {/* ══════════════════════════════════
                ALL STYLES
            ══════════════════════════════════ */}
            <style>{`
<<<<<<< HEAD
                @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&display=swap');

                /* ── BASE ── */
                .sf-root {
                    font-family: 'Outfit', sans-serif;
                    background: #0d0d0d;
=======
                .sf-root {
                    font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
                    background: #f0f4f8;
>>>>>>> a2a4741a0955b009b774553572fd95e95c06dfd2
                    min-height: 100vh;
                    color: #e8e8e8;
                }
                .sf-container { max-width: 1180px; margin: 0 auto; padding: 0 20px; }
                .sf-section   { padding: 0 0 52px; }

                /* ── HERO ── */
                .sf-hero {
                    position: relative;
                    padding: 96px 0 64px;
                    text-align: center;
                    overflow: hidden;
                }
                .sf-hero__bg-base {
                    position: absolute; inset: 0; z-index: 0;
                    background: radial-gradient(ellipse 90% 70% at 50% 0%,
                        #1a0a0a 0%, #0d0d0d 60%);
                }
                .sf-hero__bg-radial {
                    position: absolute; inset: 0; z-index: 0;
                    background:
                        radial-gradient(circle 500px at 15% 60%, rgba(229,9,20,.07), transparent),
                        radial-gradient(circle 400px at 85% 30%, rgba(229,9,20,.05), transparent);
                }
                .sf-hero__bg-noise {
                    position: absolute; inset: 0; z-index: 0; pointer-events: none;
                    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='.035'/%3E%3C/svg%3E");
                }
                .sf-hero__inner { position: relative; z-index: 1; }

                .sf-hero__eyebrow {
                    display: inline-flex; align-items: center; gap: 8px;
                    font-size: .72rem; letter-spacing: .18em; text-transform: uppercase;
                    color: #888; margin-bottom: 16px; font-weight: 500;
                }
                .sf-hero__dot {
                    width: 6px; height: 6px; border-radius: 50%;
                    background: #e50914;
                    box-shadow: 0 0 8px #e50914;
                    animation: sfPulse 2s ease infinite;
                }
                @keyframes sfPulse {
                    0%,100% { opacity:1; transform:scale(1); }
                    50%     { opacity:.6; transform:scale(1.3); }
                }

                .sf-hero__title {
                    font-size: clamp(2.2rem, 5vw, 3.4rem);
                    font-weight: 800; color: #fff;
                    margin: 0 0 32px; letter-spacing: -.03em; line-height: 1.1;
                }

                /* Search */
                .sf-search-wrap {
                    position: relative; max-width: 520px;
                    margin: 0 auto 40px;
                }
                .sf-search-icon {
                    position: absolute; left: 18px; top: 50%; transform: translateY(-50%);
                    color: #666; display: flex; align-items: center; pointer-events: none;
                }
                .sf-search {
<<<<<<< HEAD
                    width: 100%; padding: 15px 48px 15px 50px;
                    border: 1px solid rgba(255,255,255,.1);
                    border-radius: 50px;
                    background: rgba(255,255,255,.07);
                    backdrop-filter: blur(12px);
                    font-family: 'Outfit', sans-serif;
                    font-size: .97rem; color: #fff; outline: none;
                    transition: border-color .2s, box-shadow .2s, background .2s;
                }
                .sf-search::placeholder { color: #555; }
                .sf-search:focus {
                    border-color: rgba(229,9,20,.5);
                    background: rgba(255,255,255,.1);
                    box-shadow: 0 0 0 3px rgba(229,9,20,.12);
=======
                    width: 100%; padding: 15px 48px 15px 52px;
                    border: none; border-radius: 50px;
                    background: #fff; box-shadow: 0 2px 20px rgba(0,0,0,.1);
                    font-family: inherit;
                    font-size: 1rem; color: #1a1a2e; outline: none;
                    transition: box-shadow .2s;
>>>>>>> a2a4741a0955b009b774553572fd95e95c06dfd2
                }
                .sf-search-clear {
                    position: absolute; right: 16px; top: 50%; transform: translateY(-50%);
                    background: rgba(255,255,255,.1); border: none; border-radius: 50%;
                    width: 26px; height: 26px; cursor: pointer;
                    color: #aaa; font-size: .72rem;
                    display: flex; align-items: center; justify-content: center;
                    transition: background .2s;
                }
                .sf-search-clear:hover { background: rgba(255,255,255,.2); }

                /* Categories */
                .sf-cats {
                    display: flex; gap: 28px; justify-content: center; flex-wrap: wrap;
                }
                .sf-cat {
                    display: flex; flex-direction: column; align-items: center; gap: 9px;
                    background: none; border: none; cursor: pointer; padding: 0;
                    transition: transform .2s;
                }
                .sf-cat:hover { transform: translateY(-4px); }
                .sf-cat__icon {
                    width: 66px; height: 66px; border-radius: 50%;
                    background: rgba(255,255,255,.07);
                    border: 1px solid rgba(255,255,255,.1);
                    display: flex; align-items: center; justify-content: center;
                    font-size: 1.7rem;
                    transition: background .2s, border-color .2s, box-shadow .2s;
                }
                .sf-cat:hover .sf-cat__icon {
                    background: rgba(229,9,20,.15);
                    border-color: rgba(229,9,20,.35);
                    box-shadow: 0 6px 20px rgba(229,9,20,.2);
                }
                .sf-cat__label {
                    font-size: .78rem; font-weight: 600; color: #888;
                    transition: color .2s;
                }
                .sf-cat:hover .sf-cat__label { color: #ddd; }

                /* ── PROMO BANNERS ── */
                .sf-banner-grid {
                    display: grid; grid-template-columns: repeat(3,1fr);
                    gap: 14px; margin-bottom: 8px;
                }
                .sf-banner {
                    border-radius: 14px; padding: 22px 24px;
                    background: #161616;
                    border: 1px solid rgba(255,255,255,.07);
                    position: relative; overflow: hidden; cursor: pointer;
                    transition: transform .25s, border-color .25s, box-shadow .25s;
                    min-height: 120px;
                }
                .sf-banner:hover {
                    transform: translateY(-4px);
                    border-color: rgba(255,255,255,.14);
                    box-shadow: 0 14px 36px rgba(0,0,0,.4);
                }
                .sf-banner__glow {
                    position: absolute; top: -30px; right: -30px;
                    width: 100px; height: 100px; border-radius: 50%;
                    opacity: .12; filter: blur(28px);
                }
                .sf-banner__top {
                    display: flex; align-items: center; justify-content: space-between;
                    margin-bottom: 10px;
                }
                .sf-banner__label {
                    font-size: .65rem; font-weight: 700;
                    letter-spacing: .14em; text-transform: uppercase;
                }
                .sf-banner__arrow {
                    font-size: 1.5rem; color: rgba(255,255,255,.2); line-height: 1;
                    transition: color .2s, transform .2s;
                }
                .sf-banner:hover .sf-banner__arrow { color: rgba(255,255,255,.5); transform: translateX(3px); }
                .sf-banner__headline {
                    font-size: .97rem; font-weight: 700; color: #f0f0f0;
                    margin: 0 0 6px; line-height: 1.4;
                }
                .sf-banner__sub {
                    font-size: .73rem; color: #666; margin: 0;
                }

                /* ── FILM LIST HEADER ── */
                .sf-list-header {
                    display: flex; align-items: center; justify-content: space-between;
                    margin-bottom: 22px; flex-wrap: wrap; gap: 12px;
                }
                .sf-tabs {
                    display: flex; gap: 4px;
                    background: #1a1a1a; border-radius: 50px; padding: 4px;
                    border: 1px solid rgba(255,255,255,.07);
                }
                .sf-tab {
                    display: flex; align-items: center; gap: 8px;
                    padding: 9px 20px; border-radius: 50px; border: none;
                    background: transparent;
<<<<<<< HEAD
                    font-family: 'Outfit', sans-serif;
                    font-size: .875rem; font-weight: 600; color: #666;
=======
                    font-family: inherit;
                    font-size: .875rem; font-weight: 600; color: #64748b;
>>>>>>> a2a4741a0955b009b774553572fd95e95c06dfd2
                    cursor: pointer; transition: all .2s; white-space: nowrap;
                }
                .sf-tab--active {
                    background: #e50914; color: #fff;
                    box-shadow: 0 2px 16px rgba(229,9,20,.35);
                }
                .sf-tab__count {
                    background: rgba(255,255,255,.12); color: #aaa;
                    font-size: .68rem; font-weight: 700;
                    padding: 2px 7px; border-radius: 50px; min-width: 20px; text-align: center;
                }
                .sf-tab--active .sf-tab__count {
                    background: rgba(0,0,0,.25); color: rgba(255,255,255,.8);
                }
                .sf-see-all {
                    font-size: .875rem; font-weight: 700; color: #ccc;
                    text-decoration: none;
                    padding: 9px 20px;
                    border: 1px solid rgba(255,255,255,.12);
                    border-radius: 50px; background: transparent;
                    transition: all .2s; white-space: nowrap;
                }
                .sf-see-all:hover {
                    background: #e50914; color: #fff;
                    border-color: #e50914;
                    box-shadow: 0 4px 16px rgba(229,9,20,.3);
                }

                /* ── FILM GRID ── */
                .sf-film-grid {
                    display: grid; grid-template-columns: repeat(2,1fr); gap: 14px;
                }
                @media (min-width: 480px)  { .sf-film-grid { grid-template-columns: repeat(3,1fr); } }
                @media (min-width: 768px)  { .sf-film-grid { grid-template-columns: repeat(4,1fr); gap: 18px; } }
                @media (min-width: 1024px) { .sf-film-grid { grid-template-columns: repeat(5,1fr); } }

                .sf-film-col { animation: sfFadeUp .45s ease both; }
                @keyframes sfFadeUp {
                    from { opacity:0; transform:translateY(16px); }
                    to   { opacity:1; transform:translateY(0); }
                }

                .sf-card-link { text-decoration:none; color:inherit; display:block; }
                .sf-card {
                    border-radius: 12px; overflow: hidden;
                    background: #161616;
                    border: 1px solid rgba(255,255,255,.07);
                    transition: transform .3s, box-shadow .3s, border-color .3s;
                }
                .sf-card:hover {
                    transform: translateY(-6px) scale(1.01);
                    box-shadow: 0 14px 40px rgba(0,0,0,.55);
                    border-color: rgba(229,9,20,.25);
                }

                .sf-card__poster-wrap {
                    position: relative; aspect-ratio: 2/3; overflow: hidden;
                    background: #111;
                }
                .sf-card__poster {
                    width:100%; height:100%; object-fit:cover; display:block;
                    transition: transform .4s ease;
                }
                .sf-card:hover .sf-card__poster { transform: scale(1.06); }

                .sf-card__grad {
                    position: absolute; inset: 0;
                    background: linear-gradient(to top,
                        rgba(10,10,10,.9) 0%,
                        rgba(10,10,10,.2) 40%,
                        transparent 70%);
                    opacity: 0; transition: opacity .3s;
                }
                .sf-card:hover .sf-card__grad { opacity: 1; }

                /* Nomor urut */
                .sf-card__num {
                    position: absolute; bottom: 10px; right: 10px;
                    width: 28px; height: 28px; border-radius: 50%;
                    background: rgba(0,0,0,.65); color: #fff;
                    font-size: .72rem; font-weight: 800;
                    display: flex; align-items: center; justify-content: center;
                    backdrop-filter: blur(4px);
                    border: 1px solid rgba(255,255,255,.15);
                }

                /* Badge */
                .sf-card__badge {
                    position: absolute; top: 10px; left: 0;
                    background: #e50914; color: #fff;
                    font-size: .62rem; font-weight: 700; letter-spacing: .06em;
                    padding: 4px 10px 4px 8px;
                    border-radius: 0 50px 50px 0;
                }

                /* Hover play button */
                .sf-card__play {
                    position: absolute; inset: 0;
                    display: flex; align-items: center; justify-content: center;
                    opacity: 0; transition: opacity .3s;
                }
                .sf-card__play svg {
                    width: 48px; height: 48px;
                    background: rgba(229,9,20,.85);
                    border-radius: 50%; padding: 10px;
                    color: #fff;
                    box-shadow: 0 4px 20px rgba(229,9,20,.5);
                    transform: scale(.8); transition: transform .2s;
                }
                .sf-card:hover .sf-card__play { opacity: 1; }
                .sf-card:hover .sf-card__play svg { transform: scale(1); }

                .sf-card__body { padding: 11px 12px 14px; }
                .sf-card__title {
                    font-size: .83rem; font-weight: 700; color: #e8e8e8;
                    margin: 0 0 5px; line-height: 1.35;
                    display: -webkit-box; -webkit-line-clamp:2;
                    -webkit-box-orient:vertical; overflow:hidden;
                }
                .sf-card__genre {
                    font-size: .7rem; color: #555; margin:0; font-weight:500;
                    white-space:nowrap; overflow:hidden; text-overflow:ellipsis;
                }

                /* ── SKELETON ── */
                .sf-skel-poster { aspect-ratio:2/3; border-radius:12px; width:100%; display:block; }
                .sf-skel-line   { border-radius:6px; display:block; }
                .sf-skel-anim {
                    background: linear-gradient(90deg, #1c1c1c 25%, #242424 50%, #1c1c1c 75%);
                    background-size: 200% 100%;
                    animation: sfShimmer 1.4s ease infinite;
                }
                @keyframes sfShimmer {
                    0%   { background-position:200% 0; }
                    100% { background-position:-200% 0; }
                }

                /* ── ERROR ── */
                .sf-error {
                    background: rgba(229,9,20,.1); border: 1px solid rgba(229,9,20,.25);
                    color: #f87171; border-radius: 10px;
                    padding: .85rem 1.1rem; font-size: .9rem; margin-bottom: 24px;
                }

                /* ── EMPTY ── */
                .sf-empty { text-align:center; padding:64px 20px; }
                .sf-empty__icon  { font-size:3rem; margin-bottom:12px; }
                .sf-empty__title { font-weight:700; font-size:1.1rem; color:#e8e8e8; margin:0 0 6px; }
                .sf-empty__sub   { font-size:.88rem; color:#666; margin:0 0 20px; }
                .sf-empty__btn {
<<<<<<< HEAD
                    background: #e50914; color:#fff; border:none;
                    padding:.65rem 1.6rem; border-radius:50px;
                    font-family:'Outfit',sans-serif;
                    font-weight:700; font-size:.88rem; cursor:pointer;
                    transition:background .2s, box-shadow .2s;
                }
                .sf-empty__btn:hover {
                    background:#c8000f;
                    box-shadow: 0 4px 16px rgba(229,9,20,.35);
=======
                    background:#1a6fba; color:#fff; border:none;
                    padding:.6rem 1.6rem; border-radius:50px;
                    font-family: inherit;
                    font-weight:600; font-size:.88rem; cursor:pointer;
                    transition:background .2s;
>>>>>>> a2a4741a0955b009b774553572fd95e95c06dfd2
                }

                /* ── FOOTER ── */
                .sf-footer {
                    background: #0a0a0a; border-top: 1px solid rgba(255,255,255,.07);
                    padding: 24px 0;
                }
                .sf-footer__inner {
                    display:flex; align-items:center;
                    justify-content:space-between; flex-wrap:wrap; gap:8px;
                }
                .sf-footer__brand {
<<<<<<< HEAD
                    font-family:'Outfit',sans-serif;
                    font-size:1.25rem; font-weight:800; color:#fff;
                    letter-spacing: -.02em;
=======
                    font-family: inherit;
                    font-size:1.2rem; font-weight:700; color:#1a1a2e;
>>>>>>> a2a4741a0955b009b774553572fd95e95c06dfd2
                }
                .sf-footer__copy { font-size:.78rem; color:#444; margin:0; }

                /* ── RESPONSIVE ── */
                @media (max-width: 900px) {
                    .sf-banner-grid { grid-template-columns:1fr 1fr; }
                    .sf-banner-grid > :last-child { grid-column: span 2; }
                }
                @media (max-width: 600px) {
                    .sf-banner-grid { grid-template-columns:1fr; }
                    .sf-banner-grid > :last-child { grid-column:span 1; }
                    .sf-hero { padding:80px 0 48px; }
                    .sf-cats { gap: 16px; }
                    .sf-cat__icon { width:56px; height:56px; font-size:1.45rem; }
                }
            `}</style>
        </MainLayout>
    );
};

export default Home;
