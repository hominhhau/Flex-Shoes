import React from 'react';
import classNames from 'classnames/bind';
import styles from './ProductForm.module.scss';
import { ProductDetails } from './ProductDetails';
import { ImageUploader } from './ImageUploader';

const cx = classNames.bind(styles);

const ProductForm = () => {
    return (
        <form className={cx('formContainer')}>
            <div className={cx('formContent')}>
                <ProductDetails />
                <ImageUploader />
            </div>

            <div className={cx('actionButtons')}>
                <button type="submit" className={cx('button', 'updateButton')}>
                    Update
                </button>
                <button type="button" className={cx('button', 'deleteButton')}>
                    Delete
                </button>
                <button type="button" className={cx('button', 'cancelButton')}>
                    Cancel
                </button>
            </div>
        </form>
    );
};

export default ProductForm;
