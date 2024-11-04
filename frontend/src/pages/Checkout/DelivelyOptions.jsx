import React, { useState } from 'react';
import styles from './DeliveryOptions.module.scss';
import Delivery from './DeliveryOption';

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
  }
];

const DeliveryOptionsButton = () => {
  const [selectedOption, setSelectedOption] = useState('Standard Delivery');

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
            onClick={() => setSelectedOption(option.title)}
          />
        ))}
      </div>
    </section>
  );
};

export default DeliveryOptionsButton;
