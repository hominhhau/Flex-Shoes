import React from 'react';
import styles from './DeliveryOptions.module.scss';

const Delivery = ({ 
  title, 
  description, 
  price, 
  isSelected,
  onClick
}) => {
  return (
    <div 
    className={`${styles.optionCard} ${isSelected ? styles.selectedOption : ''}`}
    onClick={onClick}
  >
    <div className={styles.optionInfo}>
      <h3 className={styles.optionTitle}>{title}</h3>
      <p className={styles.optionDescription}>{description}</p>
    </div>
    <span className={`${styles.optionPrice} ${price === 'Free' ? styles.blueText : ''}`}>
      {price === 'Free' ? price : `$${price}`}
    </span>
  </div>
  );
};

export default Delivery;