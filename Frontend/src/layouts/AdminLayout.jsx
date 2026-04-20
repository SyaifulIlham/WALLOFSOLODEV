import React from 'react';
import SidebarAdmin from '../components/SidebarAdmin';

const AdminLayout = ({ children, activeMenu }) => {
    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#06080f', color: '#fff', fontFamily: 'Inter, sans-serif' }}>
            <div style={{ display: 'flex', minHeight: '100vh' }}>
                <div style={{ position: 'fixed', left: 0, top: 0, width: '280px', height: '100vh', zIndex: 1000 }}>
                    <SidebarAdmin activeMenu={activeMenu} />
                </div>
                <main style={{
                    marginLeft: '280px',
                    padding: '32px 36px',
                    minHeight: '100vh',
                    overflowY: 'auto',
                    background: 'radial-gradient(circle at top right, rgba(47, 128, 237, 0.08), transparent 28%), linear-gradient(180deg, #07090f 0%, #0d1220 100%)'
                }}>
                    {children}
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;