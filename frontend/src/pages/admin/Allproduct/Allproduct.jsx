import React, { useState, useEffect } from 'react';
import classNames from 'classnames/bind';
import styles from './AllProduct.module.scss';
import { Api_Product } from '../../../../apis/Api_Product';
import { useNavigate } from 'react-router-dom';
import config from '../../../config';
const cx = classNames.bind(styles);

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
                const response = await Api_Product.getAllProducts();
                if (response) {
                    setProducts(response);
                    console.log('Product Data:', response);
                }
            } catch (error) {
                setError(error.message); // Handle any errors from the API call
            } finally {
                setLoading(false); // Set loading to false once data is fetched
            }
        };

        fetchProducts();
    }, []); // Empty dependency array ensures this effect runs only once on mount

    // Display loading message while fetching data
    if (loading) {
        return <div>Loading...</div>;
    }

    // Display error message if API call fails
    if (error) {
        return <div>Error: {error}</div>;
    }

    // Display message if no products are found
    if (!products || products.length === 0) {
        return <div>No products available.</div>;
    }

    return (
        <div className={cx('wrapper')}>
            <div className={cx('header')}>
                <h1>All Products</h1>
                <button className={cx('add-product')}
                onClick={() => {
                    navigator(config.routes.addNewProduct);
                }
                }
                >Add New Product</button>
            </div>
            <div className={cx('product-list')}>
                {products.map((product) => (
                    <div key={product.productId} onClick={
                        () => {
                            navigator(config.routes.ProductDetails , { state: { productId: product.productId } });
                        }
                    } className={cx('product-card')}>
                        <div className={cx('product-info')}>
                            <img
                                src={
                                    product.images && product.images.length > 0
                                        ? product.images[0]
                                        : '/default-image.png'
                                }
                                alt={product.productName}
                                className={cx('product-image')}
                            />
                            <div className={cx('product-details')}>
                                <h2>{product.productName}</h2>
                                <p className={cx('price')}>${product.finalPrice.toFixed(2)}</p>
                            </div>
                        </div>
                        <div>
                            <p className={cx('summary')}>Summary</p>
                            <p className={cx('description')}>{product.description}</p>
                        </div>
                        {/* <div className={cx('stats')}>
                            <div className={cx('stat-item')}>
                                <p>Sales</p>
                                <p>{product.quantity}</p>
                            </div>
                            <div className={cx('stat-item')}>
                                <p>Remaining Products</p>
                                <p>{product.quantity}</p>
                            </div>
                        </div> */}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AllProduct;
