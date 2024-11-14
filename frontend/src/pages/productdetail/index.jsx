import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import classNames from 'classnames/bind';
import styles from './productdetail.module.scss';

const cx = classNames.bind(styles);

const productDetail = {
    id: '1',
    name: 'ADIDAS 4DFWD X PARLEY RUNNING SHOES',
    price: 125.00,
    status: 'New Release',
    colors: ['Navy', 'Green'],
    sizes: [38, 39, 40, 41, 42, 43, 44, 45, 46, 47],
    imageSrc: [
        './src/assets/images/productDetail/img1.png',
        './src/assets/images/productDetail/img2.png',
        './src/assets/images/productDetail/img3.png',
        './src/assets/images/productDetail/img4.png',
        './src/assets/images/productDetail/img3.png',
        './src/assets/images/productDetail/img4.png',
        './src/assets/images/productDetail/img3.png',
        './src/assets/images/productDetail/img4.png',
        './src/assets/images/productDetail/img3.png',
        './src/assets/images/productDetail/img4.png',

    ],
    description: 'This product is excluded from all promotional discounts and offers.',
    additionalInfo: [
        'Shadow Navy / Army Green This product is excluded from all promotional discounts and offers. Pay over time in interest-free installments with Affirm, Klarna or Afterpay. Join adiClub to get unlimited free standard shipping, returns, & exchanges.'
    ]
};



export default function ProductDetail() {
    // Chọn ảnh
    const [selectedImage, setSelectedImage] = useState(0);
    // Chọn màu
    const [selectedColor, setSelectedColor] = useState(productDetail.colors[0]);
    // Chọn size
    const [selectedSize, setSelectedSize] = useState(productDetail.sizes[0]);

    const navigate = useNavigate();

    return (
        <div className={cx('wrapper')}>
            <div className={cx('product-images')}>
                <img
                    src={productDetail.imageSrc[selectedImage]}
                    alt={productDetail.name}
                    className={cx('main-image')}
                />
                <div className={cx('thumbnail-container')}>
                    {productDetail.imageSrc.map((src, index) => (
                        <img
                            key={index}
                            src={src}
                            alt={`${productDetail.name} thumbnail ${index + 1}`}
                            className={cx('thumbnail', { 'active': selectedImage === index })}
                            onClick={() => setSelectedImage(index)}
                        />
                    ))}
                </div>
            </div>
            <div className={cx('product-info')}>
                <span className={cx('status')}>{productDetail.status}</span>
                <h1 className={cx('product-name')}>{productDetail.name}</h1>
                <p className={cx('product-price')}>${productDetail.price.toFixed(2)}</p>

                <div className={cx('color-selection')}>
                    <p>COLOR</p>
                    <div className={cx('color-options')}>
                        {productDetail.colors.map((color) => (
                            <button
                                key={color}
                                className={cx('color-option', { 'active': selectedColor === color })}
                                style={{ backgroundColor: color.toLowerCase() }}
                                onClick={() => setSelectedColor(color)}
                            />
                        ))}
                    </div>
                </div>

                <div className={cx('size-selection')}>
                    <p>SIZE</p>
                    <div className={cx('size-options')}>
                        {productDetail.sizes.map((size) => (
                            <button
                                key={size}
                                className={cx('size-option', { 'active': selectedSize === size })}
                                onClick={() => setSelectedSize(size)}
                            >
                                {size}
                            </button>
                        ))}
                    </div>
                </div>

                <div className={cx('product-actions')}>
                    <div>
                        <button className={cx('add-to-cart')}>ADD TO CART</button>
                        <button className={cx('add-to-wishlist')}>♡</button>
                    </div>
                    <div>
                        <button 
                        className={cx('buy-now')}
                        onClick={() => 
                            navigate('/cart', {
                                state: {
                                    name: productDetail.name,
                                    size: selectedSize,
                                    color: selectedColor,
                                    price: productDetail.price,
                                    image: productDetail.imageSrc[0],
                                }
                            })
                        }
                        >BUY IT NOW</button>
                    </div>
                </div>

                <div className={cx('product-description')}>
                    <h2>ABOUT THE PRODUCT</h2>
                    <p>{productDetail.description}</p>
                    <ul>
                        {productDetail.additionalInfo.map((info, index) => (
                            <li key={index}>{info}</li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
}