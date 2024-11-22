import React, { useState, useEffect } from 'react';
import classNames from 'classnames/bind';
import styles from './AllProduct.module.scss';
import { useNavigate } from 'react-router-dom';
import { Api_Product } from "../../../../apis/Api_Product";

const cx = classNames.bind(styles);

const AllProduct = () => {
    // const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [products, setProducts] = useState([]);
    const [selectedImage, setSelectedImage] = useState(0);


    // Fetch products on mount
    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await Api_Product.getAllProducts();
                if (response) {
                    setProducts(response);
                    console.log("Đây là response", response);
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
                <button className={cx('add-product')}>Add New Product</button>
            </div>
            <div className={cx('product-list')}>
                {products.map((product) => (
                    <div key={product.productId} className={cx('product-card')}>
                        {/* Display first image from the array or a default image */}
                        <img
                            src={product.images && product.images.length > 0 ? product.images[0] : '/default-image.png'}
                            alt={product.productName}
                            className={cx('product-image')}
                        />
                        <h2>{product.productName}</h2>
                        <p className={cx('brand')}>{product.brandName}</p>
                        {/* <p className={cx('category')}>{product.categoryName}</p> */}
                        <p className={cx('price')}>${product.finalPrice.toFixed(2)}</p>
                        <p className={cx('description')}>{product.description}</p>

                        <div className={cx('stats')}>
                            <div>
                                <p>Sales</p>
                                {/* <p>${product.salePrice.toFixed(2)}</p> Show sale price */}
                                <p>{product.quantity}</p> {/* Show quantity */}
                            </div>
                            <div>
                                <p>Remaining Products</p>
                                <p>{product.quantity}</p> {/* Show quantity */}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AllProduct;
