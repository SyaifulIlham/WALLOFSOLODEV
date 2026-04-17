import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { FaChevronLeft, FaChevronRight, FaPlay, FaInfoCircle, FaStar } from 'react-icons/fa';

export default function FilmCarousel() {
    const [films, setFilms] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isAutoPlay, setIsAutoPlay] = useState(true);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFilms = async () => {
            try {
                const res = await axios.get('http://localhost:3000/films');
                // Get only "Sedang Tayang" films for the carousel
                const featuredFilms = res.data.data.filter(film =>
                    film.status === 'Sedang Tayang' || !film.status
                ).slice(0, 5); // Limit to 5 films for carousel
                setFilms(featuredFilms);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching films:', error);
                setLoading(false);
            }
        };
        fetchFilms();
    }, []);

    const nextSlide = useCallback(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % films.length);
    }, [films.length]);

    const prevSlide = useCallback(() => {
        setCurrentIndex((prevIndex) => (prevIndex - 1 + films.length) % films.length);
    }, [films.length]);

    const goToSlide = (index) => {
        setCurrentIndex(index);
    };

    // Auto-play carousel
    useEffect(() => {
        if (!isAutoPlay || films.length === 0) return;

        const interval = setInterval(() => {
            nextSlide();
        }, 6000); // Change every 6 seconds

        return () => clearInterval(interval);
    }, [isAutoPlay, films.length, nextSlide]);

    if (loading) {
        return (
            <div className="film-carousel-loading">
                <div className="loading-spinner"></div>
                <p>Loading featured films...</p>
            </div>
        );
    }

    if (films.length === 0) {
        return (
            <div className="film-carousel-placeholder">
                <h2>No featured films available</h2>
            </div>
        );
    }

    const currentFilm = films[currentIndex];

    return (
        <div
            className="film-carousel"
            onMouseEnter={() => setIsAutoPlay(false)}
            onMouseLeave={() => setIsAutoPlay(true)}
        >
            {/* Background Image */}
            <div
                className="carousel-background"
                style={{
                    backgroundImage: `url(${currentFilm.poster || '/placeholder-movie.jpg'})`,
                }}
            >
                <div className="background-overlay"></div>
            </div>

            {/* Content */}
            <div className="carousel-content">
                <div className="container h-100">
                    <div className="row h-100 align-items-center">
                        <div className="col-lg-6 col-md-8">
                            <div className="film-info">
                                {/* Featured Badge */}
                                <div className="featured-badge">
                                    <FaStar className="star-icon" />
                                    Featured Film
                                </div>

                                {/* Film Title */}
                                <h1 className="film-title">{currentFilm.judul_film}</h1>

                                {/* Film Details */}
                                <div className="film-meta">
                                    <span className="genre">{currentFilm.genre || 'Action'}</span>
                                    <span className="separator">•</span>
                                    <span className="duration">{currentFilm.durasi || '120'} min</span>
                                    <span className="separator">•</span>
                                    <span className="rating">
                                        <FaStar className="rating-star" />
                                        {currentFilm.rating || '8.5'}
                                    </span>
                                </div>

                                {/* Film Description */}
                                <p className="film-description">
                                    {currentFilm.deskripsi ?
                                        currentFilm.deskripsi.substring(0, 200) + '...' :
                                        'Experience the thrill of this amazing film that will keep you on the edge of your seat.'
                                    }
                                </p>

                                {/* Action Buttons */}
                                <div className="action-buttons">
                                    <Link
                                        to={`/movie/${currentFilm.id_film}`}
                                        className="btn btn-primary watch-btn"
                                    >
                                        <FaPlay className="me-2" />
                                        Watch Now
                                    </Link>
                                    <Link
                                        to={`/movie/${currentFilm.id_film}`}
                                        className="btn btn-outline-light info-btn"
                                    >
                                        <FaInfoCircle className="me-2" />
                                        More Info
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Navigation Arrows */}
                <button className="nav-arrow nav-arrow-left" onClick={prevSlide}>
                    <FaChevronLeft />
                </button>
                <button className="nav-arrow nav-arrow-right" onClick={nextSlide}>
                    <FaChevronRight />
                </button>

                {/* Indicators */}
                <div className="carousel-indicators">
                    {films.map((_, index) => (
                        <button
                            key={index}
                            className={`indicator ${index === currentIndex ? 'active' : ''}`}
                            onClick={() => goToSlide(index)}
                        />
                    ))}
                </div>
            </div>

            {/* Custom Styles */}
            <style>
                {`
                    .film-carousel {
                        position: relative;
                        height: 70vh;
                        min-height: 500px;
                        overflow: hidden;
                        color: white;
                    }

                    .carousel-background {
                        position: absolute;
                        top: 0;
                        left: 0;
                        width: 100%;
                        height: 100%;
                        background-size: cover;
                        background-position: center;
                        background-repeat: no-repeat;
                        transition: all 0.7s ease;
                    }

                    .background-overlay {
                        position: absolute;
                        top: 0;
                        left: 0;
                        width: 100%;
                        height: 100%;
                        background: linear-gradient(
                            45deg,
                            rgba(10, 11, 13, 0.8) 0%,
                            rgba(10, 11, 13, 0.4) 50%,
                            rgba(10, 11, 13, 0.8) 100%
                        );
                    }

                    .carousel-content {
                        position: relative;
                        z-index: 2;
                        height: 100%;
                    }

                    .film-info {
                        animation: slideInLeft 0.8s ease-out;
                    }

                    @keyframes slideInLeft {
                        from {
                            opacity: 0;
                            transform: translateX(-50px);
                        }
                        to {
                            opacity: 1;
                            transform: translateX(0);
                        }
                    }

                    .featured-badge {
                        display: inline-flex;
                        align-items: center;
                        gap: 8px;
                        background: linear-gradient(45deg, #dc3545, #ff6b6b);
                        color: white;
                        padding: 8px 16px;
                        border-radius: 20px;
                        font-size: 0.9rem;
                        font-weight: 600;
                        margin-bottom: 20px;
                        box-shadow: 0 4px 15px rgba(220, 53, 69, 0.3);
                    }

                    .star-icon {
                        font-size: 0.8em;
                    }

                    .film-title {
                        font-size: 3.5rem;
                        font-weight: 800;
                        margin-bottom: 15px;
                        text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
                        line-height: 1.1;
                    }

                    .film-meta {
                        display: flex;
                        align-items: center;
                        gap: 15px;
                        margin-bottom: 20px;
                        font-size: 1.1rem;
                    }

                    .genre {
                        color: #dc3545;
                        font-weight: 600;
                    }

                    .separator {
                        color: rgba(255,255,255,0.5);
                    }

                    .rating {
                        display: flex;
                        align-items: center;
                        gap: 5px;
                        color: #ffd700;
                        font-weight: 600;
                    }

                    .rating-star {
                        font-size: 0.9em;
                    }

                    .film-description {
                        font-size: 1.1rem;
                        line-height: 1.6;
                        margin-bottom: 30px;
                        opacity: 0.9;
                        max-width: 500px;
                    }

                    .action-buttons {
                        display: flex;
                        gap: 15px;
                        flex-wrap: wrap;
                    }

                    .watch-btn {
                        background: linear-gradient(45deg, #dc3545, #ff6b6b);
                        border: none;
                        padding: 12px 30px;
                        font-size: 1.1rem;
                        font-weight: 600;
                        border-radius: 8px;
                        transition: all 0.3s ease;
                        box-shadow: 0 4px 15px rgba(220, 53, 69, 0.3);
                    }

                    .watch-btn:hover {
                        transform: translateY(-2px);
                        box-shadow: 0 6px 20px rgba(220, 53, 69, 0.4);
                        background: linear-gradient(45deg, #c82333, #e74c3c);
                    }

                    .info-btn {
                        border: 2px solid rgba(255,255,255,0.8);
                        color: white;
                        padding: 12px 30px;
                        font-size: 1.1rem;
                        font-weight: 600;
                        border-radius: 8px;
                        transition: all 0.3s ease;
                        background: transparent;
                    }

                    .info-btn:hover {
                        background: rgba(255,255,255,0.1);
                        border-color: white;
                        transform: translateY(-2px);
                    }

                    .nav-arrow {
                        position: absolute;
                        top: 50%;
                        transform: translateY(-50%);
                        background: rgba(0,0,0,0.5);
                        border: none;
                        color: white;
                        width: 50px;
                        height: 50px;
                        border-radius: 50%;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        font-size: 1.2rem;
                        cursor: pointer;
                        transition: all 0.3s ease;
                        z-index: 3;
                        backdrop-filter: blur(10px);
                    }

                    .nav-arrow:hover {
                        background: rgba(220, 53, 69, 0.8);
                        transform: translateY(-50%) scale(1.1);
                    }

                    .nav-arrow-left {
                        left: 20px;
                    }

                    .nav-arrow-right {
                        right: 20px;
                    }

                    .carousel-indicators {
                        position: absolute;
                        bottom: 30px;
                        left: 50%;
                        transform: translateX(-50%);
                        display: flex;
                        gap: 10px;
                        z-index: 3;
                    }

                    .indicator {
                        width: 12px;
                        height: 12px;
                        border-radius: 50%;
                        border: 2px solid rgba(255,255,255,0.5);
                        background: transparent;
                        cursor: pointer;
                        transition: all 0.3s ease;
                    }

                    .indicator.active {
                        background: #dc3545;
                        border-color: #dc3545;
                        transform: scale(1.2);
                    }

                    .indicator:hover {
                        border-color: rgba(255,255,255,0.8);
                    }

                    /* Loading State */
                    .film-carousel-loading {
                        height: 70vh;
                        min-height: 500px;
                        background: linear-gradient(45deg, #0a0b0d, #1a1b1d);
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        justify-content: center;
                        color: white;
                    }

                    .loading-spinner {
                        width: 50px;
                        height: 50px;
                        border: 3px solid rgba(255,255,255,0.1);
                        border-top: 3px solid #dc3545;
                        border-radius: 50%;
                        animation: spin 1s linear infinite;
                        margin-bottom: 20px;
                    }

                    @keyframes spin {
                        0% { transform: rotate(0deg); }
                        100% { transform: rotate(360deg); }
                    }

                    .film-carousel-placeholder {
                        height: 70vh;
                        min-height: 500px;
                        background: linear-gradient(45deg, #0a0b0d, #1a1b1d);
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        color: white;
                        text-align: center;
                    }

                    /* Responsive Design */
                    @media (max-width: 768px) {
                        .film-title {
                            font-size: 2.5rem;
                        }

                        .film-description {
                            font-size: 1rem;
                        }

                        .action-buttons {
                            flex-direction: column;
                            width: 100%;
                        }

                        .watch-btn, .info-btn {
                            width: 100%;
                            text-align: center;
                        }

                        .nav-arrow {
                            width: 40px;
                            height: 40px;
                            font-size: 1rem;
                        }

                        .nav-arrow-left {
                            left: 10px;
                        }

                        .nav-arrow-right {
                            right: 10px;
                        }
                    }

                    @media (max-width: 576px) {
                        .film-title {
                            font-size: 2rem;
                        }

                        .film-meta {
                            flex-direction: column;
                            align-items: flex-start;
                            gap: 5px;
                        }
                    }
                `}
            </style>
        </div>
    );
}