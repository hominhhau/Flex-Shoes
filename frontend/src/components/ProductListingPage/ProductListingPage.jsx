import React, { useState } from 'react';
import Button from '../Button';
import ProductItem from '../ProductItem';
import classNames from 'classnames/bind';
import styles from './ProductListingPage.module.scss';

const cx = classNames.bind(styles);

function ProductListPage({ products }) {
    const [visibleCount, setVisibleCount] = useState(12);

    // Create a Set to track unique productIds
    const uniqueProducts = Array.from(new Map(products.map((product) => [product._id, product])).values());

    const handleShowMore = () => {
        setVisibleCount((prevCount) => Math.min(prevCount + 4, uniqueProducts.length));
    };

    return (
        <div className={cx('product-list')}>
            <div className={cx('grid-container')}>
                {uniqueProducts.slice(0, visibleCount).map((product, index) => (
                    <div key={`${product._id}-${index}`} className={cx('product-item')}>
                        <ProductItem
                            key={product._id} // Ensure key is unique for each product
                            productId={product._id} // Pass productId here
                            src={product.image[0].imageID.URL}
                            name={product.productName}
                            price={product.sellingPrice}
                        />
                    </div>
                ))}
            </div>

            {visibleCount < uniqueProducts.length && (
                <div className="text-center mt-4">
                    <Button onClick={handleShowMore}>See More...</Button>
                </div>
            )}
        </div>
    );
}

export default ProductListPage;
