import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
    const [form, setForm] = useState({
        nama: '',
        email: '',
        password: '',
        no_hp: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        setError(''); // reset error saat user ngetik
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
        <div style={{ backgroundColor: '#0a0b0d', minHeight: '100vh', fontFamily: 'Inter, sans-serif', display: 'flex' }} className="register-layout">

            {/* Left Sidebar */}
            <div style={{
                flex: '1',
                background: 'linear-gradient(135deg, #001236 0%, #05070d 100%)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                padding: '40px',
                position: 'relative',
                overflow: 'hidden'
            }} className="sidebar-section">

                {/* Back to Home Button */}
                <div style={{ position: 'absolute', top: '20px', left: '20px', zIndex: 3 }}>
                    <Link to="/" style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        color: '#dc3545',
                        fontSize: '0.9rem',
                        fontWeight: '600',
                        textDecoration: 'none',
                        padding: '8px 16px',
                        border: '1px solid #dc3545',
                        borderRadius: '8px',
                        backgroundColor: 'transparent',
                        transition: 'all 0.3s ease',
                        cursor: 'pointer'
                    }}
                    onMouseEnter={(e) => {
                        e.target.style.backgroundColor = '#dc3545';
                        e.target.style.color = '#fff';
                    }}
                    onMouseLeave={(e) => {
                        e.target.style.backgroundColor = 'transparent';
                        e.target.style.color = '#dc3545';
                    }}>
                        ← Kembali ke Home
                    </Link>
                </div>

                {/* Logo */}
                <div style={{ marginBottom: '40px', zIndex: 2 }}>
                    <Link to="/" style={{ textDecoration: 'none', fontSize: '2.5rem', fontWeight: 'bold', letterSpacing: '1px' }}>
                        <span style={{ color: '#dc3545' }}>Solo</span>
                        <span style={{ color: '#fff' }}>Flixx</span>
                    </Link>
                </div>

                {/* Content */}
                <div style={{ position: 'relative', zIndex: 2, textAlign: 'center', maxWidth: '400px' }}>
                    <h2 style={{
                        color: '#fff',
                        fontSize: '2.2rem',
                        fontWeight: '700',
                        marginBottom: '16px',
                        lineHeight: '1.2'
                    }} className="sidebar-title">
                        Selamat Datang di SoloFlixx
                    </h2>

                    <p style={{
                        color: '#a1a1aa',
                        fontSize: '1.1rem',
                        marginBottom: '30px',
                        lineHeight: '1.5'
                    }} className="sidebar-subtitle">
                        Platform Website untuk memesan tiket bioskop secara online dengan mudah dan cepat
                    </p>

                    {/* Features */}
                    <div style={{ textAlign: 'left', marginBottom: '30px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '15px', color: '#fff' }} className="feature-item">
                            <div style={{
                                width: '20px',
                                height: '20px',
                                backgroundColor: '#dc3545',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginRight: '15px',
                                fontSize: '12px',
                                fontWeight: 'bold'
                            }}>✓</div>
                            <span>Pesan tiket tanpa perlu antri di loket</span>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '15px', color: '#fff' }} className="feature-item">
                            <div style={{
                                width: '20px',
                                height: '20px',
                                backgroundColor: '#dc3545',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginRight: '15px',
                                fontSize: '12px',
                                fontWeight: 'bold'
                            }}>✓</div>
                            <span>pesan tiket dimana saja, kapan saja</span>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '15px', color: '#fff' }} className="feature-item">
                            <div style={{
                                width: '20px',
                                height: '20px',
                                backgroundColor: '#dc3545',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginRight: '15px',
                                fontSize: '12px',
                                fontWeight: 'bold'
                            }}>✓</div>
                            <span>Pesan Cepat realtime</span>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', color: '#fff' }} className="feature-item">
                            <div style={{
                                width: '20px',
                                height: '20px',
                                backgroundColor: '#dc3545',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginRight: '15px',
                                fontSize: '12px',
                                fontWeight: 'bold'
                            }}>✓</div>
                            <span>Update informasi tiket secara real-time</span>
                        </div>
                    </div>

                    {/* Login Link */}
                    <p style={{ color: '#6c757d', fontSize: '0.9rem' }}>
                        Sudah punya akun?{' '}
                        <Link to="/login" style={{
                            color: '#dc3545',
                            fontWeight: '600',
                            textDecoration: 'none',
                            borderBottom: '1px solid transparent',
                            transition: 'border-color 0.3s'
                        }}>
                            Login di sini
                        </Link>
                    </p>

                </div>

                {/* Decorative Elements */}
                <div style={{
                    position: 'absolute',
                    top: '10%',
                    right: '10%',
                    width: '100px',
                    height: '100px',
                    border: '2px solid rgba(220, 53, 69, 0.1)',
                    borderRadius: '50%',
                    animation: 'float 6s ease-in-out infinite'
                }}></div>

                <div style={{
                    position: 'absolute',
                    bottom: '15%',
                    left: '10%',
                    width: '60px',
                    height: '60px',
                    border: '2px solid rgba(220, 53, 69, 0.1)',
                    borderRadius: '50%',
                    animation: 'float 4s ease-in-out infinite reverse'
                }}></div>

                <style>
                    {`
                        @keyframes float {
                            0%, 100% { transform: translateY(0px); }
                            50% { transform: translateY(-20px); }
                        }
                    `}
                </style>

            </div>

            {/* Right Side - Registration Form */}
            <div style={{
                flex: '1',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '40px',
                backgroundColor: '#292827'
            }} className="form-section">

                <div style={{ width: '100%', maxWidth: '440px' }}>

                    {/* Header */}
                    <div className="text-center mb-4">
                        <h3 style={{
                            color: '#fff',
                            fontSize: '1.8rem',
                            fontWeight: '700',
                            marginBottom: '8px'
                        }}>
                            Buat Akun Baru
                        </h3>
                        <p style={{
                            color: '#6c757d',
                            fontSize: '0.95rem',
                            margin: 0
                        }}>
                            Daftar sekarang untuk melakukan pemesanan tiket dengan mudah dan cepat!
                        </p>
                    </div>

                    {/* Form Box */}
                    <div style={{
                        backgroundColor: '#111318',
                        border: '1px solid #1f2636',
                        borderRadius: '16px',
                        padding: '36px',
                        boxShadow: '0 20px 40px rgba(0,0,0,0.3)'
                    }} className="form-container">

                        {/* Error Message */}
                        {error && (
                            <div style={{ backgroundColor: 'rgba(220, 53, 69, 0.1)', border: '1px solid rgba(220, 53, 69, 0.3)', borderRadius: '8px', padding: '12px 16px', marginBottom: '20px', color: '#dc3545', fontSize: '0.875rem' }}>
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit}>

                            {/* Username */}
                            <div className="mb-3">
                                <label style={labelStyle}>Nama Lengkap</label>
                                <input
                                    type="text"
                                    name="nama"
                                    placeholder="Masukkan nama lengkap"
                                    onChange={handleChange}
                                    required
                                    style={inputStyle}
                                    onFocus={e => e.target.style.borderColor = '#dc3545'}
                                    onBlur={e => e.target.style.borderColor = '#1f2636'}
                                />
                            </div>

                            {/* Email */}
                            <div className="mb-3">
                                <label style={labelStyle}>Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="contoh@email.com"
                                    onChange={handleChange}
                                    required
                                    style={inputStyle}
                                    onFocus={e => e.target.style.borderColor = '#dc3545'}
                                    onBlur={e => e.target.style.borderColor = '#1f2636'}
                                />
                            </div>

                            {/* Password */}
                            <div className="mb-3">
                                <label style={labelStyle}>Password</label>
                                <input
                                    type="password"
                                    name="password"
                                    placeholder="Minimal 6 karakter"
                                    onChange={handleChange}
                                    required
                                    style={inputStyle}
                                    onFocus={e => e.target.style.borderColor = '#dc3545'}
                                    onBlur={e => e.target.style.borderColor = '#1f2636'}
                                />
                            </div>

                            {/* No HP */}
                            <div className="mb-4">
                                <label style={labelStyle}>No. HP</label>
                                <input
                                    type="number"
                                    name="no_hp"
                                    placeholder="08xxxxxxxxxx"
                                    onChange={handleChange}
                                    required
                                    style={inputStyle}
                                    onFocus={e => e.target.style.borderColor = '#dc3545'}
                                    onBlur={e => e.target.style.borderColor = '#1f2636'}
                                />
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={loading}
                                style={{ width: '100%', padding: '12px', backgroundColor: '#dc3545', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', fontSize: '1rem', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1, transition: '0.3s' }}
                            >
                                {loading ? 'Mendaftar...' : 'Daftar Sekarang'}
                            </button>

                        </form>

                    </div>
                </div>
            </div>

            {/* Responsive Styles */}
            <style>
                {`
                    @media (max-width: 768px) {
                        .register-layout {
                            flex-direction: column !important;
                        }
                        .sidebar-section {
                            padding: 30px 20px !important;
                            min-height: 300px !important;
                        }
                        .form-section {
                            padding: 20px !important;
                        }
                        .sidebar-title {
                            font-size: 1.8rem !important;
                        }
                        .sidebar-subtitle {
                            font-size: 1rem !important;
                        }
                        .feature-item {
                            font-size: 0.9rem !important;
                        }
                    }

                    @media (max-width: 480px) {
                        .sidebar-section {
                            padding: 20px !important;
                        }
                        .form-container {
                            padding: 24px !important;
                        }
                        .sidebar-title {
                            font-size: 1.5rem !important;
                        }
                    }
                `}
            </style>

        </div>
    );
};

// Style reusable
const labelStyle = {
    display: 'block',
    color: '#a1a1aa',
    fontSize: '0.8rem',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    fontWeight: '600',
    marginBottom: '8px'
};

const inputStyle = {
    width: '100%',
    backgroundColor: '#0a0b0d',
    border: '1px solid #1f2636',
    borderRadius: '8px',
    padding: '12px 15px',
    color: '#fff',
    fontSize: '0.95rem',
    outline: 'none',
    transition: 'border-color 0.3s',
    boxSizing: 'border-box'
};

export default Register;
