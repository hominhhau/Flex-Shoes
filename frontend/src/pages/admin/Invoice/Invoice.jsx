import React, { useEffect, useState } from 'react';
import { SlArrowRight, SlCalender } from 'react-icons/sl';
import classNames from 'classnames/bind';
import styles from './Invoice.module.scss';

import OrderSummary from '../../../layouts/componentsAdmin/OrderSummary';
import RecentOrders from '../../../layouts/componentsAdmin/RecentOrders';
import { Api_InvoiceAdmin } from '../../../../apis/Api_invoiceAdmin';

const cx = classNames.bind(styles);

function Invoice() {
    const today = new Date();
    const formattedDate = `Day ${today.getDate()} Month ${today.getMonth() + 1} Year ${today.getFullYear()}`;

    const [totalOrders, setTotalOrders] = useState(0);
    const [totalShipping, setTotalShipping] = useState(0);
    const [totalRevenue, setTotalRevenue] = useState(0);

    // Fetch API data for Invoice overview
    useEffect(() => {
        const fetchData = async () => {
            try {
                const totalOrdersResponse = await Api_InvoiceAdmin.getTotalOrders();
                setTotalOrders(totalOrdersResponse.data);

                console.log('totalOrdersResponse', totalOrdersResponse.data);
                const totalShippingResponse = await Api_InvoiceAdmin.getTotalShipping();
                setTotalShipping(totalShippingResponse.data);

                const totalRevenueResponse = await Api_InvoiceAdmin.getTotalRevenue();
                setTotalRevenue(totalRevenueResponse.data);
            } catch (error) {
                console.error('Error fetching Invoice data:', error);
            }
        };

        fetchData();
    }, []);

    return (
        <div className="w-full pl-[260px] mt-[100px]">
            <div className="p-[20px]">
                <div className="flex justify-between">
                    <div>
                        <p className="font-bold text-[24px]">Invoice</p>
                        <div className={cx('tab')}>
                            Home <SlArrowRight size={10} className="mx-3" /> Invoice
                        </div>
                    </div>
                    <div className="flex items-end">
                        <SlCalender className="mr-5 mb-2" />
                        {formattedDate}
                    </div>
                </div>

                <div className="mt-5">
                    <RecentOrders />
                </div>
            </div>
        </div>
    );
}

export default Invoice;
