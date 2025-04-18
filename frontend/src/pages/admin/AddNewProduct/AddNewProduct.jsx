import React, { useState, useEffect } from 'react';
import classNames from 'classnames/bind';

import styles from './AddNewProduct.module.scss';
import { ImageUploader } from './ImageUpload';
import { Api_AddProduct } from '../../../../apis/Api_AddProduct';
import { useNavigate } from 'react-router-dom';
import config from '../../../config';
import { Api_ChatGPT } from '../../../../apis/Api_ChatGPT';

const cx = classNames.bind(styles);

const AddNewProduct = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        productName: '',
        description: '',
        category: null,
        brandName: null,
        status: 'Available',
        discount: 0,
        originalPrice: 0,
        vat: 10,
        images: [],
        gender: null,
        purchases: [],
    });
    const [loadingAI, setLoadingAI] = useState(false);

    console.log('Form data trước khi gửi:', formData);

    const [newPurchase, setNewPurchase] = useState({
        color: null,
        size: null,
        quantity: 1,
    });
    console.log('New purchase:', newPurchase);

    const [purchases, setPurchases] = useState([]);
    const [colors, setColors] = useState([]);
    const [sizes, setSizes] = useState([]);
    const [categorys, setCategories] = useState([]);
    const [brands, setBrands] = useState([]);
    console.log('Purchases:', purchases);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const categoryRes = await Api_AddProduct.getCategory();
                const brandRes = await Api_AddProduct.getBrand();
                const colorRes = await Api_AddProduct.getColor();
                const sizeRes = await Api_AddProduct.getSize();
                setCategories(categoryRes);
                setBrands(brandRes);
                setColors(colorRes);
                setSizes(sizeRes);
            } catch (error) {
                console.error('Lỗi khi load Color/Size:', error);
            }
        };
        fetchData();
    }, []);

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
    const handleImproveDescription = async () => {
        if (!formData.description.trim()) {
            alert('Please enter a description before using AI to improve it.');
            return;
        }
        const trimmedDescription = formData.description.trim();

        setLoadingAI(true);
        try {
            const response = await Api_ChatGPT.chatgpt(trimmedDescription);

            if (response && response.improvedDescription) {
                setFormData((prev) => ({
                    ...prev,
                    description: response.improvedDescription,
                }));
            } else {
                alert('Failed to improve description. Please try again.');
            }
        } catch (error) {
            console.error('Error fetching AI description:', error);
        } finally {
            setLoadingAI(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        //   Validation checks (bỏ comment nếu cần)
        if (
            !formData.productName ||
            !formData.description ||
            !formData.images.length ||
            !formData.category ||
            !formData.brandName ||
            !formData.gender ||
            formData.discount <= 0 ||
            formData.originalPrice <= 0
        ) {
            alert(
                'Please fill in all required fields: Product Name, Description, Images, Category, Brand Name, Sale Price, and Regular Price.',
            );
            return;
        }

        // Tạo FormData để gửi dữ liệu
        const formDataToSend = new FormData();
        formDataToSend.append('productName', formData.productName);
        formDataToSend.append('description', formData.description);
        formDataToSend.append('originalPrice', formData.originalPrice);
        formDataToSend.append('discount', formData.discount);
        formDataToSend.append('vat', formData.vat);
        formDataToSend.append('status', formData.status);
        formDataToSend.append('gender', formData.gender ? formData.gender.toUpperCase() : '');
        formDataToSend.append('brandId', formData.brandName);
        formDataToSend.append('categoryId', formData.category);

        // Thêm file ảnh
        formData.images.forEach((image, index) => {
            console.log(`Adding image ${index}:`, image.file); // Log để kiểm tra
            formDataToSend.append('images', image.file); // Field name phải là 'images'
        });

        formDataToSend.append(
            'inventory',
            JSON.stringify(
                purchases.map((purchase) => ({
                    color: purchase.color._id,
                    size: purchase.size._id,
                    quantity: purchase.quantity,
                })),
            ),
        );

        // Log toàn bộ FormData
        for (let [key, value] of formDataToSend.entries()) {
            console.log(`${key}:`, value);
        }

        try {
            const createdProduct = await Api_AddProduct.createProduct(formDataToSend);
            console.log('Created product:', createdProduct);
            if (createdProduct) {
                alert('Product created successfully!');
                // navigate(config.routes.admin.products);
            } else {
                alert('Failed to create product. Please try again.');
            }
        } catch (error) {
            console.error('Error creating product:', error);
            alert('An error occurred while creating the product. Please try again later.');
        }
    };

    const handleAddPurchase = () => {
        if (!newPurchase.color || !newPurchase.size) {
            alert('Please select both color and size before adding.');
            return;
        }

        const existingPurchase = purchases.find(
            (p) => p.color._id === newPurchase.color._id && p.size._id === newPurchase.size._id,
        );

        if (existingPurchase) {
            setPurchases((prev) =>
                prev.map((p) =>
                    p.color._id === newPurchase.color._id && p.size._id === newPurchase.size._id
                        ? { ...p, quantity: p.quantity + newPurchase.quantity }
                        : p,
                ),
            );
        } else {
            setPurchases((prev) => [...prev, { ...newPurchase }]);
        }

        setNewPurchase({ color: null, size: null, quantity: 1 });
    };

    const handleQuantityChange = (colorId, sizeId, newQuantity) => {
        // Chuyển đổi newQuantity thành số nguyên, mặc định là 0 nếu không hợp lệ
        const quantity = Math.max(0, parseInt(newQuantity, 10) || 0);

        setPurchases((prevPurchases) =>
            prevPurchases.map((purchase) =>
                purchase.color._id === colorId && purchase.size._id === sizeId ? { ...purchase, quantity } : purchase,
            ),
        );
    };

    const handleImagesChange = (newImages) => {
        setFormData((prev) => ({
            ...prev,
            images: newImages.map((image) => ({
                file: image.file,
                name: image.name,
                url: image.url,
            })),
        }));
    };

    const handleDeletePurchase = (colorId, sizeId) => {
        setPurchases((prev) => prev.filter((p) => !(p.color._id === colorId && p.size._id === sizeId)));
    };

    const getColorName = (id) => colors.find((c) => c._id === id)?.colorName || id;
    const getSizeName = (id) => sizes.find((s) => s._id === id)?.sizeName || id;

    return (
        <form className={cx('formContainer')} onSubmit={handleSubmit}>
            <div className={cx('formContent')}>
                <section className={cx('inputSection')}>
                    <nav className={cx('breadcrumb')}>
                        <span>Home</span> &gt; <span>All Products</span> &gt; <span>Add Product </span>
                    </nav>

                    {/* Product Name */}
                    <div className={cx('fieldGroup')}>
                        <label htmlFor="productName" className={cx('fieldLabel')}>
                            Product Name
                        </label>
                        <div className={cx('inputWrapper')}>
                            <input
                                id="productName"
                                type="text"
                                className={cx('textInput')}
                                value={formData.productName}
                                onChange={(e) => handleInputChange('productName', e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Description */}
                    <div className={cx('fieldGroup')}>
                        <label htmlFor="description" className={cx('fieldLabel')}>
                            Description
                        </label>

                        <div className={cx('inputWrapper')}>
                            {/* Nút AI nằm trên textarea */}
                            {formData.description.trim() !== '' && (
                                <button
                                    className={cx('aiButton')}
                                    type="button"
                                    onClick={handleImproveDescription}
                                    disabled={loadingAI}
                                >
                                    {loadingAI ? 'Đang tạo mô tả...' : '✨ Tạo mô tả với chuyên gia Marketing AI'}
                                </button>
                            )}

                            <textarea
                                id="description"
                                className={cx('textArea')}
                                value={formData.description}
                                onChange={(e) => handleInputChange('description', e.target.value)}
                                placeholder="Enter a brief description..."
                            />
                        </div>
                    </div>

                    {/* Category */}
                    <div className={cx('fieldGroup')}>
                        <div className={cx('twoColumnGroup')}>
                            <div className={cx('columnField')}>
                                <label htmlFor="category" className={cx('fieldLabel')}>
                                    Category
                                </label>
                                <div className={cx('inputWrapper')}>
                                    <select
                                        id="category"
                                        className={cx('selectInput')}
                                        value={formData.category || ''}
                                        onChange={(e) => handleInputChange('category', e.target.value)}
                                    >
                                        <option value="" disabled>
                                            Select a category
                                        </option>
                                        {categorys.map((category) => (
                                            <option key={category._id} value={category._id}>
                                                {category.productTypeName}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className={cx('columnField')}>
                                <label htmlFor="brand" className={cx('fieldLabel')}>
                                    Brand Name
                                </label>
                                <div className={cx('inputWrapper')}>
                                    <select
                                        id="brand"
                                        className={cx('selectInput')}
                                        value={formData.brandName || ''}
                                        onChange={(e) => handleInputChange('brandName', e.target.value)}
                                    >
                                        <option value="" disabled>
                                            Select a brand
                                        </option>
                                        {brands.map((brand) => (
                                            <option key={brand._id} value={brand._id}>
                                                {brand.brandTypeName}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Gender */}
                    <div className={cx('fieldGroup')}>
                        <div className={cx('twoColumnGroup')}>
                            <div className={cx('columnField')}>
                                <label htmlFor="gender" className={cx('fieldLabel')}>
                                    Gender
                                </label>
                                <div className={cx('inputWrapper')}>
                                    <select
                                        id="gender"
                                        className={cx('selectInput')}
                                        value={formData.gender || ''}
                                        onChange={(e) => handleInputChange('gender', e.target.value)}
                                    >
                                        <option value="" disabled>
                                            Select gender
                                        </option>
                                        <option value="Men">Men</option>
                                        <option value="Women">Women</option>
                                        <option value="Unisex">Unisex</option>
                                    </select>
                                </div>
                            </div>

                            {/* VAT */}
                            <div className={cx('columnField')}>
                                <label htmlFor="vat" className={cx('fieldLabel')}>
                                    VAT (%)
                                </label>
                                <div className={cx('inputWrapper')}>
                                    <input id="vat" type="number" className={cx('textInput')} defaultValue="10" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Pricing */}
                    <div className={cx('fieldGroup')}>
                        <div className={cx('twoColumnGroup')}>
                            <div className={cx('columnField')}>
                                <label htmlFor="originalPrice" className={cx('fieldLabel')}>
                                    Original Price
                                </label>
                                <div className={cx('inputWrapper')}>
                                    <input
                                        id="originalPrice"
                                        type="number"
                                        className={cx('textInput')}
                                        value={formData.originalPrice}
                                        onChange={(e) => handleInputChange('originalPrice', parseFloat(e.target.value))}
                                    />
                                </div>
                            </div>
                            <div className={cx('columnField')}>
                                <label htmlFor="salePrice" className={cx('fieldLabel')}>
                                    Sale Price
                                </label>
                                <div className={cx('inputWrapper')}>
                                    <input
                                        id="salePrice"
                                        type="number"
                                        className={cx('textInput')}
                                        value={formData.discount}
                                        onChange={(e) => handleInputChange('discount', parseFloat(e.target.value))}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Status */}
                    <div className={cx('fieldGroup')}>
                        <label htmlFor="status" className={cx('fieldLabel')}>
                            Status
                        </label>
                        <div className={cx('inputWrapper')}>
                            <select id="status" className={cx('selectInput')} defaultValue="Active">
                                <option value="Available">Available</option>
                                <option value="Inavailable">Inavailable</option>
                            </select>
                        </div>
                    </div>

                    {/* Color, Size, Quantity */}
                    <div className={cx('threeColumnGroup')}>
                        <div className={cx('columnField')}>
                            <label htmlFor="color" className={cx('fieldLabel')}>
                                Color
                            </label>
                            <div className={cx('inputWrapper')}>
                                <select
                                    id="color"
                                    className={cx('selectInput')}
                                    value={newPurchase.color?._id || ''}
                                    onChange={(e) => {
                                        const selectedColor = colors.find((c) => c._id === e.target.value);
                                        setNewPurchase({ ...newPurchase, color: selectedColor });
                                    }}
                                >
                                    <option value="" disabled>
                                        Select a color
                                    </option>
                                    {colors.map((c) => (
                                        <option key={c._id} value={c._id}>
                                            {c.colorName}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className={cx('columnField')}>
                            <label htmlFor="size" className={cx('fieldLabel')}>
                                Size
                            </label>
                            <div className={cx('inputWrapper')}>
                                <select
                                    id="size"
                                    className={cx('selectInput')}
                                    value={newPurchase.size?._id || ''}
                                    onChange={(e) => {
                                        const selectedSize = sizes.find((s) => s._id === e.target.value);
                                        setNewPurchase({ ...newPurchase, size: selectedSize });
                                    }}
                                >
                                    <option value="" disabled>
                                        Select a size
                                    </option>
                                    {sizes.map((s) => (
                                        <option key={s._id} value={s._id}>
                                            {s.nameSize}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className={cx('columnField')}>
                            <label htmlFor="quantity" className={cx('fieldLabel')}>
                                Quantity
                            </label>
                            <div className={cx('inputWrapper')}>
                                <input
                                    id="quantity"
                                    type="number"
                                    className={cx('textInput')}
                                    value={newPurchase.quantity}
                                    min="1"
                                    onChange={(e) =>
                                        setNewPurchase({ ...newPurchase, quantity: parseInt(e.target.value, 10) })
                                    }
                                />
                            </div>
                        </div>
                    </div>

                    {/* Button to add quantity details */}
                    <div className={cx('columnField')}>
                        <div className={cx('inputWrapper')}>
                            <button type="button" className={cx('addButton')} onClick={handleAddPurchase}>
                                Add quantity details per color and size
                            </button>
                        </div>
                    </div>

                    {/* Recent Purchases Table */}
                    <header className={cx('tableHeader')}>
                        <div className={cx('headerCell')}>Color</div>
                        <div className={cx('headerCell')}>Size</div>
                        <div className={cx('headerCell')}>Quantity</div>
                        <div className={cx('headerCell')}>Actions</div>
                    </header>
                    <main className={cx('tableContainer')}>
                        {purchases.map((purchase) => (
                            <div className={cx('tableRow')} key={`${purchase.color._id}-${purchase.size._id}`}>
                                <div className={cx('cell')}>{purchase.color.colorName}</div>
                                <div className={cx('cell')}>{purchase.size.nameSize}</div>
                                <div className={cx('cell')}>
                                    <input
                                        type="number"
                                        className={cx('quantityInput')}
                                        value={purchase.quantity}
                                        min="0"
                                        onChange={(e) =>
                                            handleQuantityChange(
                                                purchase.color._id,
                                                purchase.size._id,
                                                parseInt(e.target.value, 10),
                                            )
                                        }
                                    />
                                </div>
                                <div className={cx('cell')}>
                                    <button
                                        type="button"
                                        className={cx('deleteButton')}
                                        onClick={() => handleDeletePurchase(purchase.color._id, purchase.size._id)}
                                    >
                                        ×
                                    </button>
                                </div>
                            </div>
                        ))}
                    </main>
                </section>
                <ImageUploader onImagesChange={handleImagesChange} />
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

export default AddNewProduct;
