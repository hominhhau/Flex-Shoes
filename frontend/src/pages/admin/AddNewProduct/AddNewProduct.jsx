import React, { useState, useEffect } from 'react';
import classNames from 'classnames/bind';

import styles from './AddNewProduct.module.scss';
import { ImageUploader } from './ImageUpload';
import { Api_AddProduct } from '../../../../apis/Api_AddProduct';
import { useNavigate } from 'react-router-dom';
import config from '../../../config';

const cx = classNames.bind(styles);

const AddNewProduct = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        productName: '',
        description: '',
        category: null,
        brandName: null,
        status: 'Available',
        sellingPrice: 0,
        originalPrice: 0,
        vat: 10,
        images: [],
        gender: null,
    });

    console.log('Form data trước khi gửi:', formData);

    const [newPurchase, setNewPurchase] = useState({
        color: null,
        size: null,
        quantity: 1,
    });

    const [purchases, setPurchases] = useState([]);
    const [colors, setColors] = useState([]);
    const [sizes, setSizes] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const colorRes = await Api_AddProduct.getColor();
                const sizeRes = await Api_AddProduct.getSize();
                setColors(colorRes);
                setSizes(sizeRes);
            } catch (error) {
                console.error('Lỗi khi load Color/Size:', error);
            }
        };
        fetchData();
    }, []);

    // const sizeMapping = {
    //     S: 1,
    //     M: 2,
    //     L: 3,
    //     XL: 4,
    //     XXL: 5,
    //     36: 6,
    //     37: 7,
    //     38: 8,
    //     39: 9,
    //     40: 10,
    //     41: 11,
    //     42: 12,
    //     43: 13,
    //     44: 14,
    //     45: 15,
    // };

    // const colorMapping = {
    //     Red: 1,
    //     Blue: 2,
    //     Green: 3,
    //     Black: 4,
    //     White: 5,
    //     Gray: 6,
    //     Yellow: 7,
    //     Pink: 8,
    //     Brown: 9,
    //     Purple: 10,
    // };

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

    // const handleSubmit = async (e) => {
    //     e.preventDefault();

    //     // Validation checks
    //     if (
    //         !formData.productName ||
    //         !formData.description ||
    //         !formData.images.length ||
    //         !formData.category ||
    //         !formData.brandName ||
    //         !formData.gender ||
    //         formData.sellingPrice <= 0 ||
    //         formData.originalPrice <= 0
    //     ) {
    //         alert(
    //             'Please fill in all required fields: Product Name, Description, Images, Category, Brand Name, Sale Price, and Regular Price.',
    //         );
    //     }

    //     const addProductDto = {
    //         productName: formData.productName,
    //         description: formData.description,
    //         originalPrice: parseFloat(formData.originalPrice),
    //         status: formData.status,
    //         sellingPrice: parseFloat(formData.sellingPrice),
    //         vat: formData.vat,
    //         images: formData.images,
    //         gender: formData.gender ? formData.gender.toUpperCase() : null,
    //         brand: {
    //             brandId: formData.brandName,
    //         },
    //         productCategory: {
    //             categoryId: formData.category,
    //         },
    //     };

    //     console.log('Product data:', addProductDto);

    //     try {
    //         // Create the product
    //         const response = await Api_AddProduct.createProduct(addProductDto);
    //         console.log('API Response:', response);

    //         const createdProduct = response.product; // Adjust based on your API response structure
    //         console.log('Created product:', createdProduct);

    //         const productId = createdProduct._id;
    //         const inventoryIds = [];

    //         // Iterate through purchases to construct quantities array
    //         const quantities = purchases.map((purchase) => ({
    //             // product: {
    //             //     productId: createdProduct.productId,
    //             // },
    //             // color: {
    //             //     //colorId: colorMapping[purchase.color] || null,
    //             //     colorId: purchase.color,
    //             // },
    //             // size: {
    //             //     //sizeId: sizeMapping[purchase.size] || null,
    //             //     sizeId: purchase.size,
    //             // },
    //             // quantity: purchase.quantity,
    //             product: createdProduct._id, // Truyền thẳng ObjectId dạng chuỗi
    //             color: purchase.color,
    //             size: purchase.size,
    //             quantity: purchase.quantity,
    //         }));

    //         console.log('Quantitiessssss:', quantities);

    //         // Send each quantity to the API separately
    //         for (const quantity of quantities) {
    //             try {
    //                 const quantityResponse = await Api_AddProduct.createQuantity(quantity);
    //                 console.log('Quantity Response:', quantityResponse);
    //             } catch (quantityError) {
    //                 console.error('Error creating quantity:', quantityError);
    //             }
    //         }

    //         alert('Product and quantities submitted successfully!');
    //     } catch (error) {
    //         console.error('Error submitting product:', error);
    //         if (error.response) {
    //             console.error('Error response data:', error.response.data);
    //         }
    //         alert('There was an error submitting the product. Please try again.');
    //     }
    //     navigate(config.routes.AllProduct);

    //     console.log('Giá gốc:', formData.originalPrice);
    //     console.log('Giá bán:', formData.sellingPrice);
    // };

    // const handleAddPurchase = () => {
    //     if (!newPurchase.color || !newPurchase.size) {
    //         alert('Please select both color and size before adding.');
    //         return;
    //     }

    //     const colorId = colorMapping[newPurchase.color]; // Get colorId from mapping
    //     const sizeId = sizeMapping[newPurchase.size]; // Get sizeId from mapping

    //     const existingPurchase = purchases.find(
    //         (purchase) => purchase.color === newPurchase.color && purchase.size === newPurchase.size,
    //     );

    //     if (existingPurchase) {
    //         setPurchases((prevPurchases) =>
    //             prevPurchases.map((purchase) =>
    //                 purchase.color === existingPurchase.color && purchase.size === existingPurchase.size
    //                     ? { ...purchase, quantity: purchase.quantity + newPurchase.quantity }
    //                     : purchase,
    //             ),
    //         );
    //     } else {
    //         setPurchases((prevPurchases) => [
    //             ...prevPurchases,
    //             {
    //                 color: newPurchase.color,
    //                 size: newPurchase.size,
    //                 quantity: newPurchase.quantity,
    //                 colorId: colorId, // Set colorId here
    //                 sizeId: sizeId, // Set sizeId here
    //             },
    //         ]);
    //     }

    //     setNewPurchase({ color: null, size: null, quantity: 1 });
    // };
    
    const handleSubmit = async (e) => {
        e.preventDefault();
    
        // Validation checks
        if (
            !formData.productName ||
            !formData.description ||
            !formData.images.length ||
            !formData.category ||
            !formData.brandName ||
            !formData.gender ||
            formData.sellingPrice <= 0 ||
            formData.originalPrice <= 0
        ) {
            alert(
                'Please fill in all required fields: Product Name, Description, Images, Category, Brand Name, Sale Price, and Regular Price.'
            );
            return;
        }
    
        const addProductDto = {
            productName: formData.productName,
            description: formData.description,
            originalPrice: parseFloat(formData.originalPrice),
            status: formData.status,
            sellingPrice: parseFloat(formData.sellingPrice),
            vat: formData.vat,
            images: formData.images,
            gender: formData.gender ? formData.gender.toUpperCase() : null,
            brand: {
                brandId: formData.brandName,
            },
            productCategory: {
                categoryId: formData.category,
            },
        };
    
        console.log('Product data:', addProductDto);
    
        try {
            const response = await Api_AddProduct.createProduct(addProductDto);
            console.log('API Response:', response);
    
            const createdProduct =  response.data._id; 
            console.log('Created product:', createdProduct);
    
            const productId = createdProduct;
            const inventoryIds = [];
    
            for (const purchase of purchases) {
                const quantityDto = 
                {
                    product: productId,
                    color: purchase.color,
                    size: purchase.size,
                    quantity: purchase.quantity,
                };
    
                try {
                    const quantityResponse = await Api_AddProduct.createQuantity(quantityDto);
                    console.log('Quantity created:', quantityResponse);
                    inventoryIds.push(quantityResponse._id);
                } catch (quantityError) {
                    console.error(' Error creating quantity:', quantityError);
                }
            }
    
            // Step 3: Attach inventory IDs back to the product
            try {
                await Api_AddProduct.attachInventoryToProduct({
                    _id: productId,
                    inventoryIds,
                });
                console.log('📦 Inventory attached to product.');
            } catch (attachError) {
                console.error('❌ Error attaching inventory:', attachError);
            }
    
            alert('Product and quantities submitted successfully!');
            navigate(config.routes.AllProduct);
        } catch (error) {
            console.error('Error submitting product:', error);
            if (error.response) {
                console.error('Error response data:', error.response.data);
            }
            alert('There was an error submitting the product. Please try again.');
        }
    
        console.log('Giá gốc:', formData.originalPrice);
        console.log('Giá bán:', formData.sellingPrice);
    };
    
    const handleAddPurchase = () => {
        if (!newPurchase.color || !newPurchase.size) {
            alert('Please select both color and size before adding.');
            return;
        }

        const existingPurchase = purchases.find((p) => p.color === newPurchase.color && p.size === newPurchase.size);

        if (existingPurchase) {
            setPurchases((prev) =>
                prev.map((p) =>
                    p.color === newPurchase.color && p.size === newPurchase.size
                        ? { ...p, quantity: p.quantity + newPurchase.quantity }
                        : p,
                ),
            );
        } else {
            setPurchases((prev) => [...prev, { ...newPurchase }]);
        }

        setNewPurchase({ color: null, size: null, quantity: 1 });
    };

    const handleQuantityChange = (id, newQuantity) => {
        setPurchases((prevPurchases) =>
            prevPurchases.map((purchase) => (purchase.id === id ? { ...purchase, quantity: newQuantity } : purchase)),
        );
    };

    const handleImagesChange = (newImages) => {
        setFormData((prev) => ({
            ...prev,
            images: newImages,
        }));
    };

    // const handleDeletePurchase = (color, size) => {
    //     setPurchases((prevPurchases) =>
    //         prevPurchases.filter((purchase) => !(purchase.color === color && purchase.size === size)),
    //     );
    // };
    const handleDeletePurchase = (color, size) => {
        setPurchases((prev) => prev.filter((p) => !(p.color === color && p.size === size)));
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
                                        <option value="CT001">Men Shoes</option>
                                        <option value="CT002">Women Shoes</option>
                                        <option value="CT003">Kids Shoes</option>
                                        <option value="CT004">Sports Shoes</option>
                                        <option value="CT005">Casual Shoes</option>
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
                                        <option value="BR001">Nike</option>
                                        <option value="BR002">Adidas</option>
                                        <option value="BR003">Puma</option>
                                        <option value="BR004">NewBalance</option>
                                        <option value="BR005">Reebok</option>
                                        <option value="BR006">Converse</option>
                                        <option value="BR007">Vans</option>
                                        <option value="BR008">UnderArmour</option>
                                        <option value="BR009">ASICS</option>
                                        <option value="BR010">Fila</option>
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
                                        value={formData.sellingPrice}
                                        onChange={(e) => handleInputChange('sellingPrice', parseFloat(e.target.value))}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* VAT */}
                    {/* <div className={cx('fieldGroup')}>
                <label htmlFor="vat" className={cx('fieldLabel')}>
                    VAT (%)
                </label>
                <div className={cx('inputWrapper')}>
                    <input id="vat" type="number" className={cx('textInput')} defaultValue="10" />
                </div>
            </div> */}

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
                                    value={newPurchase.color || ''}
                                    onChange={(e) => setNewPurchase({ ...newPurchase, color: e.target.value })}
                                >
                                    <option value="" disabled>
                                        Select a color
                                    </option>
                                    {colors.map((c) => (
                                        <option key={c._id} value={c.colorName}>
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
                                    value={newPurchase.size || ''}
                                    onChange={(e) => setNewPurchase({ ...newPurchase, size: e.target.value })}
                                >
                                    <option value="" disabled>
                                        Select a size
                                    </option>
                                    {sizes.map((s) => (
                                        <option key={s._id} value={s.nameSize}>
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
                            <div className={cx('tableRow')} key={`${purchase.color}-${purchase.size}`}>
                                <div className={cx('cell')}>{purchase.color}</div>
                                <div className={cx('cell')}>{purchase.size}</div>
                                <div className={cx('cell')}>
                                    <input
                                        type="number"
                                        className={cx('quantityInput')}
                                        value={purchase.quantity}
                                        min="0"
                                        onChange={(e) =>
                                            handleQuantityChange(purchase.id, parseInt(e.target.value, 10))
                                        }
                                    />
                                </div>
                                <div className={cx('cell')}>
                                    <button
                                        type="button"
                                        className={cx('deleteButton')}
                                        onClick={() => handleDeletePurchase(purchase.color, purchase.size)}
                                    >
                                        &times;
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
