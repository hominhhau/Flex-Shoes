import React from 'react';

import classNames from 'classnames/bind';
import styles from './PurchasedProductsList.module.scss';

const cx = classNames.bind(styles);

const purchasedProducts = [
    { id: 1, name: 'Giày sneaker', price: 150000, quantity: 2, image: 'https://localhost:8080/images/nike-air-max-trang-xanh-1.png' },
    { id: 2, name: 'Giày sneaker', price: 450000, quantity: 1, image: 'https://localhost:8080/images/nike-air-max-trang-xanh-1.png' },
    { id: 3, name: 'Giày sneaker', price: 800000, quantity: 1, image: 'https://localhost:8080/images/nike-air-max-trang-xanh-1.png' },
    { id: 4, name: 'Giày sneaker', price: 600000, quantity: 1, image: 'https://localhost:8080/images/nike-air-max-trang-xanh-1.png' },
    { id: 5, name: 'Giày sneaker', price: 1200000, quantity: 1, image: 'https://localhost:8080/images/nike-air-max-trang-xanh-1.png' },
];

function PurchasedProductsList() {
    const totalSpent = purchasedProducts.reduce((sum, product) => sum + product.price * product.quantity, 0);

    return (
        <div className={cx('card')}>
            <div className={cx('cardHeader')}>
                <h2 className={cx('cardTitle')}>
                    Danh sách sản phẩm đã mua
                </h2>

            </div>
            <div className={cx('cardContent')}>
                <table className={cx('table')}>
                    <thead>
                        <tr>
                            <th className={cx('tableHead')}>Hình ảnh</th>
                            <th className={cx('tableHead')}>Tên sản phẩm</th>
                            <th className={cx('tableHead')}>Giá</th>
                            <th className={cx('tableHead')}>Số lượng</th>
                            <th className={cx('tableHead')}>Tổng</th>
                        </tr>
                    </thead>
                    <tbody>
                        {purchasedProducts.map((product) => (
                            <tr key={product.id} className={cx('tableRow')}>
                                <td className={cx('tableCell')}>
                                    <img
                                        src={product.image}
                                        alt={product.name}
                                        width={80}
                                        height={80}
                                        className={cx('productImage')}
                                    />
                                </td>
                                <td className={cx('tableCell')}>{product.name}</td>
                                <td className={cx('tableCell')}>{product.price.toLocaleString('vi-VN')} ₫</td>
                                <td className={cx('tableCell')}>{product.quantity}</td>
                                <td className={cx('tableCell')}>
                                    {(product.price * product.quantity).toLocaleString('vi-VN')} ₫
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className={cx('cardFooter')}>
                <div className={cx('totalSpent')}>Tổng chi tiêu: {totalSpent.toLocaleString('vi-VN')} ₫</div>
            </div>
        </div>
    );
}

export default PurchasedProductsList;
