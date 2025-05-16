import React, { useEffect, useState } from 'react';
import { FaArrowRight, FaCalendarAlt } from 'react-icons/fa';
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
import { Api_InvoiceAdmin } from '../../../../apis/Api_InvoiceAdmin';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend);

const cx = classNames.bind(styles);

function Dashboard() {
    const today = new Date();
    const formattedDate = `Day ${today.getDate()} Month ${today.getMonth() + 1} Year ${today.getFullYear()}`;

    // State for stats and filters
    const [totalOrders, setTotalOrders] = useState(0);
    const [totalShipping, setTotalShipping] = useState(0);
    const [totalRevenue, setTotalRevenue] = useState(0);
    const [orderData, setOrderData] = useState([]);
    const [revenueData, setRevenueData] = useState([]);
    const [statsType, setStatsType] = useState('year'); // day, month, year, range
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [month, setMonth] = useState(1);
    const [year, setYear] = useState(today.getFullYear());
    const [startYear, setStartYear] = useState(today.getFullYear() - 1);
    const [endYear, setEndYear] = useState(today.getFullYear());
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Generate year options (from 2020 to current year + 1)
    const yearOptions = Array.from(
        { length: today.getFullYear() - 2019 + 1 },
        (_, i) => 2020 + i
    );

    // Month options (1-12)
    const monthOptions = Array.from({ length: 12 }, (_, i) => i + 1);

    // Utility function to format date to YYYY-MM-DD
    const formatToLocalDate = (date) => {
        const pad = (num) => String(num).padStart(2, '0');
        return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
    };

    // Fetch API data for dashboard overview and charts
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);
            try {
                let params = {};
                let chartYear = year;

                if (statsType === 'day') {
                    if (!startDate || !endDate) {
                        setError('Please select both start and end date');
                        setLoading(false);
                        return;
                    }
                    const start = new Date(startDate);
                    const end = new Date(endDate);
                    if (start > end) {
                        setError('Start date cannot be later than end date');
                        setLoading(false);
                        return;
                    }
                    params = {
                        startDate: startDate,
                        endDate: endDate,
                    };
                    chartYear = end.getFullYear();
                } else if (statsType === 'month') {
                    if (!month || !year) {
                        setError('Please select both month and year');
                        setLoading(false);
                        return;
                    }
                    const start = new Date(year, month - 1, 1);
                    const end = new Date(year, month, 0);
                    params = {
                        startDate: formatToLocalDate(start),
                        endDate: formatToLocalDate(end),
                    };
                    chartYear = year;
                } else if (statsType === 'year') {
                    if (!year) {
                        setError('Please select a year');
                        setLoading(false);
                        return;
                    }
                    const start = new Date(year, 0, 1);
                    const end = new Date(year, 11, 31);
                    params = {
                        startDate: formatToLocalDate(start),
                        endDate: formatToLocalDate(end),
                    };
                    chartYear = year;
                } else if (statsType === 'range') {
                    if (startYear > endYear) {
                        setError('Start year cannot be later than end year');
                        setLoading(false);
                        return;
                    }
                    const start = new Date(startYear, 0, 1);
                    const end = new Date(endYear, 11, 31);
                    params = {
                        startDate: formatToLocalDate(start),
                        endDate: formatToLocalDate(end),
                    };
                    chartYear = endYear;
                }

                console.log('Fetching data with params:', params);

                // Determine which API endpoints to call based on statsType
                let orderCountResponse, revenueResponse;
                if (statsType === 'day' || statsType === 'month') {
                    // Use daily stats for day and month filters
                    [orderCountResponse, revenueResponse] = await Promise.all([
                        Api_InvoiceAdmin.getOrderCountByDays(params),
                        Api_InvoiceAdmin.getRevenueByDays(params),
                    ]);
                } else if (statsType === 'year') {
                    // Use monthly stats for year filter
                    [orderCountResponse, revenueResponse] = await Promise.all([
                        Api_InvoiceAdmin.getOrderCountByMonthsInYear(chartYear, params),
                        Api_InvoiceAdmin.getRevenueByMonthsInYear(chartYear, params),
                    ]);
                } else if (statsType === 'range') {
                    // Use yearly stats for range filter
                    [orderCountResponse, revenueResponse] = await Promise.all([
                        Api_InvoiceAdmin.getOrderCountByYears(params),
                        Api_InvoiceAdmin.getRevenueByYears(params),
                    ]);
                }

                console.log('Order count response:', orderCountResponse.data);
                console.log('Revenue response:', revenueResponse.data);

                // Ensure data is an array
                const orderDataArray = Array.isArray(orderCountResponse.data) ? orderCountResponse.data : [];
                const revenueDataArray = Array.isArray(revenueResponse.data) ? revenueResponse.data : [];

                const [
                    totalOrdersResponse,
                    totalShippingResponse,
                    totalRevenueResponse,
                ] = await Promise.all([
                    Api_InvoiceAdmin.getTotalOrders(params),
                    Api_InvoiceAdmin.getTotalShipping(params),
                    Api_InvoiceAdmin.getTotalRevenue(params),
                ]);

                setTotalOrders(totalOrdersResponse.data || 0);
                setTotalShipping(totalShippingResponse.data || 0);
                setTotalRevenue(totalRevenueResponse.data || 0);
                setOrderData(orderDataArray);
                setRevenueData(revenueDataArray);
            } catch (error) {
                setError(error.response?.data?.message || 'Failed to fetch dashboard data');
                console.error('Error fetching dashboard data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [statsType, startDate, endDate, month, year, startYear, endYear]);

    // Chart label and title generator based on statsType
    const getChartLabels = () => {
        // Ensure orderData is an array before mapping
        if (!Array.isArray(orderData)) {
            console.warn('orderData is not an array:', orderData);
            return [];
        }

        if (statsType === 'day' || statsType === 'month') {
            return orderData.map((item) => item.date || '');
        } else if (statsType === 'year') {
            return orderData.map((item) => `Month ${item.month}` || '');
        } else if (statsType === 'range') {
            return orderData.map((item) => item.year?.toString() || '');
        }
        return [];
    };

    const getChartTitle = () => {
        if (statsType === 'day') {
            return `Order Count by Day (${startDate} to ${endDate})`;
        } else if (statsType === 'month') {
            return `Order Count by Day (Month ${month}/${year})`;
        } else if (statsType === 'year') {
            return `Order Count by Month (${year})`;
        } else if (statsType === 'range') {
            return `Order Count by Year (${startYear} to ${endYear})`;
        }
        return 'Order Count';
    };

    const getRevenueChartTitle = () => {
        if (statsType === 'day') {
            return `Revenue by Day (${startDate} to ${endDate})`;
        } else if (statsType === 'month') {
            return `Revenue by Day (Month ${month}/${year})`;
        } else if (statsType === 'year') {
            return `Revenue by Month (${year})`;
        } else if (statsType === 'range') {
            return `Revenue by Year (${startYear} to ${endYear})`;
        }
        return 'Revenue';
    };

    const getXAxisLabel = () => {
        if (statsType === 'day' || statsType === 'month') {
            return 'Date';
        } else if (statsType === 'year') {
            return 'Month';
        } else if (statsType === 'range') {
            return 'Year';
        }
        return 'Time';
    };

    // Bar chart configuration for order count
    const orderChartData = {
        labels: getChartLabels(),
        datasets: [
            {
                label: 'Order Count',
                data: Array.isArray(orderData) ? orderData.map((item) => item.count || 0) : [],
                backgroundColor: 'rgba(75, 192, 192, 0.5)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
            },
        ],
    };

    const orderChartOptions = {
        responsive: true,
        plugins: {
            legend: { position: 'top' },
            title: {
                display: true,
                text: getChartTitle(),
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                title: { display: true, text: 'Orders' },
            },
            x: { title: { display: true, text: getXAxisLabel() } },
        },
    };

    // Line chart configuration for revenue
    const revenueChartData = {
        labels: getChartLabels(),
        datasets: [
            {
                label: 'Revenue',
                data: Array.isArray(revenueData) ? revenueData.map((item) => item.revenue || 0) : [],
                fill: false,
                borderColor: 'rgba(255, 99, 132, 1)',
                tension: 0.1,
            },
        ],
    };

    const revenueChartOptions = {
        responsive: true,
        plugins: {
            legend: { position: 'top' },
            title: {
                display: true,
                text: getRevenueChartTitle(),
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                title: { display: true, text: 'Revenue ($)' },
            },
            x: { title: { display: true, text: getXAxisLabel() } },
        },
    };

    // Handle filter changes
    const handleStatsTypeChange = (e) => {
        setStatsType(e.target.value);
        setStartDate('');
        setEndDate('');
        setMonth(1);
        setYear(today.getFullYear());
        setStartYear(today.getFullYear() - 1);
        setEndYear(today.getFullYear());
    };

    return (
        <div className={cx('wrapper')}>
            <div className={cx('container')}>
                {/* Header */}
                <div className={cx('header')}>
                    <div>
                        <h1 className={cx('title')}>Dashboard</h1>
                        <div className={cx('breadcrumb')}>
                            Home <FaArrowRight size={10} className={cx('arrow')} /> Dashboard
                        </div>
                    </div>
                    <div className={cx('date')}>
                        <FaCalendarAlt className={cx('calendar-icon')} />
                        {formattedDate}
                    </div>
                </div>

                {/* Filter Section */}
                <div className={cx('filter-section')}>
                    <h2 className={cx('filter-title')}>Filter Statistics</h2>
                    <div className={cx('filter-controls')}>
                        <select
                            value={statsType}
                            onChange={handleStatsTypeChange}
                            className={cx('select')}
                        >
                            <option value="day">By Day</option>
                            <option value="month">By Month</option>
                            <option value="year">By Year</option>
                            <option value="range">By Year Range</option>
                        </select>
                        {statsType === 'day' && (
                            <div className={cx('date-range')}>
                                <input
                                    type="date"
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                    className={cx('date-input')}
                                    placeholder="Start Date"
                                />
                                <input
                                    type="date"
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                    className={cx('date-input')}
                                    placeholder="End Date"
                                />
                            </div>
                        )}
                        {statsType === 'month' && (
                            <div className={cx('month-range')}>
                                <select
                                    value={month}
                                    onChange={(e) => setMonth(Number(e.target.value))}
                                    className={cx('month-select')}
                                >
                                    {monthOptions.map((monthOption) => (
                                        <option key={monthOption} value={monthOption}>
                                            Month {monthOption}
                                        </option>
                                    ))}
                                </select>
                                <select
                                    value={year}
                                    onChange={(e) => setYear(Number(e.target.value))}
                                    className={cx('year-select')}
                                >
                                    {yearOptions.map((yearOption) => (
                                        <option key={yearOption} value={yearOption}>
                                            {yearOption}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}
                        {statsType === 'year' && (
                            <div className={cx('year-single')}>
                                <select
                                    value={year}
                                    onChange={(e) => setYear(Number(e.target.value))}
                                    className={cx('year-select')}
                                >
                                    {yearOptions.map((yearOption) => (
                                        <option key={yearOption} value={yearOption}>
                                            {yearOption}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}
                        {statsType === 'range' && (
                            <div className={cx('year-range')}>
                                <select
                                    value={startYear}
                                    onChange={(e) => setStartYear(Number(e.target.value))}
                                    className={cx('year-select')}
                                >
                                    {yearOptions.map((yearOption) => (
                                        <option key={yearOption} value={yearOption}>
                                            {yearOption}
                                        </option>
                                    ))}
                                </select>
                                <span className={cx('to-label')}>to</span>
                                <select
                                    value={endYear}
                                    onChange={(e) => setEndYear(Number(e.target.value))}
                                    className={cx('year-select')}
                                >
                                    {yearOptions.map((yearOption) => (
                                        <option key={yearOption} value={yearOption}>
                                            {yearOption}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}
                    </div>
                    {error && <div className={cx('error')}>{error}</div>}
                </div>

                {/* Summary Section */}
                {loading ? (
                    <div className={cx('loading')}>Loading...</div>
                ) : (
                    <>
                        <div className={cx('summary-container')}>
                            <OrderSummary name="Total Orders" price={totalOrders} rate={50} />
                            <OrderSummary name="Total Orders in Shipping" price={totalShipping} rate={50} />
                            <OrderSummary name="Total Revenue" price={`$${totalRevenue.toFixed(2)}`} rate={50} />
                        </div>

                        {/* Chart Section */}
                        <div className={cx('chart-grid')}>
                            <div className={cx('chart-container')}>
                                <Bar data={orderChartData} options={orderChartOptions} />
                            </div>
                            <div className={cx('chart-container')}>
                                <Line data={revenueChartData} options={revenueChartOptions} />
                            </div>
                        </div>

                        {/* Recent Orders */}
                        <div className={cx('recent-orders')}>
                            <RecentOrders />
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

export default Dashboard;