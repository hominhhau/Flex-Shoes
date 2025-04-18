import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styles from './Checkout.module.scss';
import classNames from 'classnames/bind';
import InputField from './InputField';
import DeliveryOptionsButton from './DelivelyOptions';
import PaymentOptionsButton from './PaymentOptionsButton';
import OrderSummary from '../../components/CartSummary/OrderSummary';
import ShoppingBag from '../../components/Cart/CartComponent';
import Modal from '../../components/Modal';
import { Api_Payment } from '../../../apis/Api_Payment';
import { Api_InvoiceAdmin } from '../../../apis/Api_invoiceAdmin';

const cx = classNames.bind(styles);

const CheckoutForm = () => {
  const [billingSameAsDelivery, setBillingSameAsDelivery] = useState(false);
  const [isOver13, setIsOver13] = useState(false);
  const [newsletterSubscription, setNewsletterSubscription] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
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
  };

  const handlePaymentChange = (paymentMethod) => {
    console.log('Selected payment method:', paymentMethod);
    setSelectedPaymentMethod(paymentMethod);
  };

  const isAllChecked = billingSameAsDelivery && isOver13;

  const handlePlaceOrder = async () => {
    if (!email || !firstName || !lastName || !address || !phone) {
      alert('Please fill in all required fields.');
      return;
    }

    setIsLoading(true);
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

      if (selectedPaymentMethod !== 'Cash on Delivery') {
        const paymentResponse = await Api_Payment.createPayment({
          total: invoiceData.total,
          invoiceId: invoiceResponse.invoiceId || Math.floor(Math.random() * 100000),
        });
        console.log('Payment response:', paymentResponse);

        if (paymentResponse?.URL) {
          window.location.href = paymentResponse.URL;
          return;
        } else {
          throw new Error('Không nhận được URL thanh toán từ VNPay.');
        }
      }

      const newCartData = cartData.filter(
        (product) =>
          !checkedItems.some(
            (item) =>
              item.id === product.id &&
              item.size === product.size &&
              item.color === product.color
          )
      );
      sessionStorage.setItem('cart', JSON.stringify(newCartData));
      console.log('Updated cart after purchase:', newCartData);

      setIsCompleted(true);
    } catch (error) {
      console.error('Lỗi khi xử lý thanh toán:', error);
      setIsFailed(true);
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
        <DeliveryOptionsButton onDeliveryChange={handleDeliveryChange} />
        <br />
        <PaymentOptionsButton onPaymentChange={handlePaymentChange} />
        <section className={cx('checkoutOptions')}>
          <div className={cx('option')}>
            <input
              type="checkbox"
              id="billingSameAsDelivery"
              checked={billingSameAsDelivery}
              onChange={() => setBillingSameAsDelivery(!billingSameAsDelivery)}
            />
            <label htmlFor="billingSameAsDelivery">
              My billing and delivery information are the same
            </label>
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
          <button
            onClick={handlePlaceOrder}
            className={cx('placeOrderButton')}
            disabled={!isAllChecked || isLoading}
          >
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
          onConfirm={() =>
            navigate(`/purchasedProductsList/${localStorage.getItem('customerId')}`)
          }
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