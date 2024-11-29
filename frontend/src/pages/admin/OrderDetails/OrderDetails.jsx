import React, { useState, useEffect } from 'react';
import { CiUser, CiDeliveryTruck  } from 'react-icons/ci';
import classNames from 'classnames/bind';
import { IoBagHandle, IoPrintOutline, IoCalendarOutline, IoReloadCircle } from 'react-icons/io5';
import { MdOutlineCancel  } from "react-icons/md";
import { useLocation } from 'react-router-dom';

import styles from './OrderDetails.module.scss';
import { Api_InvoiceAdmin } from "../../../../apis/Api_invoiceAdmin";

const cx = classNames.bind(styles);

const OrderDetails = () => {
    const location = useLocation();
    const { invoiceId } = location.state || {}; // Lấy dữ liệu từ state
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [invoice, setInvoice] = useState({});
    const [details, setDetails] = useState([]);
    const [productDelete, setProductDelete] = useState([]);
    

    useEffect (() => {
        const fetchInvoice = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await Api_InvoiceAdmin.getInvoiceById(invoiceId);
                const responseDetail = await Api_InvoiceAdmin.getInvoiceDetail(invoiceId);
                if (response && responseDetail) {
                    setInvoice(response.result);
                    setDetails(responseDetail.result);
                }

            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchInvoice();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }
    const handleChange = (event) => {
        setInvoice({...invoice , orderStatus : event.target.value}); // Cập nhật giá trị khi thay đổi
    };
    const handleDeteleProduct = (detail) => {
        const updatedDetails = details.filter((product) => product.productId !== detail.productId);
        setDetails(updatedDetails);
        //them product da xoa vao mang productDelete
        setProductDelete([...productDelete, detail]);
        console.log('size = ', productDelete.length);
    };
    const handleUpdateInvoice = async () => {
        try {
           const data = {...invoice, invoiceDetails : details};
           const response = await Api_InvoiceAdmin.updateInvoice(data);
           console.log('result = ', response.result);
        } catch (error) {
            console.error('Error updating invoice:', error);
        }
    };

    return (
        <div className={cx('wrapper')}>
            <div className={cx('contentOrder')}>
                <div className={cx('contentTop')}>
                    <div className={cx('orderID')}>
                        <div className={cx('id', 'mt-5 ml-10')}>
                            <b >Order ID: {invoice.invoiceId}</b>

                            <div className={`w-40 h-50 ml-20 rounded-lg text-center ${(invoice.orderStatus === 'Delivered')
                                ? 'bg-green-500'
                                : (invoice.orderStatus === 'Canceled')
                                    ? 'bg-red-500'
                                    : 'bg-yellow-500'
                                }`}>
                                <p >{invoice.orderStatus} </p>
                            </div>

                        </div>
                        <div className={cx('schedula', 'flex-row float-start justify-center items-center')}>
                            <IoCalendarOutline className='mr-5 ml-10' /> {invoice.issueDate}
                        </div>
                    </div>
                    <div className={cx('orderStatus')}>
                        <select value={invoice.orderStatus} onChange={handleChange}>
                            <option disabled>
                                --- Change status ---
                            </option>
                            <option value="Processing">Processing</option>
                            <option value="Delivered">Delivered</option>
                            <option value="Canceled">Canceled</option>
                        </select>
                        <button className={cx('btnPrint', 'flex justify-center items-center')}>
                            <IoPrintOutline size={30} />
                        </button>
                        <button className={cx('btnSave')} onClick={handleUpdateInvoice}>Save</button>
                    </div>
                </div>
                <div className={cx('contentBody')}>
                    <div className={cx('card')}>
                        <div className={cx('cardIcon')}>
                            <CiUser className={cx('icon')} size={20} color="white" />
                        </div>
                        <div className={cx('cardInfor')}>
                            <b>Customer</b>
                            <p className='mt-3'>Fullname: {invoice.receiverName}</p>
                            {/* <p>Email: vanan@gmail.com</p> */}
                            <p className='mt-3'>Phone: {invoice.receiverNumber}</p>
                        </div>
                    </div>
                    <div className={cx('card')}>
                        <div className={cx('cardIcon')}>
                            <IoBagHandle className={cx('icon')} size={20} color="white" />
                        </div>
                        <div className={cx('cardInfor')}>
                            <b>OrderInfor</b>
                            <p className='mt-3'>Shipping: {invoice.deliveryMethod}</p>
                            <p className='mt-3'>Payment Method: {invoice.paymentMethod}</p>
                        </div>
                    </div>
                    <div className={cx('card')}>
                        <div className={cx('cardIcon')}>
                            <CiDeliveryTruck  className={cx('icon')} size={20} color="white" />
                        </div>
                        <div className={cx('cardInfor')}>
                            <b>Deliver to</b>
                            <p className='mt-3'>Address: {invoice.receiverAddress}</p>
                        </div>
                    </div>
                </div>
            </div>
            <div className={cx('contentProduct')}>
                <div className='flex items-center'> <h2>Product</h2> { (productDelete.length != 0)
                ? <IoReloadCircle size={25}  
                        className='text-green-500 ml-5'
                        onClick={() => setDetails([...details, productDelete.pop()])}
                        
                        />
                : <div></div> }   </div>
                <div className={cx('totalProduct')}>
                    <table>
                        <tr>
                            <th>Product</th>
                            <th>OrderID</th>
                            <th>Quantity</th>
                            <th>Total</th>
                        </tr>
                         {details.map((detail, index) => (
                            <tr 
                                key={index}
                            >
                                <td>
                                    <div className='flex justify-start items-center'>
                                    <MdOutlineCancel size={20} className='ml-10 mr-10 text-red-600' onClick={() => handleDeteleProduct(detail)}/>
                                    {detail.productId} - {detail.productName}
                                 
                                    </div>
                                </td>
                                <td>#{detail.invoiceId}</td>
                                <td >{detail.quantity}</td>
                                <td >{detail.quantity * detail.salePrice}</td>
                            </tr>
                        ))} 
                    </table>
                </div>
                <div className={cx('totalPayment')}>
                    <table>
                        <tr>
                            <td>Subtotal</td>
                            <td>
                                {details.reduce((total, product) => total + product.quantity * product.salePrice, 0)}
                            </td>
                        </tr>
                        <tr>
                            <td>Tax</td>
                            <td>10%</td>
                        </tr>
                        <tr>
                            <td>Discount</td>
                            <td>0</td>
                        </tr>
                        <tr>
                            <td>
                                <b>Total</b>
                            </td>
                            <td>
                                <b>{invoice.total}</b>
                            </td>
                        </tr>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default OrderDetails;
