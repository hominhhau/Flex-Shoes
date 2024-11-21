import React, { useState, useEffect } from 'react';
import classNames from 'classnames/bind';

import Filter from '../../components/Filter';
import styles from './Listing.module.scss';
import ProductListPage from '../../components/ProductListingPage';
import SlideShow from '../../components/SlideShow';
import { Api_Product } from '../../../apis/Api_Product';
import Button from '../../components/Button';
import routes from '../../config/routes';
const cx = classNames.bind(styles);

function Listing() {
    const [filteredProducts, setFilteredProducts] = useState([]);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await Api_Product.getAll();
                setFilteredProducts(response.data);
            } catch (error) {
                console.error('Failed to fetch products', error);
            }
        };

        fetchProducts();
    }, []);

    const handleFilteredProducts = (products) => {
        setFilteredProducts(products);
    };

    return (
        <div className={cx('wrapper')}>
            <SlideShow />
            <div className={cx('container-filter')}>
                <Filter onFilterChange={handleFilteredProducts} />
            </div>
            <div className={cx('container-listproduct')}>
                <ProductListPage products={filteredProducts} />
            </div>
            {/* <Button onClick={getAllProducts}>Get all products</Button> */}
        </div>
    );
}

export default Listing;
