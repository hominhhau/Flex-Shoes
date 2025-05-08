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
  const [currentPage, setCurrentPage] = useState(1);
  const invoicesPerPage = 5;

  const { id } = useParams();

  const totalSpent = Array.isArray(purchasedProducts)
    ? purchasedProducts.reduce((sum, invoice) => sum + (invoice.total || 0), 0)
    : 0;

  const indexOfLastInvoice = currentPage * invoicesPerPage;
  const indexOfFirstInvoice = indexOfLastInvoice - invoicesPerPage;
  const currentInvoices = purchasedProducts.slice(indexOfFirstInvoice, indexOfLastInvoice);

  const totalPages = Math.ceil(purchasedProducts.length / invoicesPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  useEffect(() => {
    const fetchPurchasedProducts = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await Api_InvoiceAdmin.getPurchasedProducts(id);
        const data = response.data;
        if (Array.isArray(data)) {
          const sortedData = data.sort((a, b) => 
            new Date(b.issueDate) - new Date(a.issueDate)
          );
          setPurchasedProducts(sortedData);
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
    return <div className={cx('loading')}>Loading...</div>;
  }

  if (error) {
    return <div className={cx('error')}>Error: {error}</div>;
  }

  if (!Array.isArray(purchasedProducts) || purchasedProducts.length === 0) {
    return <div className={cx('no-products')}>No products purchased.</div>;
  }

  return (
    <div className={cx('container')}>
      <div className={cx('leftcontainer')}>
        <div className={cx('formSection')}>
          <div className={cx('sectionHeader')}>
            <h2 className={cx('sectionTitle')}>List of Purchased Products</h2>
            <p className={cx('sectionDescription')}>
              View all products purchased by this customer, grouped by invoice.
            </p>
          </div>
          <div className={cx('invoices')}>
            {currentInvoices.map((invoice) => (
              <div key={invoice.invoiceId} className={cx('invoiceGroup')}>
                <div className={cx('invoiceHeader')}>
                  <h3>Invoice #{invoice.invoiceId}</h3>
                  <p>Date: {new Date(invoice.issueDate).toLocaleDateString('vi-VN')}</p>
                  <p>Status: {invoice.orderStatus}</p>
                  <p>Total: {(invoice.total || 0).toFixed(2)} $</p>
                </div>
                <table className={cx('table')}>
                  <thead>
                    <tr>
                      <th className={cx('tableHead')}>Image</th>
                      <th className={cx('tableHead')}>Name</th>
                      <th className={cx('tableHead')}>Quantity</th>
                      <th className={cx('tableHead')}>Price</th>
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
                            {totalPricePerDetail.toFixed(2)} $
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ))}
          </div>
          <div className={cx('pagination')}>
            <button
              className={cx('paginationButton', { disabled: currentPage === 1 })}
              onClick={handlePrevPage}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index + 1}
                className={cx('paginationButton', { active: currentPage === index + 1 })}
                onClick={() => handlePageChange(index + 1)}
              >
                {index + 1}
              </button>
            ))}
            <button
              className={cx('paginationButton', { disabled: currentPage === totalPages })}
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
          <div className={cx('totalSpent')}>
            Total Spent: {totalSpent.toFixed(2)} $
          </div>
        </div>
      </div>
      <div className={cx('rightContainer')}>
        <div className={cx('orderSummary')}>
          <h3>Summary</h3>
          <p>Total Invoices: {purchasedProducts.length}</p>
          <p>Total Spent: {totalSpent.toFixed(2)} $</p>
        </div>
      </div>
    </div>
  );
};

export default PurchasedProductsList;