import React, { useEffect, useState, useMemo, useRef } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import MainLayout from '../../layouts/MainLayout';
import { base_url } from '../../config';
/* ─────────────────────────────────────────────
   SKELETON CARD
───────────────────────────────────────────── */
const SkeletonCard = () => (
    <div className="sf-film-col">
        <div className="sf-skel-wrap">
            <div className="sf-skel-poster sf-skel-anim" />
            <div style={{ padding: '10px 0 0' }}>
                <div className="sf-skel-line sf-skel-anim" style={{ width: '85%', height: 12 }} />
                <div className="sf-skel-line sf-skel-anim" style={{ width: '55%', height: 10, marginTop: 7 }} />
            </div>
        </div>
    </div>
);

/* ─────────────────────────────────────────────
   FILM CARD  (ala Cinema 21)
───────────────────────────────────────────── */
const FilmCard = ({ film, index, variant = 'now' }) => {
    const isUp = variant === 'upcoming';
    return (
        <div className="sf-film-col" style={{ animationDelay: `${index * 0.06}s` }}>
            <Link to={`/movie/${film.id_film}`} className="sf-card-link">
                <div className="sf-card">
                    <div className="sf-card__poster-wrap">
                        <img
                            src={film.poster}
                            alt={film.judul_film}
                            className="sf-card__poster"
                            loading="lazy"
                        />
                        {/* Nomor urut */}
                        <div className="sf-card__num">{index + 1}</div>

                        {/* Badge akan datang */}
                        {isUp && (
                            <div className="sf-card__adv-badge">Akan Datang</div>
                        )}
                    </div>
                    <div className="sf-card__body">
                        <p className="sf-card__title">{film.judul_film}</p>
                        {film.genre && (
                            <p className="sf-card__genre">{film.genre}</p>
                        )}
                    </div>
                </div>
            </Link>
        </div>
    );
};

/* ─────────────────────────────────────────────
   BANNER PROMO
───────────────────────────────────────────── */
const banners = [
    { bg: '#0f2a4a', accent: '#1a6fba', label: 'Promo Spesial', headline: 'Beli 2 Tiket, Gratis 1 Popcorn!', sub: 'Berlaku setiap Selasa & Rabu' },
    { bg: '#1a1a2e', accent: '#00adb5', label: 'Partner',       headline: 'Bayar Pakai GoPay, Cashback 30%', sub: 'Maks. Rp 25.000 per transaksi' },
    { bg: '#2d0f0f', accent: '#c0392b', label: 'Eksklusif',     headline: 'Gratis Upsize Snack Combo',        sub: 'Tunjukkan tiket SoloFlixx kamu' },
];

const PromoBanners = () => (
    <div className="sf-banner-grid">
        {banners.map((b, i) => (
            <div key={i} className="sf-banner" style={{ background: b.bg }}>
                <div className="sf-banner__accent" style={{ background: b.accent }} />
                <div className="sf-banner__content">
                    <span className="sf-banner__label">{b.label}</span>
                    <p className="sf-banner__headline">{b.headline}</p>
                    <p className="sf-banner__sub">{b.sub}</p>
                </div>
                <span className="sf-banner__arrow">›</span>
            </div>
        ))}
    </div>
);

/* ─────────────────────────────────────────────
   KATEGORI SHORTCUT
───────────────────────────────────────────── */
const categories = [
    { icon: '🎭', label: 'Bioskop' },
    { icon: '🎬', label: 'Film', link: '/movies' },
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
        axios.get(`${base_url}/films`)
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

                {/* ══ HERO / SEARCH ══ */}
                <section className="sf-hero">
                    <div className="sf-container">
                        <h1 className="sf-hero__title">Feel the magic beyond</h1>

                        <div className="sf-search-wrap">
                            <span className="sf-search-icon">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
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
                                <button
                                    className="sf-search-clear"
                                    onClick={() => { setSearch(''); searchRef.current?.focus(); }}
                                >
                                    ✕
                                </button>
                            )}
                        </div>

                        <div className="sf-cats">
                            {categories.map((c, i) => (
                                c.link
                                    ? (
                                        <Link key={i} to={c.link} className="sf-cat">
                                            <span className="sf-cat__icon">{c.icon}</span>
                                            <span className="sf-cat__label">{c.label}</span>
                                        </Link>
                                    )
                                    : (
                                        <button key={i} className="sf-cat">
                                            <span className="sf-cat__icon">{c.icon}</span>
                                            <span className="sf-cat__label">{c.label}</span>
                                        </button>
                                    )
                            ))}
                        </div>
                    </div>
                </section>

                {/* ══ PROMO BANNERS ══ */}
                <section className="sf-section">
                    <div className="sf-container">
                        <PromoBanners />
                    </div>
                </section>

                {/* ══ FILM LIST ══ */}
                <section className="sf-section">
                    <div className="sf-container">

                        {error && <div className="sf-error">{error}</div>}

                        {/* Header + Tabs */}
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
                                    ? Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)
                                    : displayed.map((f, i) => (
                                        <FilmCard
                                            key={f.id_film}
                                            film={f}
                                            index={i}
                                            variant={activeTab}
                                        />
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
                        <span style={{ color: '#dc3545', fontWeight: 800 }}>Solo</span>Flixx
                    </span>
                    <p className="sf-footer__copy">© 2026 SoloFlixx · Cinema Application</p>
                </div>
            </footer>

            {/* ══ STYLES ══ */}
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

                .sf-root {
                    font-family: 'Plus Jakarta Sans', sans-serif;
                    background: #f0f4f8;
                    min-height: 100vh;
                    color: #1a1a2e;
                }
                .sf-container { max-width: 1180px; margin: 0 auto; padding: 0 20px; }
                .sf-section   { padding: 0 0 44px; }

                /* HERO */
                .sf-hero {
                    background: linear-gradient(155deg, #e8f4fd 0%, #d6eaf8 50%, #eaf4fb 100%);
                    padding: 88px 0 52px;
                    text-align: center;
                }
                .sf-hero__title {
                    font-size: clamp(2rem, 4vw, 2.9rem);
                    font-weight: 800; color: #0d1b2a;
                    margin: 0 0 28px; letter-spacing: -.03em; line-height: 1.1;
                }

                /* Search bar */
                .sf-search-wrap {
                    position: relative; max-width: 540px;
                    margin: 0 auto 36px;
                }
                .sf-search-icon {
                    position: absolute; left: 18px; top: 50%; transform: translateY(-50%);
                    color: #94a3b8; display: flex; align-items: center; pointer-events: none;
                }
                .sf-search {
                    width: 100%; padding: 15px 48px 15px 52px;
                    border: none; border-radius: 50px;
                    background: #fff; box-shadow: 0 2px 20px rgba(0,0,0,.1);
                    font-family: 'Plus Jakarta Sans', sans-serif;
                    font-size: 1rem; color: #1a1a2e; outline: none;
                    transition: box-shadow .2s;
                }
                .sf-search::placeholder { color: #94a3b8; }
                .sf-search:focus { box-shadow: 0 4px 32px rgba(26,111,186,.2); }
                .sf-search-clear {
                    position: absolute; right: 16px; top: 50%; transform: translateY(-50%);
                    background: #e2e8f0; border: none; border-radius: 50%;
                    width: 26px; height: 26px; cursor: pointer;
                    color: #64748b; font-size: .75rem;
                    display: flex; align-items: center; justify-content: center;
                    transition: background .2s;
                }
                .sf-search-clear:hover { background: #cbd5e1; }

                /* Kategori */
                .sf-cats {
                    display: flex; gap: 24px; justify-content: center; flex-wrap: wrap;
                }
                .sf-cat {
                    display: flex; flex-direction: column; align-items: center; gap: 8px;
                    background: none; border: none; cursor: pointer; padding: 0;
                    transition: transform .2s;
                }
                .sf-cat:hover { transform: translateY(-3px); }
                .sf-cat__icon {
                    width: 64px; height: 64px; border-radius: 50%;
                    background: #fff; box-shadow: 0 2px 14px rgba(0,0,0,.1);
                    display: flex; align-items: center; justify-content: center;
                    font-size: 1.65rem;
                    transition: box-shadow .2s;
                }
                .sf-cat:hover .sf-cat__icon { box-shadow: 0 6px 20px rgba(26,111,186,.18); }
                .sf-cat__label {
                    font-size: .78rem; font-weight: 600; color: #475569;
                }

                /* PROMO BANNERS */
                .sf-banner-grid {
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    gap: 14px; margin-top: 8px;
                }
                .sf-banner {
                    border-radius: 16px; padding: 22px 22px;
                    position: relative; overflow: hidden; cursor: pointer;
                    transition: transform .25s, box-shadow .25s;
                    min-height: 128px; display: flex;
                    flex-direction: column; justify-content: center;
                }
                .sf-banner:hover {
                    transform: translateY(-4px);
                    box-shadow: 0 14px 36px rgba(0,0,0,.3);
                }
                .sf-banner__accent {
                    position: absolute; top: 0; left: 0;
                    width: 4px; height: 100%;
                    border-radius: 16px 0 0 16px;
                }
                .sf-banner__content { padding-left: 12px; }
                .sf-banner__label {
                    font-size: .62rem; font-weight: 700; letter-spacing: .14em;
                    text-transform: uppercase; color: rgba(255,255,255,.45);
                    display: block; margin-bottom: 7px;
                }
                .sf-banner__headline {
                    font-size: .95rem; font-weight: 700; color: #fff;
                    margin: 0 0 5px; line-height: 1.4;
                }
                .sf-banner__sub {
                    font-size: .73rem; color: rgba(255,255,255,.5); margin: 0;
                }
                .sf-banner__arrow {
                    position: absolute; right: 20px; top: 50%; transform: translateY(-50%);
                    font-size: 2rem; color: rgba(255,255,255,.2); line-height: 1;
                }

                /* FILM LIST HEADER */
                .sf-list-header {
                    display: flex; align-items: center; justify-content: space-between;
                    margin-bottom: 20px; flex-wrap: wrap; gap: 12px;
                }
                .sf-tabs {
                    display: flex; gap: 4px;
                    background: #e2e8f0; border-radius: 50px; padding: 4px;
                }
                .sf-tab {
                    display: flex; align-items: center; gap: 7px;
                    padding: 9px 20px; border-radius: 50px; border: none;
                    background: transparent;
                    font-family: 'Plus Jakarta Sans', sans-serif;
                    font-size: .875rem; font-weight: 600; color: #64748b;
                    cursor: pointer; transition: all .2s; white-space: nowrap;
                }
                .sf-tab--active {
                    background: #fff; color: #0d1b2a;
                    box-shadow: 0 1px 8px rgba(0,0,0,.1);
                }
                .sf-tab__count {
                    background: #cbd5e1; color: #475569;
                    font-size: .68rem; font-weight: 700;
                    padding: 2px 7px; border-radius: 50px;
                }
                .sf-tab--active .sf-tab__count {
                    background: #f0f4f8; color: #334155;
                }
                .sf-see-all {
                    font-size: .875rem; font-weight: 700; color: #1a6fba;
                    text-decoration: none;
                    padding: 9px 20px; border: 1.5px solid #bee3f8;
                    border-radius: 50px; background: #f0f8ff;
                    transition: all .2s; white-space: nowrap;
                }
                .sf-see-all:hover { background: #1a6fba; color: #fff; border-color: #1a6fba; }

                /* FILM GRID */
                .sf-film-grid {
                    display: grid;
                    grid-template-columns: repeat(2, 1fr);
                    gap: 14px;
                }
                @media (min-width: 480px)  { .sf-film-grid { grid-template-columns: repeat(3,1fr); } }
                @media (min-width: 768px)  { .sf-film-grid { grid-template-columns: repeat(4,1fr); gap: 18px; } }
                @media (min-width: 1024px) { .sf-film-grid { grid-template-columns: repeat(5,1fr); } }

                .sf-film-col { animation: sfFadeUp .45s ease both; }
                @keyframes sfFadeUp {
                    from { opacity:0; transform:translateY(14px); }
                    to   { opacity:1; transform:translateY(0); }
                }

                .sf-card-link { text-decoration:none; color:inherit; display:block; }
                .sf-card {
                    border-radius: 14px; overflow: hidden;
                    background: #fff;
                    box-shadow: 0 1px 6px rgba(0,0,0,.07);
                    transition: transform .25s, box-shadow .25s;
                }
                .sf-card:hover {
                    transform: translateY(-5px);
                    box-shadow: 0 10px 28px rgba(0,0,0,.12);
                }

                .sf-card__poster-wrap {
                    position: relative; aspect-ratio: 2/3; overflow: hidden;
                    background: #e2e8f0;
                }
                .sf-card__poster {
                    width:100%; height:100%; object-fit:cover; display:block;
                    transition: transform .4s ease;
                }
                .sf-card:hover .sf-card__poster { transform: scale(1.04); }

                .sf-card__num {
                    position: absolute; bottom: 10px; right: 10px;
                    width: 28px; height: 28px; border-radius: 50%;
                    background: rgba(0,0,0,.55); color: #fff;
                    font-size: .75rem; font-weight: 800;
                    display: flex; align-items: center; justify-content: center;
                    backdrop-filter: blur(4px);
                }
                .sf-card__adv-badge {
                    position: absolute; top: 10px; left: 0;
                    background: #1a6fba; color: #fff;
                    font-size: .62rem; font-weight: 700; letter-spacing: .04em;
                    padding: 4px 10px 4px 8px;
                    border-radius: 0 50px 50px 0;
                }
                .sf-card__body { padding: 10px 11px 13px; }
                .sf-card__title {
                    font-size: .82rem; font-weight: 700; color: #1a1a2e;
                    margin: 0 0 4px; line-height: 1.35;
                    display: -webkit-box; -webkit-line-clamp:2;
                    -webkit-box-orient:vertical; overflow:hidden;
                }
                .sf-card__genre {
                    font-size: .7rem; color: #94a3b8; margin: 0; font-weight: 500;
                    white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
                }

                /* SKELETON */
                .sf-skel-wrap { }
                .sf-skel-poster { aspect-ratio:2/3; border-radius:14px; width:100%; display:block; }
                .sf-skel-line   { border-radius:6px; display:block; }
                .sf-skel-anim {
                    background: linear-gradient(90deg, #e2e8f0 25%, #f1f5f9 50%, #e2e8f0 75%);
                    background-size: 200% 100%;
                    animation: sfShimmer 1.4s ease infinite;
                }
                @keyframes sfShimmer {
                    0%   { background-position: 200% 0; }
                    100% { background-position:-200% 0; }
                }

                /* ERROR */
                .sf-error {
                    background:#fef2f2; border:1px solid #fecaca; color:#dc2626;
                    border-radius:10px; padding:.85rem 1.1rem;
                    font-size:.9rem; margin-bottom:24px;
                }

                /* EMPTY */
                .sf-empty { text-align:center; padding:60px 20px; }
                .sf-empty__icon  { font-size:3rem; margin-bottom:12px; }
                .sf-empty__title { font-weight:700; font-size:1.1rem; color:#1a1a2e; margin:0 0 6px; }
                .sf-empty__sub   { font-size:.88rem; color:#64748b; margin:0 0 20px; }
                .sf-empty__btn {
                    background:#1a6fba; color:#fff; border:none;
                    padding:.6rem 1.6rem; border-radius:50px;
                    font-family:'Plus Jakarta Sans',sans-serif;
                    font-weight:600; font-size:.88rem; cursor:pointer;
                    transition:background .2s;
                }
                .sf-empty__btn:hover { background:#155fa0; }

                /* FOOTER */
                .sf-footer { background:#fff; border-top:1px solid #e2e8f0; padding:24px 0; }
                .sf-footer__inner {
                    display:flex; align-items:center;
                    justify-content:space-between; flex-wrap:wrap; gap:8px;
                }
                .sf-footer__brand {
                    font-family:'Plus Jakarta Sans',sans-serif;
                    font-size:1.2rem; font-weight:700; color:#1a1a2e;
                }
                .sf-footer__copy { font-size:.78rem; color:#94a3b8; margin:0; }

                /* RESPONSIVE */
                @media (max-width: 900px) {
                    .sf-banner-grid { grid-template-columns:1fr 1fr; }
                    .sf-banner-grid > :last-child { grid-column: span 2; }
                }
                @media (max-width: 600px) {
                    .sf-banner-grid { grid-template-columns:1fr; }
                    .sf-banner-grid > :last-child { grid-column: span 1; }
                    .sf-hero { padding:72px 0 40px; }
                }
            `}</style>
        </MainLayout>
    );
};

export default Home;
