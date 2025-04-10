import React, { useState, useEffect } from 'react';
import classNames from 'classnames/bind';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import styles from './CartComponent.module.scss';

const cx = classNames.bind(styles);

type CartComponentProps = {
    image: string;
    name: string;
    category: string;
    color: string;
    sizeOptions: string;
    initialSize?: string;
    initialQuantity?: number;
    price: number;
    removeIcon: IconDefinition;
    onRemove: () => void;
    onQuantityChange: (quantity: number) => void;
    onCheckboxChange: (isChecked: boolean) => void;
    allowQuantityChange?: boolean;
    allowSizeChange?: boolean;
};

const ShoppingBag: React.FC<CartComponentProps> = ({
    image,
    name,
    category,
    color,
    sizeOptions,
    initialSize,
    initialQuantity = 1,
    price,
    removeIcon,
    onRemove,
    onQuantityChange,
    onCheckboxChange,
    allowQuantityChange = true,
    allowSizeChange = true,
}) => {
    // const [size, setSize] = useState<string>(initialSize);
    const [quantity, setQuantity] = useState<number>(initialQuantity);
    const [isChecked, setIsChecked] = useState(false); // State for checkbox

    const totalPrice = (price * quantity).toFixed(2);

    // const handleSizeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    //   setSize(event.target.value);
    // };

    const increaseQuantity = () => {
        setQuantity((prevQuantity) => {
            const newQuantity = prevQuantity + 1;
            console.log(`Số lượng mới: ${newQuantity}`);
            onQuantityChange(newQuantity); //goi calback khi cap nhat cha
            return newQuantity;
        });
    };

    const decreaseQuantity = () => {
        setQuantity((prevQuantity) => {
            const newQuantity = Math.max(prevQuantity - 1, 1);
            console.log(`Số lượng mới: ${newQuantity}`);
            onQuantityChange(newQuantity); //goi calback khi cap nhat cha
            return newQuantity;
        });
    };

    const handleCheckboxChange = () => {
        const newCheckedState = !isChecked;
        setIsChecked(newCheckedState); // Cập nhật trạng thái trong con
        if (onCheckboxChange) {
            onCheckboxChange(newCheckedState); // Gọi callback để gửi trạng thái lên cha
        }
    };

    return (
        <main className={cx('bagContainer')}>
            <section className={cx('productContainer')}>
                {/* Checkbox for item selection */}
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
                                <p className={cx('productCategory')}>{category}</p>
                                <p className={cx('productColor')}>{color}</p>
                            </div>

                            <div className={cx('productOptionsContainer')}>
                                {/* size */}
                                <div className={cx('sizeContainer')}>
                                    <label htmlFor="size" className={cx('sizeLabel')}>
                                        Size
                                    </label>
                                    <span className={cx('sizeText')}>{sizeOptions}</span>
                                </div>

                                {/* Quantity */}
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
                                            <span className={cx('quantityText')}>{quantity}</span> // Hiển thị số lượng không nút
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
