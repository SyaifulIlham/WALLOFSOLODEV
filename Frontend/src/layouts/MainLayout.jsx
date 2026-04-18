import React from 'react';
import Navbar from '../components/nav';

const MainLayout = ({ children }) => {
    return (
        <div style={{ backgroundColor: '#0a0b0d', minHeight: '100vh', color: '#fff' }}>
            <Navbar />
            <main>
                {children}
            </main>
        </div>
    );
};

export default MainLayout;