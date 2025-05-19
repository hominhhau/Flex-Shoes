import React, { useEffect, useState } from 'react';
import { FaArrowRight, FaCalendarAlt } from 'react-icons/fa';
import classNames from 'classnames/bind';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { motion } from 'framer-motion';
import styles from './Dashboard.module.scss';
import { Bar, Line } from 'react-chartjs-2';
import { SlArrowRight, SlCalender } from 'react-icons/sl';
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
import { Api_InvoiceAdmin } from '../../../../apis/Api_invoiceAdmin';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend);

const cx = classNames.bind(styles);

function Dashboard() {
    const today = new Date();
    const formattedDate = `Day ${today.getDate()} Month ${today.getMonth() + 1} Year ${today.getFullYear()}`;

    // Utility function to format date to YYYY-MM-DD
    const formatToLocalDate = (date) => {
        const pad = (num) => String(num).padStart(2, '0');
        return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
    };

    const todayFormatted = formatToLocalDate(today); // Format today's date

    // State for stats and filters
    const [totalOrders, setTotalOrders] = useState(0);
    const [totalShipping, setTotalShipping] = useState(0);
    const [totalRevenue, setTotalRevenue] = useState(0);
    const [orderData, setOrderData] = useState([]);
    const [revenueData, setRevenueData] = useState([]);
    const [statsType, setStatsType] = useState('year');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [month, setMonth] = useState(today.getMonth() + 1);
    const [year, setYear] = useState(today.getFullYear());
    const [startYear, setStartYear] = useState(today.getFullYear() - 1);
    const [endYear, setEndYear] = useState(today.getFullYear());
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Generate year options (from 2020 to current year + 1)
    const yearOptions = Array.from({ length: today.getFullYear() - 2019 }, (_, i) => 2020 + i);

    // Month options (1-12)
    const monthOptions = Array.from({ length: 12 }, (_, i) => i + 1);

    // Utility function to get all days in a month
    const getDaysInMonth = (month, year) => {
        const days = [];
        const date = new Date(year, month - 1, 1);
        while (date.getMonth() === month - 1) {
            days.push(formatToLocalDate(date));
            date.setDate(date.getDate() + 1);
        }
        return days;
    };

    // Utility function to get all days in a date range
    const getDaysInRange = (startDate, endDate) => {
        const days = [];
        const currentDate = new Date(startDate);
        const end = new Date(endDate);
        while (currentDate <= end) {
            days.push(formatToLocalDate(currentDate));
            currentDate.setDate(currentDate.getDate() + 1);
        }
        return days;
    };

    // Validate dates and years
    const validateDates = (start, end, type = 'date') => {
        if (!start || !end) return true; // Allow empty dates for initial state
        if (type === 'date') {
            const startDate = new Date(start);
            const endDate = new Date(end);
            return startDate <= endDate;
        } else if (type === 'year') {
            return start <= end;
        }
        return true;
    };

    // Handle date changes with validation
    const handleStartDateChange = (value) => {
        if (endDate && new Date(value) > new Date(endDate)) {
            toast.error('Start date cannot be later than end date', { position: 'top-right' });
            return;
        }
        setStartDate(value);
    };

    const handleEndDateChange = (value) => {
        if (startDate && new Date(value) < new Date(startDate)) {
            toast.error('End date cannot be earlier than start date', { position: 'top-right' });
            return;
        }
        setEndDate(value);
    };

    const handleStartYearChange = (value) => {
        const newStartYear = Number(value);
        if (newStartYear > endYear) {
            toast.error('Start year cannot be later than end year', { position: 'top-right' });
            return;
        }
        setStartYear(newStartYear);
    };

    const handleEndYearChange = (value) => {
        const newEndYear = Number(value);
        if (newEndYear < startYear) {
            toast.error('End year cannot be earlier than start year', { position: 'top-right' });
            return;
        }
        setEndYear(newEndYear);
    };

    // Fetch API data
    const fetchData = async () => {
        setLoading(true);
        setError(null);
        try {
            let params = {};
            let chartYear = year;

            if (statsType === 'day') {
                // Use today's date if startDate or endDate is not set
                const effectiveStartDate = startDate || todayFormatted;
                const effectiveEndDate = endDate || todayFormatted;
                const start = new Date(effectiveStartDate);
                const end = new Date(effectiveEndDate);
                if (start > end) {
                    throw new Error('Start date cannot be later than end date');
                }
                params = { startDate: effectiveStartDate, endDate: effectiveEndDate };
                chartYear = end.getFullYear();
            } else if (statsType === 'month') {
                if (!month || !year) {
                    throw new Error('Please select both month and year');
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
                    throw new Error('Please select a year');
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
                    throw new Error('Start year cannot be later than end year');
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

            let orderCountResponse, revenueResponse;
            if (statsType === 'day' || statsType === 'month') {
                [orderCountResponse, revenueResponse] = await Promise.all([
                    Api_InvoiceAdmin.getOrderCountByDays(params),
                    Api_InvoiceAdmin.getRevenueByDays(params),
                ]);
            } else if (statsType === 'year') {
                [orderCountResponse, revenueResponse] = await Promise.all([
                    Api_InvoiceAdmin.getOrderCountByMonthsInYear(chartYear, params),
                    Api_InvoiceAdmin.getRevenueByMonthsInYear(chartYear, params),
                ]);
            } else if (statsType === 'range') {
                [orderCountResponse, revenueResponse] = await Promise.all([
                    Api_InvoiceAdmin.getOrderCountByYears(params),
                    Api_InvoiceAdmin.getRevenueByYears(params),
                ]);
            }

            console.log('Order count response:', orderCountResponse.data);
            console.log('Revenue response:', revenueResponse.data);

            const orderDataArray = Array.isArray(orderCountResponse.data) ? orderCountResponse.data : [];
            const revenueDataArray = Array.isArray(revenueResponse.data) ? revenueResponse.data : [];

            let fullOrderData = [];
            let fullRevenueData = [];
            if (statsType === 'month') {
                const days = getDaysInMonth(month, year);
                fullOrderData = days.map((date) => ({ date, count: 0 }));
                fullRevenueData = days.map((date) => ({ date, revenue: 0 }));
                orderDataArray.forEach((item) => {
                    const index = fullOrderData.findIndex((d) => d.date === item.date);
                    if (index !== -1) fullOrderData[index].count = item.count || 0;
                });
                revenueDataArray.forEach((item) => {
                    const index = fullRevenueData.findIndex((d) => d.date === item.date);
                    if (index !== -1) fullRevenueData[index].revenue = item.revenue || 0;
                });
            } else if (statsType === 'day') {
                const days = getDaysInRange(params.startDate, params.endDate);
                fullOrderData = days.map((date) => ({ date, count: 0 }));
                fullRevenueData = days.map((date) => ({ date, revenue: 0 }));
                orderDataArray.forEach((item) => {
                    const index = fullOrderData.findIndex((d) => d.date === item.date);
                    if (index !== -1) fullOrderData[index].count = item.count || 0;
                });
                revenueDataArray.forEach((item) => {
                    const index = fullRevenueData.findIndex((d) => d.date === item.date);
                    if (index !== -1) fullRevenueData[index].revenue = item.revenue || 0;
                });
            } else {
                fullOrderData = orderDataArray;
                fullRevenueData = revenueDataArray;
            }

            const [totalOrdersResponse, totalShippingResponse, totalRevenueResponse] = await Promise.all([
                Api_InvoiceAdmin.getTotalOrders(params),
                Api_InvoiceAdmin.getTotalShipping(params),
                Api_InvoiceAdmin.getTotalRevenue(params),
            ]);

            setTotalOrders(totalOrdersResponse.data || 0);
            setTotalShipping(totalShippingResponse.data || 0);
            setTotalRevenue(totalRevenueResponse.data || 0);
            setOrderData(fullOrderData);
            setRevenueData(fullRevenueData);
        } catch (error) {
            const errorMessage = error.response?.data?.message || error.message || 'Unable to load dashboard data';
            setError(errorMessage);
            toast.error(errorMessage, { position: 'top-right' });
            console.error('Error loading dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    // Fetch data when filter criteria change
    useEffect(() => {
        fetchData();
    }, [statsType, startDate, endDate, month, year, startYear, endYear]);

    // Chart label and title generator
    const getChartLabels = () => {
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
        if (statsType === 'day')
            return `Order Count by Day (${startDate || todayFormatted} to ${endDate || todayFormatted})`;
        if (statsType === 'month') return `Order Count by Day (Month ${month}/${year})`;
        if (statsType === 'year') return `Order Count by Month (${year})`;
        if (statsType === 'range') return `Order Count by Year (${startYear} to ${endYear})`;
        return 'Order Count';
    };

    const getRevenueChartTitle = () => {
        if (statsType === 'day')
            return `Revenue by Day (${startDate || todayFormatted} to ${endDate || todayFormatted})`;
        if (statsType === 'month') return `Revenue by Day (Month ${month}/${year})`;
        if (statsType === 'year') return `Revenue by Month (${year})`;
        if (statsType === 'range') return `Revenue by Year (${startYear} to ${endYear})`;
        return 'Revenue';
    };

    const getXAxisLabel = () => {
        if (statsType === 'day' || statsType === 'month') return 'Day';
        if (statsType === 'year') return 'Month';
        if (statsType === 'range') return 'Year';
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
            title: { display: true, text: getChartTitle() },
        },
        scales: {
            y: { beginAtZero: true, title: { display: true, text: 'Orders' } },
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
            title: { display: true, text: getRevenueChartTitle() },
        },
        scales: {
            y: { beginAtZero: true, title: { display: true, text: 'Revenue ($)' } },
            x: { title: { display: true, text: getXAxisLabel() } },
        },
    };

    // Handle filter changes
    const handleStatsTypeChange = (e) => {
        const newStatsType = e.target.value;
        setStatsType(newStatsType);
        if (newStatsType === 'day') {
            setStartDate(todayFormatted);
            setEndDate(todayFormatted);
        } else {
            setStartDate('');
            setEndDate('');
        }
        setMonth(today.getMonth() + 1);
        setYear(today.getFullYear());
        setStartYear(today.getFullYear() - 1);
        setEndYear(today.getFullYear());
    };

    return (
        <motion.div
            className={cx('wrapper')}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            <div className={cx('container')}>
                {/* Header */}
                <div className={cx('header')}>
                    <div>
                        <h1 className={cx('title')}>Dashboard</h1>
                        <div className={cx('breadcrumb')}>
                            Home <SlArrowRight size={10} className={cx('arrow')} /> Dashboard
                        </div>
                    </div>
                    <div className={cx('date')}>
                        <FaCalendarAlt className={cx('calendar-icon')} />
                        {formattedDate}
                    </div>
                </div>

                {/* Filter Section */}
                <motion.div
                    className={cx('filter-section')}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                >
                    <h2 className={cx('filter-title')}>Filter Statistics</h2>
                    <div className={cx('filter-controls')}>
                        <div className={cx('filter-group')}>
                            <label className={cx('filter-label')}>Filter Type</label>
                            <select value={statsType} onChange={handleStatsTypeChange} className={cx('select')}>
                                <option value="day">By Day</option>
                                <option value="month">By Month</option>
                                <option value="year">By Year</option>
                                <option value="range">By Year Range</option>
                            </select>
                        </div>

                        {statsType === 'day' && (
                            <div className={cx('filter-group')}>
                                <div className={cx('date-range')}>
                                    <div>
                                        <label className={cx('filter-label')}>Start Date</label>
                                        <input
                                            type="date"
                                            value={startDate}
                                            onChange={(e) => handleStartDateChange(e.target.value)}
                                            className={cx('date-input')}
                                        />
                                    </div>
                                    <div>
                                        <label className={cx('filter-label')}>End Date</label>
                                        <input
                                            type="date"
                                            value={endDate}
                                            onChange={(e) => handleEndDateChange(e.target.value)}
                                            className={cx('date-input')}
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {statsType === 'month' && (
                            <div className={cx('filter-group')}>
                                <div className={cx('month-range')}>
                                    <div>
                                        <label className={cx('filter-label')}>Month</label>
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
                                    </div>
                                    <div>
                                        <label className={cx('filter-label')}>Year</label>
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
                                </div>
                            </div>
                        )}

                        {statsType === 'year' && (
                            <div className={cx('filter-group')}>
                                <label className={cx('filter-label')}>Year</label>
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
                            <div className={cx('filter-group')}>
                                <div className={cx('year-range')}>
                                    <div>
                                        <label className={cx('filter-label')}>Start Year</label>
                                        <select
                                            value={startYear}
                                            onChange={(e) => handleStartYearChange(e.target.value)}
                                            className={cx('year-select')}
                                        >
                                            {yearOptions.map((yearOption) => (
                                                <option key={yearOption} value={yearOption}>
                                                    {yearOption}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <span className={cx('to-label')}>to</span>
                                    <div>
                                        <label className={cx('filter-label')}>End Year</label>
                                        <select
                                            value={endYear}
                                            onChange={(e) => handleEndYearChange(e.target.value)}
                                            className={cx('year-select')}
                                        >
                                            {yearOptions.map((yearOption) => (
                                                <option key={yearOption} value={yearOption}>
                                                    {yearOption}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </motion.div>

                {/* Summary Section */}
                <motion.div
                    className={cx('summary-container')}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                >
                    <OrderSummary name="Total Orders" price={totalOrders} rate={50} />
                    <OrderSummary name="Total Orders in Shipping" price={totalShipping} rate={50} />
                    <OrderSummary name="Total Revenue" price={`$${totalRevenue.toFixed(2)}`} rate={50} />
                </motion.div>

                {/* Chart Section */}
                <motion.div
                    className={cx('chart-section')}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.6 }}
                >
                    <h2 className={cx('chart-title')}>Order and Revenue Statistics</h2>
                    {loading ? (
                        <div className={cx('loading')}>
                            <div className={cx('spinner')}></div>
                            Loading data...
                        </div>
                    ) : (
                        <div className={cx('chart-grid')}>
                            <div className={cx('chart-container')}>
                                <Bar data={orderChartData} options={orderChartOptions} />
                            </div>
                            <div className={cx('chart-container')}>
                                <Line data={revenueChartData} options={revenueChartOptions} />
                            </div>
                        </div>
                    )}
                </motion.div>
            </div>
            <ToastContainer />
        </motion.div>
    );
}

export default Dashboard;
