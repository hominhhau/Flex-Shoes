import { useState, useEffect } from 'react';
import classNames from 'classnames/bind';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from 'react-router-dom';
import config from '../../config';

import Button from '../../components/Button';
import Image from '../../components/Image';
import styles from './SlideShow.module.scss';
import { ChevronLeft, ChevronRight } from '../../components/Chevron';

const cx = classNames.bind(styles);

const images = ['./src/assets/slide/slide1.png', './src/assets/slide/slide2.jpg', './src/assets/slide/slide3.png'];

function SlideShow() {
    const [currentIndex, setCurrentIndex] = useState(0);

    const nextSlide = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    };

    const prevSlide = () => {
        setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
    };

    useEffect(() => {
        const timer = setInterval(nextSlide, 5000); // Change slide every 5 seconds
        return () => clearInterval(timer); // Cleanup on component unmount
    }, []);

    return (
        <div className="flex items-center justify-center mt-20 mb-20">
            <div className="relative w-full ">
                <div className="overflow-hidden rounded-[64px] shadow-lg">
                    <div className="relative h-[600px]">
                        {images.map((src, index) => (
                            <Image
                                key={index}
                                src={src}
                                alt={`Slide ${index + 1}`}
                                className={`absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-500 ${
                                    index === currentIndex ? 'opacity-100' : 'opacity-0'
                                }`}
                            />
                        ))}
                        <div className="absolute flex-col mt-[350px] left-20">
                            <div className=" text-white text-[74px] font-semibold">NIKE AIR MAX</div>
                            <div className=" text-white text-[24px] font-semibold">
                                Nike introducing the new air max for everyone's comfort
                            </div>
                        </div>
                        <Button primary className="absolute bottom-20 left-20">
                            SHOP NOW
                        </Button>
                    </div>
                </div>
                <div
                    className="absolute top-1/2 left-4 transform -translate-y-1/2 w-40 h-40 flex justify-start"
                    onClick={prevSlide}
                >
                    <ChevronLeft className="h-4 w-4" />
                </div>
                <div
                    className="absolute top-1/2 right-4 transform -translate-y-1/2 w-40 h-40 flex justify-end"
                    onClick={nextSlide}
                >
                    <ChevronRight className="h-4 w-4" />
                </div>
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                    {images.map((_, index) => (
                        <button
                            key={index}
                            className={`w-2 h-2 rounded-full ${index === currentIndex ? 'bg-white' : 'bg-white/50'}`}
                            onClick={() => setCurrentIndex(index)}
                        >
                            <span className="sr-only">Go to slide {index + 1}</span>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default SlideShow;
