import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const SidebarAdmin = ({ activeMenu }) => {
    const [adminName, setAdminName] = useState("Loading..."); 

    useEffect(() => { 
        const fetchAdmin = async () => {
            try {
                const res = await axios.get('http://localhost:3000/admins');
                if (res.data.success && res.data.data) {
                    const name = res.data.data.username;
                    const capitalizedName = name.charAt(0).toUpperCase() + name.slice(1);
                    setAdminName(capitalizedName);
                } else {
                    setAdminName("Admin");
                }
            } catch (error) {
                console.error("Error fetching admin:", error);
                setAdminName("Admin"); 
            }
        };
        fetchAdmin(); 
    }, []);

    return (
        <div className="sidebar-admin d-none d-lg-flex flex-column" style={{ width: '260px', backgroundColor: '#131722', borderRight: '1px solid #1f2636', padding: '30px 20px' }}>
            
            <h3 className="fw-bold mb-5 px-3" style={{ letterSpacing: '1px' }}>
                <span style={{ color: '#dc3545' }}>Solo</span>Flixx<span style={{ fontSize: '0.8rem', color: '#2f80ed', verticalAlign: 'top', marginLeft: '2px' }}>TV</span>
            </h3>

            <div className="d-flex align-items-center mb-5 px-3">
                <div className="bg-light rounded-3 d-flex justify-content-center align-items-center fw-bold text-dark fs-5" style={{ width: '45px', height: '45px' }}>
                    {adminName.charAt(0)}
                </div>
                <div className="ms-3">
                    <small className="text-secondary d-block" style={{ fontSize: '0.75rem' }}>Admin</small>
                    <strong className="text-white">{adminName}</strong>
                </div>
            </div>

            <ul className="nav flex-column gap-2 mb-auto">
                {/* HANYA ADA CATALOG FILM SEKARANG */}
                <li className="nav-item">
                    <Link to="/admin" className={`text-danger nav-link rounded-3 px-3 py-2 d-flex align-items-center gap-3 ${activeMenu === 'catalog' || activeMenu === 'add' ? 'admin-menu-active' : 'admin-menu'}`}>
                        <span style={{ fontSize: '1.2rem' }}>•</span> Catalog Film
                    </Link>
                </li>
                <li className="nav-item">
                    <span className="text-danger nav-link rounded-3 px-3 py-2 d-flex align-items-center gap-3" style={{ opacity: 1, cursor: 'pointer'}}>
                        <span style={{ fontSize: '1.2rem' }}>-</span> Users
                    </span>
                </li>
                <li className="nav-item">
                    <span className="text-danger nav-link admin-menu rounded-3 px-3 py-2 d-flex align-items-center gap-3" style={{ opacity: 1, cursor: 'not-allowed' }}>
                        <span style={{ fontSize: '1.2rem' }}>-</span> Reviews
                    </span>
                </li>
            </ul>

            <div className="mt-5 px-3">
                <Link to="/" className="text-decoration-none text-secondary admin-menu d-flex align-items-center gap-2">
                    ← Back to SoloFlixx
                </Link>
            </div>

            <style>
                {`
                    .admin-menu { color: #a1a1aa; text-decoration: none; transition: 0.3s; }
                    .admin-menu:hover { color: #2f80ed; }
                    .admin-menu-active { background-color: transparent; text-decoration: none; color: #2f80ed; font-weight: 600; }
                `}
            </style>
        </div>
    );
};

export default SidebarAdmin;