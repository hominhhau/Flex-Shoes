import React, { useState, useEffect } from 'react';
import styles from './DeliveryOptions.module.scss';
import checkoutStyles from './Checkout.module.scss';
import classNames from 'classnames/bind';
import Delivery from './Delivery';

const cx = classNames.bind(checkoutStyles);

const deliveryOptionsData = [
  {
    title: 'Standard Delivery',
    description: "Enter your address to see when you'll get your order",
    price: '6.00',
  },
  {
    title: 'Collect in store',
    description: 'Pay now, collect in store',
    price: 'Free',
  },
];

const DeliveryOptionsButton = ({ onDeliveryChange, error }) => {
  const [selectedOption, setSelectedOption] = useState(deliveryOptionsData[0].title); // Default to Standard Delivery

  useEffect(() => {
    // Call onDeliveryChange with default price when component mounts
    const defaultOption = deliveryOptionsData[0]; // Standard Delivery
    const price = defaultOption.price === 'Free' ? 0 : parseFloat(defaultOption.price);
    console.log('Initial delivery price:', price);
    onDeliveryChange(price);
  }, [onDeliveryChange]); // Run once on mount

  const handleSelectOption = (option) => {
    console.log('Selected option:', option);
    setSelectedOption(option.title);
    const price = option.price === 'Free' ? 0 : parseFloat(option.price);
    console.log('Updated price:', price);
    onDeliveryChange(price);
  };

  return (
    <section className={styles.container}>
      <h2 className={styles.title}>Delivery Options</h2>
      <div className={styles.optionsWrapper}>
        {deliveryOptionsData.map((option, index) => (
          <Delivery
            key={index}
            title={option.title}
            description={option.description}
            price={option.price}
            isSelected={selectedOption === option.title}
            onClick={() => handleSelectOption(option)}
          />
        ))}
      </div>
      {error && <p className={cx('errorText')}>{error}</p>}
    </section>
  );
};

export default DeliveryOptionsButton;