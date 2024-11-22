import React, { useState } from 'react';
import classNames from 'classnames/bind';
import styles from './AddNewProduct.module.scss';
import { FormField } from './FormField';
import { ImageUpload } from './ImageUpload';
const cx = classNames.bind(styles);

const AddNewProduct = () => {
    const [formData, setFormData] = useState({
        productName: '',
        description: '',
        category: '',
        brandName: '',
        sku: 'Fox-3983',
        stockQuantity: '1258',
        regularPrice: '1000',
        salePrice: '450',
        tags: ['Adidas', 'Shoes', 'Sneakers', 'Ultraboost'],
    });

    const handleInputChange = (field, value) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleTagAdd = (tag) => {
        setFormData((prev) => ({
            ...prev,
            tags: [...prev.tags, tag],
        }));
    };

    const handleTagRemove = (tagToRemove) => {
        setFormData((prev) => ({
            ...prev,
            tags: prev.tags.filter((tag) => tag !== tagToRemove),
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Form Submitted:', formData);
    };

    return (
        <form className={cx('formContainer')} onSubmit={handleSubmit}>
            <div className={cx('formContent')}>
                <section className={cx('inputContainer')}>
                    <FormField
                        label="Product Name"
                        id="productName"
                        placeholder="Type name here"
                        value={formData.productName}
                        onChange={(e) => handleInputChange('productName', e.target.value)}
                    />
                    <FormField
                        label="Description"
                        id="description"
                        type="textarea"
                        placeholder="Type description here"
                        value={formData.description}
                        onChange={(e) => handleInputChange('description', e.target.value)}
                    />
                    <FormField
                        label="Category"
                        id="category"
                        placeholder="Type category here"
                        value={formData.category}
                        onChange={(e) => handleInputChange('category', e.target.value)}
                    />
                    <FormField
                        label="Brand Name"
                        id="brandName"
                        placeholder="Type brand name here"
                        value={formData.brandName}
                        onChange={(e) => handleInputChange('brandName', e.target.value)}
                    />
                    <div className={cx('formField')}>
                        <div style={{ display: 'flex', gap: '24px' }}>
                            <FormField
                                label="SKU"
                                id="sku"
                                value={formData.sku}
                                onChange={(e) => handleInputChange('sku', e.target.value)}
                            />
                            <FormField
                                label="Stock Quantity"
                                id="stockQuantity"
                                type="number"
                                value={formData.stockQuantity}
                                onChange={(e) => handleInputChange('stockQuantity', e.target.value)}
                            />
                        </div>
                    </div>
                    <div className={cx('formField')}>
                        <div style={{ display: 'flex', gap: '24px' }}>
                            <FormField
                                label="Regular Price"
                                id="regularPrice"
                                value={formData.regularPrice}
                                onChange={(e) => handleInputChange('regularPrice', e.target.value)}
                            />
                            <FormField
                                label="Sale Price"
                                id="salePrice"
                                value={formData.salePrice}
                                onChange={(e) => handleInputChange('salePrice', e.target.value)}
                            />
                        </div>
                    </div>
                    <TagsInput tags={formData.tags} onAdd={handleTagAdd} onRemove={handleTagRemove} />
                </section>
                <ImageUpload mainImage={cx('mainImage')} />
            </div>
            <div className={cx('buttonContainer')}>
                <button type="submit" className={cx('submitButton')}>
                    Submit
                </button>
                <button type="button" className={cx('cancelButton')}>
                    Cancel
                </button>
            </div>
        </form>
    );
};

function TagsInput({ tags, onAdd, onRemove }) {
    const [newTag, setNewTag] = useState('');

    const handleAddTag = () => {
        if (newTag.trim() && !tags.includes(newTag)) {
            onAdd(newTag.trim());
            setNewTag('');
        }
    };

    return (
        <div className={cx('formField')}>
            <label htmlFor="tags" className={cx('fieldLabel')}>
                Tags
            </label>
            <div className={cx('tagInput')}>
                {tags.map((tag) => (
                    <span key={tag} className={cx('tag')}>
                        {tag}
                        <button type="button" className={cx('tagRemoveButton')} onClick={() => onRemove(tag)}>
                            &times;
                        </button>
                    </span>
                ))}
                <input
                    type="text"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    placeholder="Add a tag"
                    className={cx('newTagInput')}
                />
                <button type="button" className={cx('addTagButton')} onClick={handleAddTag}>
                    Add
                </button>
            </div>
        </div>
    );
}
export default AddNewProduct;
