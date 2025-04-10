import React from 'react';
import styles from './PaymentOption.module.scss';

const PaymentOption = ({ 
  title, 
  description, 
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
    </div>
  );
};

export default PaymentOption;
