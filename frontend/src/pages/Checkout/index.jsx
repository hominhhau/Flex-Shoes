import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import styles from './Checkout.module.scss';
import classNames from 'classnames/bind';
import InputField from './InputField';
import DeliveryOptionsButton from './DelivelyOptions';
import OrderSummary from '../../components/CartSummary/OrderSummary';
import ShoppingBag from '../../components/Cart/CartComponent';
import { Api_Payment } from '../../../apis/Api_Payment';

const cx = classNames.bind(styles);

const CheckoutForm = () => {
    const [billingSameAsDelivery, setBillingSameAsDelivery] = useState(false);
    const [isOver13, setIsOver13] = useState(false);
    const [newsletterSubscription, setNewsletterSubscription] = useState(false);

    const location = useLocation();
    const { cartData, itemCount, totalAmount, deliveryFee } = location.state || {};
    console.log('Checkout data:', cartData);

    // const handlePlaceOrder = () => {
    //     alert('Order placed successfully!');
    // };
    // Example for creating a payment and redirecting to VNPay
    const handlePlaceOrder = async () => {
        try {
            // Calculate total in VND (multiply by 100 if working with cents)
            const total = Math.round(totalAmount * 23000); // Convert to VND (assuming original price is in USD)

            const invoiceDto = {
                invoiceId: '26', // Generate a unique invoice ID
                total: 90000,
            };

            console.log('Sending payment request:', invoiceDto);
            const paymentResponse = await Api_Payment.createPayment(invoiceDto);

            if (paymentResponse?.URL) {
                window.location.href = paymentResponse.URL;
            } else {
                throw new Error('No payment URL received');
            }
        } catch (error) {
            console.error('Error during order placement:', error);
            alert('There was an error processing your payment. Please try again.');
        }
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
                        <InputField label="Email" id="email" placeholder="Email" width={300} />
                    </form>
                </section>

                <section className={cx('shippingSection')}>
                    <h2 className={cx('shippingTitle')}>Shipping Address</h2>

                    <form className={cx('shippingForm')}>
                        <div className={cx('nameInputs')}>
                            <InputField label="First Name" id="firstName" placeholder="First Name*" width={300} />
                            <InputField label="Last Name" id="lastName" placeholder="Last Name*" width={300} />
                        </div>

                        <div className={cx('addressInput')}>
                            <InputField
                                label="Find Delivery Address"
                                id="address"
                                placeholder="Find Delivery Address*"
                                helperText="Start typing your street address or zip code for suggestion"
                                width={665}
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
                            />
                        </div>
                    </form>
                </section>

                <br />
                <DeliveryOptionsButton />

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

                <button onClick={handlePlaceOrder} className={cx('placeOrderButton')}>
                    REVIEW AND PAY
                </button>
            </div>
            <div className={cx('rightContainer')}>
                <div className={cx('orderSummary')}>
                    <OrderSummary
                        itemCount={itemCount}
                        totalAmount={totalAmount}
                        deliveryFee={deliveryFee}
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
                                    color={product.color}
                                    sizeOptions={product.sizeOptions}
                                    price={product.price}
                                    quantity={product.quantity}
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
        </main>
    );
};

export default CheckoutForm;
