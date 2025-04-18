import React, { useState, useEffect } from 'react';
import classNames from 'classnames/bind';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styles from './CartComponent.module.scss';

const cx = classNames.bind(styles);

type CartComponentProps = {
  image: string;
  name: string;
  color: string;
  size: string;
  initialQuantity?: number;
  price: number;
  removeIcon: any;
  onRemove: () => void;
  onQuantityChange: (quantity: number) => void;
  onCheckboxChange: (isChecked: boolean, product: any) => void;
  allowQuantityChange?: boolean;
  product: any;
  isChecked?: boolean; // Thêm prop để đồng bộ với checkedItems từ Cart
};

const ShoppingBag: React.FC<CartComponentProps> = ({
  image,
  name,
  color,
  size,
  initialQuantity = 1,
  price,
  removeIcon,
  onRemove,
  onQuantityChange,
  onCheckboxChange,
  allowQuantityChange = true,
  product,
  isChecked = false,
}) => {
  const [quantity, setQuantity] = useState<number>(initialQuantity);

  useEffect(() => {
    setQuantity(initialQuantity);
  }, [initialQuantity]);

  const totalPrice = (price * quantity).toFixed(2);

  const increaseQuantity = () => {
    setQuantity((prev) => {
      const newQuantity = prev + 1;
      onQuantityChange(newQuantity);
      return newQuantity;
    });
  };

  const decreaseQuantity = () => {
    setQuantity((prev) => {
      const newQuantity = Math.max(prev - 1, 1);
      onQuantityChange(newQuantity);
      return newQuantity;
    });
  };

  const handleCheckboxChange = () => {
    console.log("Checkbox changed for product:", product, "New state:", !isChecked);
    onCheckboxChange(!isChecked, product);
  };

  return (
    <main className={cx('bagContainer')}>
      <section className={cx('productContainer')}>
        <div className={cx('checkboxContainer')}>
          <label>
            <input
              type="checkbox"
              checked={isChecked}
              onChange={handleCheckboxChange}
              className={cx('checkbox')}
            />
            <span className={cx('checkboxLabel')}></span>
          </label>
        </div>
        <img loading="lazy" src={image} alt={name} className={cx('productImage')} />

        <article className={cx('productDetailsContainer')}>
          <div className={cx('productInfoWrapper')}>
            <div className={cx('productInfo')}>
              <h2 className={cx('productName')}>{name}</h2>
              <div className={cx('productMetaContainer')}>
                <p className={cx('productColor')}>{color}</p>
                <p className={cx('productSize')}>{size}</p>
              </div>

              <div className={cx('productOptionsContainer')}>
                <div className={cx('sizeContainer')}>
                  <label htmlFor="size" className={cx('sizeLabel')}>
                    Size
                  </label>
                  <span className={cx('sizeText')}>{size}</span>
                </div>

                <div className={cx('quantityContainer')}>
                  <label className={cx('quantityLabel')}>Quantity</label>
                  <div className={cx('quantityControl')}>
                    {allowQuantityChange ? (
                      <>
                        <button onClick={decreaseQuantity} className={cx('quantityButton')}>
                          -
                        </button>
                        <span className={cx('quantityText')}>{quantity}</span>
                        <button onClick={increaseQuantity} className={cx('quantityButton')}>
                          +
                        </button>
                      </>
                    ) : (
                      <span className={cx('quantityText')}>{quantity}</span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <p className={cx('price')}>${totalPrice}</p>
          </div>

          <div className={cx('actionButtonsContainer')}>
            <button className={cx('actionButton')} onClick={onRemove}>
              <FontAwesomeIcon icon={removeIcon} size="2x" />
            </button>
          </div>
        </article>
      </section>
    </main>
  );
};

export default ShoppingBag;