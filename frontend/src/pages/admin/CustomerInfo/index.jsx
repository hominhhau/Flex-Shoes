import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import classNames from 'classnames/bind';
import styles from './CustomerInfo.module.scss';

const cx = classNames.bind(styles);
function CustomerInfo() {
    const { state } = useLocation();
    const navigate = useNavigate();
    const { address , email, firstName, gender, lastName, phoneNumber, profileKey } = state || {};
    
    
    console.log('Profile Key:', profileKey);

    // if (!state) return <p>Không tìm thấy thông tin khách hàng.</p>;
    return (
        <div>
            <div className={cx('w-full pl-[270px] mt-[96px] p-10')}>
                <div className={cx('bg-white shadow-md rounded-lg p-6')}>
                    <div className={cx('flex justify-between items-center mt-4')}>
                        <h1 className={cx('text-3xl font-bold')}>Thông tin khách hàng</h1>
                        <button
                            onClick={() => navigate(-1)}
                            className={cx('bg-blue-500 text-white p-3 rounded hover:bg-blue-600')}
                        >
                            Quay lại
                        </button>
                    </div>
                    <div>
                        <div className={cx('w-full mt-4 flex')}>
                            <div className={cx('w-1/3 mr-4')}>
                                <p className={cx('text-2xl font-bold')}>Mã khách hàng:</p>
                                <input
                                    type="text"
                                    className={cx('mt-2 border border-[#232321] rounded-md px-4 py-2')}
                                    value={profileKey}
                                    readOnly
                                />
                            </div>
                        </div>
                        <div className={cx('w-full mt-4 flex')}>
                            <div className={cx('w-1/2 mr-4')}>
                                <p className={cx('text-2xl font-bold')}>Email:</p>
                                <input
                                    type="text"
                                    className={cx('mt-2 border border-[#232321] rounded-md px-4 py-2')}
                                    value={email}
                                    readOnly
                                />
                            </div>
                            <div className={cx('w-1/2 mr-4')}>
                                <p className={cx('text-2xl font-bold')}>Số điện thoại:</p>
                                <input
                                    type="text"
                                    className={cx('mt-2 border border-[#232321] rounded-md px-4 py-2')}
                                    value={phoneNumber}
                                    readOnly
                                />
                            </div>
                        </div>
                        <div className={cx('w-full mt-4 flex')}>
                            <div className={cx('w-1/2 mr-4')}>
                                <p className={cx('text-2xl font-bold')}>Họ:</p>
                                <input
                                    type="text"
                                    className={cx('mt-2 border border-[#232321] rounded-md px-4 py-2')}
                                    value={firstName}
                                    readOnly
                                />
                            </div>
                            <div className={cx('w-1/2 mr-4')}>
                                <p className={cx('text-2xl font-bold')}>Tên:</p>
                                <input
                                    type="text"
                                    className={cx('mt-2 border border-[#232321] rounded-md px-4 py-2')}
                                    value={lastName}
                                    readOnly
                                />
                            </div>
                        </div>
                        <div className={cx('w-full mt-4 flex')}>
                            <div className={cx('w-1/3 mr-4')}>
                                <p className={cx('text-2xl font-bold')}>Giới tính:</p>
                                <input
                                    type="text"
                                    className={cx('mt-2 border border-[#232321] rounded-md px-4 py-2')}
                                    value={gender === 'MEN' ? 'Nam' : (gender === 'WOMEN' ? 'Nữ' : 'Khác')}
                                    readOnly
                                />
                            </div>
                        </div>
                        <div className={cx('w-full mt-4 flex')}>
                            <div className={cx('w-2/3 mr-4')}>
                                <p className={cx('text-2xl font-bold')}>Địa chỉ:</p>
                                {address.length > 0 &&
                                    address.map((item, index) => (
                                        <input
                                            key={index}
                                            type="text"
                                            className={cx('mt-2 border border-[#232321] rounded-md px-4 py-2')}
                                            value={item}
                                            readOnly
                                        />
                                    ))}
                                    {address.length == 0 &&
                                  
                                        <input
                                          
                                            type="text"
                                            className={cx('mt-2 border border-[#232321] rounded-md px-4 py-2')}
                                            value="Chưa cập nhật địa chỉ"
                                            readOnly
                                        />
                                    }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CustomerInfo;
