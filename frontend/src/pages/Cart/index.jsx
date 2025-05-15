import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import classNames from 'classnames/bind';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashCan } from '@fortawesome/free-regular-svg-icons';
import { ToastContainer, toast } from 'react-toastify'; // Added react-toastify
import 'react-toastify/dist/ReactToastify.css'; // Added toastify CSS
import ShoppingBag from '../../components/Cart/CartComponent';
import OrderSummary from '../../components/CartSummary/OrderSummary';
import styles from './Cart.module.scss';

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
            id: productData.id,
            image: productData.image,
            name: productData.name,
            color: productData.color,
            size: productData.size,
            price: parseFloat(productData.price),
            quantity: productData.quantity,
            maxQuantity: productData.maxQuantity
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

  // Kiểm tra xem tất cả sản phẩm có được chọn hay không
  const isAllSelected = data.length > 0 && checkedItems.length === data.length;

  // Xử lý chọn hoặc bỏ chọn tất cả
  const handleSelectAll = () => {
    if (isAllSelected) {
      // Bỏ chọn tất cả
      setCheckedItems([]);
      console.log('Deselected all items');
    } else {
      // Chọn tất cả
      setCheckedItems([...data]);
      console.log('Selected all items:', data);
    }
  };

  const handleCheckout = () => {
    console.log('Before navigating to CheckoutForm - checkedItems:', checkedItems);
    if (checkedItems.length === 0) {
      toast.error(
        <CustomToast
          message="Please select at least one product to proceed to checkout."
          type="error"
        />,
        { toastId: 'checkout-error' } // Added toastId to prevent duplicates
      );
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
    const product = data.find((p) => p.id === id && p.size === size);
    const maxQuantity = product?.maxQuantity || Infinity;
    if (newQuantity > maxQuantity) {
      toast.error(
        <CustomToast
          message={`Cannot increase quantity. Only ${maxQuantity} items available.`}
          type="error"
        />,
        { toastId: 'quantity-error' } // Added toastId to prevent duplicates
      );
      return;
    }

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
          <div className={cx('selectAllContainer')}>
            <label className={cx('selectAllLabel')}>
              <input
                type="checkbox"
                checked={isAllSelected}
                onChange={handleSelectAll}
                className={cx('selectAllCheckbox')}
              />
              <span>Select All</span>
            </label>
          </div>
        </header>
      </div>

      <div className={cx('container')}>
        <div className={cx('leftContainer')}>
          {data.length > 0 ? (
            data.map((product) => (
              <ShoppingBag
                key={`${product.id}-${product.size}-${product.color}`}
                image={product.image}
                name={product.name}
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
            handleCheckout={handleCheckout}
          />
        </div>
      </div>
    </div>
  );
}

export default Cart;