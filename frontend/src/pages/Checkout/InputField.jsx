import React from 'react';
import styles from './Checkout.module.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(styles);

const InputField = ({ 
    label, 
    type = 'text', 
    id, 
    placeholder, 
    helperText,
    width,
    value,
    onChange,
}) => {
  return (
    <div className={cx('inputField')}>
      <div className={cx('inputContainer')}>
        <label htmlFor={id} className={cx('visually-hidden')}>{label}</label>
        <input
          type={type}
          id={id}
          className={cx('input')}
          placeholder={placeholder}
          aria-label={label}
          style={{ width }}
          value={value}
          onChange={onChange}
        />
        {helperText && <div className={cx('helperText')}>{helperText}</div>}
      </div>
    </div>
  );
};

export default InputField;
