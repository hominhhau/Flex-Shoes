import React from 'react';
import { SlArrowRight, SlCalender } from 'react-icons/sl';
import classNames from 'classnames/bind';
import styles from './Dashboard.module.scss';

import OrderSummary from '../../../layouts/componentsAdmin/OrderSummary';
import RecentOrders from '../../../layouts/componentsAdmin/RecentOrders';

const cx = classNames.bind(styles);

function Dashboard() {
    const today = new Date();
    const formattedDate = `Ngày ${today.getDate()} Tháng ${today.getMonth() + 1} Năm ${today.getFullYear()}`;

    return (
        <div className="w-full pl-[260px] mt-[96px] ">
            <div className="p-[24px] ">
                <div className="flex justify-between">
                    <div>
                        <p className="font-bold text-[24px]">Dashboard</p>
                        <div className={cx('tab')}>
                            Home <SlArrowRight size={10} className="mx-3" /> Dashboard
                        </div>
                    </div>
                    <div className="flex items-end ">
                        <SlCalender className="mr-5 mb-2" />
                        {formattedDate}
                    </div>
                </div>
                <div className="flex mt-5 col-span-3 gap-6">
                    <OrderSummary name={'Tổng số đơn đặt hàng'} price={12300} rate={50} />
                    <OrderSummary name={'Tổng số đơn đặt hàng'} price={12300} rate={50} />
                    <OrderSummary name={'Tổng số đơn đặt hàng'} price={12300} rate={50} />
                </div>
                <div>
                    <RecentOrders />
                </div>
            </div>
        </div>
    );
}

export default Dashboard;
