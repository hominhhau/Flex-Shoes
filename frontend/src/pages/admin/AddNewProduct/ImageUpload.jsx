import React, { useState, useCallback } from 'react';
import classNames from 'classnames/bind';
import styles from './AddNewProduct.module.scss';

const cx = classNames.bind(styles);

// Thumbnail component wrapped in React.memo
const Thumbnail = React.memo(({ url, index, onDelete }) => {
    return (
        <div className={cx('thumbnailItem')}>
            <img src={url} alt={`Thumbnail ${index + 1}`} className={cx('thumbnail')} />
            <div className={cx('thumbnailInfo')}>
                <p className={cx('thumbnailName')}>Uploaded Image {index + 1}</p>
            </div>
            <img
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/888abed304c7b62175d81ba429c625f88c079f22266ff2d7777f87ff6130d33b?placeholderIfAbsent=true&apiKey=e18ee7c2ed144d6ea9fc5b78b4956a1b"
                alt="Delete thumbnail"
                className={cx('deleteIcon')}
                role="button"
                tabIndex={0}
                onClick={onDelete}
            />
        </div>
    );
});

export function ImageUploader({ onImagesChange }) {
    const [imageUrl, setImageUrl] = useState('');
    const [uploadedImages, setUploadedImages] = useState([]);

    const handleAddImage = useCallback(() => {
        if (imageUrl) {
            setUploadedImages((prevImages) => {
                const newImages = [...prevImages, imageUrl];
                onImagesChange(newImages); // Notify parent of new images
                return newImages;
            });
            setImageUrl(''); // Clear input after adding
        }
    }, [imageUrl, onImagesChange]);

    const handleDeleteImage = useCallback((index) => {
        setUploadedImages((prevImages) => {
            const newImages = prevImages.filter((_, i) => i !== index);
            onImagesChange(newImages); // Notify parent of updated images
            return newImages;
        });
    }, [onImagesChange]);

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
                    <input
                        type="text"
                        value={imageUrl}
                        onChange={(e) => setImageUrl(e.target.value)}
                        placeholder="        Enter image URL"
                    />
                    <br />
                    <button type="button" onClick={handleAddImage} style={{ color: 'green', paddingTop: '20px' }}>
                        Add Image
                    </button>
                </div>
            </div>

            <div className={cx('thumbnailList')}>
                {uploadedImages.length > 0 &&
                    uploadedImages.map((url, index) => (
                        <Thumbnail key={index} url={url} index={index} onDelete={() => handleDeleteImage(index)} />
                    ))}
            </div>
        </section>
    );
}
