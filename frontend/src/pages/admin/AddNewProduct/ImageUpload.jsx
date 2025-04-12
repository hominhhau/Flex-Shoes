import React, { useState, useCallback, useRef } from 'react';
import classNames from 'classnames/bind';
import styles from './AddNewProduct.module.scss';

const cx = classNames.bind(styles);

const Thumbnail = React.memo(({ image, index, onDelete }) => {
    return (
        <div className={cx('thumbnailItem')}>
            <img src={image.url} alt={`Thumbnail ${index + 1}`} className={cx('thumbnail')} />
            <div className={cx('thumbnailInfo')}>
                <p className={cx('thumbnailName')}>{image.name || `Image ${index + 1}`}</p>
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
    const [uploadedImages, setUploadedImages] = useState([]);
    const fileInputRef = useRef(null);

    const handleFileChange = useCallback(
        (e) => {
            const files = Array.from(e.target.files); // Lấy danh sách file
            if (files.length === 0) return;

            const newImages = files.map((file) => ({
                file, // Lưu File object để gửi lên server
                url: URL.createObjectURL(file), // URL để hiển thị preview
                name: file.name, // Sử dụng tên file gốc
            }));

            setUploadedImages((prevImages) => {
                const updatedImages = [...prevImages, ...newImages];
                onImagesChange(updatedImages); // Gửi danh sách ảnh mới lên component cha
                return updatedImages;
            });

            // Reset input file
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        },
        [onImagesChange],
    );

    const handleDeleteImage = useCallback(
        (index) => {
            setUploadedImages((prevImages) => {
                const newImages = prevImages.filter((_, i) => i !== index);
                onImagesChange(newImages); // Cập nhật danh sách ảnh khi xóa
                return newImages;
            });
        },
        [onImagesChange],
    );

    return (
        <section className={cx('imageSection')}>
            <div className={cx('mainImage')}>
                <img
                    src={
                        uploadedImages.length > 0
                            ? uploadedImages[0].url
                            : 'https://cdn.builder.io/api/v1/image/assets/TEMP/10d1c979e7fdd0cae80d0d7b7efaddba58cd007da57440ba0f4a1cd6ac321c1d?placeholderIfAbsent=true&apiKey=e18ee7c2ed144d6ea9fc5b78b4956a1b'
                    }
                    alt="Product main image"
                    className={cx('productImage')}
                />
            </div>

            <div className={cx('fieldGroup')}>
                <h2 className={cx('fieldLabel')}>Product Gallery</h2>
                <div className={cx('dropZone')}>
                    <input
                        type="file"
                        accept="image/*"
                        multiple // Hỗ trợ chọn nhiều file
                        onChange={handleFileChange}
                        ref={fileInputRef}
                    />
                </div>
            </div>

            <div className={cx('thumbnailList')}>
                {uploadedImages.map((img, index) => (
                    <Thumbnail key={index} image={img} index={index} onDelete={() => handleDeleteImage(index)} />
                ))}
            </div>
        </section>
    );
}
