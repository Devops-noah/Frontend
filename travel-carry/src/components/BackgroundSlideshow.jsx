import React, { useEffect, useState, useCallback } from 'react';
import photo1 from '../assets/photo1.jpg';
import photo2 from '../assets/photo2.jpg';
import photo3 from '../assets/photo3.jpg';
import photo4 from '../assets/photo4.jpg';
import photo6 from '../assets/photo6.jpg';
import photo7 from '../assets/photo7.jpg';

const BackgroundSlideshow = () => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const images = [photo1, photo2, photo3, photo4,photo6,photo7 ];

    const nextImage = useCallback(() => {
        setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, []);

    useEffect(() => {
        const interval = setInterval(nextImage, 5000);
        return () => clearInterval(interval);
    }, [nextImage]);

    return (
        <div className="fixed inset-0 -z-10">
            {images.map((image, index) => (
                <div
                    key={index}
                    className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                        index === currentImageIndex ? 'opacity-150' : 'opacity-0'
                    }`}
                    style={{
                        backgroundImage: `url(${image})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                    }}
                />
            ))}
        </div>
    );

};

export default React.memo(BackgroundSlideshow);