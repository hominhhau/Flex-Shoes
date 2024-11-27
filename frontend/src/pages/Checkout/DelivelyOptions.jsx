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

const DeliveryOptionsButton = ({ onDeliveryChange }) => {
  const [selectedOption, setSelectedOption] = useState(deliveryOptionsData[0].price);

  const handleSelectOption = (option) => {
    console.log('Selected option:', option);
    setSelectedOption(option.title);
    // Truyền giá trị phí giao hàng lên component cha (CheckoutForm)
    //onDeliveryChange(option.price);
    const price = option.price === 'Free' ? 0 : parseFloat(option.price);
    console.log('Updated price:', price); // Kiểm tra giá trị giá giao hàng
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
    </section>
  );
};

export default DeliveryOptionsButton;
