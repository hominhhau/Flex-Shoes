import React, { useState, useEffect } from 'react';
import classNames from 'classnames/bind';
import styles from './PurchasedProductsList.module.scss';
import { Api_Product } from '../../../apis/Api_Product'; // Đảm bảo import đúng
import { useParams } from 'react-router-dom'; // Để lấy tham số từ URL

const cx = classNames.bind(styles);

function PurchasedProductsList() {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [purchasedProducts, setPurchasedProducts] = useState([]);
    const totalSpent = purchasedProducts.reduce((sum, product) => sum + product.total, 0);

    // Lấy customerId từ URL
    const { id } = useParams(); // Lấy id từ URL
    console.log('Customer ID from URL:', id); // Kiểm tra giá trị của id

    useEffect(() => {
        const fetchPurchasedProducts = async () => {
            setLoading(true);
            setError(null);

            try {
                // Gọi API với customerId từ URL
                const response = await Api_Product.getPurchasedProducts(id);
                console.log('Response từ API:', response); // Kiểm tra dữ liệu trả về từ API
                if (response) {
                    setPurchasedProducts(response);
                    console.log('Response từ API:', response); // Kiểm tra dữ liệu trả về từ API
                }
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchPurchasedProducts();
        }
    }, [id]); // Giám sát sự thay đổi của id

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    if (!purchasedProducts || purchasedProducts.length === 0) {
        return <div>No purchased products available.</div>;
    }

    return (
        <div className={cx('card')}>
            <div className={cx('cardHeader')}>
                <h2 className={cx('cardTitle')}>Danh sách sản phẩm đã mua</h2>
            </div>
            <div className={cx('cardContent')}>
                <table className={cx('table')}>
                    <thead>
                        <tr>
                            <th className={cx('tableHead')}>Hình ảnh</th>
                            <th className={cx('tableHead')}>Tên sản phẩm</th>
                            <th className={cx('tableHead')}>Số lượng</th>
                            <th className={cx('tableHead')}>Ngày mua</th>
                            <th className={cx('tableHead')}>Tổng</th>
                        </tr>
                    </thead>
                    <tbody>
                        {purchasedProducts.map((product) => (
                            <tr key={product.id} className={cx('tableRow')}>
                                <td className={cx('tableCell')}>
                                    <img
                                        src={product.image}
                                        alt={product.productName}
                                        width={80}
                                        height={80}
                                        className={cx('productImage')}
                                    />
                                </td>
                                <td className={cx('tableCell')}>{product.productName}</td>
                                <td className={cx('tableCell')}>{product.quantity}</td>
                                <td className={cx('tableCell')}>
                                    {new Date(product.issueDate).toLocaleDateString('vi-VN')}
                                </td>
                                <td className={cx('tableCell')}>{product.total.toLocaleString('vi-VN')} ₫</td>
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
