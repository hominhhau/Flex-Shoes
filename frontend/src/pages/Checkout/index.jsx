import React, { useState, useEffect, useCallback } from 'react';
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
    translate: (message) => message.includes('bắt buộc') ? 'Phone number is required' : message,
  },
  receiverName: {
    frontendField: 'name',
    translate: (message) => message.includes('bắt buộc') ? 'Full name is required' : message.includes('105') ? 'Full name cannot exceed 105 characters' : message,
  },
  receiverAddress: {
    frontendField: 'address',
    translate: (message) => message.includes('bắt buộc') ? 'Address is required' : message.includes('105') ? 'Address cannot exceed 105 characters' : message,
  },
  issueDate: {
    frontendField: 'issueDate',
    translate: (message) => message.includes('bắt buộc') ? 'Issue date is required' : message,
  },
  total: {
    frontendField: 'total',
    translate: (message) => message.includes('bắt buộc') ? 'Total is required' : message.includes('lớn hơn hoặc bằng 0') ? 'Total must be greater than or equal to 0' : message,
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
  const [checkoutData, setCheckoutData] = useState(location.state || {});
  const { cartData, itemCount, totalAmount, deliveryFee, checkedItems } = checkoutData;
  const [selectedDeliveryFee, setSelectedDeliveryFee] = useState(deliveryFee || 0);

  // Ghi chú: Theo dõi thay đổi location.state để cập nhật checkoutData
  useEffect(() => {
    console.log('location.state:', location.state);
    setCheckoutData(location.state || {});
  }, [location.state]);

  // Ghi chú: Debug state để phát hiện render vô hạn
  useEffect(() => {
    console.log('State updated:', {
      email,
      firstName,
      lastName,
      address,
      phone,
      selectedPaymentMethod,
      selectedDeliveryMethod,
      isLoading,
      isCompleted,
      isFailed,
      errors,
      checkoutData,
    });
  }, [email, firstName, lastName, address, phone, selectedPaymentMethod, selectedDeliveryMethod, isLoading, isCompleted, isFailed, errors, checkoutData]);

  // Ghi chú: Sử dụng useCallback để tránh tạo hàm mới trong mỗi render
  const handleDeliveryChange = useCallback((newDeliveryFee) => {
    console.log('New delivery fee:', newDeliveryFee);
    setSelectedDeliveryFee(newDeliveryFee);
    setSelectedDeliveryMethod(newDeliveryFee === 0 ? 'Collect in store' : 'Standard Delivery');
    setErrors((prev) => ({ ...prev, deliveryMethod: '' }));
  }, []);

  const handlePaymentChange = useCallback((paymentMethod) => {
    console.log('Selected payment method:', paymentMethod);
    setSelectedPaymentMethod(paymentMethod);
    setErrors((prev) => ({ ...prev, paymentMethod: '' }));
  }, []);

  const isAllChecked = billingSameAsDelivery && isOver13;

  // Ghi chú: Hàm xử lý đặt hàng, đảm bảo cập nhật số lượng tồn kho khi thanh toán thành công
const handlePlaceOrder = useCallback(async () => {
  const newErrors = {};
  if (!email) newErrors.email = 'Email is required';
  else if (!email.includes('@')) newErrors.email = 'Invalid email format';
  if (!firstName) newErrors.firstName = 'First name is required';
  if (!lastName) newErrors.lastName = 'Last name is required';
  if (!address) newErrors.address = 'Address is required';
  if (!phone) newErrors.phone = 'Phone number is required';
  if (!selectedPaymentMethod) newErrors.paymentMethod = 'Payment method is required';
  if (!selectedDeliveryMethod) newErrors.deliveryMethod = 'Delivery method is required';
  if (!checkedItems || checkedItems.length === 0) newErrors.cart = 'Không có sản phẩm nào được chọn';

  if (Object.keys(newErrors).length > 0) {
    setErrors(newErrors);
    console.log('Validation errors:', newErrors);
    return;
  }

  setIsLoading(true);
  setErrors({});

  try {
    const customerID = localStorage.getItem('customerId');
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

    // Ghi chú: Log dữ liệu hóa đơn để debug
    console.log('Sending invoice data:', JSON.stringify(invoiceData, null, 2));
    const invoiceResponse = await Api_InvoiceAdmin.createInvoice(invoiceData);
    console.log('Received Invoice:', invoiceResponse);

    // Ghi chú: Kiểm tra dữ liệu sản phẩm trước khi gửi
    const handleCartData = checkedItems.map((product) => {
      if (!product.id || !product.quantity || !product.color || !product.size) {
        throw new Error(`Dữ liệu sản phẩm không hợp lệ: ${JSON.stringify(product)}`);
      }
      return {
        productId: product.id,
        quantity: product.quantity,
        colorName: product.color,
        sizeName: product.size,
      };
    });
    console.log('handleCartData:', JSON.stringify(handleCartData, null, 2));

    // Ghi chú: Chỉ cập nhật số lượng tồn kho nếu thanh toán thành công hoặc là Cash on Delivery
    let updateQuantity;
    if (selectedPaymentMethod !== 'Cash on Delivery') {
      // Ghi chú: Xử lý thanh toán trực tuyến
      const paymentResponse = await Api_Payment.createPayment({
        total: invoiceData.total,
        invoiceId: invoiceResponse.invoiceId || Math.floor(Math.random() * 100000),
      });
      console.log('Payment response:', paymentResponse);
      if (paymentResponse?.URL) {
        // Ghi chú: Chuyển hướng tới URL thanh toán, không cập nhật tồn kho ngay
        window.location.href = paymentResponse.URL;
        return;
      } else {
        throw new Error('Không nhận được URL thanh toán từ VNPay.');
      }
    } else {
      // Ghi chú: Cash on Delivery - Cập nhật số lượng ngay sau khi tạo hóa đơn
      updateQuantity = await Api_InvoiceAdmin.updateQuantityAfterCheckout({ items: handleCartData });
      console.log('Updated quantity response:', JSON.stringify(updateQuantity, null, 2));
      
      // Ghi chú: Kiểm tra phản hồi cẩn thận hơn
      if (updateQuantity?.status === 'fail') {
        setErrors({ inventory: 'Cập nhật số lượng tồn kho thất bại: ' + (updateQuantity?.message || 'Lỗi không xác định từ server') });
        setIsCompleted(true); // Vẫn hoàn thành vì hóa đơn đã được tạo
        return;
      }
      if (!updateQuantity?.updated) {
        console.warn('Phản hồi không có thuộc tính updated:', updateQuantity);
        // Ghi chú: Xác nhận cập nhật bằng cách kiểm tra cơ sở dữ liệu nếu cần
        setIsCompleted(true);
        return;
      }
    }

    // Ghi chú: Cập nhật giỏ hàng sau khi xử lý thành công
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
    console.log('Updated cart:', newCartData);
    setIsCompleted(true);
  } catch (error) {
    console.error('Lỗi chi tiết:', error);
    console.error('Thông tin lỗi:', {
      message: error.message,
      code: error.code,
      response: error.response?.data,
    });
    if (error.message.includes('Network Error')) {
      setErrors({ general: 'Lỗi kết nối mạng. Vui lòng kiểm tra kết nối và thử lại.' });
      setIsFailed(true);
    } else if (error.response?.data?.status === 'fail' && error.response?.data?.result) {
      // Ghi chú: Xử lý lỗi validation từ backend
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
      // Ghi chú: Chỉ đặt isFailed nếu hóa đơn chưa được tạo
      setErrors({ general: error.message || 'Có lỗi xảy ra khi xử lý đơn hàng.' });
      setIsFailed(true);
    }
  } finally {
    setIsLoading(false);
  }
}, [email, firstName, lastName, address, phone, selectedPaymentMethod, selectedDeliveryMethod, checkedItems, totalAmount, selectedDeliveryFee, cartData, navigate]);
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
            disabled={isLoading}
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
          // Ghi chú: Hiển thị lỗi cập nhật tồn kho nếu có
          message={errors.inventory ? `Hóa đơn được tạo, nhưng ${errors.inventory}` : "Thank you for shopping with us."}
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
          message={errors.general || "Please try again."}
          onConfirm={() => navigate('/cart')}
          isConfirm={true}
          contentConfirm="OK"
        />
      )}
    </main>
  );
};

export default React.memo(CheckoutForm);