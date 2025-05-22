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
import { Api_Profile } from '../../../apis/Api_Profile';

const cx = classNames.bind(styles);

const errorFieldMapping = {
    receiverNumber: {
        frontendField: 'phone',
        translate: (message) =>
            message.includes('bắt buộc')
                ? 'Phone number is required'
                : message.includes('không hợp lệ')
                  ? 'Invalid phone number format'
                  : message,
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

// Validate phone number
const validatePhoneNumber = (phone) => {
    const phoneRegex = /^\+?\d{10,15}$/;
    return phoneRegex.test(phone);
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
    const { cartData = [], itemCount = 0, totalAmount = 0, deliveryFee = 0, checkedItems = [] } = checkoutData;
    const [selectedDeliveryFee, setSelectedDeliveryFee] = useState(deliveryFee);

    // Ensure checkoutData has default values
    useEffect(() => {
        if (!location.state) {
            console.warn('location.state is empty, redirecting to cart');
            navigate('/cart');
        } else {
            console.log('location.state:', location.state);
            setCheckoutData(location.state);
        }
    }, [location.state, navigate]);

    // Debug state to detect issues
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
        console.log('Current sessionStorage cart:', sessionStorage.getItem('cart'));
    }, [
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
    ]);

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

    // Validate input as user types
    const validateInput = useCallback(
        (field, value) => {
            const newErrors = { ...errors };
            switch (field) {
                case 'email':
                    if (!value) newErrors.email = 'Email is required';
                    else if (!value.includes('@')) newErrors.email = 'Invalid email format';
                    else delete newErrors.email;
                    break;
                case 'firstName':
                    if (!value) newErrors.firstName = 'First name is required';
                    else if (value.length > 50) newErrors.firstName = 'First name cannot exceed 50 characters';
                    else delete newErrors.firstName;
                    break;
                case 'lastName':
                    if (!value) newErrors.lastName = 'Last name is required';
                    else if (value.length > 50) newErrors.lastName = 'Last name cannot exceed 50 characters';
                    else delete newErrors.lastName;
                    break;
                case 'address':
                    if (!value) newErrors.address = 'Address is required';
                    else if (value.length > 105) newErrors.address = 'Address cannot exceed 105 characters';
                    else delete newErrors.address;
                    break;
                case 'phone':
                    if (!value) newErrors.phone = 'Phone number is required';
                    else if (!validatePhoneNumber(value)) newErrors.phone = 'Invalid phone number format';
                    else delete newErrors.phone;
                    break;
                default:
                    break;
            }
            setErrors(newErrors);
        },
        [errors],
    );

    const handlePlaceOrder = useCallback(async () => {
        const newErrors = {};
        if (!email) newErrors.email = 'Email is required';
        else if (!email.includes('@')) newErrors.email = 'Invalid email format';
        if (!firstName) newErrors.firstName = 'First name is required';
        if (!lastName) newErrors.lastName = 'Last name is required';
        if (!address) newErrors.address = 'Address is required';
        if (!phone) newErrors.phone = 'Phone number is required';
        else if (!validatePhoneNumber(phone)) newErrors.phone = 'Invalid phone number format';
        if (!selectedPaymentMethod) newErrors.paymentMethod = 'Payment method is required';
        if (!selectedDeliveryMethod) newErrors.deliveryMethod = 'Delivery method is required';
        if (!checkedItems || checkedItems.length === 0) newErrors.cart = 'No items selected';

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            console.log('Validation errors:', newErrors);
            return;
        }

        setIsLoading(true);
        setErrors({});

        try {
            const customerID = localStorage.getItem('customerId');
            if (!customerID) {
                throw new Error('Customer ID not found. Please log in again.');
            }
            const now = new Date();
            const vietnamTime = new Date(now.getTime() + 7 * 60 * 60 * 1000);
            const invoiceData = {
                invoiceDetails: checkedItems.map((product) => ({
                    productId: product.id,
                    id: product.id,
                    quantity: product.quantity,
                })),
                issueDate: vietnamTime.toISOString(),
                receiverNumber: phone,
                receiverName: `${firstName} ${lastName}`,
                receiverAddress: address,
                paymentMethod: selectedPaymentMethod.toString(),
                deliveryMethod: selectedDeliveryMethod.toString(),
                customerId: customerID,
                orderStatus: 'Processing',
                total: totalAmount + selectedDeliveryFee,
            };

            console.log('Sending invoice data:', JSON.stringify(invoiceData, null, 2));
            const invoiceResponse = await Api_InvoiceAdmin.createInvoice(invoiceData);
            console.log('Received Invoice:', invoiceResponse);

            const handleCartData = checkedItems.map((product) => {
                if (!product.id || !product.quantity || !product.color || !product.size) {
                    throw new Error(`Invalid product data: ${JSON.stringify(product)}`);
                }
                return {
                    productId: product.id,
                    quantity: product.quantity,
                    colorName: product.color,
                    sizeName: product.size,
                };
            });
            console.log('handleCartData:', JSON.stringify(handleCartData, null, 2));

            let updateQuantity;
            const paymentResponse = await Api_Payment.createPayment({
                order: invoiceResponse,
            });

            if (selectedPaymentMethod === 'Bank Transfer') {
                if (paymentResponse?.URL) {
                    window.location.href = paymentResponse.URL;
                    return; // Exit early to prevent further processing
                } else {
                    throw new Error('No payment URL received from VNPay.');
                }
            }

            if (selectedPaymentMethod === 'Cash on Delivery' || paymentResponse?.status === 'success') {
                console.log('Updating inventory with cart data:', JSON.stringify(handleCartData, null, 2));
                updateQuantity = await Api_InvoiceAdmin.updateQuantityAfterCheckout({ items: handleCartData });
                console.log('Updated quantity response:', JSON.stringify(updateQuantity, null, 2));

                if (updateQuantity?.data?.status === 'fail') {
                    setErrors({
                        inventory: `Failed to update inventory: ${updateQuantity?.data?.message || 'Unknown server error'}`,
                    });
                    setIsCompleted(true);
                    return;
                }

                if (!updateQuantity?.data?.updated) {
                    console.warn('Inventory update response does not indicate success:', updateQuantity);
                    setErrors({ inventory: 'Inventory update did not complete successfully.' });
                    setIsCompleted(true);
                    return;
                }
            }

            // Update cart by removing checked items
            console.log('Starting cart update process...');
            console.log('Current cartData:', JSON.stringify(cartData, null, 2));
            console.log('Checked items to remove:', JSON.stringify(checkedItems, null, 2));

            const newCartData = cartData.filter((product) => {
                const isRemoved = checkedItems.some(
                    (item) => item.id === product.id && item.size === product.size && item.color === product.color,
                );
                console.log(`Checking product: ${JSON.stringify(product)} - Removed: ${isRemoved}`);
                return !isRemoved;
            });

            console.log('New cartData after filtering:', JSON.stringify(newCartData, null, 2));

            // Save updated cart to sessionStorage
            try {
                sessionStorage.setItem('cart', JSON.stringify(newCartData));
                console.log('Cart successfully saved to sessionStorage:', JSON.stringify(newCartData, null, 2));
            } catch (storageError) {
                console.error('Failed to save cart to sessionStorage:', storageError);
                setErrors({ general: 'Failed to update cart in storage. Please try again.' });
                setIsFailed(true);
                return;
            }

            // Update local state to reflect new cart
            const updatedItemCount = newCartData.reduce((sum, item) => sum + item.quantity, 0);
            const updatedTotalAmount = newCartData.reduce((sum, item) => sum + item.price * item.quantity, 0);
            console.log('Updating checkoutData with:', {
                cartData: newCartData,
                itemCount: updatedItemCount,
                totalAmount: updatedTotalAmount,
                checkedItems: [],
            });

            setCheckoutData((prev) => {
                const newState = {
                    ...prev,
                    cartData: newCartData,
                    itemCount: updatedItemCount,
                    totalAmount: updatedTotalAmount,
                    checkedItems: [],
                };
                console.log('New checkoutData state:', JSON.stringify(newState, null, 2));
                return newState;
            });

            // Dispatch custom event to notify other components of cart update
            console.log('Dispatching cartUpdated event with new cart:', JSON.stringify(newCartData, null, 2));
            window.dispatchEvent(new CustomEvent('cartUpdated', { detail: { cart: newCartData } }));

            handleConfirm();
            setIsCompleted(true);
        } catch (error) {
            console.error('Detailed error:', error);
            console.error('Error info:', {
                message: error.message,
                code: error.code,
                response: error.response?.data,
            });
            if (error.message.includes('Network Error')) {
                setErrors({ general: 'Network error. Please check your connection and try again.' });
                setIsFailed(true);
            } else if (error.response?.data?.status === 'fail' && error.response?.data?.result) {
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
                setErrors({ general: error.message || 'An error occurred while processing your order.' });
                setIsFailed(true);
            }
        } finally {
            setIsLoading(false);
            console.log('Checkout process completed. isLoading set to false.');
        }
    }, [
        email,
        firstName,
        lastName,
        address,
        phone,
        selectedPaymentMethod,
        selectedDeliveryMethod,
        checkedItems,
        totalAmount,
        selectedDeliveryFee,
        cartData,
        navigate,
    ]);

    const selectedCartData = checkedItems || [];

    const handleConfirm = async () => {
        setIsLoading(true);
        const customerId = localStorage.getItem('profileKey');

        const userId = localStorage.getItem('customerId');
        try {
            // Fetch user profile to get name and email
            const profileResponse = await await Api_Profile.getProfile(customerId);

            console.log('Profile: ', profileResponse.data.response);

            const data = profileResponse.data.response; // Assuming the response has a `data` field with email and name

            // Call the order success notification API
            await fetch('https://api.flexshoes.io.vn/api/v1/notification/order-success', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    // Authorization: `Bearer ${token}`, // Include Bearer token for authentication
                },
                body: JSON.stringify({
                    email: data.email || '',
                    name: `${data.firstName || ''} ${data.lastName || ''}`.trim(),
                }),
            }).then(async (response) => {
                if (!response.ok) {
                    const errorText = await response.text();
                    throw new Error(`Failed to send order success notification: ${errorText}`);
                }
            });

            // Navigate to purchased products list
        } catch (error) {
            console.error('Error in handleConfirm:', error);
            // Still navigate even if API call fails to maintain user experience
            // navigate(`/purchasedProductsList/${customerId}`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <main className={cx('container')}>
            <div className={cx('leftcontainer')}>
                <a href="/login" className={cx('loginLink')} aria-label="Login to checkout faster">
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
                                validateInput('email', e.target.value);
                            }}
                            error={errors.email}
                            aria-required="true"
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
                                    validateInput('firstName', e.target.value);
                                }}
                                error={errors.firstName}
                                aria-required="true"
                            />
                            <InputField
                                label="Last Name"
                                id="lastName"
                                placeholder="Last Name*"
                                width={300}
                                value={lastName}
                                onChange={(e) => {
                                    setLastName(e.target.value);
                                    validateInput('lastName', e.target.value);
                                }}
                                error={errors.lastName}
                                aria-required="true"
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
                                    validateInput('address', e.target.value);
                                }}
                                error={errors.address}
                                aria-required="true"
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
                                    validateInput('phone', e.target.value);
                                }}
                                error={errors.phone}
                                aria-required="true"
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
                            aria-label="Billing same as delivery"
                        />
                        <label htmlFor="billingSameAsDelivery">My billing and delivery information are the same</label>
                    </div>

                    <div className={cx('option')}>
                        <input
                            type="checkbox"
                            id="isOver13"
                            checked={isOver13}
                            onChange={() => setIsOver13(!isOver13)}
                            aria-label="Confirm age over 13"
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
                                aria-label="Subscribe to newsletter"
                            />
                            <label htmlFor="newsletterSubscription">
                                Yes, I’d like to receive emails about exclusive sales and more.
                            </label>
                        </div>
                    </div>
                </section>

                <div className={cx('actionButtons')}>
                    <button onClick={() => navigate('/cart')} className={cx('backButton')} aria-label="Return to cart">
                        Back to Cart
                    </button>
                    <button
                        onClick={handlePlaceOrder}
                        className={cx('placeOrderButton')}
                        disabled={isLoading}
                        aria-label="Review and pay"
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
                    message={
                        errors.inventory ? `Order created, but ${errors.inventory}` : 'Thank you for shopping with us.'
                    }
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
                    message={errors.general || 'Please try again.'}
                    onConfirm={() => navigate('/cart')}
                    isConfirm={true}
                    contentConfirm="OK"
                />
            )}
        </main>
    );
};

export default CheckoutForm;
