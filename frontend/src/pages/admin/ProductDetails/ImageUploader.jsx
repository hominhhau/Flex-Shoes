import React, { useState, useCallback, useRef, useEffect } from 'react';
import classNames from 'classnames/bind';
import styles from './ProductDetails.module.scss';

const cx = classNames.bind(styles);

// Hiển thị từng ảnh nhỏ
const Thumbnail = React.memo(({ image, index, onDelete }) => {
    const getImageUrl = () => {
        if (image.url) return image.url; // Ảnh mới (blob)
        if (image.imageID?.URL) return image.imageID.URL; // Ảnh từ API
        return '';
    };

    return (
        <div className={cx('thumbnailItem')}>
            <img src={getImageUrl()} alt={`Thumbnail ${index + 1}`} className={cx('thumbnail')} />
            <div className={cx('thumbnailInfo')}>
                <p className={cx('thumbnailName')}>{`Image ${index + 1}`}</p>
            </div>
            <img
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/888abed304c7b62175d81ba429c625f88c079f22266ff2d7777f87ff6130d33b"
                alt="Delete thumbnail"
                className={cx('deleteIcon')}
                role="button"
                tabIndex={0}
                onClick={onDelete}
            />
        </div>
    );
});

export function ImageUploader({ images = [], onImagesChange }) {
    const [uploadedImages, setUploadedImages] = useState(images);
    const fileInputRef = useRef(null);

    // Cập nhật state nếu props thay đổi (ảnh từ API)
    useEffect(() => {
        setUploadedImages(images);
    }, [images]);

    // Lấy ảnh chính để hiển thị preview
    const getMainImageUrl = (img) => {
        if (!img) return '';
        if (img.url) return img.url;
        if (img.imageID?.URL) return img.imageID.URL;
        return '';
    };

    // Thêm ảnh mới
    const handleFileChange = useCallback(
        (e) => {
            const files = Array.from(e.target.files);
            if (files.length === 0) return;

            const newImages = files.map((file) => ({
                file,
                url: URL.createObjectURL(file),
                name: file.name,
            }));

            const updatedImages = [...uploadedImages, ...newImages];
            setUploadedImages(updatedImages);
            onImagesChange(updatedImages);

            if (fileInputRef.current) fileInputRef.current.value = '';
        },
        [uploadedImages, onImagesChange],
    );

    // Xóa ảnh
    const handleDeleteImage = useCallback(
        (index) => {
            const newImages = uploadedImages.filter((_, i) => i !== index);
            setUploadedImages(newImages);
            onImagesChange(newImages);
        },
        [uploadedImages, onImagesChange],
    );

    return (
        <section className={cx('imageSection')}>
            <div className={cx('mainImage')}>
                <img
                    src={
                        getMainImageUrl(uploadedImages[0]) ||
                        'https://cdn.builder.io/api/v1/image/assets/TEMP/10d1c979e7fdd0cae80d0d7b7efaddba58cd007da57440ba0f4a1cd6ac321c1d'
                    }
                    alt="Product main image"
                    className={cx('productImage')}
                />
            </div>

            <div className={cx('fieldGroup')}>
                <h2 className={cx('fieldLabel')}>Product Gallery</h2>
                <div className={cx('dropZone')}>
                    <input type="file" accept="image/*" multiple onChange={handleFileChange} ref={fileInputRef} />
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
