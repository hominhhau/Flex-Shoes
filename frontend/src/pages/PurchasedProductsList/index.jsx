import React, { useState, useEffect } from 'react';
import classNames from 'classnames/bind';
import styles from './PurchasedProductsList.module.scss';
import { Api_InvoiceAdmin } from '../../../apis/Api_invoiceAdmin';
import { useParams } from 'react-router-dom';

const cx = classNames.bind(styles);

const PurchasedProductsList = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [purchasedProducts, setPurchasedProducts] = useState([]);

  // Lấy customerId từ URL
  const { id } = useParams();
  console.log('Customer ID from URL:', id);
  console.log('Customer ID from URL:', id);

  // Tính tổng chi tiêu dựa trên chi tiết hóa đơn
  const totalSpent = Array.isArray(purchasedProducts)
    ? purchasedProducts.reduce((sum, invoice) => {
      const invoiceTotal = invoice.invoiceDetails.reduce((detailSum, detail) => {
        const unitPrice = detail.product ? detail.product.sellingPrice : 0;
        const discount = detail.product ? detail.product.discount / 100 : 0;
        const discountedPrice = unitPrice * (1 - discount);
        return detailSum + discountedPrice * detail.quantity;
      }, 0);
      return sum + invoiceTotal;
    }, 0)
    : 0;

  useEffect(() => {
    const fetchPurchasedProducts = async () => {
      setLoading(true);
      setError(null);

      try {
        // Gọi API với customerId từ URL
        const response = await Api_InvoiceAdmin.getPurchasedProducts(id);
        console.log('Response từ API:', response);

        // Lấy dữ liệu từ response.data
        const data = response.data;
        if (Array.isArray(data)) {
          setPurchasedProducts(data);
        } else {
          throw new Error('Dữ liệu trả về không phải là mảng');
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
  }, [id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!Array.isArray(purchasedProducts) || purchasedProducts.length === 0) {
    return <div>Không có sản phẩm nào đã mua.</div>;
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
              <th className={cx('tableHead')}>Trạng thái</th>
              <th className={cx('tableHead')}>Giá</th>
            </tr>
          </thead>
          <tbody>
            {purchasedProducts.flatMap((invoice) =>
              invoice.invoiceDetails.map((detail) => {
                const productId = detail.product ? detail.product.productId : 'N/A';
                const productName = detail.product ? detail.product.productName : 'Thông tin sản phẩm không có';
                const firstImageURL = detail.product && detail.product.image && detail.product.image.length > 0
                  ? detail.product.image[0].imageID.URL // Truy cập đúng cấu trúc
                  : null;
                const unitPrice = detail.product ? detail.product.sellingPrice : 0;
                const discountedPrice = unitPrice * (1 - (detail.product ? detail.product.discount / 100 : 0));
                const totalPricePerDetail = discountedPrice * detail.quantity;

                return (
                  <tr key={detail.detailId || `${invoice.invoiceId}-${productId}`} className={cx('tableRow')}>
                    <td className={cx('tableCell')}>
                      {firstImageURL ? (
                        <img
                          src={firstImageURL}
                          alt={productName}
                          width={80}
                          height={80}
                          className={cx('productImage')}
                        />
                      ) : (
                        <span>No Image</span>
                      )}
                    </td>
                    <td className={cx('tableCell')}>{productName}</td>
                    <td className={cx('tableCell')}>{detail.quantity}</td>
                    <td className={cx('tableCell')}>
                      {new Date(invoice.issueDate).toLocaleDateString('vi-VN')}
                    </td>
                    <td className={cx('tableCell')}>{invoice.orderStatus}</td>
                    <td className={cx('tableCell')}>
                      {totalPricePerDetail.toLocaleString('vi-VN')} ₫
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
      <div className={cx('cardFooter')}>
        <div className={cx('totalSpent')}>
          Tổng chi tiêu: {totalSpent.toLocaleString('vi-VN')} ₫
        </div>
      </div>
    </div>
  );
};

export default PurchasedProductsList;