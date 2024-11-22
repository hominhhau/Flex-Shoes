import React from 'react';
import classNames from 'classnames/bind';
import styles from './ProductForm.module.scss';

const cx = classNames.bind(styles);

export function ProductDetails() {
    return (
        <section className={cx('inputSection')}>
            <div className={cx('fieldGroup')}>
                <label htmlFor="productName" className={cx('fieldLabel')}>
                    Product Name
                </label>
                <div className={cx('inputWrapper')}>
                    <input id="productName" type="text" className={cx('textInput')} defaultValue="Adidas Ultra boost" />
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
                        defaultValue="Long distance running requires a lot from athletes."
                    />
                </div>
            </div>

            <div className={cx('fieldGroup')}>
                <label htmlFor="category" className={cx('fieldLabel')}>
                    Category
                </label>
                <div className={cx('inputWrapper')}>
                    <input id="category" type="text" className={cx('textInput')} defaultValue="Sneaker" />
                </div>
            </div>

            <div className={cx('fieldGroup')}>
                <label htmlFor="brand" className={cx('fieldLabel')}>
                    Brand Name
                </label>
                <div className={cx('inputWrapper')}>
                    <input id="brand" type="text" className={cx('textInput')} defaultValue="Addidas" />
                </div>
            </div>

            <div className={cx('fieldGroup')}>
                <div className={cx('twoColumnGroup')}>
                    <div className={cx('columnField')}>
                        <label htmlFor="sku" className={cx('fieldLabel')}>
                            SKU
                        </label>
                        <div className={cx('inputWrapper')}>
                            <input id="sku" type="text" className={cx('textInput')} defaultValue="#32A53" />
                        </div>
                    </div>
                    <div className={cx('columnField')}>
                        <label htmlFor="stock" className={cx('fieldLabel')}>
                            Stock Quantity
                        </label>
                        <div className={cx('inputWrapper')}>
                            <input id="stock" type="number" className={cx('textInput')} defaultValue="21" />
                        </div>
                    </div>
                </div>
            </div>

            <div className={cx('fieldGroup')}>
                <div className={cx('twoColumnGroup')}>
                    <div className={cx('columnField')}>
                        <label htmlFor="regularPrice" className={cx('fieldLabel')}>
                            Regular Price
                        </label>
                        <div className={cx('inputWrapper')}>
                            <input id="regularPrice" type="text" className={cx('textInput')} defaultValue="$110.40" />
                        </div>
                    </div>
                    <div className={cx('columnField')}>
                        <label htmlFor="salePrice" className={cx('fieldLabel')}>
                            Sale Price
                        </label>
                        <div className={cx('inputWrapper')}>
                            <input id="salePrice" type="text" className={cx('textInput')} defaultValue="$450" />
                        </div>
                    </div>
                </div>
            </div>

            <div className={cx('fieldGroup')}>
                <label htmlFor="tags" className={cx('fieldLabel')}>
                    Tag
                </label>
                <div className={cx('inputWrapper')}>
                    <div className={cx('tagInput')}>
                        <div className={cx('tagList')}>
                            <span className={cx('tag')}>Adidas</span>
                            <span className={cx('tag')}>Shoes</span>
                            <span className={cx('tag')}>Sneakers</span>
                            <span className={cx('tag')}>Ultraboost</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
