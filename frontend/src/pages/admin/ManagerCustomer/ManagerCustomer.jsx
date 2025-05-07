import React, { useState, useEffect } from 'react';
import classNames from 'classnames/bind';
import styles from './managerCustomer.module.scss';
import { useNavigate } from 'react-router-dom';



import { Api_ManagerCustomer } from '../../../../apis/Api_ManagerCustomer';
import config from '../../../config';


const cx = classNames.bind(styles);

function ManagerCustomer() {
    const navigate = useNavigate();
    const [data, setData] = useState([]);

    useEffect(() => {
        const fetchCustomers = async () => {
            try {
                const customers = await Api_ManagerCustomer.getAllCustomers();
                setData(customers.response);
            } catch (error) {
                console.error('Failed to fetch customers:', error);
            }
        };

        fetchCustomers();
    }, []);

    // Phân trang
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 9;

    // Tính toán số lượng trang
    const totalPages = Math.ceil(data.length / itemsPerPage);

    // Lấy dữ liệu cho trang hiện tại
    const currentData = data.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    // Chuyển đến trang được chọn
    const goToPage = (page) => {
        setCurrentPage(page);
    };

    const handleViewCustomer = (item) => {
        // Chuyển hướng đến trang thông tin khách hàng với thông tin đã chọn
        console.log('Item:', item);
        navigate(config.routes.infoCustomer, { state: { ...item } });
    };

    return (
        <div className={cx('page-wrapper')}>
            <div className={cx('table-container')}>
                <table className={cx('table')}>
                    <thead>
                        <tr>
                            <th>No</th>
                            <th>Customer ID</th>
                            <th>Customer Name</th>
                            <th>Email</th>
                            <th>Phone Number</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentData.map((item, index) => (
                            <tr key={index} onClick={() => handleViewCustomer(item)}>
                                <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                                <td>{item.profileKey}</td>
                                <td>
                                    {item.firstName} {item.lastName}
                                </td>
                                <td>{item.email}</td>
                                <td>{item.phoneNumber}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Phân trang */}
            <div className={cx('pagination')}>
                <button onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1}>
                    Previous
                </button>
                {Array.from({ length: totalPages }, (_, index) => (
                    <button
                        key={index}
                        className={cx('page-button', { active: currentPage === index + 1 })}
                        onClick={() => goToPage(index + 1)}
                    >
                        {index + 1}
                    </button>
                ))}
                <button onClick={() => goToPage(currentPage + 1)} disabled={currentPage === totalPages}>
                    Next
                </button>
            </div>
        </div>
    );
}

export default ManagerCustomer;
