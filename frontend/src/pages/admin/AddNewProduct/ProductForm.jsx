import React, { useState } from 'react';
import { ImageUpload } from './components/ImageUpload';
import { TagList } from './components/TagList';
import styles from './ProductForm.module.css';

const initialTags = ['Adidas', 'Shoes', 'Sneakers', 'Ultraboost'];
const initialImages = [
  { id: 1, name: 'Product thumbnail.png', url: 'https://example.com/image1.png' },
  { id: 2, name: 'Product thumbnail.png', url: 'https://example.com/image2.png' },
];

export const ProductForm = () => {
  const [tags, setTags] = useState(initialTags);
  const [uploadedImages, setUploadedImages] = useState(initialImages);

  const handleImageDelete = (id) => {
    setUploadedImages((prevImages) => prevImages.filter((image) => image.id !== id));
  };

  const handleTagDelete = (tag) => {
    setTags((prevTags) => prevTags.filter((t) => t !== tag));
  };

  return (
    <form className={styles.formContainer}>
      <div className={styles.formContent}>
        <section className={styles.formSection}>
          {/* Product Fields */}
          <div className={styles.inputGroup}>
            <label htmlFor="productName" className={styles.inputLabel}>Product Name</label>
            <input id="productName" type="text" className={styles.textInput} placeholder="Type name here" />
          </div>

          {/* Other Fields */}
          <div className={styles.inputGroup}>
            <label htmlFor="tags" className={styles.inputLabel}>Tags</label>
            <TagList tags={tags} onDelete={handleTagDelete} />
          </div>
        </section>

        <section className={styles.imageSection}>
          {/* Main Image */}
          <div className={styles.mainImage}>
            <img src="https://example.com/main-image.png" alt="Product main" className={styles.mainImagePreview} />
          </div>

          {/* Image Upload Section */}
          <div className={styles.inputGroup}>
            <h2 className={styles.inputLabel}>Product Gallery</h2>
            {uploadedImages.map((image) => (
              <ImageUpload key={image.id} image={image} onDelete={handleImageDelete} />
            ))}
          </div>
        </section>
      </div>

      {/* Form Buttons */}
      <div className={styles.buttonGroup}>
        <button type="submit" className={`${styles.button} ${styles.primaryButton}`}>Save</button>
        <button type="button" className={`${styles.button} ${styles.secondaryButton}`}>Cancel</button>
      </div>
    </form>
  );
};
