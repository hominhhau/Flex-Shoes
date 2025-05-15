import React, { useState, useEffect } from 'react';
import classNames from 'classnames/bind';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styles from './CartComponent.module.scss';

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

const ShoppingBag = ({
  image,
  name,
  color,
  size,
  initialQuantity = 1,
  price,
  removeIcon,
  onRemove,
  onQuantityChange,
  onCheckboxChange,
  allowQuantityChange = true,
  product,
  isChecked = false,
}) => {
  const [quantity, setQuantity] = useState(initialQuantity);

  useEffect(() => {
    setQuantity(initialQuantity);
  }, [initialQuantity]);

  const totalPrice = (price * quantity).toFixed(2);

  const increaseQuantity = () => {
    setQuantity((prev) => {
      const maxQuantity = product.maxQuantity || Infinity;
      const newQuantity = prev + 1;
      if (newQuantity > maxQuantity) {
        toast.error(
          <CustomToast
            message={`Cannot increase quantity. Only ${maxQuantity} items available.`}
            type="error"
          />,
          { toastId: 'quantity-error' }
        );
        return prev;
      }
      onQuantityChange(newQuantity);
      return newQuantity;
    });
  };

  const decreaseQuantity = () => {
    setQuantity((prev) => {
      const newQuantity = Math.max(prev - 1, 1);
      onQuantityChange(newQuantity);
      return newQuantity;
    });
  };

  // Handle manual quantity input
  const handleQuantityInput = (e) => {
    const value = e.target.value;
    const maxQuantity = product.maxQuantity || Infinity;

    // Allow empty input temporarily for user convenience
    if (value === '') {
      setQuantity('');
      return;
    }

    const newQuantity = parseInt(value, 10);
    if (isNaN(newQuantity)) {
      toast.error(
        <CustomToast message="Please enter a valid number" type="error" />,
        { toastId: 'invalid-quantity' }
      );
      setQuantity(initialQuantity);
      return;
    }

    if (newQuantity < 1) {
      toast.error(
        <CustomToast message="Quantity must be at least 1" type="error" />,
        { toastId: 'min-quantity' }
      );
      setQuantity(1);
      onQuantityChange(1);
      return;
    }

    if (newQuantity > maxQuantity) {
      toast.error(
        <CustomToast
          message={`Cannot set quantity. Only ${maxQuantity} items available.`}
          type="error"
        />,
        { toastId: 'max-quantity' }
      );
      setQuantity(maxQuantity);
      onQuantityChange(maxQuantity);
      return;
    }

    setQuantity(newQuantity);
    onQuantityChange(newQuantity);
  };

  const handleCheckboxChange = () => {
    console.log("Checkbox changed for product:", product, "New state:", !isChecked);
    onCheckboxChange(!isChecked, product);
  };

  return (
    <main className={cx('bagContainer')}>
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
      />
      <section className={cx('productContainer')}>
        <div className={cx('checkboxContainer')}>
          <label>
            <input
              type="checkbox"
              checked={isChecked}
              onChange={handleCheckboxChange}
              className={cx('checkbox')}
            />
            <span className={cx('checkboxLabel')}></span>
          </label>
        </div>
        <img loading="lazy" src={image} alt={name} className={cx('productImage')} />

        <article className={cx('productDetailsContainer')}>
          <div className={cx('productInfoWrapper')}>
            <div className={cx('productInfo')}>
              <h2 className={cx('productName')}>{name}</h2>
              <div className={cx('productMetaContainer')}>
                <div className={cx('colorContainer')}>
                  <label htmlFor="color" className={cx('colorLabel')}>
                    Color
                  </label>
                  <span className={cx('colorText')}>{color}</span>
                </div>
                <div className={cx('colorSwatch')} style={{ backgroundColor: color }}></div>
              </div>

              <div className={cx('productOptionsContainer')}>
                <div className={cx('sizeContainer')}>
                  <label htmlFor="size" className={cx('sizeLabel')}>
                    Size
                  </label>
                  <span className={cx('sizeText')}>{size}</span>
                </div>

                <div className={cx('quantityContainer')}>
                  <label className={cx('quantityLabel')}>Quantity</label>
                  <div className={cx('quantityControl')}>
                    {allowQuantityChange ? (
                      <>
                        <button onClick={decreaseQuantity} className={cx('quantityButton')}>
                          -
                        </button>
                        <input
                          type="number"
                          className={cx('quantityInput')}
                          value={quantity}
                          onChange={handleQuantityInput}
                          min="1"
                          max={product.maxQuantity || undefined}
                          step="1"
                        />
                        <button
                          onClick={increaseQuantity}
                          className={cx('quantityButton')}
                          disabled={quantity >= (product.maxQuantity || Infinity)}
                        >
                          +
                        </button>
                      </>
                    ) : (
                      <span className={cx('quantityText')}>{quantity}</span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <p className={cx('price')}>${totalPrice}</p>
          </div>

          {/* Modified: Conditionally render remove button only if removeIcon is provided */}
          {removeIcon && (
            <div className={cx('actionButtonsContainer')}>
              <button className={cx('actionButton')} onClick={onRemove}>
                <FontAwesomeIcon icon={removeIcon} size="2x" />
              </button>
            </div>
          )}
        </article>
      </section>
    </main>
  );
};

export default ShoppingBag;