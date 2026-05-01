import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
    const [form, setForm] = useState({
        // TUGAS MINGGU 3: Properti 'email' diganti menjadi 'identifier' (atau 'usernameOrEmail')
        identifier: '', 
        password: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            // Pastikan backend Anda menerima field 'identifier' atau sesuaikan payload-nya di sini
            const payload = {
                identifier: form.identifier, // Kirim ke backend
                password: form.password
            };

            const response = await axios.post('http://localhost:3000/api/login/user', payload);
            
            if (response.data.success) {
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('user', JSON.stringify(response.data.data));

                alert('Login Berhasil!');
                navigate('/'); 
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Login gagal, periksa email/username atau password.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ backgroundColor: '#0a0b0d', minHeight: '100vh', fontFamily: 'Inter, sans-serif', display: 'flex' }} className="login-layout">
            
            <div className="sidebar-section" style={{
                flex: '1',
                background: 'linear-gradient(135deg, #1a1c22 0%, #0a0b0d 100%)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                padding: '60px',
                borderRight: '1px solid #1f2636'
            }}>
                <div style={{ maxWidth: '400px' }}>
                    <h1 className="sidebar-title" style={{ color: '#fff', fontSize: '2.5rem', fontWeight: '800', marginBottom: '16px', letterSpacing: '-1px' }}>
                        Welcome Back to <span style={{ color: '#dc3545' }}>SoloFlix</span>.
                    </h1>
                    <p className="sidebar-subtitle" style={{ color: '#94a3b8', fontSize: '1.1rem', lineHeight: '1.6', marginBottom: '40px' }}>
                        Masuk untuk melanjutkan menonton film favoritmu dan mengelola daftar putar.
                    </p>
                </div>
            </div>

            <div className="form-section" style={{ flex: '1.2', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px' }}>
                <div className="form-container" style={{ width: '100%', maxWidth: '440px', padding: '40px', backgroundColor: '#111318', borderRadius: '16px', border: '1px solid #1f2636', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)' }}>
                    
                    <div style={{ marginBottom: '32px' }}>
                        <h2 style={{ color: '#fff', fontSize: '1.75rem', fontWeight: '700', marginBottom: '8px' }}>Sign In</h2>
                        <p style={{ color: '#71717a', fontSize: '0.9rem' }}>Masukkan detail akun anda di bawah ini.</p>
                    </div>

                    {error && (
                        <div style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', border: '1px solid #ef4444', color: '#ef4444', padding: '12px', borderRadius: '8px', fontSize: '0.85rem', marginBottom: '20px' }}>
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        {/* INPUT EMAIL / USERNAME */}
                        <div style={{ marginBottom: '20px' }}>
                            <label style={labelStyle}>Email or Username</label>
                            <input 
                                type="text" // Diubah dari 'email' ke 'text' agar bisa menerima username
                                name="identifier"
                                placeholder="Email or username"
                                style={inputStyle}
                                value={form.identifier}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div style={{ marginBottom: '28px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                                <label style={{ ...labelStyle, marginBottom: '0' }}>Password</label>
                            </div>
                            <input 
                                type="password" 
                                name="password"
                                placeholder="••••••••"
                                style={inputStyle}
                                value={form.password}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <button 
                            type="submit" 
                            disabled={loading}
                            style={{
                                width: '100%',
                                backgroundColor: '#dc3545',
                                color: '#fff',
                                padding: '14px',
                                borderRadius: '8px',
                                border: 'none',
                                fontWeight: '600',
                                fontSize: '1rem',
                                cursor: loading ? 'not-allowed' : 'pointer',
                                transition: 'all 0.2s ease',
                                opacity: loading ? '0.7' : '1'
                            }}
                        >
                            {loading ? 'Processing...' : 'Sign In'}
                        </button>
                    </form>

                    <div style={{ marginTop: '32px', textAlign: 'center', borderTop: '1px solid #1f2636', paddingTop: '24px' }}>
                        <p style={{ color: '#71717a', fontSize: '0.9rem' }}>
                            Belum punya akun?{' '}
                            <Link to="/register" style={{ color: '#dc3545', textDecoration: 'none', fontWeight: '600' }}>
                                Daftar sekarang
                            </Link>
                        </p>
                    </div>
                </div>
            </div>

            <style>
                {`
                    @media (max-width: 968px) {
                        .sidebar-section { display: none !important; }
                        .login-layout { justify-content: center; }
                    }
                `}
            </style>
        </div>
    );
};

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
    transition: 'border-color 0.2s ease'
};

export default Login;