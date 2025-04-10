import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import classNames from 'classnames/bind';
import styles from './productdetail.module.scss';
import { Api_Product } from '../../../apis/Api_Product';
import { useAuth } from '../../hooks/useAuth';

const cx = classNames.bind(styles);

// Map color names to hex codes for display
const colorMap = {
  Red: '#FF0000',
  Blue: '#0000FF',
  Green: '#008000',
  Black: '#000000',
  White: '#FFFFFF',
  Gray: '#808080',
  Yellow: '#FFFF00',
  Pink: '#FFC0CB',
  Brown: '#A52A2A',
  Purple: '#800080',
};

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

  // Fetch product details
  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await Api_Product.getProductDetail(id);
        if (!data) throw new Error('Product not found');

        setProduct(data);

        // Extract unique colors and sizes from inventory
        const colors = [
          ...new Map(
            data.inventory
              .filter(item => item.numberOfProduct?.color)
              .map(item => [
                item.numberOfProduct.color._id,
                {
                  colorId: item.numberOfProduct.color._id,
                  colorName: item.numberOfProduct.color.colorName,
                },
              ]),
          ).values(),
        ];

        const sizes = [
          ...new Map(
            data.inventory
              .filter(item => item.numberOfProduct?.size)
              .map(item => [
                item.numberOfProduct.size._id,
                {
                  sizeId: item.numberOfProduct.size._id,
                  sizeName: item.numberOfProduct.size.nameSize,
                },
              ]),
          ).values(),
        ];

        setSelectedColor(colors[0] || null);
        setSelectedSize(sizes[0] || null);
      } catch (err) {
        console.error('Failed to fetch product:', err);
        setError(err.message || 'Error fetching product details');
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchProduct();
  }, [id]);

  // Loading and error states
  if (loading) return <div className="text-center py-10">Loading...</div>;
  if (error) return <div className="text-center text-red-500 py-10">Error: {error}</div>;
  if (!product) return <div className="text-center py-10">No product details available.</div>;

  // Extract images
  const images = product.image.map(img => img.imageID.URL);

  // Extract unique colors and sizes
  const uniqueColors = [
    ...new Map(
      product.inventory
        .filter(item => item.numberOfProduct?.color)
        .map(item => [
          item.numberOfProduct.color._id,
          {
            colorId: item.numberOfProduct.color._id,
            colorName: item.numberOfProduct.color.colorName,
          },
        ]),
    ).values(),
  ];

  const uniqueSizes = [
    ...new Map(
      product.inventory
        .filter(item => item.numberOfProduct?.size)
        .map(item => [
          item.numberOfProduct.size._id,
          {
            sizeId: item.numberOfProduct.size._id,
            sizeName: item.numberOfProduct.size.nameSize,
          },
        ]),
    ).values(),
  ];

  // Add to cart handler
  const handleAddToCart = () => {
    if (!isLoggedIn) {
      alert('Please login to add product to cart');
      return navigate('/login');
    }

    if (!selectedColor || !selectedSize) {
      alert('Please select a color and size');
      return;
    }

    const cartItem = {
      productId: product._id,
      name: product.productName,
      color: selectedColor.colorName,
      size: selectedSize.sizeName,
      price: product.sellingPrice,
      image: images[0],
      quantity: 1,
    };

    console.log('Adding to cart:', cartItem);

    const cart = JSON.parse(sessionStorage.getItem('cart')) || [];
    const existingIndex = cart.findIndex(
      item =>
        item.productId === cartItem.productId &&
        item.color === cartItem.color &&
        item.size === cartItem.size,
    );

    if (existingIndex >= 0) {
      cart[existingIndex].quantity += 1;
    } else {
      cart.push(cartItem);
    }

    sessionStorage.setItem('cart', JSON.stringify(cart));
    alert('Product added to cart!');
  };

  // Buy now handler
  const handleBuyNow = () => {
    if (!selectedColor || !selectedSize) {
      alert('Please select a color and size');
      return;
    }

    const cartItem = {
      productId: product._id,
      name: product.productName,
      color: selectedColor.colorName,
      size: selectedSize.sizeName,
      price: product.sellingPrice,
      image: images[0],
      quantity: 1,
    };

    console.log('Buying now:', cartItem);

    const cart = JSON.parse(sessionStorage.getItem('cart')) || [];
    const existingIndex = cart.findIndex(
      item =>
        item.productId === cartItem.productId &&
        item.color === cartItem.color &&
        item.size === cartItem.size,
    );

    if (existingIndex >= 0) {
      cart[existingIndex].quantity += 1;
    } else {
      cart.push(cartItem);
    }

    sessionStorage.setItem('cart', JSON.stringify(cart));
    navigate('/cart', { state: cartItem });
  };

  return (
    <div className={cx('wrapper')}>
      <div className={cx('content-header')}>
        {/* Product Images */}
        <div className={cx('product-images')}>
          <img
            src={images[selectedImageIndex]}
            alt={product.productName}
            className={cx('main-image')}
          />
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
          <span className={cx('status')}>
            {product.status ? 'In Stock' : 'Out of Stock'}
          </span>
          <h1 className={cx('product-name')}>{product.productName}</h1>
          <p className={cx('product-price')}>
            ${(product.sellingPrice / 1000).toFixed(2)} {/* Giả định VND */}
          </p>

          {/* Color Selection */}
          <div className={cx('color-selection')}>
            <p>COLOR</p>
            <div className={cx('color-options')}>
              {uniqueColors.map(color => (
                <button
                  key={color.colorId}
                  className={cx('color-option', {
                    active: selectedColor?.colorId === color.colorId,
                  })}
                  style={{ backgroundColor: colorMap[color.colorName] || '#000' }}
                  onClick={() => setSelectedColor(color)}
                />
              ))}
            </div>
          </div>

          {/* Size Selection */}
          <div className={cx('size-selection')}>
            <p>SIZE</p>
            <div className={cx('size-options')}>
              {uniqueSizes.map(size => (
                <button
                  key={size.sizeId}
                  className={cx('size-option', {
                    active: selectedSize?.sizeId === size.sizeId,
                  })}
                  onClick={() => setSelectedSize(size)}
                >
                  {size.sizeName}
                </button>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className={cx('product-actions')}>
            <button className={cx('add-to-cart')} onClick={handleAddToCart}>
              ADD TO CART
            </button>
            <button className={cx('add-to-wishlist')}>♡</button>
            <button className={cx('buy-now')} onClick={handleBuyNow}>
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