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
    const productData = location.state;// Không có || {} để tránh giá trị rỗng không xác định.

    // const [data, setData] = useState(
    //     [
    //         productData
    //             ? {
    //                   id: productData.productId,
    //                   image: productData.image,
    //                   name: productData.name,
    //                   color: productData.color,
    //                   sizeOptions: [productData.size],
    //                   price: parseFloat(productData.price),
    //                   quantity: 1,
    //               }
    //             : null,
    //     ].filter(Boolean),
    // );

    // const [data, setData] = useState(() => {
    //     const savedCart = JSON.parse(sessionStorage.getItem('cart')) || [];
    //     return savedCart;
    // });
    
    // useEffect(() => {
    //     // Lấy giỏ hàng từ sessionStorage mỗi khi trang được load lại
    //     const savedCart = JSON.parse(sessionStorage.getItem('cart')) || [];
    //     setData(savedCart);
    // }, []);

    const [data, setData] = useState(() => {
        // Kiểm tra xem có dữ liệu giỏ hàng từ sessionStorage không
        const savedCart = JSON.parse(sessionStorage.getItem('cart')) || [];
        return savedCart.length > 0
            ? savedCart
            : productData
            ? [{
                id: productData.productId,
                //category: productData.category,
                image: productData.image,
                name: productData.name,
                color: productData.color,
                sizeOptions: productData.size,
                price: parseFloat(productData.price),
                quantity: 1,
            }]
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

    // const handleCheckout = () => {
    //     console.log("Cart data before checkout: ", data);
    //     navigate('/checkout', { state: { cartData: data } });
    // };

    const handleCheckout = () => {
        navigate('/checkout', { state: { cartData: data, itemCount: totalProducts, totalAmount } });
    };
    
    // const handleRemove = (id) => {
    //     console.log('Array trước khi xóa: ', data);
    //     const updateData = data.filter((product) => product.id !== id);
    //     setData(updateData);
    //     console.log('Array sau khi xóa: ', updateData);
    //     sessionStorage.setItem('cart', JSON.stringify(updateData));
    // };

    const handleRemove = (id, color, size) => {
        console.log('Array trước khi xóa: ', data);
        const updateData = data.filter((product) => 
            product.id !== id || product.color !== color || product.size !== size
        );
        setData(updateData);
        console.log('Array sau khi xóa: ', updateData);
        sessionStorage.setItem('cart', JSON.stringify(updateData));
    };

    // const handleQuantityChange = (id, newQuantity) => {
    //     setData(data.map((product) => (product.id === id ? { ...product, quantity: newQuantity } : product)));
    // };
      // Hàm cập nhật số lượng sản phẩm
      const handleQuantityChange = (id, newQuantity) => {
        setData(data.map((product) => 
            product.id === id 
                ? { ...product, quantity: newQuantity } 
                : product
        ));
        sessionStorage.setItem('cart', JSON.stringify(data));
    };

    // const totalProducts = data.length;
    // console.log('Tổng số sản phẩm: ' + totalProducts);

    // const totalAmount = data.reduce((acc, product) => acc + product.price * product.quantity, 0);
    const deliveryFee = 0;



    const [isCheckoutVisible, setCheckoutVisible] = useState(true);

    const toggleCheckoutVisibility = () => {
        setCheckoutVisible((prev) => !prev);
    };

    const [checkedItems, setCheckedItems] = useState([]); // Lưu danh sách sản phẩm được chọn

  // Hàm xử lý khi checkbox thay đổi
  const handleCheckboxChange = (isChecked, product) => {
    if (isChecked) {
      setCheckedItems((prev) => [...prev, product]);
    } else {
      setCheckedItems((prev) => prev.filter((item) => item.id !== product.id || item.sizeOptions !== product.sizeOptions));
    }
  };

  // Tính tổng số lượng và tổng tiền dựa trên danh sách sản phẩm được chọn
//   const totalProducts = checkedItems.reduce((acc, product) => acc + product.quantity, 0);
//   const totalAmount = checkedItems.reduce((acc, product) => acc + product.price * product.quantity, 0);

  const [totalProducts, setTotalProducts] = useState(0);
const [totalAmount, setTotalAmount] = useState(0);

  // Sử dụng useEffect để tính lại tổng tiền mỗi khi data hoặc checkedItems thay đổi
useEffect(() => {
    const checkedProducts = data.filter((product) => 
        checkedItems.some(item => item.id === product.id)
    );
    const newTotalAmount = checkedProducts.reduce((acc, product) => acc + (product.price * product.quantity), 0);
    const newTotalProducts = checkedProducts.reduce((acc, product) => acc + product.quantity, 0);

    setTotalAmount(newTotalAmount);
    setTotalProducts(newTotalProducts);

}, [data, checkedItems]); // Cập nhật khi data hoặc checkedItems thay đổi

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
                sizeOptions={product.size}
                price={product.price}
                quantity={product.quantity}
                onRemove={() => handleRemove(product.id, product.color, product.size)}
                onQuantityChange={(newQuantity) => handleQuantityChange(product.id, newQuantity)}
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
