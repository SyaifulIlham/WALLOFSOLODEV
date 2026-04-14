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
        <div style={{ backgroundColor: '#0a0b0d', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Inter, sans-serif' }}>


            {/* Card Register */}
            <div style={{ width: '100%', maxWidth: '440px', padding: '0 20px' }}>   
                
                {/* Logo */}
                <div className="text-center mb-4">
                    <Link to="/" style={{ textDecoration: 'none', fontSize: '2rem', fontWeight: 'bold', letterSpacing: '1px' }}>
                        <span style={{ color: '#dc3545' }}>Solo</span>
                        <span style={{ color: '#fff' }}>Flixx</span>
                    </Link>
                    <p style={{ color: '#6c757d', marginTop: '8px', fontSize: '0.9rem' }}>Buat akun baru kamu</p>
                </div>

                {/* Form Box */}
                <div style={{ backgroundColor: '#111318', border: '1px solid #1f2636', borderRadius: '16px', padding: '36px' }}>
                    
                    {/* Error Message */}
                    {error && (
                        <div style={{ backgroundColor: 'rgba(220, 53, 69, 0.1)', border: '1px solid rgba(220, 53, 69, 0.3)', borderRadius: '8px', padding: '12px 16px', marginBottom: '20px', color: '#dc3545', fontSize: '0.875rem' }}>
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        
                        {/* Username */}
                        <div className="mb-3">
                            <label style={labelStyle}>Username</label>
                            <input
                                type="text"
                                name="nama"
                                placeholder="Tulis Username kamu"
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

                    {/* Link ke Login */}
                    <p className="text-center mt-4 mb-0" style={{ color: '#6c757d', fontSize: '0.875rem' }}>
                        Sudah punya akun?{' '}
                        <Link to="/login" style={{ color: '#dc3545', fontWeight: '600', textDecoration: 'none' }}>
                            Login di sini
                        </Link>
                    </p>

                </div>
            </div>

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