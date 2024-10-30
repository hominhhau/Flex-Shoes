import React, { useState } from 'react';
import classNames from 'classnames/bind';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashCan } from '@fortawesome/free-regular-svg-icons';
import productImage from '../../assets/images/Product01.png';
import ShoppingBag from '../../components/Cart/CartComponent';

import OrderSummary from '../../components/CartSummary/OrderSummary';
import styles from './Cart.module.scss';
const cx = classNames.bind(styles);

function Cart() {
  const [data, setData] = useState([
    {
      id: 1,
      image: productImage,
      name: 'Product 01',
      category: 'Category',
      color: 'Red',
      sizeOptions: ['39', '40', '41', '42', '43', '44', '45', '46', '47'],
      price: 100.00,
      quantity: 1,
    },
    {
      id: 2,
      image: productImage,
      name: 'Product 02',
      category: 'Category',
      color: 'Red',
      sizeOptions: ['39', '40', '41', '42', '43', '44', '45', '46', '47'],
      price: 300.00,
      quantity: 1,
    },
    {
      id: 3,
      image: productImage,
      name: 'Product 03',
      category: 'Category',
      color: 'Red',
      sizeOptions: ['39', '40', '41', '42', '43', '44', '45', '46', '47'],
      price: 400.00,
      quantity: 1,
    },
    {
      id: 4,
      image: productImage,
      name: 'Product 04',
      category: 'Category',
      color: 'Red',
      sizeOptions: ['39', '40', '41', '42', '43', '44', '45', '46', '47'],
      price: 500.00,
      quantity: 1,
    },
    {
      id: 5,
      image: productImage,
      name: 'Product 05',
      category: 'Category',
      color: 'Red',
      sizeOptions: ['39', '40', '41', '42', '43', '44', '45', '46', '47'],
      price: 600.00,
      quantity: 1,
    },
    {
      id: 6,
      image: productImage,
      name: 'Product 06',
      category: 'Category',
      color: 'Red',
      sizeOptions: ['39', '40', '41', '42', '43', '44', '45', '46', '47'],
      price: 700.00,
      quantity: 1,
    },

  ])
  
    
    const handleRemove = () => {
        console.log("xóa");
    };

    const handleQuantityChange = (id, newQuantity) => {
      setData(data.map(product => 
        product.id === id ? { ...product, quantity: newQuantity } : product
      ));
    };

    const totalProducts = data.length;
    console.log("Tổng số sản phẩm: " + totalProducts);

    const totalAmount = data.reduce((acc, product) => acc + (product.price * product.quantity), 0);
    const deliveryFee = 6.99; 

    const [isCheckoutVisible, setCheckoutVisible] = useState(true); 

    const toggleCheckoutVisibility = () => {
        setCheckoutVisible(prev => !prev); 
    };


    return (
        <div className={cx('wrapper')}>
            <div className={cx('promotion')}>
                <h2>Saving to celebrate</h2>
                <p>
                    Enjoy up to 60% off thousands of styles during the End of Year sale - while supplies last. No code
                    needed.
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
                    {data.map((product) => (
                      <ShoppingBag
                      key={product.id}
                      image={product.image}
                      name={product.name}
                      category={product.category}
                      color={product.color}
                      sizeOptions={product.sizeOptions}
                      price={product.price}
                      quantity={product.quantity} 
                      onRemove={handleRemove}
                      onQuantityChange={(newQuantity) => handleQuantityChange(product.id, newQuantity)}
                      removeIcon={faTrashCan}
                      allowQuantityChange={true}
                      allowSizeChange={true}
                      />
                    ))}
                </div>
                <div className={cx('rightContainer')}>
                    <OrderSummary
                    itemCount = {totalProducts}
                    totalAmount = {totalAmount}
                    deliveryFee = {deliveryFee}
                    cartData={data}
                    isCheckoutVisible={isCheckoutVisible} 
                    toggleCheckoutVisibility={toggleCheckoutVisibility} 
                    />
                </div>
            </div>
        </div>
    );
}

export default Cart;
