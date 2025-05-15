import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import classNames from 'classnames/bind';
import { ToastContainer, toast } from 'react-toastify'; // Added react-toastify
import 'react-toastify/dist/ReactToastify.css'; // Added toastify CSS
import styles from './productdetail.module.scss';
import { Api_Product } from '../../../apis/Api_Product';
import { useAuth } from '../../hooks/useAuth';

const cx = classNames.bind(styles);

// Custom toast component for consistent styling
const CustomToast = ({ message, type }) => (
  <div className={cx('custom-toast', type)}>
    <span className={cx('toast-icon')}>
      {type === 'success' ? '✅' : '❌'}
    </span>
    <span className={cx('toast-message')}>{message}</span>
  </div>
);

const ProductDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { isLoggedIn } = useAuth();

    const [product, setProduct] = useState(null);
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const [selectedColor, setSelectedColor] = useState(null);
    const [selectedSize, setSelectedSize] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [availableQuantities, setAvailableQuantities] = useState({});
    const [uniqueColors, setUniqueColors] = useState([]);
    const [uniqueSizes, setUniqueSizes] = useState([]);

    // Fetch product details
    useEffect(() => {
        const fetchProduct = async () => {
            setLoading(true);
            setError(null);

            try {
                const response = await Api_Product.getProductDetail(id);
                const data = response.data;

                if (!data) throw new Error('Product not found');

                setProduct(data);
                console.log('Product data:', data);

                // Initialize available quantities
                const initialQuantities = {};
                data.inventory.forEach((item) => {
                    const colorId = item?.numberOfProduct?.color?._id;
                    const sizeId = item?.numberOfProduct?.size?._id;
                    if (colorId && sizeId) {
                        initialQuantities[`${colorId}-${sizeId}`] = item?.numberOfProduct?.quantity || 0;
                    }
                });
                setAvailableQuantities(initialQuantities);

                // Extract unique colors and sizes
                const colors = new Map();
                const sizes = new Map();
                data.inventory.forEach((item) => {
                    const color = item?.numberOfProduct?.color;
                    if (color && !colors.has(color._id)) {
                        colors.set(color._id, color);
                    }
                    const size = item?.numberOfProduct?.size;
                    if (size && !sizes.has(size._id)) {
                        sizes.set(size._id, size);
                    }
                });
                setUniqueColors([...colors.values()]);
                setUniqueSizes([...sizes.values()]);

                // Set initial selected color and size if available
                if (data.inventory.length > 0) {
                    setSelectedColor(data.inventory[0]?.numberOfProduct?.color || null);
                    setSelectedSize(data.inventory[0]?.numberOfProduct?.size || null);
                }
            } catch (err) {
                console.error('Failed to fetch product:', err);
                // setError(err.message || 'Error fetching product details');
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchProduct();
    }, [id]);

    // Update available quantity when color or size changes
    useEffect(() => {
        if (product && selectedColor && selectedSize) {
            const key = `${selectedColor._id}-${selectedSize._id}`;
            const quantity = availableQuantities[key] || 0;
            console.log(
                `Available quantity for color ${selectedColor?.colorName}, size ${selectedSize?.nameSize}: ${quantity}`,
            );
        }
    }, [selectedColor, selectedSize, availableQuantities, product]);

    // Loading and error states
    if (loading) return <div className="text-center py-10">Loading...</div>;
    if (error) return <div className="text-center text-red-500 py-10">Error: {error}</div>;
    if (!product) return <div className="text-center py-10">No product details available.</div>;

    // Extract images
    const images = product.image?.map((img) => img?.imageID?.URL) || [];

    // Add to cart handler
    const handleAddToCart = () => {
        if (!isLoggedIn) {
            toast.error(
                <CustomToast message="Please login to add product to cart" type="error" />,
                { toastId: 'login-error-cart' }
            );
            // Modified: Added delay to show toast before redirecting
            setTimeout(() => navigate('/login'), 3000);
            return;
        }

        if (!selectedColor || !selectedSize) {
            toast.error(
                <CustomToast message="Please select a color and size" type="error" />,
                { toastId: 'selection-error-cart' }
            );
            return;
        }

        const key = `${selectedColor._id}-${selectedSize._id}`;
        const currentQuantity = availableQuantities[key] || 0;
        if (currentQuantity <= 0) {
            toast.error(
                <CustomToast message="This color and size is currently out of stock." type="error" />,
                { toastId: 'stock-error-cart' }
            );
            return;
        }

        const cart = JSON.parse(sessionStorage.getItem('cart')) || [];
        const existingItem = cart.find(
            (item) => item.id === product._id && item.color === selectedColor.colorName && item.size === selectedSize.nameSize
        );

        const requestedQuantity = (existingItem ? existingItem.quantity : 0) + 1;
        if (requestedQuantity > currentQuantity) {
            toast.error(
                <CustomToast
                    message={`Cannot add to cart. Only ${currentQuantity} items available for this color and size.`}
                    type="error"
                />,
                { toastId: 'quantity-error-cart' }
            );
            return;
        }

        const cartItem = {
            id: product._id,
            name: product.productName,
            color: selectedColor.colorName,
            size: selectedSize.nameSize,
            price: product.sellingPrice,
            image: images[0],
            quantity: 1,
            maxQuantity: currentQuantity
        };

        console.log('Adding to cart:', cartItem);

        const existingIndex = cart.findIndex(
            (item) => item.id === cartItem.id && item.color === cartItem.color && item.size === cartItem.size
        );

        if (existingIndex >= 0) {
            cart[existingIndex].quantity += 1;
        } else {
            cart.push(cartItem);
        }

        sessionStorage.setItem('cart', JSON.stringify(cart));
        toast.success(
            <CustomToast message="Product added to cart!" type="success" />,
            { toastId: 'success-cart' }
        );
    };

    // Buy now handler
    const handleBuyNow = () => {
        if (!isLoggedIn) {
            toast.error(
                <CustomToast message="Please login to Buy" type="error" />,
                { toastId: 'login-error-buy' }
            );
            // Modified: Added delay to show toast before redirecting
            setTimeout(() => navigate('/login'), 3000);
            return;
        }

        if (!selectedColor || !selectedSize) {
            toast.error(
                <CustomToast message="Please select a color and size" type="error" />,
                { toastId: 'selection-error-buy' }
            );
            return;
        }

        const key = `${selectedColor._id}-${selectedSize._id}`;
        const currentQuantity = availableQuantities[key] || 0;
        if (currentQuantity <= 0) {
            toast.error(
                <CustomToast message="This color and size is currently out of stock." type="error" />,
                { toastId: 'stock-error-buy' }
            );
            return;
        }

        const cart = JSON.parse(sessionStorage.getItem('cart')) || [];
        const existingItem = cart.find(
            (item) => item.id === product._id && item.color === selectedColor.colorName && item.size === selectedSize.nameSize
        );

        const requestedQuantity = (existingItem ? existingItem.quantity : 0) + 1;
        if (requestedQuantity > currentQuantity) {
            toast.error(
                <CustomToast
                    message={`Cannot proceed. Only ${currentQuantity} items available for this color and size.`}
                    type="error"
                />,
                { toastId: 'quantity-error-buy' }
            );
            return;
        }

        const cartItem = {
            id: product._id,
            name: product.productName,
            color: selectedColor.colorName,
            size: selectedSize.nameSize,
            price: product.sellingPrice,
            image: images[0],
            quantity: 1,
            maxQuantity: currentQuantity
        };

        console.log('Buying now:', cartItem);

        const existingIndex = cart.findIndex(
            (item) => item.id === cartItem.id && item.color === cartItem.color && item.size === cartItem.size
        );

        if (existingIndex >= 0) {
            cart[existingIndex].quantity += 1;
        } else {
            cart.push(cartItem);
        }

        sessionStorage.setItem('cart', JSON.stringify(cart));
        navigate('/cart', { state: cartItem });
    };

    const handleColorSelect = (color) => {
        setSelectedColor(color);
        if (
            selectedSize &&
            !product.inventory.some(
                (item) =>
                    item?.numberOfProduct?.color?._id === color._id &&
                    item?.numberOfProduct?.size?._id === selectedSize._id
            )
        ) {
            setSelectedSize(null);
        }
    };

    const handleSizeSelect = (size) => {
        console.log('handleSizeSelect called with:', size);
        setSelectedSize(size);
        if (
            selectedColor &&
            !product.inventory.some(
                (item) =>
                    item?.numberOfProduct?.color?._id === selectedColor._id &&
                    item?.numberOfProduct?.size?._id === size._id
            )
        ) {
            setSelectedColor(null);
        }
    };

    const getAvailableQuantity = () => {
        if (selectedColor && selectedSize) {
            const key = `${selectedColor._id}-${selectedSize._id}`;
            return availableQuantities[key] || 0;
        }
        return 0;
    };

    return (
        <div className={cx('wrapper')}>
            <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
            /> {/* Added ToastContainer for toast notifications */}
            <div className={cx('content-header')}>
                {/* Product Images */}
                <div className={cx('product-images')}>
                    {images.length > 0 && (
                        <img src={images[selectedImageIndex]} alt={product.productName} className={cx('main-image')} />
                    )}
                    <div className={cx('thumbnail-container')}>
                        {images.map((src, index) => (
                            <img
                                key={index}
                                src={src}
                                alt={`${product.productName} thumbnail ${index + 1}`}
                                className={cx('thumbnail', { active: selectedImageIndex === index })}
                                onClick={() => setSelectedImageIndex(index)}
                            />
                        ))}
                    </div>
                </div>

                {/* Product Info */}
                <div className={cx('product-info')}>
                    <span className={cx('status')}>{product.status ? 'In Stock' : 'Out of Stock'}</span>
                    <h1 className={cx('product-name')}>{product.productName}</h1>
                    <p className={cx('product-price')}>$ {product.sellingPrice.toFixed(2)}</p>

                    {/* Color Selection */}
                    {uniqueColors.length > 0 && (
                        <div className={cx('color-selection')}>
                            <p>COLOR</p>
                            <div className={cx('color-options')}>
                                {uniqueColors.map((color) => (
                                    <button
                                        key={color._id}
                                        className={cx('color-option', {
                                            active: selectedColor?._id === color._id,
                                        })}
                                        style={{ backgroundColor: color.hex || '#000' }}
                                        onClick={() => handleColorSelect(color)}
                                    />
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Size Selection */}
                    {uniqueSizes.length > 0 && (
                        <div className={cx('size-selection')}>
                            <p>SIZE</p>
                            <div className={cx('size-options')}>
                                {uniqueSizes.map((size) => (
                                    <button
                                        key={size._id}
                                        className={cx('size-option', {
                                            active: selectedSize?._id === size._id,
                                        })}
                                        onClick={() => handleSizeSelect(size)}
                                    >
                                        {size.nameSize}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Available Quantity */}
                    {selectedColor && selectedSize && (
                        <p className={cx('available-quantity')}>Available: {getAvailableQuantity()}</p>
                    )}

                    {/* Actions */}
                    <div className={cx('product-actions')}>
                        <button
                            className={cx('add-to-cart')}
                            onClick={handleAddToCart}
                            disabled={!selectedColor || !selectedSize || getAvailableQuantity() <= 0}
                        >
                            ADD TO CART
                        </button>
                        <button className={cx('add-to-wishlist')}>♡</button>
                        <button
                            className={cx('buy-now')}
                            onClick={handleBuyNow}
                            disabled={!selectedColor || !selectedSize || getAvailableQuantity() <= 0}
                        >
                            BUY IT NOW
                        </button>
                    </div>

                    {/* Description */}
                    <div className={cx('product-description')}>
                        <h2>ABOUT THE PRODUCT</h2>
                        <p>{product.description || 'No description available'}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;