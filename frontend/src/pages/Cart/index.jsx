import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import classNames from 'classnames/bind';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashCan } from '@fortawesome/free-regular-svg-icons';
import productImage from '../../assets/images/Product01.png';
import ShoppingBag from '../../components/Cart/CartComponent';
import OrderSummary from '../../components/CartSummary/OrderSummary';
import styles from './Cart.module.scss';

const cx = classNames.bind(styles);

function Cart() {
  const location = useLocation();
  const productData = location.state;
  const navigate = useNavigate();

  const [data, setData] = useState(() => {
    const savedCart = JSON.parse(sessionStorage.getItem('cart')) || [];
    return savedCart.length > 0
      ? savedCart
      : productData
      ? [
          {
            id: productData.productId,
            image: productData.image,
            name: productData.name,
            color: productData.color,
            size: productData.size,
            price: parseFloat(productData.price),
            quantity: productData.quantity,
          },
        ]
      : [];
  });

  useEffect(() => {
    sessionStorage.setItem('cart', JSON.stringify(data));
  }, [data]);

  const [checkedItems, setCheckedItems] = useState([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const deliveryFee = 0;

  useEffect(() => {
    const newTotalProducts = checkedItems.length;
    const newTotalAmount = checkedItems.reduce(
      (acc, product) => acc + product.price * product.quantity,
      0
    );
    setTotalProducts(newTotalProducts);
    setTotalAmount(newTotalAmount);
    console.log('Checked items updated:', checkedItems);
    console.log('Total products:', newTotalProducts, 'Total amount:', newTotalAmount);
  }, [checkedItems]);

  const handleCheckout = () => {
    console.log('Before navigating to CheckoutForm - checkedItems:', checkedItems);
    if (checkedItems.length === 0) {
      alert('Please select at least one product to proceed to checkout.');
      return;
    }
    navigate('/checkout', {
      state: { cartData: data, itemCount: totalProducts, totalAmount, checkedItems, deliveryFee },
    });
  };

  const handleRemove = (id, color, size) => {
    const updatedData = data.filter(
      (product) => product.id !== id || product.color !== color || product.size !== size
    );
    setData(updatedData);
    setCheckedItems((prev) =>
      prev.filter(
        (item) => item.id !== id || item.color !== color || item.size !== size
      )
    );
    sessionStorage.setItem('cart', JSON.stringify(updatedData));
  };

  const handleQuantityChange = (id, size, newQuantity) => {
    const updatedData = data.map((product) =>
      product.id === id && product.size === size
        ? { ...product, quantity: newQuantity }
        : product
    );
    setData(updatedData);
    setCheckedItems((prev) =>
      prev.map((item) =>
        item.id === id && item.size === size ? { ...item, quantity: newQuantity } : item
      )
    );
    sessionStorage.setItem('cart', JSON.stringify(updatedData));
  };

  const handleCheckboxChange = (isChecked, product) => {
    setCheckedItems((prev) => {
      if (isChecked) {
        const newCheckedItems = [...prev, product];
        console.log('Added product to checkedItems:', product);
        return newCheckedItems;
      } else {
        const newCheckedItems = prev.filter(
          (item) =>
            item.id !== product.id ||
            item.size !== product.size ||
            item.color !== product.color
        );
        console.log('Removed product from checkedItems:', product);
        return newCheckedItems;
      }
    });
  };

  const isProductChecked = (product) => {
    return checkedItems.some(
      (item) =>
        item.id === product.id &&
        item.size === product.size &&
        item.color === product.color
    );
  };

  const [isCheckoutVisible, setCheckoutVisible] = useState(true);
  const toggleCheckoutVisibility = () => {
    setCheckoutVisible((prev) => !prev);
  };

  return (
    <div className={cx('wrapper')}>
      <div className={cx('promotion')}>
        <h2>Saving to celebrate</h2>
        <p>
          Enjoy up to 60% off thousands of styles during the End of Year sale - while supplies last. No code needed.
        </p>
        <div className={cx('links')}>
          <a href="/join">Join us</a> or <a href="/signin">Sign-in</a>
        </div>
      </div>
      <div className={cx('bagContainer')}>
        <header className={cx('headerContainer')}>
          <h1 className={cx('bagTitle')}>Your Bag</h1>
          <p className={cx('bagDescription')}>
            Items in your bag not reserved - check out now to make them yours.
          </p>
        </header>
      </div>

      <div className={cx('container')}>
        <div className={cx('leftContainer')}>
          {data.length > 0 ? (
            data.map((product) => (
              <ShoppingBag
                key={`${product.id}-${product.size}-${product.color}`}
                image={product.image || productImage}
                name={product.name || 'Null'}
                color={product.color}
                size={product.size}
                price={product.price}
                initialQuantity={product.quantity}
                onRemove={() => handleRemove(product.id, product.color, product.size)}
                onQuantityChange={(newQuantity) =>
                  handleQuantityChange(product.id, product.size, newQuantity)
                }
                removeIcon={faTrashCan}
                allowQuantityChange={true}
                onCheckboxChange={handleCheckboxChange}
                product={product}
                isChecked={isProductChecked(product)}
              />
            ))
          ) : (
            <p className={cx('empty-message')}>No products</p>
          )}
        </div>
        <div className={cx('rightContainer')}>
          <OrderSummary
            itemCount={totalProducts}
            totalAmount={totalAmount}
            deliveryFee={deliveryFee}
            cartData={data}
            checkedItems={checkedItems}
            isCheckoutVisible={isCheckoutVisible}
            toggleCheckoutVisibility={toggleCheckoutVisibility}
            handleCheckout={handleCheckout} // Truyền handleCheckout từ Cart
          />
        </div>
      </div>
    </div>
  );
}

export default Cart;