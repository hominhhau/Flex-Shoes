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
  error,
}) => {
  return (
    <div className={cx('inputField')}>
      <div className={cx('inputContainer')}>
        <label htmlFor={id} className={cx('visually-hidden')}>
          {label}
        </label>
        <input
          type={type}
          id={id}
          className={cx('input', { 'inputError': !!error })}
          placeholder={placeholder}
          aria-label={label}
          style={{ width }}
          value={value}
          onChange={onChange}
        />
        {helperText && !error && <div className={cx('helperText')}>{helperText}</div>}
        {error && <div className={cx('errorText')}>{error}</div>}
      </div>
    </div>
  );
};

export default InputField;