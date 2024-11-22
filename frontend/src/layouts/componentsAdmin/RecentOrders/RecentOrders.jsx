import React, { useEffect, useState } from 'react';
import { IoMdMore } from 'react-icons/io';
import classNames from 'classnames/bind';
import { Api_InvoiceAdmin } from '../../../../apis/Api_InvoiceAdmin';

import styles from './RecentOrders.module.scss';
const cx = classNames.bind(styles);

function RecentOrders() {
    const [orders, setOrders] = useState([]); // State lưu danh sách hóa đơn
    const [loading, setLoading] = useState(true); // State quản lý trạng thái tải

    useEffect(() => {
        const fetchRecentOrders = async () => {
            try {
                const recentOrders = await Api_InvoiceAdmin.getRecentInvoices();
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

    return (
        <div className="bg-white w-full rounded-3xl shadow-md p-12 mt-8">
            <div className="flex flex-row items-center justify-between space-y-0 pb-8 border-b border-separate">
                <div className="font-bold">Đơn đặt hàng gần đây</div>
            </div>
            <div>
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="py-6 text-left font-bold text-gray-500 uppercase tracking-wider">
                                ID đơn hàng
                            </th>
                            <th className="py-6 text-left font-bold text-gray-500 uppercase tracking-wider">Ngày</th>
                            <th className="py-6 text-left font-bold text-gray-500 uppercase tracking-wider">
                                Tên khách hàng
                            </th>
                            <th className="py-6 text-left font-bold text-gray-500 uppercase tracking-wider">
                                Trạng thái
                            </th>
                            <th className="py-6 text-left font-bold text-gray-500 uppercase tracking-wider">Số tiền</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {orders.map((order, index) => (
                            <tr key={index}>
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
                                                ? 'text-blue-500' // Màu xanh cho trạng thái "Delivered"
                                                : order.orderStatus === 'Canceled'
                                                  ? 'text-red-500' // Màu đỏ cho trạng thái "Cancel"
                                                  : 'text-orange-500' // Màu cam cho các trạng thái khác
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
        </div>
    );
}

export default RecentOrders;
