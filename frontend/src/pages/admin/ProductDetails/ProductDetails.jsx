import React, { useState, useEffect } from 'react';
import classNames from 'classnames/bind';
import styles from './ProductForm.module.scss';
import { Api_Inventory } from '../../../../apis/Api_Inventory';

const cx = classNames.bind(styles);

export function ProductDetails({ product, brand, category, setProduct, setQuantities, quantities }) {
    const [colors, setColors] = useState([]);
    const [sizes, setSizes] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const colorRes = await Api_Inventory.getColor();
                const sizeRes = await Api_Inventory.getSize();
                setColors(colorRes);
                setSizes(sizeRes);
            } catch (error) {
                console.error('Lỗi khi load Color/Size:', error);
            }
        };
        fetchData();
    }, []);

    const [newPurchase, setNewPurchase] = useState({
        color: null,
        size: null,
        quantity: 1,
    });

    const [purchases, setPurchases] = useState(product.inventory || []);

    useEffect(() => {
        setPurchases(product.inventory || []);
    }, [product.inventory]);

    // Function to calculate totalQuantity
    const calculateTotalQuantity = (inventory) => {
        return inventory.reduce((sum, item) => sum + (item.numberOfProduct.quantity || 0), 0);
    };

    const handleAddPurchase = async () => {
        const { color, size, quantity } = newPurchase;

        if (!color || !size || quantity < 1) {
            alert('Vui lòng chọn màu, kích thước và nhập số lượng hợp lệ.');
            return;
        }

        const existingIndex = purchases.findIndex(
            (p) => p.numberOfProduct.color._id === color._id && p.numberOfProduct.size._id === size._id,
        );

        let updatedInventory = [...purchases];

        if (existingIndex !== -1) {
            // Nếu tồn tại, chỉ cập nhật lại quantity
            updatedInventory[existingIndex] = {
                ...updatedInventory[existingIndex],
                numberOfProduct: {
                    ...updatedInventory[existingIndex].numberOfProduct,
                    quantity: updatedInventory[existingIndex].numberOfProduct.quantity + quantity,
                },
            };
        } else {
            // Nếu chưa có thì thêm mới
            const newItem = {
                numberOfProduct: {
                    color: color,
                    size: size,
                    quantity: quantity,
                },
            };
            updatedInventory.push(newItem);
        }

        const totalQuantity = calculateTotalQuantity(updatedInventory);

        setProduct((prevProduct) => ({
            ...prevProduct,
            inventory: updatedInventory,
            totalQuantity,
        }));

        setNewPurchase({ color: null, size: null, quantity: 1 });
    };

    const handleQuantityChange = async (colorId, sizeId, newQuantity) => {
        const quantity = Math.max(1, parseInt(newQuantity, 10) || 1);

        const purchaseIndex = purchases.findIndex(
            (p) => p.numberOfProduct.color._id === colorId && p.numberOfProduct.size._id === sizeId,
        );

        if (purchaseIndex === -1) return;

        const updatedPurchases = [...purchases];
        updatedPurchases[purchaseIndex] = {
            ...updatedPurchases[purchaseIndex],
            numberOfProduct: {
                ...updatedPurchases[purchaseIndex].numberOfProduct,
                quantity: quantity,
            },
        };

        const totalQuantity = calculateTotalQuantity(updatedPurchases);

        setProduct((prevProduct) => ({
            ...prevProduct,
            inventory: updatedPurchases,
            totalQuantity,
        }));
    };

    const handleDeletePurchase = async (colorId, sizeId) => {
        const purchase = purchases.find(
            (p) => p.numberOfProduct.color._id === colorId && p.numberOfProduct.size._id === sizeId,
        );

        if (!purchase) return;

        try {
            await Api_Inventory.deleteQuantity(purchase._id);
            const updatedPurchases = purchases.filter(
                (p) => !(p.numberOfProduct.color._id === colorId && p.numberOfProduct.size._id === sizeId),
            );
            const totalQuantity = calculateTotalQuantity(updatedPurchases);

            setProduct((prevProduct) => ({
                ...prevProduct,
                inventory: updatedPurchases,
                totalQuantity,
            }));
        } catch (error) {
            console.error('Error deleting quantity:', error);
            const updatedPurchases = purchases.filter(
                (p) => !(p.numberOfProduct.color._id === colorId && p.numberOfProduct.size._id === sizeId),
            );
            const totalQuantity = calculateTotalQuantity(updatedPurchases);

            setProduct((prevProduct) => ({
                ...prevProduct,
                inventory: updatedPurchases,
                totalQuantity,
            }));
        }
    };

    return (
        <section className={cx('inputSection')}>
            <nav className={cx('breadcrumb')}>
                <span>Home</span> <span>All Products</span> <span>Product Details</span>
            </nav>

            <div className={cx('fieldGroup')}>
                <label htmlFor="productName" className={cx('fieldLabel')}>
                    Product Name
                </label>
                <div className={cx('inputWrapper')}>
                    <input
                        id="productName"
                        type="text"
                        className={cx('textInput')}
                        value={product.productName || ''}
                        onChange={(e) => {
                            setProduct({ ...product, productName: e.target.value });
                        }}
                    />
                </div>
            </div>

            <div className={cx('fieldGroup')}>
                <label htmlFor="description" className={cx('fieldLabel')}>
                    Description
                </label>
                <div className={cx('inputWrapper')}>
                    <textarea
                        id="description"
                        className={cx('textArea')}
                        value={product.description || ''}
                        onChange={(e) => {
                            setProduct({ ...product, description: e.target.value });
                        }}
                    />
                </div>
            </div>

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
                                value={product.proType?.productTypeName || ''}
                                onChange={(e) => {
                                    const selectedCategory = category.find(
                                        (item) => item.productTypeName === e.target.value,
                                    );
                                    setProduct({
                                        ...product,
                                        proType: {
                                            _id: selectedCategory._id,
                                            productTypeName: selectedCategory.productTypeName,
                                            description: selectedCategory.description,
                                        },
                                    });
                                }}
                            >
                                <option value="">Select Category</option>
                                {category.map((item) => (
                                    <option key={item._id} value={item.productTypeName}>
                                        {item.productTypeName}
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
                                value={product.braType?.brandTypeName || ''}
                                onChange={(e) => {
                                    const selectedBrand = brand.find((item) => item.brandTypeName === e.target.value);
                                    setProduct({
                                        ...product,
                                        braType: {
                                            _id: selectedBrand._id,
                                            brandTypeName: selectedBrand.brandTypeName,
                                            description: selectedBrand.description,
                                        },
                                    });
                                }}
                            >
                                <option value="">Select Brand</option>
                                {brand.map((item) => (
                                    <option key={item._id} value={item.brandTypeName}>
                                        {item.brandTypeName}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>
            </div>

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
                                value={product.gender || ''}
                                onChange={(e) => {
                                    setProduct({ ...product, gender: e.target.value });
                                }}
                            >
                                <option value="">Select Gender</option>
                                <option value="MEN">Men</option>
                                <option value="WOMEN">Women</option>
                                <option value="UNISEX">Unisex</option>
                            </select>
                        </div>
                    </div>

                    <div className={cx('columnField')}>
                        <label htmlFor="vat" className={cx('fieldLabel')}>
                            VAT (%)
                        </label>
                        <div className={cx('inputWrapper')}>
                            <input
                                id="vat"
                                type="number"
                                className={cx('textInput')}
                                value={product.tax || ''}
                                onChange={(e) => {
                                    setProduct({ ...product, tax: e.target.value });
                                }}
                            />
                        </div>
                    </div>
                </div>
            </div>

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
                                value={product.originalPrice || ''}
                                onChange={(e) => {
                                    setProduct({ ...product, originalPrice: e.target.value });
                                }}
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
                                value={product.discount || ''}
                                onChange={(e) => {
                                    setProduct({ ...product, discount: e.target.value });
                                }}
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className={cx('fieldGroup')}>
                <label htmlFor="status" className={cx('fieldLabel')}>
                    Status
                </label>
                <div className={cx('inputWrapper')}>
                    <select
                        id="status"
                        className={cx('selectInput')}
                        value={product.status || ''}
                        onChange={(e) => {
                            setProduct({ ...product, status: e.target.value });
                        }}
                    >
                        <option value="AVAILABLE">Available</option>
                        <option value="NOT_AVAILABLE">Not Available</option>
                    </select>
                </div>
            </div>

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
                            min="0"
                            onChange={(e) => setNewPurchase({ ...newPurchase, quantity: parseInt(e.target.value, 10) })}
                        />
                    </div>
                </div>
            </div>

            <div className={cx('columnField')}>
                <div className={cx('inputWrapper')}>
                    <button type="button" className={cx('addButton')} onClick={handleAddPurchase}>
                        Add quantity details per color and size
                    </button>
                </div>
            </div>

            <header className={cx('tableHeader')}>
                <div className={cx('headerCell')}>Color</div>
                <div className={cx('headerCell')}>Size</div>
                <div className={cx('headerCell')}>Quantity</div>
                <div className={cx('headerCell')}>Actions</div>
            </header>
            <main className={cx('tableContainer')}>
                {purchases.length === 0 ? (
                    <div className={cx('emptyState')}>Không có mục tồn kho nào.</div>
                ) : (
                    purchases.map((purchase) => (
                        <div
                            className={cx('tableRow')}
                            key={`${purchase.numberOfProduct.color._id}-${purchase.numberOfProduct.size._id}`}
                        >
                            <div className={cx('cell')}>{purchase.numberOfProduct.color?.colorName || 'N/A'}</div>
                            <div className={cx('cell')}>{purchase.numberOfProduct.size?.nameSize || 'N/A'}</div>
                            <div className={cx('cell')}>
                                <input
                                    type="number"
                                    className={cx('quantityInput')}
                                    value={purchase.numberOfProduct.quantity}
                                    min="0"
                                    onChange={(e) =>
                                        handleQuantityChange(
                                            purchase.numberOfProduct.color._id,
                                            purchase.numberOfProduct.size._id,
                                            parseInt(e.target.value, 10),
                                        )
                                    }
                                />
                            </div>
                            <div className={cx('cell')}>
                                <button
                                    type="button"
                                    className={cx('deleteButton')}
                                    onClick={() =>
                                        handleDeletePurchase(
                                            purchase.numberOfProduct.color._id,
                                            purchase.numberOfProduct.size._id,
                                        )
                                    }
                                >
                                    ×
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </main>
        </section>
    );
}
