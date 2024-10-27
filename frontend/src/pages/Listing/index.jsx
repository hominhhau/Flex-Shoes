import { useState } from 'react';
import classNames from 'classnames/bind';

import Filter from '../../components/Filter';
import styles from './Listing.module.scss';
import ProductList from '../../components/ProductList';

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
        imageSrc: './src/assets/productItems/product1.png',
    },
    {
        id: '6',
        name: 'ADIDAS 4DFWD X PARLEY RUNNING SHOES',
        price: 125,
        imageSrc: './src/assets/productItems/product2.png',
    },
    {
        id: '7',
        name: 'ADIDAS 4DFWD X PARLEY RUNNING SHOES',
        price: 125,
        imageSrc: './src/assets/productItems/product3.png',
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
];

function Listing() {
    const [visibleCount, setVisibleCount] = useState(3);

    const handleLoadMore = () => {
        setVisibleCount((prevCount) => prevCount + 3);
    };

    return (
        <div className={cx('wrapper')}>
            <div className={cx('container-filter')}>
                <Filter />
            </div>
            <div className={cx('container-listproduct')}>
                <ProductList columns={3} products={products.slice(0, visibleCount)} />
                {visibleCount < products.length && (
                    <button onClick={handleLoadMore} className={cx('load-more-btn')}>
                        Load More
                    </button>
                )}
            </div>
        </div>
    );
}

export default Listing;
