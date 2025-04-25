import React, { useState } from 'react';
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
  const [selectedOption, setSelectedOption] = useState(deliveryOptionsData[0].title);

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