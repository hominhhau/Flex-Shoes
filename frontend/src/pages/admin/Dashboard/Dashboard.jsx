
import React, { useEffect, useState } from 'react';
import { SlArrowRight, SlCalender } from 'react-icons/sl';
import classNames from 'classnames/bind';
import styles from './Dashboard.module.scss';
import { Bar, Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    LineElement,
    PointElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

import OrderSummary from '../../../layouts/componentsAdmin/OrderSummary';
import RecentOrders from '../../../layouts/componentsAdmin/RecentOrders';
import { Api_InvoiceAdmin } from '../../../../apis/Api_invoiceAdmin';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend);

const cx = classNames.bind(styles);

function Dashboard() {
    const today = new Date();
    const formattedDate = `Day ${today.getDate()} Month ${today.getMonth() + 1} Year ${today.getFullYear()}`;
    const [totalOrders, setTotalOrders] = useState(0);
    const [totalShipping, setTotalShipping] = useState(0);
    const [totalRevenue, setTotalRevenue] = useState(0);
    const [orderData, setOrderData] = useState([]);
    const [revenueData, setRevenueData] = useState([]);
    const [selectedYear, setSelectedYear] = useState(today.getFullYear());

    // Fetch API data for dashboard overview and charts
    useEffect(() => {
        const fetchData = async () => {
            try {
                const totalOrdersResponse = await Api_InvoiceAdmin.getTotalOrders();
                setTotalOrders(totalOrdersResponse.data);

                const totalShippingResponse = await Api_InvoiceAdmin.getTotalShipping();
                setTotalShipping(totalShippingResponse.data);

                const totalRevenueResponse = await Api_InvoiceAdmin.getTotalRevenue();
                setTotalRevenue(totalRevenueResponse.data);

                const orderCountResponse = await Api_InvoiceAdmin.getOrderCountByMonthsInYear(selectedYear);
                setOrderData(orderCountResponse.data);

                const revenueResponse = await Api_InvoiceAdmin.getRevenueByMonthsInYear(selectedYear);
                setRevenueData(revenueResponse.data);
            } catch (error) {
                console.error('Error fetching dashboard data:', error);
            }
        };

        fetchData();
    }, [selectedYear]);

    // Bar chart configuration for order count
    const orderChartData = {
        labels: orderData.map(item => `Tháng ${item.month}`),
        datasets: [
            {
                label: 'Số lượng đơn hàng',
                data: orderData.map(item => item.count),
                backgroundColor: 'rgba(75, 192, 192, 0.5)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
            },
        ],
    };

    const orderChartOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: `Số lượng đơn hàng theo tháng (${selectedYear})`,
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'Số đơn hàng',
                },
            },
            x: {
                title: {
                    display: true,
                    text: '',
                },
            },
        },
    };

    // Line chart configuration for revenue
    const revenueChartData = {
        labels: revenueData.map(item => `Tháng ${item.month}`),
        datasets: [
            {
                label: 'Doanh thu',
                data: revenueData.map(item => item.revenue),
                fill: false,
                borderColor: 'rgba(255, 99, 132, 1)',
                tension: 0.1,
            },
        ],
    };

    const revenueChartOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: `Doanh thu theo tháng (${selectedYear})`,
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'Doanh thu ($)',
                },
            },
            x: {
                title: {
                    display: true,
                    text: '',
                },
            },
        },
    };

    // Handle year change
    const handleYearChange = (e) => {
        setSelectedYear(parseInt(e.target.value));
    };

    // Generate year options (e.g., from 2020 to current year)
    const yearOptions = Array.from({ length: today.getFullYear() - 2019 }, (_, i) => 2020 + i);

    return (
        <div className="w-full pl-[260px] mt-[100px]">
            <div className="p-[20px]">
                <div className="flex justify-between">
                    <div>
                        <p className="font-bold text-[24px]">Dashboard</p>
                        <div className={cx('tab')}>
                            Home <SlArrowRight size={10} className="mx-3" /> Dashboard
                        </div>
                    </div>
                    <div className="flex items-end">
                        <SlCalender className="mr-5 mb-2" />
                        {formattedDate}
                    </div>
                </div>
                <div className="flex mt-5 col-span-3 gap-6">
                    <OrderSummary name={'Total Orders'} price={totalOrders} rate={50} />
                    <OrderSummary name={'Total Orders in Shipping'} price={totalShipping} rate={50} />
                    <OrderSummary name={'Total Revenue'} price={`$ ${totalRevenue}`} rate={50} />
                </div>
                <div className="mt-10">
                    <div className="mb-5">
                        <label htmlFor="yearSelect" className="mr-3">Chọn năm:</label>
                        <select
                            id="yearSelect"
                            value={selectedYear}
                            onChange={handleYearChange}
                            className="p-2 border rounded"
                        >
                            {yearOptions.map(year => (
                                <option key={year} value={year}>{year}</option>
                            ))}
                        </select>
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                        <div className="bg-white p-5 rounded shadow">
                            <Bar data={orderChartData} options={orderChartOptions} />
                        </div>
                        <div className="bg-white p-5 rounded shadow">
                            <Line data={revenueChartData} options={revenueChartOptions} />
                        </div>
                    </div>
                </div>
                {/* <div>
                    <RecentOrders />
                </div> */}
            </div>
        </div>
    );
}

export default Dashboard;
