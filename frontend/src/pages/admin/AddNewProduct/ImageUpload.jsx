import React from 'react';
import classNames from 'classnames/bind';
import styles from './AddNewProduct.module.scss';
const cx = classNames.bind(styles);

export function ImageUpload({
    mainImage,
    galleryImages = [],
    onMainImageChange,
    onGalleryImageAdd,
    onGalleryImageRemove,
}) {
    const handleFileUpload = (e) => {
        const files = e.target.files;
        if (files.length > 0 && onGalleryImageAdd) {
            const uploadedImages = Array.from(files).map((file) => ({
                id: file.name,
                name: file.name,
                url: URL.createObjectURL(file),
            }));
            onGalleryImageAdd(uploadedImages);
        }
    };

    return (
        <section className={cx('imageSection')}>
            {/* Main Image */}
            {/* <div className={cx('mainImage')}>
                <img src={mainImage} alt="Product main" className={cx('mainImagePreview')} />
                {onMainImageChange && (
                    <input
                        type="file"
                        accept="image/jpeg, image/png"
                        className={cx('fileInput')}
                        onChange={(e) => onMainImageChange(e.target.files[0])}
                    />
                )}
            </div> */}

            {/* Gallery Section */}
            <div>
                <h2 className={cx('fieldLabel')}>Product Gallery</h2>
                <div className={cx('dropZone')}>
                    <input
                        type="file"
                        accept="image/jpeg, image/png"
                        multiple
                        className={cx('fileInput')}
                        onChange={handleFileUpload}
                    />
                    <img
                        src="https://cdn.builder.io/api/v1/image/assets/TEMP/2a6ec2b79dfcb23a459b9b9d6541aaef60a163fd6b36dd4cdd9f2a55631bb934?placeholderIfAbsent=true&apiKey=e18ee7c2ed144d6ea9fc5b78b4956a1b"
                        alt="Upload icon"
                        width="64"
                        height="64"
                    />
                    <div>
                        <p>Drop your image here, or browse</p>
                        <p>Jpeg, png are allowed</p>
                    </div>
                </div>

                {/* Gallery Images */}
                <div className={cx('gallery')}>
                    {galleryImages.map((image) => (
                        <div key={image.id} className={cx('galleryImage')}>
                            <img src={image.url} alt={image.name} className={cx('galleryImagePreview')} />
                            <button
                                type="button"
                                className={cx('deleteButton')}
                                onClick={() => onGalleryImageRemove && onGalleryImageRemove(image.id)}
                            >
                                Remove
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
