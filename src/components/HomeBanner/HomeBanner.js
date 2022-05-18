import React, { useState, useEffect } from 'react';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';

import "./HomeBanner.css";

const bannerImages = [
    "https://m.media-amazon.com/images/I/518S7WaovmL._SX1500_.jpg",
    "https://m.media-amazon.com/images/I/611MhrKcEmL._SX3000_.jpg", 
    "https://m.media-amazon.com/images/I/71+d0EnJojL._SX3000_.jpg"
];


const HomeBanner = () => {
    const [currentIdx, setCurrentIdx] = useState(0);
    const bannerLength = bannerImages.length;

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIdx(currentIdx === bannerLength - 1 ? 0 : currentIdx+1);
        }, 5000);

        return () => clearInterval(interval);

    }, [currentIdx])

    const nextSlide = () => {
        setCurrentIdx(currentIdx === bannerLength - 1 ? 0 : currentIdx+1);
    }

    const prevSlide = () => {
        setCurrentIdx(currentIdx === 0 ? bannerLength - 1 : currentIdx-1);
    }
    return (
        <div className="banner">
            <ArrowBackIosNewIcon className="banner--left-arrow hover:scale-150 transform transition duration-300 ease-out" onClick={prevSlide}/>
            <ArrowForwardIosIcon className="banner--right-arrow hover:scale-150 transform transition duration-300 ease-out" onClick={nextSlide}/>
            {
                bannerImages.map((image, idx) => {
                    return (
                        <div className={idx === currentIdx ? 'banner-active-slide': 'banner--slide'}
                          key={idx}>
                          {idx === currentIdx &&  <img 
                            className="banner--image h-[300px] sm:h-[400px] lg:h-[600px] 2xl:h-[800px]" 
                            src={image} alt="banner"/>}          
                        </div>
                    )
                })
            }
        </div>
    );
}

export default HomeBanner;