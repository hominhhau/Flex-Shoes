import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import classNames from 'classnames/bind';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashCan } from '@fortawesome/free-regular-svg-icons';
import productImage from '../../assets/images/Product01.png';
import ShoppingBag from '../../components/Cart/CartComponent';
import { useNavigate } from 'react-router-dom';
import OrderSummary from '../../components/CartSummary/OrderSummary';
import styles from './Cart.module.scss';
const cx = classNames.bind(styles);

function Cart() {
    //truyen du lieu tu card sang checkout
    const location = useLocation();
    const productData = location.state; // Không có || {} để tránh giá trị rỗng không xác định.


    const [data, setData] = useState(() => {
        // Kiểm tra xem có dữ liệu giỏ hàng từ sessionStorage không
        const savedCart = JSON.parse(sessionStorage.getItem('cart')) || [];
        return savedCart.length > 0
      ? savedCart
      : productData
        ? [productData]
        : [];
  });


    // Lưu giỏ hàng vào sessionStorage mỗi khi dữ liệu thay đổi
    useEffect(() => {
        sessionStorage.setItem('cart', JSON.stringify(data));
    }, [data]);

    //Check
    console.log('Data hiển thị ghhgccg:  ', data);
    console.log('Product Data:', productData);

    const navigate = useNavigate();

    const handleCheckout = () => {
        if (checkedItems.length > 0) {
          navigate('/checkout', { state: { checkedItems, totalAmount: totalAmount + deliveryFee } });
        } else {
          alert('Please select items to checkout.');
        }
      };

    const handleRemove = (id, color, size) => {
        console.log('Array trước khi xóa: ', data);
        const updateData = data.filter(
            (product) => product.id !== id || product.color !== color || product.size !== size,
        );
        setData(updateData);
        console.log('Array sau khi xóa: ', updateData);
        sessionStorage.setItem('cart', JSON.stringify(updateData));
    };


    const handleQuantityChange = (id, size, newQuantity) => {
        const updatedData = data.map((product) =>
            product.id === id && product.size === size ? { ...product, quantity: newQuantity } : product,
        );

        setData(updatedData);
        // Lưu trạng thái mới vào sessionStorage
        sessionStorage.setItem('cart', JSON.stringify(updatedData));
    };

    const deliveryFee = 0;

    const [isCheckoutVisible, setCheckoutVisible] = useState(true);

    const toggleCheckoutVisibility = () => {
        setCheckoutVisible((prev) => !prev);
    };

    const [checkedItems, setCheckedItems] = useState([]); // Lưu danh sách sản phẩm được chọn
    const handleCheckboxChange = (isChecked, product) => {
        console.log("handleCheckboxChange - isChecked:", isChecked, "product:", product);
        setCheckedItems((prev) => {
            if (isChecked) {
                return [...prev, product];
            } else {
                return prev.filter(
                    (item) => item.id !== product.id || item.size !== product.size || item.color !== product.color
                );
            }
        });
    };

    const [totalProducts, setTotalProducts] = useState(0);
    const [totalAmount, setTotalAmount] = useState(0);

    // Sử dụng useEffect để tính lại tổng tiền mỗi khi data hoặc checkedItems thay đổi
    useEffect(() => {
        console.log("Cart - useEffect - checkedItems:", checkedItems); // Kiểm tra nội dung của checkedItems
        const checkedProducts = checkedItems;
        const newTotalAmount = checkedProducts.reduce((acc, product) => {
            console.log("Product Price:", product.price, "Quantity:", product.quantity);
            return acc + product.price * product.quantity;
        }, 0);
        const newTotalProducts = checkedProducts.length;
        setTotalAmount(newTotalAmount);
        setTotalProducts(newTotalProducts);
    }, [checkedItems]);


    // 
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
                    {data.length > 0 ? (
                        data.map((product) => {
                            console.log('Product being passed to ShoppingBag sdsdsadad:', product);
                            return (
                                <ShoppingBag
                                    key={product.id}
                                    image={product.image || productImage}
                                    name={product.name || 'Null'}
                                    //category={product.category || 'Null'}
                                    color={product.color}
                                    size={product.size}
                                    price={product.price}
                                    //quantity={product.quantity}
                                    initialQuantity={product.quantity}
                                    onRemove={() => handleRemove(product.id, product.color, product.size)}
                                    onQuantityChange={(newQuantity) =>
                                        handleQuantityChange(product.id, product.size, newQuantity)
                                    }
                                    removeIcon={faTrashCan}
                                    allowQuantityChange={true}
                                    allowSizeChange={true}
                                    onCheckboxChange={(isChecked) => handleCheckboxChange(isChecked, product)}
                                />
                            );
                        })
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
