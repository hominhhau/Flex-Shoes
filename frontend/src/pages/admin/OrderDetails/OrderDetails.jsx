import React, { useState, useEffect } from 'react';
import { CiUser } from "react-icons/ci";
import classNames from 'classnames/bind';
import { IoBagHandle, IoPrintOutline, IoCalendarOutline  } from "react-icons/io5";


import styles from './OrderDetails.module.scss';
// import { Api_Payment, Api_Product } from "../../../../apis/Api_Payment";

const cx = classNames.bind(styles);

const OrderDetails = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [orders, setOrders] = useState([]);


    // useEffect(() => {
    //     const fetchProducts = async () => {
    //         setLoading(true);
    //         setError(null);
    //         try {
    //             const response = await Api_Payment.getOrderDetails();
    //             if (response) {
    //                 setOrders(response);
    //             }

    //         } catch (error) {
    //             setError(error.message);
    //         } finally {
    //             setLoading(false);
    //         }
    //     };

    //     fetchProducts();
    // }, []); 

    // if (loading) {
    //     return <div>Loading...</div>;
    // }

    // if (error) {
    //     return <div>Error: {error}</div>;
    // }


    // if (!products || products.length === 0) {
    //     return <div>No products available.</div>;
    // }

    return (
        <div className={cx('wrapper')}>
            <div className={cx('header')}>
                <h1>Order Details</h1>
            </div>
            <div className={cx('contentOrder')}>
                <div className={cx('contentTop')}>
                    <div className={cx('orderID')}>
                        <div className={cx('id')}>
                           <b>Order ID: 1</b>
                           <div className={cx('tagStatus')}> <p>Complete </p></div>
                       
                        </div>
                        <div className={cx('schedula')}>
                            <IoCalendarOutline /> 2020-12-12
                        </div>
                        
                    </div>
                    <div className={cx('orderStatus')}>
                        <select name="" id="">
                            <option value="" selected>Change status</option>
                            <option value="">Pending</option>
                            <option value="">Processing</option>
                            <option value="">Completed</option>
                            <option value="">Cancelled</option>
                        </select>
                        <button className={cx('btnPrint')}><IoPrintOutline  size={30}/></button>
                        <button className={cx('btnSave')}>Save</button>
                    </div>

                </div>
                <div className={cx('contentBody')}>
                    <div className={cx('card')}>
                        <div className={cx('cardIcon')}>
                         
                            <CiUser className={cx('icon')} size={20} color='white'/>

                        </div>
                        <div className={cx('cardInfor')}>

                            <b>Customer</b>
                            <p>Fullname: Nguyen Van A</p>
                            <p>Email: vanan@gmail.com</p>
                            <p>Phone: 0123456789</p>
                        </div>
                    </div>
                    <div className={cx('card')}>
                        <div className={cx('cardIcon')}>
                            <IoBagHandle className={cx('icon')} size={20} color='white'/>
                        </div>
                        <div className={cx('cardInfor')}>

                            <b>OrderInfor</b>
                            <p>Shipping: Nguyen Van A</p>
                            <p>Payment Method: vanan@gmail.com</p>
                            <p>Status: 0123456789</p>
                        </div>
                    </div>
                    <div className={cx('card')}>
                        <div className={cx('cardIcon')}>
                            
                        <IoBagHandle className={cx('icon')} size={20} color='white'/>
                        </div>
                        <div className={cx('cardInfor')}>

                            <b>Deliver to</b>
                            <p>Address: 12 Đ. 339, Phước Long B, Quận 9, Hồ Chí Minh, Việt Nam</p>

                        </div>
                    </div>
                </div>

            </div>
            <div className={cx('contentProduct')}>
                <h2>Product</h2>
                <div className={cx('totalProduct')}>

                    <table>
                        <tr>
                            <th>Product</th>
                            <th>Price</th>
                            <th>Quantity</th>
                            <th>Total</th>
                        </tr>
                        {
                            orders.map((order) => (
                                <tr>
                                    <td>
                                        {order.productName}
                                    </td>
                                    <td>
                                        {order.price}
                                    </td>
                                    <td>
                                        {order.quantity}
                                    </td>
                                    <td>
                                        {order.total}
                                    </td>
                                </tr>
                            ))
                        }
                    </table>
                </div>
                <div className={cx('totalPayment')}>
                    <table>
                        <tr>
                            <td>Subtotal</td>
                            <td>0</td>
                        </tr>
                        <tr>
                            <td>Tax</td>
                            <td>0</td>
                        </tr>
                        <tr>
                            <td>Discount</td>
                            <td>0</td>
                        </tr>
                        <tr>
                            <td><b>Total</b></td>
                            <td><b>0</b></td>
                        </tr>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default OrderDetails;
