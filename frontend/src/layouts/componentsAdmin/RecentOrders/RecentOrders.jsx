import React, { useEffect, useState } from 'react';
import classNames from 'classnames/bind';
import styles from './RecentOrders.module.scss';
import { useNavigate } from 'react-router-dom';
import { Api_InvoiceAdmin } from '../../../../apis/Api_invoiceAdmin';
import config from '../../../config';
import moment from 'moment';

const cx = classNames.bind(styles);

function RecentOrders() {
  const navigate = useNavigate();

  // State management
  const [orders, setOrders] = useState([]);
  const [allOrders, setAllOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [ordersPerPage] = useState(5);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState('all');
  const [orderStatus, setOrderStatus] = useState('All');

  // Fetch recent invoices on component mount
  useEffect(() => {
    const fetchRecentOrders = async () => {
      try {
        setLoading(true);
        const response = await Api_InvoiceAdmin.getRecentInvoices();
        setOrders(response.data);
        setAllOrders(response.data);
      } catch (error) {
        console.error('Error fetching recent invoices:', error);
        alert('Unable to load invoice list');
      } finally {
        setLoading(false);
      }
    };

    fetchRecentOrders();
  }, []);

  // Search function for individual criteria
  const searchOrders = async () => {
    try {
      setLoading(true);
      let filters = {};

      if (searchType === 'id') {
        if (searchQuery && !isNaN(searchQuery) && /^[0-9]+$/.test(searchQuery)) {
          filters = { id: parseInt(searchQuery) };
        } else {
          alert('Please enter a valid ID (numbers only)');
          setLoading(false);
          return;
        }
      } else if (searchType === 'customerName') {
        if (searchQuery) {
          filters = { customerName: searchQuery };
        } else {
          alert('Please enter a customer name');
          setLoading(false);
          return;
        }
      } else if (searchType === 'status' && orderStatus !== 'All') {
        filters = { orderStatus };
      } else {
        const response = await Api_InvoiceAdmin.getRecentInvoices();
        setOrders(response.data);
        setLoading(false);
        return;
      }

      const response = await Api_InvoiceAdmin.searchInvoices(filters);
      setOrders(response.data.length > 0 ? response.data : []);
    } catch (error) {
      console.error('Error searching invoices:', error);
      alert(`No invoices found for ${searchType === 'id' ? 'ID' : searchType === 'customerName' ? 'customer name' : 'status'}`);
    } finally {
      setLoading(false);
    }
  };

  // Trigger search when orderStatus changes
  useEffect(() => {
    if (searchType === 'status' || searchType === 'all') {
      searchOrders();
    }
  }, [orderStatus, searchType]);

  // Pagination logic
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = orders.slice(indexOfFirstOrder, indexOfLastOrder);
  const totalPages = Math.ceil(orders.length / ordersPerPage);

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  const getPaginationPages = () => {
    const maxPagesToShow = 3;
    const pages = [];
    if (totalPages <= maxPagesToShow) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else if (currentPage <= 2) {
      pages.push(1, 2, 3, '...');
    } else if (currentPage >= totalPages - 1) {
      pages.push('...', totalPages - 2, totalPages - 1, totalPages);
    } else {
      pages.push('...', currentPage - 1, currentPage, currentPage + 1, '...');
    }
    return pages;
  };

  if (loading) {
    return <div className="text-center">Loading...</div>;
  }

  return (
    <div className="bg-white w-full rounded-3xl shadow-md p-12 mt-8">
      {/* Header with search and filter */}
      <div className="flex flex-row items-center justify-between pb-8 border-b">
        <div className="font-bold">Order List</div>
        <div className="flex items-center gap-2">
          {/* Select search type */}
          <select
            value={searchType}
            onChange={(e) => {
              setSearchType(e.target.value);
              setSearchQuery('');
              setOrderStatus('All');
            }}
            className="border border-gray-300 px-4 py-3 rounded-xl"
          >
            <option value="all">All</option>
            <option value="id">Order ID</option>
            <option value="customerName">Customer Name</option>
            <option value="status">Status</option>
          </select>

          {/* Input or select based on search type */}
          {searchType === 'status' ? (
            <select
              value={orderStatus}
              onChange={(e) => setOrderStatus(e.target.value)}
              className="border border-gray-300 px-4 py-3 rounded-xl"
            >
              <option value="All">All</option>
              <option value="Delivered">Delivered</option>
              <option value="Canceled">Canceled</option>
              <option value="Processing">Processing</option>
              <option value="Pending">Pending</option>
            </select>
          ) : searchType !== 'all' ? (
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={`Enter ${searchType === 'id' ? 'order ID' : 'customer name'}`}
              className="border border-gray-300 px-4 py-2 rounded-xl focus:border-blue-500"
            />
          ) : null}

          {/* Search button */}
          {searchType !== 'status' && searchType !== 'all' && (
            <button
              onClick={searchOrders}
              className="px-4 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600"
            >
              Search
            </button>
          )}
        </div>
      </div>

      {/* Orders table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className={cx('table-header', 'w-1/5')}>
                ORDER_ID
              </th>
              <th className={cx('table-header', 'w-1/5')}>
                ORDER_DATE
              </th>
              <th className={cx('table-header', 'w-1/3')}>
                CUSTOMER_NAME
              </th>
              <th className={cx('table-header', 'w-1/5')}>
                ORDER_STATUS
              </th>
              <th className={cx('table-header', 'w-1/5')}>
                TOTAL
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentOrders.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center py-8 text-gray-500">
                  No matching orders found.
                </td>
              </tr>
            ) : (
              currentOrders.map((order) => (
                <tr
                  key={order.invoiceId}
                  className="hover:bg-gray-50 cursor-pointer"
                  onClick={() =>
                    navigate(config.routes.OrderDetails, {
                      state: { invoiceId: order.invoiceId },
                    })
                  }
                >
                  <td className="py-6 whitespace-nowrap text-gray-900">{order.invoiceId}</td>
                  <td className="py-6 whitespace-nowrap text-gray-900">
                    {moment(order.issueDate).format('DD/MM/YYYY HH:mm')}
                  </td>
                  <td className="py-6 whitespace-nowrap text-gray-900">
                    {order.customerName || 'Unknown Customer'}
                  </td>
                  <td className="py-6 whitespace-nowrap">
                    <span
                      className={cx('status', {
                        'text-blue-500': order.orderStatus === 'Delivered',
                        'text-red-500': order.orderStatus === 'Canceled',
                        'text-orange-500': order.orderStatus === 'Processing',
                        'text-yellow-500': order.orderStatus === 'Pending',
                      })}
                    >
                      {order.orderStatus}
                    </span>
                  </td>
                  <td className="py-6 whitespace-nowrap text-gray-900">
                    ${Number(order.total).toFixed(2)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination controls */}
      <div className="flex justify-center mt-4">
        <button
          className="px-4 py-2 mx-2 rounded-xl border border-gray-300 disabled:opacity-50 hover:bg-blue-500 hover:text-white"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        {getPaginationPages().map((page, index) => (
          <button
            key={index}
            className={cx('px-4 py-2 mx-2 rounded-xl border border-gray-300', {
              'bg-blue-500 text-white': page === currentPage,
              'hover:bg-blue-500 hover:text-white': page !== '...',
              'bg-transparent cursor-default': page === '...',
            })}
            onClick={() => page !== '...' && handlePageChange(page)}
            disabled={page === '...'}
          >
            {page}
          </button>
        ))}
        <button
          className="px-4 py-2 mx-2 rounded-xl border border-gray-300 disabled:opacity-50 hover:bg-blue-500 hover:text-white"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default RecentOrders;