import React from "react";
import { Link } from "react-router-dom";

const Hero = () => {
    return (
        <div className="hero-section d-flex flex-column align-items-center justify-content-center text-center" style={{ backgroundImage: 'url(/assets/hero-bg.jpg)' }}>
            <h1 className="hero-title">Selamat Datang di SoloFlixx</h1>
            <p className="hero-subtitle">Temukan film favoritmu dan nikmati pengalaman menonton yang tak terlupakan!</p>
            <Link to="/movies" className="btn btn-primary btn-lg mt-4">Jelajahi Film</Link>
        </div>
    );
}
const styles = {
    heroSection: {
        backgroundImage: 'url(/assets/hero-bg.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        height: '80vh',
        color: '#fff',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '0 20px'
    },
    heroTitle: {
        fontSize: '3rem',
        fontWeight: '700',
        marginBottom: '20px',
        textShadow: '0 4px 15px rgba(0,0,0,0.3)',   
    },
    heroSubtitle: {
        fontSize: '1.25rem',
        marginBottom: '30px'
    }
};