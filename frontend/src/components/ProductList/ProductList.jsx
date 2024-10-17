import Button from '../Button';
import Image from '../Image/Image';
import classNames from 'classnames/bind';

import styles from './ProductList.module.scss';

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
];

function ProductList() {
    return (
        <div className="container mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {products.map((product) => (
                    <div key={product.id} className={cx('product-item')}>
                        <div className={cx('inner')}>
                            <div className="relative">
                                <Image src={product.imageSrc} alt={product.name} className={cx('product-image')} />
                                <span className={cx('product-tag')}>New</span>
                            </div>
                        </div>
                        <div className="pt-4">
                            <h3 className={cx('product-name')}>{product.name}</h3>
                            <Button to="/" viewProduct className="w-full">
                                <span className={cx('product-view')}>
                                    VIEW PRODUCT - <span className={cx('product-price')}>${product.price}</span>
                                </span>
                            </Button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default ProductList;
