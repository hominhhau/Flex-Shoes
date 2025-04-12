import React, { useState, useRef, useEffect } from 'react';
import Button from '../Button';
import ProductItem from '../ProductItem';
import { Api_Listing } from '../../../apis/Api_Listing';
import { useLocation } from 'react-router-dom';

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const containerRef = useRef(null);
    const location = useLocation();
    const query = new URLSearchParams(location.search);
    const genderFilter = query.get('gender');

    const [selectedFilters] = useState({
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

                // Gộp theo _id để loại trùng
                const uniqueProducts = Array.from(
                    new Map(response.map(product => [product._id, product])).values()
                );

                setProducts(uniqueProducts);
            } catch (error) {
                console.error('Failed to fetch products', error);
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

    return (
        <div className="product-list relative">
            <div className="flex justify-end mb-4 space-x-2">
                <Button onClick={() => handleScroll('left')}>&lsaquo;</Button>
                <Button onClick={() => handleScroll('right')}>&rsaquo;</Button>
            </div>

            <div
                ref={containerRef}
                className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide"
                style={{ scrollSnapType: 'x mandatory' }}
            >
                {products.map((product) => {
                    const imageUrl = product?.image?.[0]?.imageID?.URL || 'https://via.placeholder.com/300x300?text=No+Image';

                    return (
                        <div key={product._id} className="flex-none w-full sm:w-1/2 lg:w-1/4 p-2 snap-start">
                            <ProductItem
                                key={product._id}
                                productId={product._id}
                                src={imageUrl}
                                name={product.productName}
                                price={product.sellingPrice}
                            />
                        </div>
                    );
                })}
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
