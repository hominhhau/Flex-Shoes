import React from 'react';
import classNames from 'classnames/bind';
import { useNavigate } from 'react-router-dom';
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
  subtotal: number;
  deliveryFee: number;
  tax: number;
  cartData: any[];
  isCheckoutVisible: boolean;
}

const OrderSummary: React.FC<OrderSummaryProps> = ({
  itemCount,
  subtotal,
  deliveryFee,
  tax,
  cartData,
  isCheckoutVisible,
}) => {
  const navigate = useNavigate();

  const subtotalNum = (typeof subtotal === 'number' ? subtotal : parseFloat(subtotal)) || 0;
  const deliveryFeeNum = (typeof deliveryFee === 'number' ? deliveryFee : parseFloat(deliveryFee)) || 0;
  const taxNum = (typeof tax === 'number' ? tax : parseFloat(tax)) || 0;

  const total = (subtotalNum + deliveryFeeNum + taxNum).toFixed(2);

  const summaryItems = [
    { label: `${itemCount} ITEM${itemCount !== 1 ? 'S' : ''}`, value: `$${subtotalNum.toFixed(2)}` },
    { label: 'Delivery', value: `$${deliveryFeeNum.toFixed(2)}` },
    { label: 'Sales Tax', value: taxNum > 0 ? `$${taxNum.toFixed(2)}` : '-' },
  ];

  const handleCheckout = () => {
    navigate('/checkout', {
      state: { cartData, itemCount, subtotal, deliveryFee, tax },
    });
  };

  return (
    <section className={cx('orderSummary')}>
      <h2 className={cx('title')}>Order Summary</h2>
      <div className={cx('summaryList')}>
        {summaryItems.map((item, index) => (
          <SummaryItem key={index} label={item.label} value={item.value} />
        ))}
        <div className={cx('summaryItem', 'totalItem')}>
          <div>Total</div>
          <div className={cx('summaryValue')}>${total}</div>
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