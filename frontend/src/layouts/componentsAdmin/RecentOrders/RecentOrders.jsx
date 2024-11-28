import React, { useEffect, useState } from 'react';
import classNames from 'classnames/bind';
import styles from './RecentOrders.module.scss';
import { Link, useNavigate } from 'react-router-dom';


import {Api_InvoiceAdmin } from '../../../../apis/Api_InvoiceAdmin';
import config from '../../../config';

const cx = classNames.bind(styles);

function RecentOrders() {
    const navigator = useNavigate();

    const [orders, setOrders] = useState([]); // State lưu danh sách hóa đơn
    const [loading, setLoading] = useState(true); // State quản lý trạng thái tải
    const [currentPage, setCurrentPage] = useState(1); // Trang hiện tại
    const [ordersPerPage] = useState(5); // Số lượng đơn hàng mỗi trang

    useEffect(() => {
        const fetchRecentOrders = async () => {
            try {
                const recentOrders = await Api_InvoiceAdmin.getRecentInvoices(); // Lấy tất cả đơn hàng
                setOrders(recentOrders); // Cập nhật dữ liệu vào state
            } catch (error) {
                console.error('Lỗi khi tải hóa đơn gần đây:', error);
            } finally {
                setLoading(false); // Tắt trạng thái tải
            }
        };

        fetchRecentOrders();
    }, []);

    if (loading) return <div className="text-center">Đang tải...</div>;

    if (orders.length === 0) return <div className="text-center">Không có đơn hàng nào gần đây.</div>;

    // Hàm để tính toán đơn hàng hiển thị trên mỗi trang
    const indexOfLastOrder = currentPage * ordersPerPage; // Chỉ số của đơn hàng cuối cùng
    const indexOfFirstOrder = indexOfLastOrder - ordersPerPage; // Chỉ số của đơn hàng đầu tiên
    const currentOrders = orders.slice(indexOfFirstOrder, indexOfLastOrder); // Cắt danh sách đơn hàng cho trang hiện tại

    // Tính số trang
    const totalPages = Math.ceil(orders.length / ordersPerPage);

    // Hàm chuyển trang
    const handlePageChange = (page) => {
        if (page < 1 || page > totalPages) return; // Kiểm tra trang hợp lệ
        setCurrentPage(page); // Cập nhật trang hiện tại
    };

    // Tính toán các trang hiển thị
    const getPaginationPages = () => {
        const maxPagesToShow = 3; // Số trang tối đa cần hiển thị
        const pages = [];

        // Nếu tổng số trang ít hơn hoặc bằng số trang tối đa cần hiển thị
        if (totalPages <= maxPagesToShow) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            // Nếu trang hiện tại là gần đầu hoặc gần cuối
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

    return (
        <div className="bg-white w-full rounded-3xl shadow-md p-12 mt-8">
            <div className="flex flex-row items-center justify-between pb-8 border-b">
                <div className="font-bold">Đơn đặt hàng gần đây</div>
            </div>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="">
                        <tr>
                            <th className="py-6 text-left font-bold text-gray-500 uppercase tracking-wider w-1/5">
                                ID đơn hàng
                            </th>
                            <th className="py-6 text-left font-bold text-gray-500 uppercase tracking-wider w-1/5">
                                Ngày
                            </th>
                            <th className="py-6 text-left font-bold text-gray-500 uppercase tracking-wider w-1/3">
                                Tên khách hàng
                            </th>
                            <th className="py-6 text-left font-bold text-gray-500 uppercase tracking-wider w-1/5">
                                Trạng thái
                            </th>
                            <th className="py-6 text-left font-bold text-gray-500 uppercase tracking-wider w-1/5">
                                Số tiền
                            </th>
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
                                <td className="cursor-pointer py-6 whitespace-nowrap text-gray-900">
                                    {order.invoiceId}
                                </td>
                                <td className="cursor-pointer py-6 whitespace-nowrap text-gray-900">
                                    {order.issueDate}
                                </td>
                                <td className="cursor-pointer py-6 whitespace-nowrap text-gray-900">
                                    {order.receiverName}
                                </td>
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
                                <td className="py-4 whitespace-nowrap text-gray-900">${order.total?.toFixed(2)}</td>
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

                {/* Các trang hiển thị */}
                {getPaginationPages().map((page, index) => (
                    <button
                        key={index}
                        className={`px-4 py-2 mx-2 rounded-xl border border-gray-300 ${page === '...' ? 'bg-transparent' : currentPage === page ? 'bg-blue-500 text-white' : 'bg-white'}`}
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
