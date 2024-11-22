import React, { useState, useRef, useEffect } from 'react';
import Button from '../Button';
import ProductItem from '../ProductItem';
import { Api_Listing } from '../../../apis/Api_Listing';
import { useLocation } from 'react-router-dom';

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [scrollPosition, setScrollPosition] = useState(0);
    const containerRef = useRef(null);
    const location = useLocation();
    const query = new URLSearchParams(location.search);
    const genderFilter = query.get('gender');

    const [selectedFilters, setSelectedFilters] = useState({
        refineBy: [],
        size: [],
        color: [],
        category: [],
        gender: genderFilter ? [genderFilter] : [],
        price: [0, 1000],
        brand: [],
    });

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await Api_Listing.filterProductsByCriteria({
                    colors: selectedFilters.color,
                    sizes: selectedFilters.size,
                    brands: selectedFilters.brand,
                    category: selectedFilters.category,
                    genders: selectedFilters.gender,
                    minPrice: selectedFilters.price[0],
                    maxPrice: selectedFilters.price[1],
                });
                const uniqueProducts = Array.from(new Map(response.map(product => [product.productId, product])).values());
                setProducts(uniqueProducts);
            } catch (error) {
                console.error('Error fetching products:', error);
            }
        };

        fetchProducts();
    }, [selectedFilters]);

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
                    <div key={product.productId} className="flex-none w-full sm:w-1/2 lg:w-1/4 p-2 snap-start">
                        <ProductItem
                            src={product.images[0]}
                            name={product.productName}
                            price={product.finalPrice}
                            originalPrice={product.originalPrice}
                            brand={product.brandName}
                            size={product.sizeName}
                            productId={product.productId}
                        />
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
};

export default ProductList;
