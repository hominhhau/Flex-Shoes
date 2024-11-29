import React, { useEffect, useState } from 'react';
import classNames from 'classnames/bind';
import styles from './RecentOrders.module.scss';
import { useNavigate } from 'react-router-dom';
import { Api_InvoiceAdmin } from '../../../../apis/Api_invoiceAdmin';
import config from '../../../config';

const cx = classNames.bind(styles);

function RecentOrders() {
    const navigator = useNavigate();

    const [orders, setOrders] = useState([]); // State lưu danh sách hóa đơn
    const [loading, setLoading] = useState(true); // State quản lý trạng thái tải
    const [currentPage, setCurrentPage] = useState(1); // Trang hiện tại
    const [ordersPerPage] = useState(5); // Số lượng đơn hàng mỗi trang
    const [searchQuery, setSearchQuery] = useState(''); // Giá trị ô tìm kiếm
    const [orderStatus, setOrderStatus] = useState('All'); // Trạng thái đơn hàng
    const [allOrders, setAllOrders] = useState([]); 

    // Hàm gọi API lấy hóa đơn gần đây
    const fetchRecentOrders = async () => {
        try {
            setLoading(true);
            const recentOrders = await Api_InvoiceAdmin.getRecentInvoices();
            setOrders(recentOrders); // Lưu danh sách đơn hàng vào orders
            setAllOrders(recentOrders); // Lưu danh sách đơn hàng vào allOrders
        } catch (error) {
            console.error('Lỗi khi tải hóa đơn gần đây:', error);
        } finally {
            setLoading(false);
        }
    };

    // Hàm tìm kiếm theo ID đơn hàng
    const searchById = async () => {
        try {
            setLoading(true);
            const filters = {
                id: searchQuery || undefined, // Tìm kiếm theo ID (nếu có)
            };
            const filteredOrders = await Api_InvoiceAdmin.searchInvoices(filters); // Gọi API tìm kiếm theo ID
            setOrders(filteredOrders); // Cập nhật state với kết quả tìm kiếm
        } catch (error) {
            console.error('Lỗi khi tìm kiếm hóa đơn theo ID:', error);
        } finally {
            setLoading(false);
        }
    };

    // Hàm tìm kiếm theo trạng thái đơn hàng
    const searchByStatus = async () => {
        try {
            setLoading(true);
            if (orderStatus === 'All') {
                // Nếu orderStatus là 'All', hiển thị tất cả các đơn hàng đã tải
                setOrders(allOrders);
            } else {
                // Nếu chọn trạng thái khác 'All', lọc danh sách theo trạng thái
                const filteredOrders = allOrders.filter(order => order.orderStatus === orderStatus);
                setOrders(filteredOrders);
            }
        } catch (error) {
            console.error('Lỗi khi tìm kiếm hóa đơn theo trạng thái:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        searchByStatus();
    }, [orderStatus]);


    // Xử lý khi component render lần đầu
    useEffect(() => {
        fetchRecentOrders();
    }, []);

    // Phân trang
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

    if (loading) return <div className="text-center">Đang tải...</div>;

    if (orders.length === 0) return <div className="text-center">Không có đơn hàng nào gần đây.</div>;

    return (
        <div className="bg-white w-full rounded-3xl shadow-md p-12 mt-8">
            <div className="flex flex-row items-center justify-between pb-8 border-b">
                <div className="font-bold">Đơn đặt hàng</div>
                {/* Ô tìm kiếm và nút tìm */}
                <div className="flex items-center gap-2">
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Nhập tên khách hàng..."
                        className="border border-gray-300 px-4 py-2 rounded-xl focus:border-blue-500"
                    />
                    <button
                        onClick={searchById} // Tìm kiếm theo ID
                        className="px-4 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600"
                    >
                        Tìm
                    </button>
                    {/* Dropdown chọn trạng thái đơn hàng */}
                    <select
                        value={orderStatus}
                        onChange={(e) => {
                            setOrderStatus(e.target.value); // Cập nhật trạng thái
                            searchByStatus(); // Gọi hàm tìm kiếm ngay khi thay đổi
                        }}
                        className="border border-gray-300 px-4 py-2 rounded-xl"
                    >
                        <option value="All">Tất cả</option>
                        <option value="Delivered">Đã giao</option>
                        <option value="Canceled">Đã hủy</option>
                        <option value="Processing">Đang xử lý</option>
                    </select>
                </div>
            </div>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead>
                        <tr>
                            <th className="py-6 text-left font-bold text-gray-500 uppercase tracking-wider w-1/5">ID đơn hàng</th>
                            <th className="py-6 text-left font-bold text-gray-500 uppercase tracking-wider w-1/5">Ngày</th>
                            <th className="py-6 text-left font-bold text-gray-500 uppercase tracking-wider w-1/3">Tên khách hàng</th>
                            <th className="py-6 text-left font-bold text-gray-500 uppercase tracking-wider w-1/5">Trạng thái</th>
                            <th className="py-6 text-left font-bold text-gray-500 uppercase tracking-wider w-1/5">Số tiền</th>
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

                {getPaginationPages().map((page, index) => (
                    <button
                        key={index}
                        className={`px-4 py-2 mx-2 rounded-xl border border-gray-300 ${
                            page === '...' ? 'bg-transparent' : currentPage === page ? 'bg-blue-500 text-white' : 'bg-white'
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
