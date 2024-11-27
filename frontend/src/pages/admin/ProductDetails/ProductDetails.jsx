import React from 'react';
import classNames from 'classnames/bind';
import styles from './ProductForm.module.scss';
import RecentPurchases from './RecentPurchases';

const cx = classNames.bind(styles);

export function ProductDetails() {
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
                    <input id="productName" type="text" className={cx('textInput')} defaultValue="Adidas Ultra Boost" />
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
                        defaultValue="Long distance running requires a lot from athletes."
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
                            <select id="category" className={cx('selectInput')} defaultValue="Sneaker">
                                <option value="Sneaker">Sneaker</option>
                                <option value="Running">Running</option>
                                <option value="Casual">Casual</option>
                            </select>
                        </div>
                    </div>

                    <div className={cx('columnField')}>
                        <label htmlFor="brand" className={cx('fieldLabel')}>
                            Brand Name
                        </label>
                        <div className={cx('inputWrapper')}>
                            <select id="brand" className={cx('selectInput')} defaultValue="Adidas">
                                <option value="Adidas">Adidas</option>
                                <option value="Nike">Nike</option>
                                <option value="Puma">Puma</option>
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
                            <select id="gender" className={cx('selectInput')} defaultValue="Men">
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
                            <input id="originalPrice" type="number" className={cx('textInput')} defaultValue="100.00" />
                        </div>
                    </div>
                    <div className={cx('columnField')}>
                        <label htmlFor="salePrice" className={cx('fieldLabel')}>
                            Sale Price
                        </label>
                        <div className={cx('inputWrapper')}>
                            <input id="salePrice" type="number" className={cx('textInput')} defaultValue="90.00" />
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
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                    </select>
                </div>
            </div>

            {/* Recent Purchases */}
            <div className={cx('fieldGroup')}>
                <div className={cx('inputWrapper')}>
                    <RecentPurchases />
                </div>
            </div>
        </section>
    );
}
