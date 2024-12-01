import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styles from './Checkout.module.scss';
import classNames from 'classnames/bind';
import InputField from './InputField';
import DeliveryOptionsButton from './DelivelyOptions';
import PaymentOptionsButton from './PaymentOptionsButton';
import OrderSummary from '../../components/CartSummary/OrderSummary';
import ShoppingBag from '../../components/Cart/CartComponent';
import  Modal  from '../../components/Modal';

import { Api_Payment } from '../../../apis/Api_Payment';
import { Api_InvoiceAdmin } from '../../../apis/Api_invoiceAdmin';

const cx = classNames.bind(styles);

const CheckoutForm = () => {
    const [billingSameAsDelivery, setBillingSameAsDelivery] = useState(false);
    const [isOver13, setIsOver13] = useState(false);
    const [newsletterSubscription, setNewsletterSubscription] = useState(false);
    const navigator = useNavigate();
    //State user enter
    const [email, setEmail] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [address, setAddress] = useState('');
    const [phone, setPhone] = useState('');
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');
    const [selectedDeliveryMethod, setSelectedDeliveryMethod] = useState('');
    const [paymentStatus, setPaymentStatus] = useState('unpaid');
    const [isCompleted, setIsCompleted] = useState(false);
    const [isFailed, setIsFailed] = useState(false);
    const location = useLocation();
    console.log(location.state);
    const { cartData, itemCount, totalAmount, deliveryFee } = location.state || {};
    console.log('Checkout data:', cartData);
    const [selectedDeliveryFee, setSelectedDeliveryFee] = useState(deliveryFee);

    const handleDeliveryChange = (newDeliveryFee) => {
        console.log('New delivery fee:', newDeliveryFee);
        setSelectedDeliveryFee(newDeliveryFee);
        setSelectedDeliveryMethod(newDeliveryFee === 0 ? 'Collect in store' : 'Standard Delivery');
    };

    const handleQuantityChange = (productId, newQuantity) => {
        const updatedCartData = cartData.map((product) =>
            product.productId === productId ? { ...product, quantity: newQuantity } : product,
        );
        console.log('Updated cart data:', updatedCartData);
    };
    const handlePaymentChange = (paymentMethod) => {
        console.log('Selected payment method:', paymentMethod);
        setSelectedPaymentMethod(paymentMethod);
    };

    // const handlePlaceOrder = () => {
    //     alert('Order placed successfully!');
    // };

    // Hàm xử lý khi bấm nút "REVIEW AND PAY"
    // const handlePlaceOrder = async () => {
    //     try{
    //         // Chuyển đổi tổng số tiền từ USD sang VND
    //         const totalInVND = Math.round(totalAmount * 23000);

    //         const invoiceData = {
    //             invoiceId: '30',
    //             // issueDate: new Date().toISOString().split('T')[0],
    //             // receiverNumber: phone,  // Giá trị số điện thoại
    //             // receiverName: `${firstName} ${lastName}`,  // Họ và tên
    //             // receiverAddress: address,  // Địa chỉ
    //             // paymentMethod: 'VNPay',  // Phương thức thanh toán (giả sử)
    //             // deliveryMethod: 'Express',  // Phương thức giao hàng (giả sử)
    //             // orderStatus: paymentStatus === 'paid' ?  'Paid' : 'Pending',  // Trạng thái đơn hàng
    //             total: totalInVND,  // Tổng giá trị
    //             //cartData: cartData,  // Dữ liệu giỏ hàng
    //         };

    //         console.log('Đang gửi yêu cầu thanh toán:', invoiceData);
    //         // Gọi API tạo thanh toán qua VNPay
    //     const paymentResponse = await Api_Payment.createPayment(invoiceData);

    //     if (paymentResponse?.URL) {
    //         // Điều hướng đến VNPay
    //         window.location.href = paymentResponse.URL;
    //     } else {
    //         throw new Error('Không nhận được URL thanh toán');
    //     }
    //     }catch (error) {
    //         console.error('Lỗi trong quá trình thanh toán:', error);
    //         alert('Đã xảy ra lỗi khi xử lý thanh toán. Vui lòng thử lại.');
    //     }

    //     // try {
    //     //     const response = await axios.post('http://localhost:8080/api/invoices', invoiceData);
    //     //     alert('Order placed successfully!');
    //     //     console.log(response.data);
    //     // } catch (error) {
    //     //     console.error('Error placing order:', error.response || error.message || error);
    //     //     alert('Failed to place order. Please try again.');
    //     // }
    // };

    const isAllChecked = billingSameAsDelivery && isOver13;

    const handlePlaceOrder = async () => {
        try {
            console.log('cartData:', cartData);
            // Chuyển đổi tổng tiền sang VND
            const totalInVND = Math.round(totalAmount * 23000);
            const customerID = localStorage.getItem('customerId');
            console.log('customerID:', customerID);
            console.log('invoiceData:', cartData);
            const invoiceData = {
                invoiceDetails: cartData.map((product) => ({
                    productId: product.id || product.productId,
                    quantity: product.quantity,
                })),

                issueDate: new Date().toISOString().split('T')[0], //YYYY-MM-DD lấy ptu đầu tiên của mảng [0]
                receiverNumber: phone,
                receiverName: `${firstName} ${lastName}`,
                receiverAddress: address,
                paymentMethod: selectedPaymentMethod.toString(),
                deliveryMethod: selectedDeliveryMethod.toString(),
                customerId: customerID,
                orderStatus: 'Processing',
                total: totalInVND,
            };

            console.log('Sending invoice data to server:', invoiceData);

            // Gửi dữ liệu đơn hàng lên server

            const invoiceResponse = await Api_InvoiceAdmin.createInvoice(invoiceData);
            console.log('Received Invoice:', invoiceResponse);
            //Update quantity after checkout
            const handleCartData = cartData.map((product) => ({
                productId: product.productId || product.id,
                quantity: product.quantity,
                colorName: product.color,
                sizeName: product.size,
            }));
            console.log('handleCartData:', handleCartData);
            const updateQuantity = await Api_InvoiceAdmin.updateQuantityAfterCheckout(handleCartData);
            console.log('Updated quantity:', updateQuantity);


            if (!(selectedPaymentMethod === 'Cash on Delivery')) {
                const paymentResponse = await Api_Payment.createPayment({
                    total: totalInVND,
                    // invoiceId: invoiceResponse.invoiceId,
                    invoiceId: Math.floor(Math.random() * 100000)
                });
                console.log('====================================');
                console.log('invoiceId', invoiceResponse.invoiceId);
                console.log('====================================');

                if (paymentResponse?.URL) {
                    window.location.href = paymentResponse.URL;
                } else {
                    alert('Có lỗi xảy ra khi đặt hàng. Vui lòng thử lại.');
                    throw new Error('Không nhận được URL thanh toán từ VNPay.');
                }
            }
            // Xóa product da mua trong giỏ hàng sau khi đặt hàng
            const newCartData = cartData.filter(
                (product) => !invoiceData.invoiceDetails.some((item) => item.productId === product.productId),
            );
            sessionStorage.setItem('cart', JSON.stringify(newCartData));

            // Hiển thị thông báo đặt hàng thành công
            setIsCompleted(true);


        } catch (error) {
            console.error('Lỗi khi xử lý thanh toán:', error);
            setIsFailed(true);
        }
    };

    const handlePaymentStatusChange = (newStatus) => {
        setPaymentStatus(newStatus); //paid or unpaid
    };

    return (
        <main className={cx('container')}>
            <div className={cx('leftcontainer')}>
                <a href="#" className={cx('loginLink')}>
                    Login and Checkout faster
                </a>

                <section className={cx('formSection')}>
                    <header className={cx('sectionHeader')}>
                        <h2 className={cx('sectionTitle')}>Contact Details</h2>
                        <p className={cx('sectionDescription')}>
                            We will use these details to keep you informed about your delivery.
                        </p>
                    </header>

                    <form className={cx('inputGroup')}>
                        <InputField
                            label="Email"
                            id="email"
                            placeholder="Email"
                            width={300}
                            value={email} //bind với giá trị state
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </form>
                </section>

                <section className={cx('shippingSection')}>
                    <h2 className={cx('shippingTitle')}>Shipping Address</h2>

                    <form className={cx('shippingForm')}>
                        <div className={cx('nameInputs')}>
                            <InputField
                                label="First Name"
                                id="firstName"
                                placeholder="First Name*"
                                width={300}
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                            />
                            <InputField
                                label="Last Name"
                                id="lastName"
                                placeholder="Last Name*"
                                width={300}
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                            />
                        </div>

                        <div className={cx('addressInput')}>
                            <InputField
                                label="Find Delivery Address"
                                id="address"
                                placeholder="Find Delivery Address*"
                                helperText="Start typing your street address or zip code for suggestion"
                                width={665}
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                            />
                        </div>

                        <div className={cx('phoneInput')}>
                            <InputField
                                label="Phone Number"
                                id="phone"
                                type="tel"
                                placeholder="Phone Number*"
                                helperText="E.g. (123) 456-7890"
                                width={300}
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                            />
                        </div>
                    </form>
                </section>

                <br />
                {/* Delivery */}
                <DeliveryOptionsButton onDeliveryChange={handleDeliveryChange} />
                <br />
                {/* Payment */}
                <PaymentOptionsButton onPaymentChange={handlePaymentChange} />
                {/* Checkbox */}
                <section className={cx('checkoutOptions')}>
                    <div className={cx('option')}>
                        <input
                            type="checkbox"
                            id="billingSameAsDelivery"
                            checked={billingSameAsDelivery}
                            onChange={() => setBillingSameAsDelivery(!billingSameAsDelivery)}
                        />
                        <label htmlFor="billingSameAsDelivery">My billing and delivery information are the same</label>
                    </div>

                    <div className={cx('option')}>
                        <input
                            type="checkbox"
                            id="isOver13"
                            checked={isOver13}
                            onChange={() => setIsOver13(!isOver13)}
                        />
                        <label htmlFor="isOver13">I'm 13+ years old</label>
                    </div>

                    <div className={cx('newsletterSection')}>
                        <h4>Also want product updates with our newsletter?</h4>
                        <div className={cx('option')}>
                            <input
                                type="checkbox"
                                id="newsletterSubscription"
                                checked={newsletterSubscription}
                                onChange={() => setNewsletterSubscription(!newsletterSubscription)}
                            />
                            <label htmlFor="newsletterSubscription">
                                Yes, I’d like to receive emails about exclusive sales and more.
                            </label>
                        </div>
                    </div>
                </section>

                <button onClick={handlePlaceOrder} className={cx('placeOrderButton')} disabled={!isAllChecked}>
                    REVIEW AND PAY
                </button>
            </div>
            <div className={cx('rightContainer')}>
                <div className={cx('orderSummary')}>
                    <OrderSummary
                        itemCount={itemCount}
                        totalAmount={totalAmount}
                        deliveryFee={selectedDeliveryFee}
                        cartData={cartData}
                    />
                </div>
                <div className={cx('shoppingBag')}>
                    {cartData && cartData.length > 0 ? (
                        cartData.map((product) => (
                            <div className={cx('shoppingBagItem')} key={product.id}>
                                <ShoppingBag
                                    image={product.image}
                                    name={product.name}
                                    category={product.category}
                                    color={product.color || 'Color'}
                                    sizeOptions={product.size || ['Size']}
                                    price={product.price}
                                    // quantity={product.quantity}
                                    initialQuantity={product.quantity}
                                    onQuantityChange={(newQuantity) => handleQuantityChange(product.id, newQuantity)}
                                    allowQuantityChange={false}
                                    allowSizeChange={false}
                                />
                            </div>
                        ))
                    ) : (
                        <p>No items in the cart.</p>
                    )}
                  
                </div>
            </div>
            {
                    isCompleted &&
                   <Modal
                        valid={true}
                        title="Order placed successfully!"
                        message="Thank you for shopping with us."
                        onConfirm={() => navigator(`/purchasedProductsList/${localStorage.getItem('customerId')}`)}
                        isConfirm={true}
                        contentConfirm="OK"
                        isCancel={false}

                    />
                   }
                   {
                    isFailed &&
                    <Modal
                        valid={false}
                        title="Order failed!"
                        message="Please try again."
                        onConfirm={() => navigator(`/cart`)}
                        isConfirm={true}
                        contentConfirm="OK"
                    />
                   }
        </main>
    );
};

export default CheckoutForm;
