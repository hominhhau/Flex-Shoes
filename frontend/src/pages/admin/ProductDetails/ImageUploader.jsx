import React from 'react';
import classNames from 'classnames/bind';
import styles from './ProductForm.module.scss';

const cx = classNames.bind(styles);

const thumbnails = [
    { id: 1, name: 'Product thumbnail.png', progress: 50 },
    { id: 2, name: 'Product thumbnail.png', progress: 50 },
    { id: 3, name: 'Product thumbnail.png', progress: 50 },
    { id: 4, name: 'Product thumbnail.png', progress: 50 },
];

export function ImageUploader() {
    return (
        <section className={cx('imageSection')}>
            <div className={cx('mainImage')}>
                <img
                    src="https://cdn.builder.io/api/v1/image/assets/TEMP/10d1c979e7fdd0cae80d0d7b7efaddba58cd007da57440ba0f4a1cd6ac321c1d?placeholderIfAbsent=true&apiKey=e18ee7c2ed144d6ea9fc5b78b4956a1b"
                    alt="Product main image"
                    className={cx('productImage')}
                />
            </div>

            <div className={cx('fieldGroup')}>
                <h2 className={cx('fieldLabel')}>Product Gallery</h2>
                <div className={cx('dropZone')}>
                    <img
                        src="https://cdn.builder.io/api/v1/image/assets/TEMP/2a6ec2b79dfcb23a459b9b9d6541aaef60a163fd6b36dd4cdd9f2a55631bb934?placeholderIfAbsent=true&apiKey=e18ee7c2ed144d6ea9fc5b78b4956a1b"
                        alt=""
                        className={cx('uploadIcon')}
                    />
                    <p className={cx('uploadText')}>Drop your imager here, or browse</p>
                    <p className={cx('uploadHint')}>Jpeg, png are allowed</p>
                </div>
            </div>

            <div className={cx('thumbnailList')}>
                {thumbnails.map((thumbnail) => (
                    <div key={thumbnail.id} className={cx('thumbnailItem')}>
                        <img
                            src="https://cdn.builder.io/api/v1/image/assets/TEMP/dc8767cdbeabc46517901576f88041cf42721a02ca501d48eed025f74784f4e5?placeholderIfAbsent=true&apiKey=e18ee7c2ed144d6ea9fc5b78b4956a1b"
                            alt={`Thumbnail ${thumbnail.id}`}
                            className={cx('thumbnail')}
                        />
                        <div className={cx('thumbnailInfo')}>
                            <p className={cx('thumbnailName')}>{thumbnail.name}</p>
                            <div className={cx('progressBar')} />
                        </div>
                        <img
                            src="https://cdn.builder.io/api/v1/image/assets/TEMP/97113f1067f43df227ecafbbd19e17a2a63efcb68bd5da1296df0667d44741f2?placeholderIfAbsent=true&apiKey=e18ee7c2ed144d6ea9fc5b78b4956a1b"
                            alt="Delete thumbnail"
                            className={cx('deleteIcon')}
                            role="button"
                            tabIndex={0}
                        />
                    </div>
                ))}
            </div>
        </section>
    );
}
