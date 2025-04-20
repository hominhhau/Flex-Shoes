import React, { useState, useEffect } from 'react';
import classNames from 'classnames/bind';
import styles from './AllProduct.module.scss';
import { Api_Inventory } from '../../../../apis/Api_Inventory';
import { useNavigate } from 'react-router-dom';
import config from '../../../config';

const cx = classNames.bind(styles);

// Hàm giới hạn số từ
const limitWords = (text, maxWords) => {
    if (!text || typeof text !== 'string') return '';
    const words = text.split(' ');
    if (words.length <= maxWords) return text;
    return words.slice(0, maxWords).join(' ') + '...';
};

const AllProduct = () => {
    const navigator = useNavigate();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [products, setProducts] = useState([]);

    // Fetch products on mount
    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await Api_Inventory.getAllProducts();
                setProducts(response || []);
                console.log('Product Data:', response);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    if (!products || products.length === 0) {
        return <div>No products available.</div>;
    }

    return (
        <div className={cx('wrapper')}>
            <div className={cx('header')}>
                <h1>All Products</h1>
                <button
                    className={cx('add-product')}
                    onClick={() => {
                        navigator(config.routes.addNewProduct);
                    }}
                >
                    Add New Product
                </button>
            </div>
            <div className={cx('product-list')}>
                {products.map((product) => (
                    <div
                        key={product._id}
                        onClick={() => {
                            navigator(config.routes.ProductDetails, { state: { productId: product._id } });
                        }}
                        className={cx('product-card')}
                    >
                        <div className={cx('product-info')}>
                            <img
                                src={product?.image?.[0]?.imageID?.URL || '/default-image.png'}
                                alt={product.productName}
                                className={cx('product-image')}
                            />
                            <div className={cx('product-details')}>
                                <h2>{product.productName}</h2>
                                <p className={cx('price')}>${product.sellingPrice.toFixed(2)}</p>
                            </div>
                        </div>
                        <div>
                            <p className={cx('summary')}>Summary</p>
                            <p className={cx('description')}>
                                {limitWords(product.description, 20)} {/* Giới hạn 20 từ */}
                            </p>
                        </div>
                        <div className={cx('stats')}>
                            <div className={cx('stat-item')}>
                                <p>Total Quantity</p>
                                <p>{product.totalQuantity}</p>
                            </div>
                            <div className={cx('stat-item')}>
                                <p>Status</p>
                                <p>{product.status}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AllProduct;
