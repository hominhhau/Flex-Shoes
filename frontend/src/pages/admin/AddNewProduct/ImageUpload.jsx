import React from 'react';
import classNames from 'classnames/bind';
import styles from '../ProductForm.module.scss';

const cx = classNames.bind(styles);

export const ImageUpload = ({ image, onDelete }) => {
    return (
        <div className={cx('uploadedImage')}>
            <img src={image.url} alt={image.name} className={cx('uploadIcon')} />
            <div>
                <p>{image.name}</p>
                <div className={cx('progressBar')}>
                    <div className={cx('progress')} />
                </div>
            </div>
            <button className={cx('deleteButton')} onClick={() => onDelete(image.id)} aria-label="Delete image">
                <img
                    src="https://cdn.builder.io/api/v1/image/assets/TEMP/97113f1067f43df227ecafbbd19e17a2a63efcb68bd5da1296df0667d44741f2?placeholderIfAbsent=true&apiKey=e18ee7c2ed144d6ea9fc5b78b4956a1b"
                    alt=""
                    className={cx('uploadIcon')}
                />
            </button>
        </div>
    );
};
