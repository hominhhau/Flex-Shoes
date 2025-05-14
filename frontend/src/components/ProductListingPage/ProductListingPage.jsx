import React, { useState } from 'react';
import Button from '../Button';
import ProductItem from '../ProductItem';
import classNames from 'classnames/bind';
import styles from './ProductListingPage.module.scss';

const cx = classNames.bind(styles);

function ProductListPage({ products }) {
    const [currentPage, setCurrentPage] = useState(1);
    const productsPerPage = 6;

    // Create a Set to track unique productIds
    const uniqueProducts = Array.from(new Map(products.map((product) => [product._id, product])).values());

    // Calculate pagination
    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = uniqueProducts.slice(indexOfFirstProduct, indexOfLastProduct);
    const totalPages = Math.ceil(uniqueProducts.length / productsPerPage);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const getPaginationPages = () => {
        const maxPagesToShow = 3;
        const pages = [];
        if (totalPages <= maxPagesToShow) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            if (currentPage <= 2) {
                pages.push(1, 2, 3, '...');
            } else if (currentPage >= totalPages - 1) {
                pages.push('...', totalPages - 2, totalPages - 1, totalPages);
            } else {
                pages.push('...', currentPage - 1, currentPage, currentPage + 1, '...');
            }
        }
        return pages;
    };

    return (
        <div className={cx('product-list')}>
            <div className={cx('grid-container')}>
                {currentProducts.map((product, index) => (
                    <div key={`${product._id}-${index}`} className={cx('product-item')}>
                        <ProductItem
                            key={product._id}
                            productId={product._id}
                            src={product.image[0]?.imageID?.URL || ''}
                            name={product.productName}
                            price={product.sellingPrice}
                        />
                    </div>
                ))}
            </div>

            {/* Pagination Controls */}
            <div className={cx('pagination')}>
                <button
                    className={cx('page-button')}
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                >
                    Prev
                </button>

                {getPaginationPages().map((page, index) => (
                    <button
                        key={index}
                        className={cx('page-button', { active: page === currentPage })}
                        onClick={() => page !== '...' && handlePageChange(page)}
                        disabled={page === '...'}
                    >
                        {page}
                    </button>
                ))}

                <button
                    className={cx('page-button')}
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                >
                    Next
                </button>
            </div>
        </div>
    );
}

export default ProductListPage;
