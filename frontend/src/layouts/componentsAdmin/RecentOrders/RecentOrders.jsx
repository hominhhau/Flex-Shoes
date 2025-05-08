import React, { useEffect, useState } from 'react';
import classNames from 'classnames/bind';
import styles from './RecentOrders.module.scss';
import { useNavigate } from 'react-router-dom';
import { Api_InvoiceAdmin } from '../../../../apis/Api_invoiceAdmin';
import config from '../../../config';

const cx = classNames.bind(styles);

function RecentOrders() {
    const navigator = useNavigate();

    const [orders, setOrders] = useState([]); // State to store the list of invoices
    const [loading, setLoading] = useState(true); // State to manage loading status
    const [currentPage, setCurrentPage] = useState(1); // Current page
    const [ordersPerPage] = useState(5); // Number of orders per page
    const [searchQuery, setSearchQuery] = useState(''); // Search input value
    const [orderStatus, setOrderStatus] = useState('All'); // Order status
    const [allOrders, setAllOrders] = useState([]); 

    // Function to fetch recent invoices via API
    const fetchRecentOrders = async () => {
        try {
            setLoading(true);
            const recentOrders = await Api_InvoiceAdmin.getRecentInvoices();
            setOrders(recentOrders.data); // Set the correct array
            setAllOrders(recentOrders.data);
        } catch (error) {
            console.error('Error fetching recent invoices:', error);
        } finally {
            setLoading(false);
        }
    };

    // Function to search by order ID
    const searchById = async () => {
        try {
            setLoading(true);
            const filters = {
                id: searchQuery || undefined, // Search by ID (if provided)
            };
            console.log('====================================');
            console.log('id', filters.id);
            console.log('====================================');
            const filteredOrders = await Api_InvoiceAdmin.searchInvoices(filters);
            setOrders(filteredOrders.data);
        } catch (error) {
            console.error('Error searching invoices by ID:', error);
        } finally {
            setLoading(false);
        }
    };

    // Function to search by order status
    const searchByStatus = async () => {
        try {
            setLoading(true);
            if (orderStatus === 'All') {
                // If orderStatus is 'All', display all loaded orders
                setOrders(allOrders);
            } else {
                // If a specific status is selected, filter the list by status
                const filteredOrders = allOrders.filter(order => order.orderStatus === orderStatus);
                setOrders(filteredOrders);
            }
        } catch (error) {
            console.error('Error searching invoices by status:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        searchByStatus();
    }, [orderStatus]);
    
    // Handle initial component render
    useEffect(() => {
        fetchRecentOrders();
    }, []);

    // Pagination
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
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            if (currentPage <= 2) {
                pages.push(1, 2, 3, '...');
            } else if (currentPage >= totalPages - 1) {
                pages.push('...', totalPages - 2, totalPages - 1, totalPages);
            } else {
                pages.push('...', currentPage - 1, currentPage, currentPage + 1, '...');
            }
        }
        return pages;
    };

    if (loading) return <div className="text-center">Loading...</div>;

    if (orders.length === 0) return <div className="text-center">No recent orders found.</div>;

    return (
        <div className="bg-white w-full rounded-3xl shadow-md p-12 mt-8">
            <div className="flex flex-row items-center justify-between pb-8 border-b">
                <div className="font-bold">Orders</div>
                {/* Search input and button */}
                <div className="flex items-center gap-2">
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Enter customer ID..."
                        className="border border-gray-300 px-4 py-2 rounded-xl focus:border-blue-500"
                    />
                    <button
                        onClick={searchById} // Search by ID
                        className="px-4 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600"
                    >
                        Search
                    </button>
                    {/* Dropdown for selecting order status */}
                    <select
                        value={orderStatus}
                        onChange={(e) => {
                            setOrderStatus(e.target.value); // Update status
                            searchByStatus(); // Call search function on change
                        }}
                        className="border border-gray-300 px-4 py-2 rounded-xl"
                    >
                        <option value="All">All</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Canceled">Canceled</option>
                        <option value="Processing">Processing</option>
                    </select>
                </div>
            </div>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead>
                        <tr>
                            <th className="py-6 text-left font-bold text-gray-500 uppercase tracking-wider w-1/5">Order ID</th>
                            <th className="py-6 text-left font-bold text-gray-500 uppercase tracking-wider w-1/5">Date</th>
                            <th className="py-6 text-left font-bold text-gray-500 uppercase tracking-wider w-1/3">Customer Name</th>
                            <th className="py-6 text-left font-bold text-gray-500 uppercase tracking-wider w-1/5">Status</th>
                            <th className="py-6 text-left font-bold text-gray-500 uppercase tracking-wider w-1/5">Amount</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200 ">
                        {currentOrders.map((order, index) => (
                            <tr
                                key={index}
                                className="hover:bg-gray-50"
                                onClick={() => {
                                    navigator(config.routes.OrderDetails, { state: { invoiceId: order.invoiceId } });
                                }}
                            >
                                <td className="cursor-pointer py-6 whitespace-nowrap text-gray-900">{order.invoiceId}</td>
                                <td className="cursor-pointer py-6 whitespace-nowrap text-gray-900">{order.issueDate}</td>
                                <td className="cursor-pointer py-6 whitespace-nowrap text-gray-900">{order.receiverName}</td>
                                <td className="cursor-pointer py-6 whitespace-nowrap">
                                    <span
                                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full font-medium ${
                                            order.orderStatus === 'Delivered'
                                                ? 'text-blue-500'
                                                : order.orderStatus === 'Canceled'
                                                ? 'text-red-500'
                                                : 'text-orange-500'
                                        }`}
                                    >
                                        {order.orderStatus}
                                    </span>
                                </td>
                                <td className="py-4 whitespace-nowrap text-gray-900"> ${Number(order.total).toFixed(2)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination Controls */}
            <div className="flex justify-center mt-4">
                <button
                    className="px-4 py-2 mx-2 rounded-xl border border-solid border-gray-300 hover:bg-blue-500 hover:text-white"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                >
                    Prev
                </button>

                {getPaginationPages().map((page, index) => (
                    <button
                        key={index}
                        className={`px-4 py-2 mx-2 rounded-xl border border-gray-300 ${
                            page === '...' ? 'bg-transparent' : currentPage === page ? 'bg-blue-500 text-white' : 'hover:bg-blue-500 hover:text-white'
                        }`}
                        onClick={() => page !== '...' && handlePageChange(page)}
                        disabled={page === '...'}
                    >
                        {page}
                    </button>
                ))}

                <button
                    className="px-4 py-2 mx-2 rounded-xl border border-solid border-gray-300 hover:bg-blue-500 hover:text-white"
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