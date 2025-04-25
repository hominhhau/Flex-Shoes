import React, { useState, useEffect } from 'react';
import { CiUser, CiDeliveryTruck } from 'react-icons/ci';
import classNames from 'classnames/bind';
import { IoBagHandle, IoPrintOutline, IoCalendarOutline, IoReloadCircle } from 'react-icons/io5';
import { MdOutlineCancel } from 'react-icons/md';
import { useLocation, useNavigate } from 'react-router-dom';

import styles from './OrderDetails.module.scss';
import { Api_InvoiceAdmin } from '../../../../apis/Api_invoiceAdmin';
import Modal from '../../../components/Modal';
import config from '../../../config';

const cx = classNames.bind(styles);

const OrderDetails = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { invoiceId } = location.state || {}; // Lấy dữ liệu từ state
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [invoice, setInvoice] = useState({});
    const [details, setDetails] = useState([]);
    const [productDelete, setProductDelete] = useState([]);
    const [subtotal, setSubtotal] = useState(0);
    const [tax, setTax] = useState(0);
    const [discount, setDiscount] = useState(0);
    const [total, setTotal] = useState(0);

    const [isSuccess, setIsSuccess] = useState(false);
    const [isError, setIsError] = useState(false);

    useEffect(() => {
        const fetchInvoice = async () => {
            setLoading(true);
            setError(null);
            try {
                console.log('invoiceId = ', invoiceId);
                const response = await Api_InvoiceAdmin.getInvoiceById(invoiceId);
                console.log('response = ', response);
                if (response) {
                    setInvoice(response.data.result);
                    setDetails(response.data.result.invoiceDetails);
                    console.log('invoice = ', response.data.result);
                    console.log('details = ', response.data.result.invoiceDetails);
                }
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchInvoice();
    }, []);

    useEffect(() => {
        const newSubtotal = details.reduce((total, detail) => {
          const sellingPrice = detail.product?.sellingPrice || 0;
          const discount = detail.product?.discount || 0;
          const discountedPrice = sellingPrice * (1 - discount / 100);
          return total + discountedPrice * detail.quantity;
        }, 0);
    
        const newDiscount = details.reduce((total, detail) => {
          const sellingPrice = detail.product?.sellingPrice || 0;
          const discount = detail.product?.discount || 0;
          return total + sellingPrice * (discount / 100) * detail.quantity;
        }, 0);
    
        const newTax = newSubtotal * 0.1; // 10% tax
        const newTotal = newSubtotal + newTax;
    
        setSubtotal(newSubtotal);
        setDiscount(newDiscount);
        setTax(newTax);
        setTotal(newTotal);
      }, [details]);
    const handleChange = (event) => {
        setInvoice({ ...invoice, orderStatus: event.target.value }); // Cập nhật giá trị khi thay đổi
    };
    // const handleDeteleProduct = (detail) => {
    //     try {
    //         const updatedDetails = details.filter((product) => product.productId !== detail.productId);
    //         setDetails(updatedDetails);
    //         //them product da xoa vao mang productDelete
    //         setProductDelete([...productDelete, detail]);
    //         console.log('size = ', productDelete.length);
    //     } catch (error) {
    //         console.error('Error deleting product:', error);
    //     }
    // };

    
  const handleDeleteProduct = (detail) => {
    try {
      const updatedDetails = details.filter((item) => item.detailId !== detail.detailId);
      setDetails(updatedDetails);
      setProductDelete([...productDelete, detail]);
      console.log('Deleted product:', detail, 'Current deleted products:', productDelete.length + 1);
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };
    const handleUpdateInvoice = async () => {
        try {
            productDelete.forEach(async (item) => {
                const responseDelete = await Api_InvoiceAdmin.delete(item.detailId);
                console.log('result = ', responseDelete);
            });

            //Update invoice
            const data = { ...invoice, customerId: invoice.customerId, invoiceDetails: details, total: total };
            const response = await Api_InvoiceAdmin.updateInvoice(data);
            console.log('result = ', response.result);
            setIsSuccess(true);
        } catch (error) {
            console.error('Error updating invoice:', error);
            setIsError(true);
        }
    };
    const handleUpdateRedirect = () => {
        setIsSuccess(false);
        setIsError(false);
        navigate(config.routes.dashboard);
    };
    const handleTryAgain = () => {
        setIsError(false);
    };

    return (
        <div className={cx('wrapper')}>
            <div className={cx('contentOrder')}>
                <div className={cx('contentTop')}>
                    <div className={cx('orderID')}>
                        <div className={cx('id', 'mt-5 ml-10')}>
                            <b>Order ID: {invoice.invoiceId}</b>

                            <div
                                className={`w-40 h-50 ml-20 rounded-lg text-center ${invoice.orderStatus === 'Delivered'
                                    ? 'bg-green-500'
                                    : invoice.orderStatus === 'Canceled'
                                        ? 'bg-red-500'
                                        : 'bg-yellow-500'
                                    }`}
                            >
                                <p>{invoice.orderStatus} </p>
                            </div>
                        </div>
                        <div className={cx('schedula', 'flex-row float-start justify-center items-center')}>
                            <IoCalendarOutline className="mr-5 ml-10" /> {invoice.issueDate}
                        </div>
                    </div>
                    <div className={cx('orderStatus')}>
                        <select value={invoice.orderStatus} onChange={handleChange}>
                            <option disabled>--- Change status ---</option>
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
                            <p className="mt-3">Fullname: {invoice.receiverName}</p>
                            {/* <p>Email: vanan@gmail.com</p> */}
                            <p className="mt-3">Phone: {invoice.receiverNumber}</p>
                        </div>
                    </div>
                    <div className={cx('card')}>
                        <div className={cx('cardIcon')}>
                            <IoBagHandle className={cx('icon')} size={20} color="white" />
                        </div>
                        <div className={cx('cardInfor')}>
                            <b>OrderInfor</b>
                            <p className="mt-3">Shipping: {invoice.deliveryMethod}</p>
                            <p className="mt-3">Payment Method: {invoice.paymentMethod}</p>
                        </div>
                    </div>
                    <div className={cx('card')}>
                        <div className={cx('cardIcon')}>
                            <CiDeliveryTruck className={cx('icon')} size={20} color="white" />
                        </div>
                        <div className={cx('cardInfor')}>
                            <b>Deliver to</b>
                            <p className="mt-3">Address: {invoice.receiverAddress}</p>
                        </div>
                    </div>
                </div>
            </div>
            <div className={cx('contentProduct')}>
                <div className="flex items-center">
                    {' '}
                    <h2>Product</h2>{' '}
                    {productDelete.length != 0 ? (
                        <IoReloadCircle
                            size={25}
                            className="text-green-500 ml-5"
                            onClick={() => setDetails([...details, productDelete.pop()])}
                        />
                    ) : (
                        <div></div>
                    )}{' '}
                </div>
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
                                const discount = detail.product?.discount || 0;
                                const discountedPrice = sellingPrice * (1 - discount / 100);
                                const totalPrice = discountedPrice * detail.quantity;

                                return (
                                    <tr key={detail.detailId}>
                                        <td>
                                            <div className={cx('productCell')}>
                                                <MdOutlineCancel
                                                    size={20}
                                                    className={cx('deleteIcon')}
                                                    onClick={() => handleDeleteProduct(detail)}
                                                />
                                                {detail.product?.productName || 'N/A'} (ID: {detail.productId})
                                            </div>
                                        </td>
                                        <td>#{detail.invoiceId}</td>
                                        <td>{detail.quantity}</td>
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
                            <td>Subtotal</td>
                            <td>${subtotal.toFixed(2)}</td>
                        </tr>
                        <tr>
                            <td>Tax</td>
                            <td>10% (${tax.toFixed(2)})</td>
                        </tr>
                        <tr>
                            <td>Discount</td>
                            <td>${discount.toFixed(2)}</td>
                        </tr>
                        <tr>
                            <td>
                                <b>Total</b>
                            </td>
                            <td>
                                <b>${total.toFixed(2)}</b>
                            </td>
                        </tr>
                    </table>
                </div>
            </div>
            {isSuccess && (
                <Modal
                    valid={true}
                    title="Update Success!"
                    message="Your information has been updated successfully"
                    isConfirm={true}
                    onConfirm={handleUpdateRedirect}
                    contentConfirm={'OK'}
                />
            )}
            {isError && (
                <Modal
                    valid={false}
                    title="Update Failed!"
                    message="Please check your information again or try again later"
                    isConfirm={true}
                    onConfirm={handleTryAgain}
                    contentConfirm={'OK'}
                />
            )}
        </div>
    );
};

export default OrderDetails;