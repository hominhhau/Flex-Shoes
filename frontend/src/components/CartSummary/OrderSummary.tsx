import React from 'react';
import classNames from 'classnames/bind';
import styles from './OrderSummary.module.scss';

const cx = classNames.bind(styles);

interface SummaryItemProps {
  label: string;
  value: string;
}

const SummaryItem: React.FC<SummaryItemProps> = ({ label, value }) => (
  <div className={cx('summaryItem')}>
    <div>{label}</div>
    <div className={cx('summaryValue')}>{value}</div>
  </div>
);

interface OrderSummaryProps {
  itemCount: number;
  totalAmount: number;
  deliveryFee: number;
  cartData: any;
  checkedItems: any[];
  isCheckoutVisible: boolean;
  toggleCheckoutVisibility: () => void;
  handleCheckout: () => void; // Nhận handleCheckout từ Cart
}

const OrderSummary: React.FC<OrderSummaryProps> = ({
  itemCount,
  totalAmount,
  deliveryFee,
  cartData,
  checkedItems,
  isCheckoutVisible,
  toggleCheckoutVisibility,
  handleCheckout, // Sử dụng handleCheckout từ props
}) => {
  const totalAmountNum = (typeof totalAmount === 'number' ? totalAmount : parseFloat(totalAmount)) || 0;
  const deliveryFeeNum = (typeof deliveryFee === 'number' ? deliveryFee : parseFloat(deliveryFee)) || 0;

  if (isNaN(totalAmountNum) || isNaN(deliveryFeeNum)) {
    console.error('Invalid totalAmount or deliveryFee value.');
  }

  const totalWithDelivery = (totalAmountNum + deliveryFeeNum).toFixed(2);
  console.log(totalWithDelivery);
  const formattedTotalWithDelivery = `${totalWithDelivery}`;
  const summaryItems = [
    { label: `${itemCount} ITEM${itemCount !== 1 ? 'S' : ''}`, value: `${totalAmount.toFixed(2)}` },
    { label: 'Delivery', value: `${deliveryFee.toFixed(2)}` },
    { label: 'Sales Tax', value: '-' },
  ];

  console.log('Order summary:', cartData, itemCount, totalAmount, deliveryFee, checkedItems);

  return (
    <section className={cx('orderSummary')}>
      <h2 className={cx('title')}>Order Summary</h2>
      <div className={cx('summaryList')}>
        {summaryItems.map((item, index) => (
          <SummaryItem key={index} label={item.label} value={item.value} />
        ))}
        <div className={cx('summaryItem', 'totalItem')}>
          <div>Total</div>
          <div className={cx('summaryValue')}>{formattedTotalWithDelivery}</div>
        </div>
      </div>
      {isCheckoutVisible && (
        <button className={cx('checkoutButton')} onClick={handleCheckout}>
          Checkout
        </button>
      )}

      <div className={cx('promoCode')}>Use a promo code</div>
    </section>
  );
};

export default OrderSummary;