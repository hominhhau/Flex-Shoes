import React, { useState, useEffect } from 'react';
import { CiUser, CiDeliveryTruck } from 'react-icons/ci';
import classNames from 'classnames/bind';
import { IoBagHandle, IoPrintOutline, IoCalendarOutline } from 'react-icons/io5';
import { useLocation, useNavigate } from 'react-router-dom';

import styles from './OrderDetails.module.scss';
import { Api_InvoiceAdmin } from '../../../../apis/Api_invoiceAdmin';
import Modal from '../../../components/Modal';
import config from '../../../config';

const cx = classNames.bind(styles);

const OrderDetails = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { invoiceId } = location.state || {};
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [invoice, setInvoice] = useState({});
    const [details, setDetails] = useState([]);
    const [isSuccess, setIsSuccess] = useState(false);
    const [isError, setIsError] = useState(false);

    const fetchInvoice = async () => {
        setLoading(true);
        setError(null);
        try {
            console.log('Fetching invoice with ID:', invoiceId);
            const response = await Api_InvoiceAdmin.getInvoiceById(invoiceId);
            console.log('API response (getInvoiceById):', response);
            if (response?.data?.result) {
                const invoiceData = response.data.result;
                // Giả định orderStatus là chuỗi sạch (ví dụ: "Delivered")
                console.log('Raw orderStatus:', invoiceData.orderStatus);
                setInvoice(invoiceData);
                setDetails(invoiceData.invoiceDetails || []);
                console.log('Invoice data:', invoiceData);
                console.log('Invoice details:', invoiceData.invoiceDetails);
            } else {
                throw new Error('No invoice data found');
            }
        } catch (error) {
            console.error('Error fetching invoice:', error);
            setError(error.message || 'Failed to load invoice');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (invoiceId) {
            fetchInvoice();
        }
    }, [invoiceId]);

    const handleChange = (event) => {
        const newStatus = event.target.value;
        console.log('Selected new status:', newStatus);
        setInvoice({ ...invoice, orderStatus: newStatus });
    };

    const handleUpdateInvoice = async () => {
        const status = invoice.orderStatus;
        console.log('Sending status to update:', status);
        if (!status) {
            setIsError(true);
            setError('Please select a valid status');
            return;
        }
        try {
            const response = await Api_InvoiceAdmin.updateOrderStatus(invoice.invoiceId, status);
            console.log('Update status response:', response);
            // Làm mới dữ liệu hóa đơn
            await fetchInvoice();
            setIsSuccess(true);
        } catch (error) {
            console.error('Error updating status:', error);
            setError(error.response?.data?.message || 'Failed to update status');
            setIsError(true);
        }
    };

    const handleUpdateRedirect = () => {
        setIsSuccess(false);
        setIsError(false);
        setError(null);
        navigate(config.routes.dashboard);
    };

    const handleTryAgain = () => {
        setIsError(false);
        setError(null);
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error && !invoice.invoiceId) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className={cx('wrapper')}>
            <div className={cx('contentOrder')}>
                <div className={cx('contentTop')}>
                    <div className={cx('orderID')}>
                        <div className={cx('id', 'mt-5 ml-10')}>
                            <b>Order ID: {invoice.invoiceId || 'N/A'}</b>
                            <div
                                className={`w-40 h-50 ml-20 rounded-lg text-center ${
                                    invoice.orderStatus === 'Delivered'
                                        ? 'bg-green-500'
                                        : invoice.orderStatus === 'Canceled'
                                        ? 'bg-red-500'
                                        : 'bg-yellow-500'
                                }`}
                            >
                                <p>{invoice.orderStatus || 'Unknown'}</p>
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
                            <option value="Processing">Processing</option>
                            <option value="Delivered">Delivered</option>
                            <option value="Canceled">Canceled</option>
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
                                                {detail.product?.productName || 'N/A'} (ID:{' '}
                                                {detail.productId || 'N/A'})
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