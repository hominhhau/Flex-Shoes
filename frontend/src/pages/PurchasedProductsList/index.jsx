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
  const productsPerPage = 15;

  // Lấy customerId từ URL
  const { id } = useParams();
  console.log('Customer ID from URL:', id);

  // Tính tổng chi tiêu
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

  // Lấy tất cả sản phẩm từ invoices
  const allProducts = purchasedProducts.flatMap((invoice) =>
    invoice.invoiceDetails.map((detail) => ({
      invoice,
      detail,
    }))
  );

  // Tính toán sản phẩm cho trang hiện tại
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = allProducts.slice(indexOfFirstProduct, indexOfLastProduct);

  // Tính tổng số trang
  const totalPages = Math.ceil(allProducts.length / productsPerPage);

  // Chuyển trang
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Trang trước
  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Trang tiếp theo
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
        console.log('Response từ API:', response);

        const data = response.data;
        if (Array.isArray(data)) {
          // Sắp xếp invoices theo issueDate giảm dần (mới nhất trước)
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
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!Array.isArray(purchasedProducts) || purchasedProducts.length === 0) {
    return <div>No products purchased.</div>;
  }

  return (
    <div className={cx('card')}>
      <div className={cx('cardHeader')}>
        <h2 className={cx('cardTitle')}>List of products purchased</h2>
      </div>
      <div className={cx('cardContent')}>
        <table className={cx('table')}>
          <thead>
            <tr>
              <th className={cx('tableHead')}>Image</th>
              <th className={cx('tableHead')}>Name</th>
              <th className={cx('tableHead')}>Quantity</th>
              <th className={cx('tableHead')}>Date</th>
              <th className={cx('tableHead')}>Status</th>
              <th className={cx('tableHead')}>Price</th>
            </tr>
          </thead>
          <tbody>
            {currentProducts.map(({ invoice, detail }) => {
              const productId = detail.product ? detail.product.productId : 'N/A';
              const productName = detail.product ? detail.product.productName : 'N/A';
              const firstImageURL =
                detail.product && detail.product.image && detail.product.image.length > 0
                  ? detail.product.image[0].imageID.URL
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
                    {totalPricePerDetail.toFixed(2)} $
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
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
      <div className={cx('cardFooter')}>
        <div className={cx('totalSpent')}>
          Tổng chi tiêu: {totalSpent.toFixed(2)} $
        </div>
      </div>
    </div>
  );
};

export default PurchasedProductsList;