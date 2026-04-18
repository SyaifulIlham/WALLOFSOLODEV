import React from 'react';
import SidebarAdmin from '../components/SidebarAdmin';

const AdminLayout = ({ children }) => {
    return (
        <div style={{ backgroundColor: '#0a0b0d', minHeight: '100vh', color: '#fff' }}>
            <div style={{ display: 'flex' }}>
                <SidebarAdmin />
                <main style={{ flex: 1, padding: '20px' }}>
                    {children}
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;