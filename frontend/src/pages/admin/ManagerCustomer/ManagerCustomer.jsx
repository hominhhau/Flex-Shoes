import React, { useState, useEffect } from 'react';
import classNames from 'classnames/bind';
import styles from './managerCustomer.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit } from '@fortawesome/free-solid-svg-icons'; 
import { Api_ManagerCustomer } from '../../../../apis/Api_ManagerCustomer';

const cx = classNames.bind(styles);

function ManagerCustomer() {

    const [data, setData] = useState([]); // Lưu danh sách khách hàng
    // const data = [
    //     { customerId: "KH001", customerName: "Nguyễn Thị Quỳnh Giang", email: "nguyenthiquynhgiang@gmail.com", phoneNumber: "123-456-7890", address: "TPHCM" },
    //     { customerId: "KH002", customerName: "Nguyễn Thị Quỳnh Giang", email: "nguyenthiquynhgiang@gmail.com", phoneNumber: "123-456-7890", address: "TPHCM" },
    // ];

    useEffect(() => {
        // Lấy dữ liệu khách hàng từ API
        const fetchCustomers = async () => {
            try {
                const customers = await Api_ManagerCustomer.getAllCustomers();
                setData(customers);
                console.log('Customers:', customers);
            } catch (error) {
                console.error('Failed to fetch customers:', error);
            }
        };

        fetchCustomers();
    }, []);


    // Phân trang
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 7;

    // Tính toán số lượng trang
    const totalPages = Math.ceil(data.length / itemsPerPage);

    // Lấy dữ liệu cho trang hiện tại
    const currentData = data.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

     // Chuyển đến trang được chọn
     const goToPage = (page) => {
        setCurrentPage(page);
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
                            <th>Address</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentData.map((item, index) => (
                            <tr key={index}>
                                <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                                <td>{item.customerId}</td>
                                <td>{item.customerName}</td>
                                <td>{item.email}</td>
                                <td>{item.phoneNumber}</td>
                                <td>{item.address}</td>
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
