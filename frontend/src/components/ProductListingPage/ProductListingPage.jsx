import React, { useState } from 'react';
import Button from '../Button';
import ProductItem from '../ProductItem';
import classNames from 'classnames/bind';
import styles from './ProductListingPage.module.scss';

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
    {
        id: '6',
        name: 'ADIDAS 4DFWD X PARLEY RUNNING SHOES',
        price: 125,
        imageSrc: './src/assets/productItems/product4.png',
    },
    {
        id: '7',
        name: 'ADIDAS 4DFWD X PARLEY RUNNING SHOES',
        price: 125,
        imageSrc: './src/assets/productItems/product4.png',
    },
    {
        id: '8',
        name: 'ADIDAS 4DFWD X PARLEY RUNNING SHOES',
        price: 125,
        imageSrc: './src/assets/productItems/product4.png',
    },
    {
        id: '9',
        name: 'ADIDAS 4DFWD X PARLEY RUNNING SHOES',
        price: 125,
        imageSrc: './src/assets/productItems/product4.png',
    },
    {
        id: '10',
        name: 'ADIDAS 4DFWD X PARLEY RUNNING SHOES',
        price: 125,
        imageSrc: './src/assets/productItems/product4.png',
    },
    {
        id: '11',
        name: 'ADIDAS 4DFWD X PARLEY RUNNING SHOES',
        price: 125,
        imageSrc: './src/assets/productItems/product4.png',
    },
    {
        id: '12',
        name: 'ADIDAS 4DFWD X PARLEY RUNNING SHOES',
        price: 125,
        imageSrc: './src/assets/productItems/product4.png',
    },
    {
        id: '13',
        name: 'ADIDAS 4DFWD X PARLEY RUNNING SHOES',
        price: 125,
        imageSrc: './src/assets/productItems/product4.png',
    },
    {
        id: '14',
        name: 'ADIDAS 4DFWD X PARLEY RUNNING SHOES',
        price: 125,
        imageSrc: './src/assets/productItems/product4.png',
    },
    {
        id: '15',
        name: 'ADIDAS 4DFWD X PARLEY RUNNING SHOES',
        price: 125,
        imageSrc: './src/assets/productItems/product4.png',
    },
    {
        id: '16',
        name: 'ADIDAS 4DFWD X PARLEY RUNNING SHOES',
        price: 125,
        imageSrc: './src/assets/productItems/product4.png',
    },
    {
        id: '17',
        name: 'ADIDAS 4DFWD X PARLEY RUNNING SHOES',
        price: 125,
        imageSrc: './src/assets/productItems/product4.png',
    },
    {
        id: '18',
        name: 'ADIDAS 4DFWD X PARLEY RUNNING SHOES',
        price: 125,
        imageSrc: './src/assets/productItems/product4.png',
    },
    {
        id: '19',
        name: 'ADIDAS 4DFWD X PARLEY RUNNING SHOES',
        price: 125,
        imageSrc: './src/assets/productItems/product4.png',
    },
    {
        id: '20',
        name: 'ADIDAS 4DFWD X PARLEY RUNNING SHOES',
        price: 125,
        imageSrc: './src/assets/productItems/product4.png',
    },
];

function ProductListPage() {
    const [visibleCount, setVisibleCount] = useState(12); // Hiển thị 4 dòng * 3 cột ngay từ đầu

    const handleShowMore = () => {
        setVisibleCount((prevCount) => Math.min(prevCount + 4, products.length));
    };

    return (
        <div className={cx('product-list')}>
            <div className={cx('grid-container')}>
                {products.slice(0, visibleCount).map((product) => (
                    <div key={product.id} className={cx('product-item')}>
                        <ProductItem src={product.imageSrc} name={product.name} price={product.price} />
                    </div>
                ))}
            </div>
            {visibleCount < products.length && (
                <div className="text-center mt-4">
                    <Button onClick={handleShowMore}>See More...</Button>
                </div>
            )}
        </div>
    );
}

export default ProductListPage;
