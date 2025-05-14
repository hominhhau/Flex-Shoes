import React from 'react';
import classNames from 'classnames/bind';
import styles from './OrderSummary.module.scss';
import { IoMdMore } from 'react-icons/io';
import { IoBagHandleOutline } from 'react-icons/io5';

const cx = classNames.bind(styles);

function OrderSummary({ name, price, rate }) {
    return (
        <div className="bg-white w-full rounded-3xl shadow-md py-16 px-12 flex justify-between items-center">
            <div>
                <h2 className="font-bold">{name}</h2>
                <div className="flex items-center mt-8">
                    <div className="bg-red-100 p-2 rounded-xl mr-6">
                        <IoBagHandleOutline size={40} />
                    </div>
                    <div>
                        <p className=" font-bold">{price}</p>
                    </div>
                </div>
            </div>
            <div className="flex flex-col items-end ">
                <IoMdMore size={30} className=" mb-2" />
                <div className="text-green-500 ">↑ {rate}%</div>
                <p className=" text-muted-foreground">Compared to 2022</p>
            </div>
        </div>
    );
}

export default OrderSummary;
