import React, { useState, useEffect } from 'react';
import { CiUser, CiDeliveryTruck } from 'react-icons/ci';
import classNames from 'classnames/bind';
import { IoBagHandle, IoPrintOutline, IoCalendarOutline } from 'react-icons/io5';
import { useLocation, useNavigate } from 'react-router-dom';
import { SlArrowRight, SlCalender } from 'react-icons/sl';

import styles from './OrderDetails.module.scss';
import { Api_InvoiceAdmin } from '../../../../apis/Api_invoiceAdmin'; // Đường dẫn tương đối
import Modal from '../../../components/Modal'; // Đường dẫn tương đối
import config from '../../../config'; // Đường dẫn tương đối

const cx = classNames.bind(styles);

// Danh sách trạng thái hợp lệ
const VALID_STATUSES = ['Processing', 'Delivered', 'Canceled'];

const OrderDetails = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { invoiceId } = location.state || {}; // Lấy invoiceId từ state của location
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [invoice, setInvoice] = useState({});
    const [details, setDetails] = useState([]);
    const [isSuccess, setIsSuccess] = useState(false);
    const [isError, setIsError] = useState(false);

    const today = new Date();
    const formattedDate = `Day ${today.getDate()} Month ${today.getMonth() + 1} Year ${today.getFullYear()}`;

    // Chuẩn hóa trạng thái đơn hàng
    const normalizeStatus = (status) => {
        if (!status) return 'Processing';
        const trimmedStatus = status.trim();
        if (trimmedStatus.toLowerCase() === 'deliveried') {
            return 'Delivered';
        }
        const normalized = VALID_STATUSES.find(
            (validStatus) => validStatus.toLowerCase() === trimmedStatus.toLowerCase(),
        );
        return normalized || 'Processing';
    };

    // Hàm lấy thông tin hóa đơn từ API
    const fetchInvoice = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await Api_InvoiceAdmin.getInvoiceById(invoiceId);
            if (response?.data?.result) {
                const invoiceData = response.data.result;
                const normalizedStatus = normalizeStatus(invoiceData.orderStatus);
                setInvoice({ ...invoiceData, orderStatus: normalizedStatus });
                setDetails(invoiceData.invoiceDetails || []);
            } else {
                throw new Error('No invoice data found');
            }
        } catch (error) {
            setError(error.message || 'Failed to load invoice');
        } finally {
            setLoading(false);
        }
    };

    // Gọi fetchInvoice khi component được mount và khi invoiceId thay đổi
    useEffect(() => {
        if (invoiceId) {
            fetchInvoice();
        }
    }, [invoiceId]);

    // Hàm xử lý thay đổi trạng thái đơn hàng trong dropdown
    const handleChange = (event) => {
        const newStatus = normalizeStatus(event.target.value);
        setInvoice({ ...invoice, orderStatus: newStatus });
    };

    // Hàm xử lý cập nhật trạng thái đơn hàng lên API
    const handleUpdateInvoice = async () => {
        const status = normalizeStatus(invoice.orderStatus);
        if (!status || !VALID_STATUSES.includes(status)) {
            setIsError(true);
            setError('Please select a valid status');
            return;
        }
        try {
            // *** Important:  Send data as a JSON object ***
            const response = await Api_InvoiceAdmin.updateOrderStatus(invoice.invoiceId, { orderStatus: status });
            if (response.status === 200) {
                setIsSuccess(true);
                await fetchInvoice();
            } else {
                setIsError(true);
                setError('Failed to update order status');
            }
        } catch (error) {
            setIsError(true);
            setError(error.response?.data?.message || 'Failed to update status');
        }
    };

    // Hàm xử lý chuyển hướng sau khi cập nhật thành công
    const handleUpdateRedirect = () => {
        setIsSuccess(false);
        setIsError(false);
        setError(null);
        navigate(config.routes.invoice); // Sử dụng config.routes
    };

    const handleTryAgain = () => {
        setIsError(false);
        setError(null);
    };

    // Hiển thị loading khi đang tải dữ liệu
    if (loading) {
        return <p>Loading...</p>;
    }

    // Hiển thị lỗi nếu có lỗi xảy ra trong quá trình tải dữ liệu
    if (error && !invoice.invoiceId) {
        return <p>Error: {error}</p>;
    }

    const displayStatus = normalizeStatus(invoice.orderStatus);

    const shippingFee = invoice.deliveryMethod === 'Standard Delivery' ? 6 : 0;
    return (
        <div className={cx('wrapper')}>
            <div className="flex justify-between mb-5">
                <div>
                    <p className="font-bold text-[24px]">Invoice</p>
                    <div className={cx('tab')}>
                        Home <SlArrowRight size={10} className="mx-3" /> Invoice
                        <SlArrowRight size={10} className="mx-3" /> Invoice Detail
                    </div>
                </div>
                <div className="flex items-end ">
                    <SlCalender className="mr-5 mb-2" />
                    {formattedDate}
                </div>
            </div>
            <div className={cx('contentOrder')}>
                <div className={cx('contentTop')}>
                    <div className={cx('orderID')}>
                        <div className={cx('id', 'mt-5 ml-10')}>
                            <b>Order ID: {invoice.invoiceId || 'N/A'}</b>
                            <div
                                className={`w-40 h-50 ml-20 rounded-lg text-center ${
                                    displayStatus === 'Delivered'
                                        ? 'bg-[#5bffaa]'
                                        : displayStatus === 'Canceled'
                                          ? 'bg-red-500'
                                          : 'bg-yellow-500'
                                }`}
                            >
                                <p>{displayStatus || 'Processing'}</p>
                            </div>
                        </div>
                        <div className={cx('schedula', 'flex-row float-start justify-center items-center')}>
                            <IoCalendarOutline className="mr-5 ml-10" /> {invoice.issueDate || 'N/A'}
                        </div>
                    </div>
                    <div className={cx('orderStatus')}>
                        <select value={invoice.orderStatus || ''} onChange={handleChange}>
                            <option disabled value="">
                                --- Change status ---
                            </option>
                            {VALID_STATUSES.map((status) => (
                                <option key={status} value={status}>
                                    {status}
                                </option>
                            ))}
                        </select>
                        <button className={cx('btnPrint', 'flex justify-center items-center')}>
                            <IoPrintOutline size={30} />
                        </button>
                        <button className={cx('btnSave')} onClick={handleUpdateInvoice}>
                            Save
                        </button>
                    </div>
                </div>
                <div className={cx('contentBody')}>
                    <div className={cx('card')}>
                        <div className={cx('cardIcon')}>
                            <CiUser className={cx('icon')} size={20} color="white" />
                        </div>
                        <div className={cx('cardInfor')}>
                            <b>Customer</b>
                            <p className="mt-3">Fullname: {invoice.receiverName || 'N/A'}</p>
                            <p className="mt-3">Phone: {invoice.receiverNumber || 'N/A'}</p>
                        </div>
                    </div>
                    <div className={cx('card')}>
                        <div className={cx('cardIcon')}>
                            <IoBagHandle className={cx('icon')} size={20} color="white" />
                        </div>
                        <div className={cx('cardInfor')}>
                            <b>Order Info</b>
                            <p className="mt-3">Shipping: {invoice.deliveryMethod || 'N/A'}</p>
                            <p className="mt-3">Payment Method: {invoice.paymentMethod || 'N/A'}</p>
                        </div>
                    </div>
                    <div className={cx('card')}>
                        <div className={cx('cardIcon')}>
                            <CiDeliveryTruck className={cx('icon')} size={20} color="white" />
                        </div>
                        <div className={cx('cardInfor')}>
                            <b>Deliver to</b>
                            <p className="mt-3">Address: {invoice.receiverAddress || 'N/A'}</p>
                        </div>
                    </div>
                </div>
            </div>
            <div className={cx('contentProduct')}>
                <h2>Products</h2>
                <div className={cx('totalProduct')}>
                    <table>
                        <thead>
                            <tr>
                                <th>Product</th>
                                <th>Order ID</th>
                                <th>Quantity</th>
                                <th>Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {details.map((detail) => {
                                const sellingPrice = detail.product?.sellingPrice || 0;
                                const totalPrice = sellingPrice * detail.quantity;

                                return (
                                    <tr key={detail.detailId}>
                                        <td>
                                            <div className={cx('productCell')}>
                                                {detail.product?.productName || 'N/A'} (ID: {detail.productId || 'N/A'})
                                            </div>
                                        </td>
                                        <td>#{detail.invoiceId || 'N/A'}</td>
                                        <td>{detail.quantity || 'N/A'}</td>
                                        <td>${totalPrice.toFixed(2)}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
                <div className={cx('totalPayment')}>
                    <table>
                        <tr>
                            <td>Shipping Fee</td>
                            <td>
                                <b>${shippingFee.toFixed(2)}</b>
                            </td>
                        </tr>
                        <tr>
                            <td>Total</td>
                            <td>
                                <b>${(invoice.total || 0).toFixed(2)}</b>
                            </td>
                        </tr>
                    </table>
                </div>
            </div>
            {isSuccess && (
                <Modal
                    valid={true}
                    title="Update Success!"
                    message="Status has been updated successfully."
                    isConfirm={true}
                    onConfirm={handleUpdateRedirect}
                    contentConfirm={'OK'}
                />
            )}
            {isError && (
                <Modal
                    valid={false}
                    title="Update Failed!"
                    message={error || 'Failed to update status. Please try again later.'}
                    isConfirm={true}
                    onConfirm={handleTryAgain}
                    contentConfirm={'OK'}
                />
            )}
        </div>
    );
};

export default OrderDetails;
