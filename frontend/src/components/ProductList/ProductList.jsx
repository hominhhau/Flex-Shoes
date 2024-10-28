import React, { useState, useRef, useEffect } from 'react';
import Button from '../Button';
import Image from '../Image';
import classNames from 'classnames/bind';

import styles from './ProductList.module.scss';
import ProductItem from '../ProductItem';

const cx = classNames.bind(styles);

const products = [
    {
        id: '1',
        name: 'ADIDAS 4DFWD X PARLEY RUNNING SHOES',
        price: 125,
        imageSrc: './src/assets/productItems/product1.png',
    },
    {
        id: '2',
        name: 'ADIDAS 4DFWD X PARLEY RUNNING SHOES',
        price: 125,
        imageSrc: './src/assets/productItems/product2.png',
    },
    {
        id: '3',
        name: 'ADIDAS 4DFWD X PARLEY RUNNING SHOES',
        price: 125,
        imageSrc: './src/assets/productItems/product3.png',
    },
    {
        id: '4',
        name: 'ADIDAS 4DFWD X PARLEY RUNNING SHOES',
        price: 125,
        imageSrc: './src/assets/productItems/product4.png',
    },
    {
        id: '5',
        name: 'ADIDAS 4DFWD X PARLEY RUNNING SHOES',
        price: 125,
        imageSrc: './src/assets/productItems/product4.png',
    },
];

function ProductList() {
    const [scrollPosition, setScrollPosition] = useState(0);
    const containerRef = useRef(null);

    const handleScroll = (direction) => {
        const container = containerRef.current;
        if (container) {
            const scrollAmount = direction === 'left' ? -container.offsetWidth : container.offsetWidth;
            container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
    };

    useEffect(() => {
        const container = containerRef.current;
        if (container) {
            const handleScrollEvent = () => {
                setScrollPosition(container.scrollLeft);
            };
            container.addEventListener('scroll', handleScrollEvent);
            return () => container.removeEventListener('scroll', handleScrollEvent);
        }
    }, []);

    return (
        <div className={cx('product-list')}>
            <div className="flex justify-end mb-4">
                <Button
                    className="mr-2 bg-white shadow-md rounded-full p-2"
                    onClick={() => handleScroll('left')}
                    disabled={scrollPosition <= 0}
                >
                    &lsaquo;
                </Button>
                <Button
                    className="bg-white shadow-md rounded-full p-2"
                    onClick={() => handleScroll('right')}
                    disabled={
                        scrollPosition >=
                        (containerRef.current?.scrollWidth || 0) - (containerRef.current?.clientWidth || 0)
                    }
                >
                    &rsaquo;
                </Button>
            </div>
            <div
                ref={containerRef}
                className="flex overflow-x-auto snap-x snap-mandatory"
                style={{
                    scrollSnapType: 'x mandatory',
                    scrollbarWidth: 'none',
                    msOverflowStyle: 'none',
                }}
            >
                <style jsx>{`
                    div::-webkit-scrollbar {
                        display: none;
                    }
                `}</style>
                {products.map((product) => (
                    <div key={product.id} className="flex-none w-full sm:w-1/2 lg:w-1/4 p-2 snap-start">
                        <ProductItem src={product.imageSrc} name={product.name} price={product.price} />
                    </div>
                ))}
            </div>
        </div>
    );
}

export default ProductList;
