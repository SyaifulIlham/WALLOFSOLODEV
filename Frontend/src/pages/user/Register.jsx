import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
    const [form, setForm] = useState({ nama: '', email: '', password: '', no_hp: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [focusedField, setFocusedField] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await axios.post('http://localhost:3000/auth/register', form);
            alert('Registrasi berhasil! Silakan login.');
            navigate('/login');
        } catch (err) {
            setError(err.response?.data?.message || 'Terjadi kesalahan, coba lagi.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=DM+Sans:wght@300;400;500&display=swap');
                * { box-sizing: border-box; margin: 0; padding: 0; }

                .reg-root {
                    min-height: 100vh;
                    display: flex;
                    font-family: 'DM Sans', sans-serif;
                    background: #080a0f;
                }

                /* ── KIRI ── */
                .reg-left {
                    position: relative;
                    width: 42%;
                    background: #c8102e;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    overflow: hidden;
                    padding: 48px 40px;
                }
                .reg-left-pattern {
                    position: absolute;
                    inset: 0;
                    overflow: hidden;
                }
                .reg-left-glow {
                    position: absolute;
                    top: -20%; left: -20%;
                    width: 80%; height: 80%;
                    background: radial-gradient(circle, rgba(255,255,255,0.12) 0%, transparent 70%);
                    pointer-events: none;
                }
                .reg-left-glow2 {
                    position: absolute;
                    bottom: -15%; right: -15%;
                    width: 70%; height: 70%;
                    background: radial-gradient(circle, rgba(0,0,0,0.2) 0%, transparent 70%);
                    pointer-events: none;
                }
                .reg-left-content { position: relative; z-index: 10; text-align: center; }
                .reg-logo-text {
                    font-family: 'Playfair Display', serif;
                    font-size: 3rem;
                    font-weight: 700;
                    letter-spacing: 3px;
                    line-height: 1;
                    text-decoration: none;
                    display: block;
                    margin-bottom: 4px;
                }
                .reg-logo-solo { color: #980707; }
                .reg-logo-flixx { color: rgba(255, 255, 255, 0.4); }
                .reg-left-orn { display: flex; align-items: center; justify-content: center; gap: 8px; margin: 14px auto; }
                .reg-left-orn-line { width: 44px; height: 1px; background: rgba(255,255,255,0.35); }
                .reg-left-orn-dot { width: 5px; height: 5px; border-radius: 50%; background: #fff; }
                .reg-left-tagline { color: rgba(255,255,255,0.6); font-size: 0.72rem; letter-spacing: 3px; text-transform: uppercase; font-weight: 300; margin-bottom: 32px; }
                .reg-left-title { font-family: 'Playfair Display', serif; font-size: 1.85rem; font-weight: 700; color: #fff; line-height: 1.35; margin-bottom: 14px; }
                .reg-left-desc { color: rgba(255,255,255,0.55); font-size: 0.83rem; line-height: 1.7; max-width: 230px; margin: 0 auto 36px; }
                .reg-left-link {
                    display: inline-block;
                    padding: 11px 32px;
                    border: 1.5px solid rgba(255,255,255,0.45);
                    border-radius: 50px;
                    color: #fff;
                    font-size: 0.78rem;
                    letter-spacing: 2px;
                    text-transform: uppercase;
                    text-decoration: none;
                    font-weight: 500;
                    transition: background 0.25s, border-color 0.25s;
                }
                .reg-left-link:hover { background: rgba(255,255,255,0.12); border-color: #fff; }
                .reg-filmstrip {
                    position: absolute; left: 0; top: 0; bottom: 0;
                    width: 20px; display: flex; flex-direction: column; opacity: 0.14;
                }
                .reg-filmcell { flex-shrink: 0; height: 26px; border: 1px solid #fff; margin: 2px 3px; border-radius: 2px; }

                /* ── KANAN ── */
                .reg-right {
                    flex: 1;
                    background: #080a0f;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 48px 40px;
                    position: relative;
                    overflow: hidden;
                }
                .reg-right-glow {
                    position: absolute; top: 0; right: 0;
                    width: 300px; height: 300px;
                    background: radial-gradient(circle, rgba(200,16,46,0.07) 0%, transparent 70%);
                    pointer-events: none; filter: blur(40px);
                }
                .reg-right::before {
                    content: '';
                    position: absolute; inset: 0;
                    background-image: repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(255,255,255,0.008) 3px, rgba(255,255,255,0.008) 4px);
                    pointer-events: none;
                }
                .reg-form-wrap {
                    position: relative; z-index: 10;
                    width: 100%; max-width: 360px;
                    animation: fadeUp 0.6s ease both;
                }
                @keyframes fadeUp { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }

                .reg-tabs { display: flex; margin-bottom: 30px; border-bottom: 1px solid rgba(255,255,255,0.07); }
                .reg-tab {
                    padding: 10px 0; margin-right: 24px;
                    font-size: 0.78rem; letter-spacing: 1.5px; text-transform: uppercase;
                    text-decoration: none; font-weight: 500;
                    color: #35332f;
                    border-bottom: 2px solid transparent;
                    margin-bottom: -1px; transition: color 0.2s;
                }
                .reg-tab.active { color: #c8102e; border-bottom-color: #c8102e; }
                .reg-tab:hover:not(.active) { color: #7a7871; }

                .reg-form-title { font-family: 'Playfair Display', serif; font-size: 1.65rem; font-weight: 700; color: #f5f0e8; margin-bottom: 5px; }
                .reg-form-sub { color: #42403c; font-size: 0.8rem; margin-bottom: 26px; }

                .reg-error {
                    background: rgba(200,16,46,0.08); border: 1px solid rgba(200,16,46,0.22);
                    border-left: 3px solid #c8102e; border-radius: 8px;
                    padding: 10px 14px; margin-bottom: 18px;
                    color: #e06070; font-size: 0.82rem; line-height: 1.5;
                }

                .reg-field { margin-bottom: 18px; }
                .reg-label {
                    display: block; color: #4e4c48;
                    font-size: 0.65rem; text-transform: uppercase;
                    letter-spacing: 2px; font-weight: 500; margin-bottom: 7px;
                    transition: color 0.25s;
                }
                .reg-field.focused .reg-label { color: #c8102e; }
                .reg-input {
                    width: 100%; background: transparent;
                    border: none; border-bottom: 1px solid rgba(255,255,255,0.09);
                    padding: 10px 0; color: #f0ece4;
                    font-size: 0.9rem; font-family: 'DM Sans', sans-serif; outline: none;
                    transition: border-color 0.3s;
                    -moz-appearance: textfield;
                }
                .reg-input::-webkit-outer-spin-button, .reg-input::-webkit-inner-spin-button { -webkit-appearance: none; }
                .reg-input::placeholder { color: #28261f; }
                .reg-input:focus { border-bottom-color: #c8102e; }

                .reg-row { display: grid; grid-template-columns: 1fr 1fr; gap: 0 20px; }
                .reg-divider { height: 1px; background: rgba(255,255,255,0.05); margin: 4px 0 20px; }

                .reg-btn {
                    width: 100%; padding: 13px;
                    background: #c8102e; color: #fff; border: none;
                    border-radius: 8px; font-weight: 500; font-size: 0.8rem;
                    font-family: 'DM Sans', sans-serif; letter-spacing: 2.5px;
                    text-transform: uppercase; cursor: pointer;
                    transition: background 0.25s, transform 0.15s, box-shadow 0.25s;
                    position: relative; overflow: hidden;
                }
                .reg-btn::after { content:''; position:absolute; inset:0; background:linear-gradient(to bottom,rgba(255,255,255,0.08),transparent); pointer-events:none; }
                .reg-btn:hover:not(:disabled) { background:#a80d27; box-shadow:0 6px 20px rgba(200,16,46,0.38); transform:translateY(-1px); }
                .reg-btn:disabled { opacity:0.55; cursor:not-allowed; }

                .reg-btn-dots span { display:inline-block; width:5px; height:5px; border-radius:50%; background:#fff; margin:0 2px; animation:blink 1.2s infinite; }
                .reg-btn-dots span:nth-child(2){animation-delay:0.2s;} .reg-btn-dots span:nth-child(3){animation-delay:0.4s;}
                @keyframes blink { 0%,80%,100%{opacity:0.2;transform:scale(0.8);}40%{opacity:1;transform:scale(1);} }

                .reg-note { text-align:center; margin-top:18px; color:#2e2c29; font-size:0.75rem; }
                .reg-note a { color:#c8102e; font-weight:500; text-decoration:none; }
                .reg-note a:hover { color:#e83050; }
                .reg-reel-num { position:absolute; bottom:22px; right:28px; font-size:0.58rem; color:rgba(255,255,255,0.07); letter-spacing:3px; }

                @media (max-width: 768px) {
                    .reg-root { flex-direction: column; }
                    .reg-left { width:100%; min-height:200px; padding:32px 24px; }
                    .reg-left-title { font-size:1.4rem; }
                    .reg-left-desc, .reg-left-link { display:none; }
                    .reg-right { padding:32px 24px; }
                }
            `}</style>

            <div className="reg-root">
                {/* KIRI */}
                <div className="reg-left">
                    <div className="reg-filmstrip">
                        {Array.from({ length: 50 }).map((_, i) => <div key={i} className="reg-filmcell" />)}
                    </div>
                    <div className="reg-left-pattern">
                        <svg width="100%" height="100%" style={{ position:'absolute', inset:0, opacity:0.13 }} preserveAspectRatio="xMidYMid slice">
                            <defs>
                                <pattern id="zz" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                                    <polyline points="0,20 10,0 20,20 30,0 40,20" fill="none" stroke="#fff" strokeWidth="2.5"/>
                                    <polyline points="0,40 10,20 20,40 30,20 40,40" fill="none" stroke="#fff" strokeWidth="2.5"/>
                                </pattern>
                            </defs>
                            <rect width="100%" height="100%" fill="url(#zz)"/>
                        </svg>
                        <div className="reg-left-glow" />
                        <div className="reg-left-glow2" />
                    </div>
                    <div className="reg-left-content">
                        <Link to="/" className="reg-logo-text">
                            <span className="reg-logo-solo">Solo</span>
                            <span className="reg-logo-flixx">Flixx</span>
                        </Link>
                        <div className="reg-left-orn">
                            <div className="reg-left-orn-line" />
                            <div className="reg-left-orn-dot" />
                            <div className="reg-left-orn-line" />
                        </div>
                        <p className="reg-left-tagline">Cinema Experience</p>
                        <h2 className="reg-left-title">Nonton Film<br />Favorit Kamu<br />Kapan Saja</h2>
                        <p className="reg-left-desc">Ribuan judul film dan series tersedia untukmu. Daftar sekarang dan mulai petualanganmu.</p>
                        <Link to="/login" className="reg-left-link">Masuk Akun</Link>
                    </div>
                </div>

                {/* KANAN */}
                <div className="reg-right">
                    <div className="reg-right-glow" />
                    <div className="reg-form-wrap">
                        <div className="reg-tabs">
                            <Link to="/login" className="reg-tab">Masuk</Link>
                            <span className="reg-tab active">Daftar</span>
                        </div>
                        <h1 className="reg-form-title">Buat Akun</h1>
                        <p className="reg-form-sub">Isi data diri kamu untuk memulai</p>

                        {error && <div className="reg-error">{error}</div>}

                        <form onSubmit={handleSubmit} autoComplete="off">
                            <div className="reg-row">
                                <div className={`reg-field${focusedField === 'nama' ? ' focused' : ''}`}>
                                    <label className="reg-label">Username</label>
                                    <input className="reg-input" type="text" name="nama" placeholder="Username"
                                        onChange={handleChange} onFocus={() => setFocusedField('nama')} onBlur={() => setFocusedField('')} required />
                                </div>
                                <div className={`reg-field${focusedField === 'no_hp' ? ' focused' : ''}`}>
                                    <label className="reg-label">No. HP</label>
                                    <input className="reg-input" type="number" name="no_hp" placeholder="08xx..."
                                        onChange={handleChange} onFocus={() => setFocusedField('no_hp')} onBlur={() => setFocusedField('')} required />
                                </div>
                            </div>
                            <div className={`reg-field${focusedField === 'email' ? ' focused' : ''}`}>
                                <label className="reg-label">Alamat Email</label>
                                <input className="reg-input" type="email" name="email" placeholder="contoh@email.com"
                                    onChange={handleChange} onFocus={() => setFocusedField('email')} onBlur={() => setFocusedField('')} required />
                            </div>
                            <div className={`reg-field${focusedField === 'password' ? ' focused' : ''}`} style={{ marginBottom: 0 }}>
                                <label className="reg-label">Kata Sandi</label>
                                <input className="reg-input" type="password" name="password" placeholder="Minimal 6 karakter"
                                    onChange={handleChange} onFocus={() => setFocusedField('password')} onBlur={() => setFocusedField('')} required />
                            </div>
                            <div className="reg-divider" />
                            <button type="submit" disabled={loading} className="reg-btn">
                                {loading ? <span className="reg-btn-dots"><span/><span/><span/></span> : 'Daftar Sekarang'}
                            </button>
                        </form>
                        <p className="reg-note">Sudah punya akun? <Link to="/login">Masuk di sini</Link></p>
                    </div>
                    <div className="reg-reel-num">REG — 01</div>
                </div>
            </div>
        </>
    );
};

export default Register;

