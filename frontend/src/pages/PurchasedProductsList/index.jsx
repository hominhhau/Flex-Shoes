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
  const { id } = useParams();

  const totalSpent = purchasedProducts.reduce((sum, invoice) => sum + (invoice.total || 0), 0);

  useEffect(() => {
    const fetchPurchasedProducts = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await Api_InvoiceAdmin.getPurchasedProducts(id);
        const data = response.data;
        if (Array.isArray(data)) {
          // Sort by invoiceId in descending order
          const sortedData = data.sort((a, b) => b.invoiceId - a.invoiceId);
          setPurchasedProducts(sortedData);
        } else {
          throw new Error('Returned data is not an array');
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
    return <div className={cx('loading', 'text-center py-10')}>Loading...</div>;
  }

  if (error) {
    return <div className={cx('error', 'text-center py-10 text-red-500')}>Error: {error}</div>;
  }

  if (!Array.isArray(purchasedProducts) || purchasedProducts.length === 0) {
    return <div className={cx('no-products', 'text-center py-10')}>No products purchased.</div>;
  }

  return (
    <div className={cx('container', 'max-w-full mx-auto py-10 px-4')}>
      <h2 className={cx('title', 'text-3xl font-bold mb-8 text-center')}>List of Purchased Products</h2>
      <div className={cx('list-container')}>
        <table className={cx('invoice-table', 'w-full border-collapse')}>
          <tbody>
            {purchasedProducts.map((invoice) => (
              <tr key={invoice.invoiceId} className={cx('invoice-row', 'border bg-white')}>
                <td className={cx('invoice-cell', 'p-6')} colSpan={5}>
                  <div className={cx('invoice-header', 'flex justify-between items-center mb-4')}>
                    <h3 className={cx('invoice-id', 'text-xl font-semibold')}>Invoice #{invoice.invoiceId}</h3>
                    <div className={cx('invoice-info')}>
                      <p className={cx('invoice-date', 'text-gray-600')}>
                        Date: {new Date(invoice.issueDate).toLocaleDateString('en-US')}
                      </p>
                      <p className={cx('invoice-status', 'text-gray-600')}>
                        <span className={cx('status-label', 'text-black')}>Status: </span>
                        <span
                          className={cx('status-value', {
                            'text-orange-500': invoice.orderStatus === 'Processing',
                            'text-red-500': invoice.orderStatus === 'Canceled',
                            'text-blue-500': invoice.orderStatus === 'Delivered',
                          })}
                        >
                          {invoice.orderStatus}
                        </span>
                      </p>
                      <p className={cx('invoice-total', 'font-bold text-green-600')}>
                        Total: {(invoice.total || 0).toFixed(2)} $
                      </p>
                    </div>
                  </div>
                  <table className={cx('product-table', 'w-full border-collapse')}>
                    <thead>
                      <tr className={cx('product-head-row', 'bg-gray-100')}>
                        <th className={cx('product-head', 'p-3 text-left')}>Image</th>
                        <th className={cx('product-head', 'p-3 text-left')}>Name</th>
                        <th className={cx('product-head', 'p-3 text-left')}>Quantity</th>
                        <th className={cx('product-head', 'p-3 text-left')}>Price</th>
                        <th className={cx('product-head', 'p-3 text-left')}>Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {invoice.invoiceDetails.map((detail) => {
                        const productId = detail.product ? detail.product.productId : 'N/A';
                        const productName = detail.product ? detail.product.productName : 'N/A';
                        const firstImageURL =
                          detail.product && detail.product.image && detail.product.image.length > 0
                            ? detail.product.image[0].imageID.URL
                            : null;
                        const unitPrice = detail.product ? detail.product.sellingPrice : 0;
                        const totalPricePerDetail = unitPrice * detail.quantity;

                        return (
                          <tr
                            key={detail.detailId || `${invoice.invoiceId}-${productId}`}
                            className={cx('product-row', 'border-b hover:bg-gray-50')}
                          >
                            <td className={cx('product-cell', 'p-3')}>
                              {firstImageURL ? (
                                <img
                                  src={firstImageURL}
                                  alt={productName}
                                  className={cx('product-image', 'w-24 h-24 object-cover rounded-md')}
                                />
                              ) : (
                                <span className={cx('no-image', 'text-gray-400')}>No Image</span>
                              )}
                            </td>
                            <td className={cx('product-cell', 'p-3')}>{productName}</td>
                            <td className={cx('product-cell', 'p-3')}>{detail.quantity}</td>
                            <td className={cx('product-cell', 'p-3')}>{unitPrice.toFixed(2)} $</td>
                            <td className={cx('product-cell', 'p-3')}>{totalPricePerDetail.toFixed(2)} $</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </td>
              </tr>
            ))}
            <tr>
              <td colSpan={5} className={cx('grand-total-cell', 'p-6 text-right bg-gray-100')}>
                <span className={cx('grand-total-label', 'font-semibold mr-4')}>Total Spent:</span>
                <span className={cx('grand-total-amount', 'font-bold text-green-600')}>
                  {totalSpent.toFixed(2)} $
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PurchasedProductsList;