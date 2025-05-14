import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styles from './Checkout.module.scss';
import classNames from 'classnames/bind';
import InputField from './InputField';
import DeliveryOptionsButton from './DeliveryOptionsButton';
import PaymentOptionsButton from './PaymentOptionsButton';
import OrderSummary from '../../components/CartSummary/OrderSummary';
import ShoppingBag from '../../components/Cart/CartComponent';
import Modal from '../../components/Modal';
import { Api_Payment } from '../../../apis/Api_Payment';
import { Api_InvoiceAdmin } from '../../../apis/Api_invoiceAdmin';

const cx = classNames.bind(styles);

const errorFieldMapping = {
    receiverNumber: {
        frontendField: 'phone',
        translate: (message) => (message.includes('bắt buộc') ? 'Phone number is required' : message),
    },
    receiverName: {
        frontendField: 'name',
        translate: (message) =>
            message.includes('bắt buộc')
                ? 'Full name is required'
                : message.includes('105')
                  ? 'Full name cannot exceed 105 characters'
                  : message,
    },
    receiverAddress: {
        frontendField: 'address',
        translate: (message) =>
            message.includes('bắt buộc')
                ? 'Address is required'
                : message.includes('105')
                  ? 'Address cannot exceed 105 characters'
                  : message,
    },
    paymentMethod: {
        frontendField: 'paymentMethod',
        translate: (message) =>
            message.includes('bắt buộc')
                ? 'Payment method is required'
                : message.includes('50')
                  ? 'Payment method cannot exceed 50 characters'
                  : message,
    },
    deliveryMethod: {
        frontendField: 'deliveryMethod',
        translate: (message) =>
            message.includes('bắt buộc')
                ? 'Delivery method is required'
                : message.includes('50')
                  ? 'Delivery method cannot exceed 50 characters'
                  : message,
    },
    issueDate: {
        frontendField: 'issueDate',
        translate: (message) => (message.includes('bắt buộc') ? 'Issue date is required' : message),
    },
    total: {
        frontendField: 'total',
        translate: (message) =>
            message.includes('bắt buộc')
                ? 'Total is required'
                : message.includes('lớn hơn hoặc bằng 0')
                  ? 'Total must be greater than or equal to 0'
                  : message,
    },
};

const CheckoutForm = () => {
    const [billingSameAsDelivery, setBillingSameAsDelivery] = useState(false);
    const [isOver13, setIsOver13] = useState(false);
    const [newsletterSubscription, setNewsletterSubscription] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [address, setAddress] = useState('');
    const [phone, setPhone] = useState('');
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');
    const [selectedDeliveryMethod, setSelectedDeliveryMethod] = useState('');
    const [isCompleted, setIsCompleted] = useState(false);
    const [isFailed, setIsFailed] = useState(false);
    const location = useLocation();
    const { cartData, itemCount, totalAmount, deliveryFee, checkedItems } = location.state || {};
    console.log('Checkout data:', { cartData, checkedItems, itemCount, totalAmount });
    const [selectedDeliveryFee, setSelectedDeliveryFee] = useState(deliveryFee || 0);
    const [paymentStatus, setPaymentStatus] = useState('');

    if (!location.state || !checkedItems || checkedItems.length === 0) {
        return (
            <div className={cx('container')}>
                <p>No items selected. Please go back to your cart to select products.</p>
                <button onClick={() => navigate('/cart')} className={cx('backButton')}>
                    Back to Cart
                </button>
            </div>
        );
    }

    const handleDeliveryChange = (newDeliveryFee) => {
        console.log('New delivery fee:', newDeliveryFee);
        setSelectedDeliveryFee(newDeliveryFee);
        setSelectedDeliveryMethod(newDeliveryFee === 0 ? 'Collect in store' : 'Standard Delivery');
        setErrors((prev) => ({ ...prev, deliveryMethod: '' }));
    };

    const handlePaymentChange = (paymentMethod) => {
        console.log('Selected payment method:', paymentMethod);
        setSelectedPaymentMethod(paymentMethod);
        setErrors((prev) => ({ ...prev, paymentMethod: '' }));
    };

    const isAllChecked = billingSameAsDelivery && isOver13;

    const handlePlaceOrder = async () => {
        // Client-side validation
        const newErrors = {};
        if (!email) {
            newErrors.email = 'Email is required';
        } else if (!email.includes('@')) {
            newErrors.email = 'Invalid email format';
        }
        if (!firstName) newErrors.firstName = 'First name is required';
        if (!lastName) newErrors.lastName = 'Last name is required';
        if (!address) newErrors.address = 'Address is required';
        if (!phone) newErrors.phone = 'Phone number is required';
        if (!selectedPaymentMethod) newErrors.paymentMethod = 'Payment method is required';
        if (!selectedDeliveryMethod) newErrors.deliveryMethod = 'Delivery method is required';

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            console.log('Validation errors:', newErrors);
            return;
        }

        setIsLoading(true);
        setErrors({});

        try {
            const customerID = localStorage.getItem('customerId');
            console.log('customerID:', customerID);

            const invoiceData = {
                invoiceDetails: checkedItems.map((product) => ({
                    productId: product.id,
                    id: product.id,
                    quantity: product.quantity,
                })),
                issueDate: new Date().toISOString().split('T')[0],
                receiverNumber: phone,
                receiverName: `${firstName} ${lastName}`,
                receiverAddress: address,
                paymentMethod: selectedPaymentMethod.toString(),
                deliveryMethod: selectedDeliveryMethod.toString(),
                customerId: customerID,
                orderStatus: 'Processing',
                total: totalAmount + selectedDeliveryFee,
            };

            console.log('Sending invoice data to server:', invoiceData);

            const invoiceResponse = await Api_InvoiceAdmin.createInvoice(invoiceData);
            console.log('Received Invoice:', invoiceResponse);

            const handleCartData = checkedItems.map((product) => ({
                productId: product.id,
                quantity: product.quantity,
                colorName: product.color,
                sizeName: product.size,
            }));
            console.log('handleCartData:', handleCartData);

            // NHỚ THÊM VÀO API ĐỂ CẬP NHẬT SỐ LƯỢNG SAU KHI CHECKOUT
            // const updateQuantity = await Api_InvoiceAdmin.updateQuantityAfterCheckout(handleCartData);
            // console.log('Updated quantity:', updateQuantity);

            const paymentResponse = await Api_Payment.createPayment({
                order: invoiceResponse,
            });

            if (selectedPaymentMethod == 'Bank Transfer') {
                if (paymentResponse?.URL) {
                    window.location.href = paymentResponse.URL;
                } else {
                    alert('Có lỗi xảy ra khi đặt hàng. Vui lòng thử lại.');
                    throw new Error('Không nhận được URL thanh toán từ VNPay.');
                }
            }
            if (selectedPaymentMethod == 'Cash on Delivery') {
                console.log('Payment response:', paymentResponse);
                setPaymentStatus(paymentResponse.status);
                setIsCompleted(true);
            }

            const newCartData = cartData.filter(
                (product) =>
                    !checkedItems.some(
                        (item) => item.id === product.id && item.size === product.size && item.color === product.color,
                    ),
            );
            sessionStorage.setItem('cart', JSON.stringify(newCartData));
            console.log('Updated cart after purchase:', newCartData);

            // setIsCompleted(true);
        } catch (error) {
            console.error('Lỗi khi xử lý thanh toán:', error);
            if (error.response?.data?.status === 'fail' && error.response?.data?.result) {
                const backendErrors = error.response.data.result;
                const newErrors = {};

                Object.keys(backendErrors).forEach((field) => {
                    const mapping = errorFieldMapping[field];
                    if (mapping) {
                        newErrors[mapping.frontendField] = mapping.translate(backendErrors[field]);
                    } else {
                        newErrors[field] = backendErrors[field];
                    }
                });

                if (newErrors.name) {
                    newErrors.firstName = newErrors.name;
                    newErrors.lastName = newErrors.name;
                    delete newErrors.name;
                }

                setErrors(newErrors);
                console.log('Backend validation errors:', newErrors);
            } else {
                setIsFailed(true);
            }
        } finally {
            setIsLoading(false);
        }
    };

    const selectedCartData = checkedItems || [];

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
                            value={email}
                            onChange={(e) => {
                                setEmail(e.target.value);
                                setErrors((prev) => ({ ...prev, email: '' }));
                            }}
                            error={errors.email}
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
                                onChange={(e) => {
                                    setFirstName(e.target.value);
                                    setErrors((prev) => ({ ...prev, firstName: '' }));
                                }}
                                error={errors.firstName}
                            />
                            <InputField
                                label="Last Name"
                                id="lastName"
                                placeholder="Last Name*"
                                width={300}
                                value={lastName}
                                onChange={(e) => {
                                    setLastName(e.target.value);
                                    setErrors((prev) => ({ ...prev, lastName: '' }));
                                }}
                                error={errors.lastName}
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
                                onChange={(e) => {
                                    setAddress(e.target.value);
                                    setErrors((prev) => ({ ...prev, address: '' }));
                                }}
                                error={errors.address}
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
                                onChange={(e) => {
                                    setPhone(e.target.value);
                                    setErrors((prev) => ({ ...prev, phone: '' }));
                                }}
                                error={errors.phone}
                            />
                        </div>
                    </form>
                </section>

                <br />
                <DeliveryOptionsButton onDeliveryChange={handleDeliveryChange} error={errors.deliveryMethod} />
                <br />
                <PaymentOptionsButton onPaymentChange={handlePaymentChange} error={errors.paymentMethod} />
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

                <div className={cx('actionButtons')}>
                    <button onClick={() => navigate('/cart')} className={cx('backButton')}>
                        Back to Cart
                    </button>
                    <button onClick={handlePlaceOrder} className={cx('placeOrderButton')} disabled={isLoading}>
                        {isLoading ? 'Processing...' : 'REVIEW AND PAY'}
                    </button>
                </div>
            </div>
            <div className={cx('rightContainer')}>
                <div className={cx('orderSummary')}>
                    <OrderSummary
                        itemCount={itemCount}
                        totalAmount={totalAmount}
                        deliveryFee={selectedDeliveryFee}
                        cartData={cartData}
                        checkedItems={checkedItems}
                        isCheckoutVisible={false}
                        toggleCheckoutVisibility={() => {}}
                        handleCheckout={() => {}}
                    />
                </div>
                <div className={cx('shoppingBag')}>
                    {selectedCartData.length > 0 ? (
                        selectedCartData.map((product) => (
                            <div
                                className={cx('shoppingBagItem')}
                                key={`${product.id}-${product.size}-${product.color}`}
                            >
                                <ShoppingBag
                                    image={product.image}
                                    name={product.name}
                                    color={product.color || 'Color'}
                                    size={product.size || 'Size'}
                                    price={product.price}
                                    initialQuantity={product.quantity}
                                    onQuantityChange={() => {}}
                                    allowQuantityChange={false}
                                    onCheckboxChange={() => {}}
                                    product={product}
                                    removeIcon={null}
                                    onRemove={() => {}}
                                    isChecked={false}
                                />
                            </div>
                        ))
                    ) : (
                        <p>No items selected.</p>
                    )}
                </div>
            </div>
            {isCompleted && (
                <Modal
                    valid={true}
                    title="Order placed successfully!"
                    message="Thank you for shopping with us."
                    onConfirm={() => navigate(`/purchasedProductsList/${localStorage.getItem('customerId')}`)}
                    isConfirm={true}
                    contentConfirm="OK"
                    isCancel={false}
                />
            )}
            {isFailed && (
                <Modal
                    valid={false}
                    title="Order failed!"
                    message="Please try again."
                    onConfirm={() => navigate('/cart')}
                    isConfirm={true}
                    contentConfirm="OK"
                />
            )}
        </main>
    );
};

export default CheckoutForm;
