import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
    const [role, setRole] = useState('user'); // 'user' atau 'admin'
    const [form, setForm] = useState({ identifier: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        setError('');
    };

    const handleRoleSwitch = (newRole) => {
        setRole(newRole);
        setForm({ identifier: '', password: '' });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            let payload, endpoint;

            if (role === 'admin') {
                // Admin pakai username + password → /login/admin
                endpoint = 'http://localhost:3000/login/admin';
                payload = { username: form.identifier, password: form.password };
            } else {
                // User pakai email + password → /login/user
                endpoint = 'http://localhost:3000/login/user';
                payload = { email: form.identifier, password: form.password };
            }

            const response = await axios.post(endpoint, payload);

            if (response.data.success) {
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('role', role); // simpan role

                if (role === 'admin') {
                    localStorage.setItem('admin', JSON.stringify(response.data.data));
                    navigate('/admin');
                } else {
                    localStorage.setItem('user', JSON.stringify(response.data.data));
                    navigate('/');
                }
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Login gagal, periksa kredensial Anda.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ backgroundColor: '#0a0b0d', minHeight: '100vh', fontFamily: 'Inter, sans-serif', display: 'flex' }} className="login-layout">

            {/* SIDEBAR */}
            <div className="sidebar-section" style={{
                flex: '1', background: 'linear-gradient(135deg, #1a1c22 0%, #0a0b0d 100%)',
                display: 'flex', flexDirection: 'column', justifyContent: 'center',
                padding: '60px', borderRight: '1px solid #1f2636'
            }}>
                <div style={{ maxWidth: '400px' }}>
                    <h1 style={{ color: '#fff', fontSize: '2.5rem', fontWeight: '800', marginBottom: '16px', letterSpacing: '-1px' }}>
                        Welcome Back to <span style={{ color: '#dc3545' }}>SoloFlix</span>.
                    </h1>
                    <p style={{ color: '#94a3b8', fontSize: '1.1rem', lineHeight: '1.6' }}>
                        {role === 'admin'
                            ? 'Masuk sebagai Admin untuk mengelola konten dan pengguna.'
                            : 'Masuk untuk melanjutkan menonton film favoritmu.'}
                    </p>
                </div>
            </div>

            {/* FORM */}
            <div className="form-section" style={{ flex: '1.2', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px' }}>
                <div style={{ width: '100%', maxWidth: '440px', padding: '40px', backgroundColor: '#111318', borderRadius: '16px', border: '1px solid #1f2636', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)' }}>

                    {/* TOGGLE USER / ADMIN */}
                    <div style={{ display: 'flex', backgroundColor: '#0a0b0d', borderRadius: '10px', padding: '4px', marginBottom: '28px', border: '1px solid #1f2636' }}>
                        {['user', 'admin'].map((r) => (
                            <button
                                key={r}
                                onClick={() => handleRoleSwitch(r)}
                                style={{
                                    flex: 1, padding: '10px', border: 'none', borderRadius: '8px', cursor: 'pointer',
                                    fontWeight: '600', fontSize: '0.9rem', transition: 'all 0.2s ease',
                                    backgroundColor: role === r ? '#dc3545' : 'transparent',
                                    color: role === r ? '#fff' : '#71717a',
                                }}
                            >
                                {r === 'user' ? '👤 User' : '🛡️ Admin'}
                            </button>
                        ))}
                    </div>

                    <div style={{ marginBottom: '24px' }}>
                        <h2 style={{ color: '#fff', fontSize: '1.75rem', fontWeight: '700', marginBottom: '4px' }}>Sign In</h2>
                        <p style={{ color: '#71717a', fontSize: '0.9rem' }}>
                            {role === 'admin' ? 'Masuk sebagai Administrator' : 'Masuk sebagai User'}
                        </p>
                    </div>

                    {error && (
                        <div style={{ backgroundColor: 'rgba(239,68,68,0.1)', border: '1px solid #ef4444', color: '#ef4444', padding: '12px', borderRadius: '8px', fontSize: '0.85rem', marginBottom: '20px' }}>
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div style={{ marginBottom: '20px' }}>
                            <label style={labelStyle}>
                                {role === 'admin' ? 'Username' : 'Email'}
                            </label>
                            <input
                                type="text"
                                name="identifier"
                                placeholder={role === 'admin' ? 'Username admin' : 'Email kamu'}
                                style={inputStyle}
                                value={form.identifier}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div style={{ marginBottom: '28px' }}>
                            <label style={labelStyle}>Password</label>
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
                                width: '100%', backgroundColor: '#dc3545', color: '#fff',
                                padding: '14px', borderRadius: '8px', border: 'none',
                                fontWeight: '600', fontSize: '1rem',
                                cursor: loading ? 'not-allowed' : 'pointer',
                                opacity: loading ? '0.7' : '1', transition: 'all 0.2s ease'
                            }}
                        >
                            {loading ? 'Processing...' : `Sign In as ${role === 'admin' ? 'Admin' : 'User'}`}
                        </button>
                    </form>

                    {role === 'user' && (
                        <div style={{ marginTop: '32px', textAlign: 'center', borderTop: '1px solid #1f2636', paddingTop: '24px' }}>
                            <p style={{ color: '#71717a', fontSize: '0.9rem' }}>
                                Belum punya akun?{' '}
                                <Link to="/register" style={{ color: '#dc3545', textDecoration: 'none', fontWeight: '600' }}>
                                    Daftar sekarang
                                </Link>
                            </p>
                        </div>
                    )}
                </div>
            </div>

            <style>{`
                @media (max-width: 968px) {
                    .sidebar-section { display: none !important; }
                    .login-layout { justify-content: center; }
                }
            `}</style>
        </div>
    );
};

const labelStyle = {
    display: 'block', color: '#a1a1aa', fontSize: '0.8rem',
    textTransform: 'uppercase', letterSpacing: '0.5px',
    fontWeight: '600', marginBottom: '8px'
};

const inputStyle = {
    width: '100%', backgroundColor: '#0a0b0d', border: '1px solid #1f2636',
    borderRadius: '8px', padding: '12px 15px', color: '#fff',
    fontSize: '0.95rem', outline: 'none', transition: 'border-color 0.2s ease'
};

export default Login;