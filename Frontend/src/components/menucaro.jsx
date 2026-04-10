import React, { useState, useEffect } from 'react';

export default function MenuCarousel() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isAutoPlay, setIsAutoPlay] = useState(true);

    const items = [
        { id: 1, name: 'Item 1', image: '/image1.jpg' },
        { id: 2, name: 'Item 2', image: '/image2.jpg' },
        { id: 3, name: 'Item 3', image: '/image3.jpg' },
    ];

    const nextSlide = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % items.length);
    };

    const prevSlide = () => {
        setCurrentIndex((prevIndex) => (prevIndex - 1 + items.length) % items.length);
    };

    // Auto-play carousel
    useEffect(() => {
        if (!isAutoPlay) return;

        const interval = setInterval(() => {
            nextSlide();
        }, 4000); // Berganti setiap 4 detik

        return () => clearInterval(interval);
    }, [isAutoPlay]);

    return (
        <div 
            className="carousel"
            onMouseEnter={() => setIsAutoPlay(false)}
            onMouseLeave={() => setIsAutoPlay(true)}
        >
            <button onClick={prevSlide}>← Prev</button>
            <div className="carousel-content">
                <img src={items[currentIndex].image} alt={items[currentIndex].name} />
                <p>{items[currentIndex].name}</p>
            </div>
            <button onClick={nextSlide}>Next →</button>
        </div>
    );
}