import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import classNames from 'classnames/bind';
import styles from './productdetail.module.scss';
import { Api_Product } from '../../../apis/Api_Product'; // Assuming you have this API manager
import { useNavigate } from 'react-router-dom';
const cx = classNames.bind(styles);

export default function ProductDetail() {
    const navigate = useNavigate();
    const { id } = useParams(); // Get id from URL
    console.log('Product ID:', id); // Ensure `id` is correctly retrieved

    const [productDetail, setProductDetail] = useState(null);
    const [selectedImage, setSelectedImage] = useState(0);
    const [selectedColor, setSelectedColor] = useState('');
    const [selectedSize, setSelectedSize] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch product details from the API
    useEffect(() => {
        const fetchProductDetail = async () => {
            setLoading(true); // Start loading
            setError(null); // Reset error state

            try {
                console.log('Fetching product details for ID:', id); // Log ID
                const response = await Api_Product.getProductDetail(id); // Adjust your API call
                console.log('API Response:', response); // Log response data
                // If response is directly the product data
                if (response) {
                    console.log('Product Detail:', response); // Log the product details
                    console.log('Product Name:', response.productName);
                    console.log('Product Colors:', response.colors);
                    console.log('Product Sizes:', response.sizes);
                    setProductDetail(response);
                    // Ensure colors and sizes have data
                    if (response.colors && response.colors.length > 0) {
                        setSelectedColor(response.colors[0]);
                    }
                    if (response.sizes && response.sizes.length > 0) {
                        setSelectedSize(response.sizes[0]);
                    }
                } else {
                    setError('Product data not found.');
                }
            } catch (error) {
                console.error('Error fetching product detail:', error);
                setError('Error fetching product details.');
            } finally {
                setLoading(false); // End loading
            }
        };

        fetchProductDetail();
    }, [id]); // Depend on `id`, fetch again when `id` changes

    // Loading state
    if (loading) {
        return <div>Loading...</div>;
    }

    // Error state
    if (error) {
        return <div>Error: {error}</div>;
    }

    // No product data available
    if (!productDetail) {
        return <div>No product details available.</div>;
    }

    //

    const handleAddToCart = () => {
        if (!selectedSize || !selectedColor) {
            alert('Please select both size and color before adding to the cart.');
            return;
        }

        const newProduct = {
            productId: productDetail.productId,
            name: productDetail.productName,
            size: selectedSize.sizeName,
            color: selectedColor.colorName,
            price: productDetail.salePrice,
            image: productDetail.images[0],
            quantity: 1,
        };

        //tôi muốn in console để kiểm tra
        console.log('Product added to cart:', newProduct);

        // // Lấy giỏ hàng hiện tại từ sessionStorage
        // const currentCart = JSON.parse(sessionStorage.getItem('cart')) || [];

        // // Kiểm tra xem sản phẩm đã tồn tại trong giỏ chưa
        // const existingProductIndex = currentCart.findIndex(
        //     (item) =>
        //         item.productId === newProduct.productId &&
        //         item.size === newProduct.size &&
        //         item.color === newProduct.color,
        // );

        // if (existingProductIndex !== -1) {
        //     // Nếu sản phẩm đã tồn tại, tăng số lượng
        //     currentCart[existingProductIndex].quantity += 1;
        // } else {
        //     // Nếu sản phẩm chưa tồn tại, thêm vào giỏ
        //     currentCart.push(newProduct);
        // }

        // sessionStorage.setItem('cart', JSON.stringify(currentCart));

           // Lấy giỏ hàng hiện tại từ sessionStorage
    const existingCart = JSON.parse(sessionStorage.getItem('cart')) || [];
    const updatedCart = [...existingCart, newProduct];

    // Cập nhật giỏ hàng trong sessionStorage
    sessionStorage.setItem('cart', JSON.stringify(updatedCart));
        alert('Product added to cart!');

        // Điều hướng đến trang giỏ hàng
        navigate('/cart', {
            state: newProduct,
        });
    };

    return (
        <div className={cx('wrapper')}>
            <div className={cx('content-header')}>
                <div className={cx('product-images')}>
                    <img
                        src={productDetail.images[selectedImage]}
                        alt={productDetail.productName}
                        className={cx('main-image')}
                    />
                    <div className={cx('thumbnail-container')}>
                        {productDetail.images.map((src, index) => (
                            <img
                                key={index}
                                src={src}
                                alt={`${productDetail.productName} thumbnail ${index + 1}`}
                                className={cx('thumbnail', { active: selectedImage === index })}
                                onClick={() => setSelectedImage(index)}
                            />
                        ))}
                    </div>
                </div>

                <div className={cx('product-info')}>
                    <span className={cx('status')}>{productDetail.status}</span>
                    <h1 className={cx('product-name')}>{productDetail.productName}</h1>
                    <p className={cx('product-price')}>${productDetail.salePrice.toFixed(2)}</p>
                    <div className={cx('color-selection')}>
                        <p>COLOR</p>
                        <div className={cx('color-options')}>
                            {productDetail.colors &&
                                productDetail.colors.map((color, index) => (
                                    <button
                                        key={index} // Dùng `index` làm khóa nếu `color.colorId` bị trùng. Chỉ sử dụng khi chắc chắn rằng `index` là duy nhất trong danh sách.
                                        className={cx('color-option', { active: selectedColor === color.colorId })} // Kiểm tra `selectedColor`
                                        style={{ backgroundColor: color.colorName }}
                                        onClick={() => setSelectedColor(color.colorId)} // Cập nhật `selectedColor`
                                    >
                                        {/* Có thể thêm text hoặc icon nếu cần */}
                                    </button>
                                ))}
                        </div>
                    </div>

                    <div className={cx('size-selection')}>
                        <p>SIZE</p>
                        <div className={cx('size-options')}>
                            {productDetail.sizes &&
                                productDetail.sizes.map((size) => (
                                    <button
                                        key={size.sizeId}
                                        className={cx('size-option', { active: selectedSize === size })}
                                        onClick={() => setSelectedSize(size)}
                                    >
                                        {size.sizeName}
                                    </button>
                                ))}
                        </div>
                    </div>

                    <div className={cx('product-actions')}>
                        <button className={cx('add-to-cart')} onClick={handleAddToCart}>
                            ADD TO CART
                        </button>
                        <button className={cx('add-to-wishlist')}>♡</button>
                        <button
                            className={cx('buy-now')}
                            onClick={() => {
                                if (!selectedSize || !selectedColor) {
                                    alert('Please select both size and color before proceeding.');
                                    return;
                                }

                                navigate('/cart', {
                                    state: {
                                        productId: productDetail.productId, // ID của sản phẩm
                                        name: productDetail.productName, // Tên sản phẩm
                                        size: selectedSize.sizeName, // Tên size
                                        color: selectedColor.colorName, // Tên màu
                                        price: productDetail.salePrice, // Giá giảm
                                        image: productDetail.images[0], // Ảnh chính
                                    },
                                });
                            }}
                        >
                            BUY IT NOW
                        </button>
                    </div>

                    <div className={cx('product-description')}>
                        <h2>ABOUT THE PRODUCT</h2>
                        <p>{productDetail.description}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
