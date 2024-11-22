import React from 'react';
import { IoMdMore } from 'react-icons/io';
import classNames from 'classnames/bind';

import styles from './RecentOrders.module.scss';
const cx = classNames.bind(styles);

const orders = [
    {
        product: 'Adidas Ultra Boost',
        id: '#25426',
        date: 'Ngày 8 tháng 1 năm 2022',
        customer: 'Leo Gouse',
        status: 'Đã giao hàng',
        amount: 200.0,
        statusColor: 'text-blue-500',
    },
    {
        product: 'Adidas Ultra Boost',
        id: '#25425',
        date: 'Ngày 7 tháng 1 năm 2022',
        customer: 'Jaxson Korsgaard',
        status: 'Đã hủy',
        amount: 200.0,
        statusColor: 'text-orange-500',
    },
    {
        product: 'Adidas Ultra Boost',
        id: '#25424',
        date: 'Ngày 6 tháng 1 năm 2022',
        customer: 'Talan Botosh',
        status: 'Đã giao hàng',
        amount: 200.0,
        statusColor: 'text-blue-500',
    },
    {
        product: 'Adidas Ultra Boost',
        id: '#25423',
        date: 'Ngày 5 tháng 1 năm 2022',
        customer: 'Ryan Philips',
        status: 'Đã hủy',
        amount: 200.0,
        statusColor: 'text-orange-500',
    },
    {
        product: 'Adidas Ultra Boost',
        id: '#25422',
        date: 'Ngày 4 tháng 1 năm 2022',
        customer: 'Emerson Baptista',
        status: 'Đã giao hàng',
        amount: 200.0,
        statusColor: 'text-blue-500',
    },
    {
        product: 'Adidas Ultra Boost',
        id: '#25421',
        date: 'Ngày 2 tháng 1 năm 2022',
        customer: 'Jaxson Calzoni',
        status: 'Đã giao hàng',
        amount: 200.0,
        statusColor: 'text-blue-500',
    },
];

function RecentOrders() {
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
                                Sản phẩm
                            </th>
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
                            <th className="py-6 text-left font-bold text-gray-500 uppercase tracking-wider">
                                Số lượng
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {orders.map((order, index) => (
                            <tr key={index}>
                                <td className="cursor-pointer py-6 whitespace-nowrap text-gray-900">{order.product}</td>
                                <td className="cursor-pointer py-6 whitespace-nowrap text-gray-900">{order.id}</td>
                                <td className="cursor-pointer py-6 whitespace-nowrap text-gray-900">{order.date}</td>
                                <td className="cursor-pointer py-6 whitespace-nowrap text-gray-900">
                                    {order.customer}
                                </td>
                                <td className="cursor-pointer py-6 whitespace-nowrap">
                                    <span
                                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full  font-medium ${order.statusColor}`}
                                    >
                                        {order.status}
                                    </span>
                                </td>
                                <td className="py-4 whitespace-nowrap  text-gray-900">${order.amount.toFixed(2)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default RecentOrders;
