import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const SidebarAdmin = ({ activeMenu }) => {
    const [adminName, setAdminName] = useState('Admin');

    useEffect(() => {
        const fetchAdmin = async () => {
            try {
                const res = await axios.get('http://localhost:3000/admins');
                if (res.data.success && res.data.data) {
                    const name = res.data.data.username || 'Admin';
                    setAdminName(name.charAt(0).toUpperCase() + name.slice(1));
                }
            } catch (error) {
                console.error('Error fetching admin:', error);
            }
        };
        fetchAdmin();
    }, []);

    return (
        <aside className="sidebar-admin" style={{ width: '280px', height: '100vh', backgroundColor: '#0f1726', borderRight: '1px solid rgba(255,255,255,0.07)', padding: '32px 24px', overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
            <div className="sidebar-brand mb-5">
                <h3 style={{ margin: 0, letterSpacing: '1px', fontWeight: 700 }}>
                    <span style={{ color: '#60a5fa' }}>Solo</span>
                    <span style={{ color: '#ec4899' }}>Flixx</span>
                    <small style={{ display: 'block', fontSize: '0.72rem', color: '#94a3b8', marginTop: '6px' }}>Admin Control</small>
                </h3>
            </div>

            <div className="sidebar-profile d-flex align-items-center gap-3 mb-6" style={{ padding: '15px', borderRadius: '18px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '16px', backgroundColor: '#1e293b', display: 'grid', placeItems: 'center', color: '#93c5fd', fontWeight: 700, fontSize: '1.1rem' }}>
                    {adminName.charAt(0)}
                </div>
                <div>
                    <div style={{ fontSize: '0.92rem', color: '#f8fafc', fontWeight: 700 }}>{adminName}</div>
                    <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Administrator</div>
                </div>
            </div>

            <nav className="sidebar-nav" style={{ display: 'flex', flexDirection: 'column', gap: '20px', paddingTop: '10px'}}>
                <Link to="/admin" className={`menu-link ${activeMenu === 'catalog' ? 'active' : ''}`}>
                    <span className="menu-dot" /> Dashboard
                </Link>
                <Link to="/admin/Getfilms" className={`menu-link ${activeMenu === 'films' ? 'active' : ''}`}>
                    <span className="menu-dot" /> Films
                </Link>
                <Link to="/admin/schedules" className={`menu-link ${activeMenu === 'schedule' ? 'active' : ''}`}>
                    <span className="menu-dot" /> Jadwal
                </Link>
                <div className="menu-link disabled">
                    <span className="menu-dot" /> Users
                </div>
                <div className="menu-link disabled">
                    <span className="menu-dot" /> Reviews
                </div>
            </nav>

            <div className="sidebar-footer mt-auto" style={{ marginTop: '36px' }}>
                <div style={{ padding: '18px 20px', borderRadius: '18px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginBottom: '10px' }}>Need quick help?</div>
                    <Link to="/" className="help-link">Back to Website</Link>
                </div>
            </div>

            <style>
                {`
                    .menu-link { display: flex; align-items: center; gap: 12px; padding: 12px 16px; border-radius: 14px; color: #cbd5e1; text-decoration: none; transition: all 0.25s ease; font-weight: 500; background: transparent; }
                    .menu-link:hover { color: #fff; background: rgba(71, 85, 105, 0.18); }
                    .menu-link.active { background: rgba(59, 130, 246, 0.18); color: #eff6ff; }
                    .menu-link.disabled { cursor: not-allowed; opacity: 0.45; }
                    .menu-dot { width: 8px; height: 8px; border-radius: 50%; background: #38bdf8; display: inline-block; }
                    .help-link { display: inline-flex; align-items: center; justify-content: center; width: 100%; padding: 10px 12px; border-radius: 12px; background: #2563eb; color: #fff; text-decoration: none; font-weight: 600; }
                    .help-link:hover { background: #3b82f6; }
                `}
            </style>
        </aside>
    );
};

export default SidebarAdmin;