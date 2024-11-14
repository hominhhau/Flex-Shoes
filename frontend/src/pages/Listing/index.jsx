import { useState } from 'react';
import classNames from 'classnames/bind';

import Filter from '../../components/Filter';
import styles from './Listing.module.scss';
import ProductListPage from '../../components/ProductListingPage';
import SlideShow from '../../components/SlideShow';
import { Api_Product } from '../../../apis/Api_Product';
import Button from '../../components/Button';
import routes from '../../config/routes';
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
    const getAllProducts = async () => {
        try {
            const response = await Api_Product.getProducts();

            console.log(response.data); // Kiểm tra dữ liệu trả về
            setProducts(response.data); // Lưu dữ liệu vào state
        } catch (error) {
            console.error('Failed to fetch product list: ', error);
        }
    };

    return (
        <div className={cx('wrapper')}>
            <SlideShow />
            <div className={cx('container-filter')}>
                <Filter />
            </div>
            <div className={cx('container-listproduct')}>
                <ProductListPage />
            </div>
            {/* <Button onClick={getAllProducts}>Get all products</Button> */}
        </div>
    );
}

export default Listing;
