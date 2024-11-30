import React, { useState } from 'react';
import styles from './PaymentOption.module.scss';
import PaymentOption from './PaymentOption';

const paymentOptionsData = [
  {
    title: 'Cash on Delivery',
    description: 'Pay when you receive your order.',
  },
  {
    title: 'Bank Transfer',
    description: 'Transfer payment directly to our bank account.',
  }
];

const PaymentOptionsButton = ({ onPaymentChange }) => {
  const [selectedOption, setSelectedOption] = useState(paymentOptionsData[0].title);

  const handleSelectOption = (option) => {
    console.log('Selected payment method:', option.title);
    setSelectedOption(option.title);
    // Truyền giá trị phương thức thanh toán lên component cha
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
    </section>
  );
};

export default PaymentOptionsButton;
