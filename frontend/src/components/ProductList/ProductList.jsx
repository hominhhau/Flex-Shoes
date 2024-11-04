import React, { useState, useRef, useEffect } from 'react';
import Button from '../Button';
import ProductItem from '../ProductItem';

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
        imageSrc: './src/assets/productItems/product2.png',
    },
    {
        id: '6',
        name: 'ADIDAS 4DFWD X PARLEY RUNNING SHOES',
        price: 125,
        imageSrc: './src/assets/productItems/product3.png',
    },
    {
        id: '7',
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
        <div className="product-list relative">
            <div className="flex justify-end mb-4 space-x-2">
                <Button
                    className="bg-white shadow-md rounded-full p-2"
                    onClick={() => handleScroll('left')}
                    aria-label="Scroll left"
                >
                    &lsaquo;
                </Button>
                <Button
                    className="bg-white shadow-md rounded-full p-2"
                    onClick={() => handleScroll('right')}
                    aria-label="Scroll right"
                >
                    &rsaquo;
                </Button>
            </div>
            <div
                ref={containerRef}
                className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide"
                style={{
                    scrollSnapType: 'x mandatory',
                }}
            >
                {products.map((product) => (
                    <div key={product.id} className="flex-none w-full sm:w-1/2 lg:w-1/4 p-2 snap-start">
                        <ProductItem src={product.imageSrc} name={product.name} price={product.price} />
                    </div>
                ))}
            </div>
            <style jsx="true">{`
                .scrollbar-hide::-webkit-scrollbar {
                    display: none;
                }
                .scrollbar-hide {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
            `}</style>
        </div>
    );
}

export default ProductList;
