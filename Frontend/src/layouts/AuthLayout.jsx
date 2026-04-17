import React from 'react';

const AuthLayout = ({ children }) => {
    return (
        <div style={{
            backgroundColor: '#0a0b0d',
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
        }}>
            {children}
        </div>
    );
};

export default AuthLayout;