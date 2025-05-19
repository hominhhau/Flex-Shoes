import React from 'react';
import classNames from 'classnames/bind';
import styles from './OrderSummary.module.scss';
import { BsCartCheck } from 'react-icons/bs';
import { FaTruck, FaDollarSign, FaEllipsisH } from 'react-icons/fa';

const cx = classNames.bind(styles);

function OrderSummary({ name, price, rate }) {
  // Determine which icon and color to use based on the name prop
  let IconComponent;
  let iconColor;

  switch (name) {
    case 'Total Orders':
      IconComponent = BsCartCheck;
      iconColor = '#3b82f6'; // Blue for completed orders
      break;
    case 'Total Orders in Shipping':
      IconComponent = FaTruck;
      iconColor = '#f97316'; // Orange for shipping
      break;
    case 'Total Revenue':
      IconComponent = FaDollarSign;
      iconColor = '#22c55e'; // Green for revenue
      break;
    default:
      IconComponent = BsCartCheck;
      iconColor = '#2dd4bf'; // Default teal
  }

  return (
    <div className={cx('wrapper', 'bg-white w-full rounded-3xl shadow-md py-16 px-12 flex justify-between items-center')}>
      <div>
        <h2 className={cx('title', 'font-bold text-indigo-700')}>{name}</h2>
        <div className={cx('content', 'flex items-center mt-8')}>
          <div className={cx('icon', 'bg-teal-100 p-2 rounded-xl mr-6')}>
            <IconComponent size={40} color={iconColor} />
          </div>
          <div>
            <p className={cx('price', 'font-bold text-indigo-700')}>{price}</p>
          </div>
        </div>
      </div>
      <div className={cx('stats', 'flex flex-col items-end')}>
        <FaEllipsisH size={30} className={cx('more', 'mb-2 text-gray-600')} /> {/* Updated to a more modern "more" icon */}
        <div className={cx('rate', 'text-teal-500')}>↑ {rate}%</div>
        <p className={cx('comparison', 'text-gray-500')}>Compared to 2022</p>
      </div>
    </div>
  );
}

export default OrderSummary;