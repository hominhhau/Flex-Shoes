import React from 'react';
import classNames from 'classnames/bind';
import styles from './ProductForm.module.scss';
import RecentPurchases from './RecentPurchases';



const cx = classNames.bind(styles);

export function ProductDetails({ product, brand, category, setProduct, quantities, setQuantities }) {
   

    return (
        <section className={cx('inputSection')}>
            <nav className={cx('breadcrumb')}>
                <span>Home</span> &gt; <span>All Products</span> &gt; <span>Product Details</span>
            </nav>

            {/* Product Name */}
            <div className={cx('fieldGroup')}>
                <label htmlFor="productName" className={cx('fieldLabel')}>
                    Product Name
                </label>
                <div className={cx('inputWrapper')}>
                    <input id="productName" type="text" className={cx('textInput')}
                        value={product.productName}
                        onChange={(e) => {
                            setProduct({ ...product, productName: e.target.value });
                        }}
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
                        value={product.description}
                        onChange={(e) => {
                            setProduct({ ...product, description: e.target.value });
                        }}
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
                            <select id="category" className={cx('selectInput')}
                                value={product.categoryName}
                                onChange={(e) => {
                                    setProduct({ ...product, categoryName: e.target.value, categoryId: category.find((item) => item.categoryName === e.target.value).categoryId });
                                }}>
                                {category.map((item) => (
                                    <option key={item.categoryId} value={item.categoryName}>
                                        {item.categoryName}
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
                            <select id="brand" className={cx('selectInput')} 
                            value={product.brandName}
                            onChange={(e) => {
                                setProduct({ ...product, brandName: e.target.value, brandId: brand.find((item) => item.brandName === e.target.value).brandId });
                            }
                            }
                            >
                                {brand.map((item) => (
                                    <option key={item.brandId} value={item.brandName}>
                                        {item.brandName}
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
                            <select id="gender" className={cx('selectInput')}
                                value={product.gender}
                                onChange={(e) => {
                                    setProduct({ ...product, gender: e.target.value });
                                }
                                }>
                                <option value="MEN">Men</option>
                                <option value="WOMEN">Women</option>
                                <option value="UNISEX">Unisex</option>
                            </select>
                        </div>
                    </div>

                    {/* VAT */}
                    <div className={cx('columnField')}>
                        <label htmlFor="vat" className={cx('fieldLabel')}>
                            VAT (%)
                        </label>
                        <div className={cx('inputWrapper')}>
                            <input id="vat" type="number" className={cx('textInput')}
                             value={product.vat}
                             onChange={(e) => {
                                setProduct({ ...product, vat: e.target.value });
                             }
                            }
                             />
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
                            <input id="originalPrice" type="number" className={cx('textInput')}
                                value={product.originalPrice}
                                onChange={(e) => {
                                    setProduct({ ...product, originalPrice: e.target.value });
                                }
                                }
                            />
                        </div>
                    </div>
                    <div className={cx('columnField')}>
                        <label htmlFor="salePrice" className={cx('fieldLabel')}>
                            Sale Price
                        </label>
                        <div className={cx('inputWrapper')}>
                            <input id="salePrice" type="number" className={cx('textInput')}
                                value={product.salePrice}
                                onChange={(e) => {
                                    setProduct({ ...product, salePrice: e.target.value });
                                }}
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
                    <select id="status" className={cx('selectInput')}
                        value={product.status}
                        onChange={(e) => {
                            setProduct({ ...product, status: e.target.value });
                        }
                        }
                    >
                        <option value="Available">Available</option>
                        <option value="NotAvailable">Not Available</option>
                    </select>
                </div>
            </div>

            {/* Recent Purchases */}
            <div className={cx('fieldGroup')}>
                <div className={cx('inputWrapper')}>
                    <RecentPurchases 
                    quantities={quantities}
                    setQuantities={setQuantities}
                    />
                </div>
            </div>
        </section>
    );
}
