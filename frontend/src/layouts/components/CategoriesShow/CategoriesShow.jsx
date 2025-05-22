import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import config from '../../../config';

import Image from '../../../components/Image';
import Button from '../../../components/Button';

const categories = [
    {
        name: 'LIFESTYLE SHOES',
        image: 'https://uploads3-toturial.s3.ap-southeast-2.amazonaws.com/cate2.png',
    },
    {
        name: 'BASKETBALL SHOES',
        image: 'https://uploads3-toturial.s3.ap-southeast-2.amazonaws.com/cate1.png',
    },
    {
        name: 'RUNNING SHOES',
        image: 'https://uploads3-toturial.s3.ap-southeast-2.amazonaws.com/cate1.png',
    },
    {
        name: 'FOOTBALL SHOES',
        image: 'https://uploads3-toturial.s3.ap-southeast-2.amazonaws.com/cate2.png',
    },
];

function CategoriesShow() {
    const [currentIndex, setCurrentIndex] = useState(0);

    const nextSlide = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 2) % categories.length);
    };

    const prevSlide = () => {
        setCurrentIndex((prevIndex) => (prevIndex - 2 + categories.length) % categories.length);
    };
    return (
        <div className="bg-gray-900 text-white p-6 mt-20 rounded-[24px]">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-[74px] font-bold">CATEGORIES</h2>
                <div className="flex gap-2">
                    <button className="bg-gray-700 hover:bg-gray-600 w-[50px] h-[50px] rounded-2xl" onClick={prevSlide}>
                        <FontAwesomeIcon icon={faChevronLeft} />
                        <span className="sr-only">Previous categories</span>
                    </button>
                    <button className="bg-gray-700 hover:bg-gray-600 w-[50px] h-[50px] rounded-2xl" onClick={nextSlide}>
                        <FontAwesomeIcon icon={faChevronRight} />
                        <span className="sr-only">Next categories</span>
                    </button>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[currentIndex, (currentIndex + 1) % categories.length].map((index) => {
                    const category = categories[index];
                    return (
                        <Link to={config.routes.listing}>
                            <div key={category.name} className="relative bg-gray-800 rounded-lg overflow-hidden group">
                                <Image
                                    src={category.image}
                                    alt={category.name}
                                    width={600}
                                    height={400}
                                    className="w-full max-h-[400px] object-cover"
                                />
                                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-gray-900 to-transparent">
                                    <h3 className="text-[32px] font-bold">{category.name}</h3>
                                </div>
                                <button className="absolute bottom-4 right-4 bg-white text-gray-900 opacity-0 group-hover:opacity-100 transition-opacity w-[50px] h-[50px] rounded-2xl">
                                    <FontAwesomeIcon icon={faChevronRight} />
                                    <span className="sr-only">View {category.name}</span>
                                </button>
                            </div>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}

export default CategoriesShow;
