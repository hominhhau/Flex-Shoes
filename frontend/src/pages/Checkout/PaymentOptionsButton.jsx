import React, { useState, useEffect } from 'react';
import styles from './PaymentOption.module.scss';
import checkoutStyles from './Checkout.module.scss';
import classNames from 'classnames/bind';
import PaymentOption from './PaymentOption';

const cx = classNames.bind(checkoutStyles);

const paymentOptionsData = [
  {
    title: 'Cash on Delivery',
    description: 'Pay when you receive your order.',
  },
  {
    title: 'Bank Transfer',
    description: 'Transfer payment directly to our bank account.',
  },
];

const PaymentOptionsButton = ({ onPaymentChange, error }) => {
  const [selectedOption, setSelectedOption] = useState(paymentOptionsData[0].title); // Default to Cash on Delivery

  useEffect(() => {
    // Call onPaymentChange with default payment method when component mounts
    const defaultOption = paymentOptionsData[0]; // Cash on Delivery
    console.log('Initial payment method:', defaultOption.title);
    onPaymentChange(defaultOption.title);
  }, [onPaymentChange]); // Run once on mount

  const handleSelectOption = (option) => {
    console.log('Selected payment method:', option.title);
    setSelectedOption(option.title);
    onPaymentChange(option.title);
  };

  return (
    <section className={styles.container}>
      <h2 className={styles.title}>Payment Methods</h2>
      <div className={styles.optionsWrapper}>
        {paymentOptionsData.map((option, index) => (
          <PaymentOption
            key={index}
            title={option.title}
            description={option.description}
            isSelected={selectedOption === option.title}
            onClick={() => handleSelectOption(option)}
          />
        ))}
      </div>
      {error && <p className={cx('errorText')}>{error}</p>}
    </section>
  );
};

export default PaymentOptionsButton;