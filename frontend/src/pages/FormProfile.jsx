import React, { useState, useEffect } from 'react';
import { Api_Profile } from '../../apis/Api_Profile'; // Đảm bảo đường dẫn này đúng

const ProfileForm = () => {
    const [activeTab, setActiveTab] = useState('personal');
    const [personalInfo, setPersonalInfo] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        gender: '',
        addressString: '',
    });

    const [loginInfo, setLoginInfo] = useState({
        username: 'nhi.nhi0311',
        password: 'thuynhi@0099',
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProfile = async () => {
            setLoading(true);
            setError(null);
            try {
                const userId = localStorage.getItem('profileKey');
                const response = await Api_Profile.getProfile(userId);
                console.log('API Response:', response);
                if (
                    response.status === 200 &&
                    response.data &&
                    response.data.status === 'SUCCESS' &&
                    response.data.response
                ) {
                    const data = response.data.response;
                    setPersonalInfo({
                        firstName: data.firstName || '',
                        lastName: data.lastName || '',
                        email: data.email || '',
                        phoneNumber: data.phoneNumber || '',
                        gender: data.gender || 'OTHER',
                        addressString: data.address ? data.address.join(', ') : '',
                    });
                } else {
                    setError('Không thể tải thông tin hồ sơ.');
                }
            } catch (error) {
                setError('Đã xảy ra lỗi khi tải thông tin hồ sơ.');
                console.error('Lỗi tải hồ sơ:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    const handleTabChange = (tab) => {
        setActiveTab(tab);
    };

    const handlePersonalChange = (event) => {
        const { name, value } = event.target;
        setPersonalInfo({ ...personalInfo, [name]: value });
    };

    const handleGenderChange = (event) => {
        setPersonalInfo({ ...personalInfo, gender: event.target.value });
    };

    const handleLoginChange = (event) => {
        const { name, value } = event.target;
        setLoginInfo({ ...loginInfo, [name]: value });
    };

    const handleSavePersonal = async () => {
        try {
            const userID = localStorage.getItem('customerId');
            const dataToSend = {
                firstName: personalInfo.firstName,
                lastName: personalInfo.lastName,
                email: personalInfo.email,
                phoneNumber: personalInfo.phoneNumber,
                gender: personalInfo.gender,
                address: personalInfo.addressString.split(',').map((item) => item.trim()),
                userID,
            };

            console.log('Data to send:', dataToSend);

            const result = await Api_Profile.updateProfile(localStorage.getItem('profileKey'), dataToSend);

            if (result.status === 200 && result.data.status === 'SUCCESS') {
                localStorage.setItem('profile', JSON.stringify(result.data.response));
                alert('Cập nhật thông tin thành công');
            } else {
                alert('Cập nhật không thành công');
            }
        } catch (error) {
            console.error('Lỗi lưu thông tin cá nhân:', error);
            alert('Đã xảy ra lỗi khi lưu thông tin cá nhân.');
        }
    };

    const handleSaveLogin = () => {
        console.log('Đã lưu thông tin đăng nhập:', loginInfo);
        alert('Thông tin đăng nhập đã được lưu!');
        // Gọi API để lưu thông tin đăng nhập (chưa triển khai)
    };

    if (loading) {
        return <div className="container mx-auto p-6 mt-10 text-xl">Đang tải thông tin...</div>;
    }

    if (error) {
        return <div className="container mx-auto p-6 mt-10 text-xl text-red-500">{error}</div>;
    }

    return (
        <div
            className="container mx-auto p-6 bg-white shadow-md rounded-lg mt-10 text-xl"
            style={{ maxWidth: '1200px', padding: '50px' }}
        >
            <h2 className="text-black text-3xl font-semibold mb-6">Hồ Sơ Của Tôi</h2>
            <p className="text-gray-700 text-xl mb-6">Quản lý thông tin hồ sơ để bảo mật tài khoản</p>

            <div className="mb-4">
                <button
                    className={`py-2 px-4 rounded-md text-xl ${
                        activeTab === 'personal'
                            ? 'bg-[#4A69E2] text-white'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    } mr-2`}
                    onClick={() => handleTabChange('personal')}
                >
                    Quản lý thông tin cá nhân
                </button>
                <button
                    className={`py-2 px-4 rounded-md text-xl ${
                        activeTab === 'login'
                            ? 'bg-[#4A69E2] text-white'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                    onClick={() => handleTabChange('login')}
                >
                    Quản lý thông tin đăng nhập
                </button>
            </div>

            {activeTab === 'personal' && (
                <div>
                    <h3 className="text-2xl font-semibold mb-4">Thông Tin Cá Nhân</h3>
                    <div className="mb-6">
                        <label htmlFor="name" className="text-gray-700 block text-xl font-medium mb-2">
                            <strong className="text-xl">Họ</strong>
                        </label>
                        <input
                            type="text"
                            id="name"
                            name="firstName"
                            className="text-black border-gray-300 shadow-sm focus:ring-4A69E2 focus:border-4A69E2 block w-full text-xl border rounded-md bg-gray-100 py-3 px-4 hover:bg-white"
                            value={personalInfo.firstName}
                            onChange={handlePersonalChange}
                        />
                    </div>
                    <div className="mb-6">
                        <label htmlFor="name" className="text-gray-700 block text-xl font-medium mb-2">
                            <strong className="text-xl">Tên</strong>
                        </label>
                        <input
                            type="text"
                            id="name"
                            name="lastName"
                            className="text-black border-gray-300 shadow-sm focus:ring-4A69E2 focus:border-4A69E2 block w-full text-xl border rounded-md bg-gray-100 py-3 px-4 hover:bg-white"
                            value={personalInfo.lastName}
                            onChange={handlePersonalChange}
                        />
                    </div>

                    <div className="mb-6">
                        <label htmlFor="email" className="text-gray-700 block text-xl font-medium mb-2">
                            <strong className="text-xl">Email</strong>
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            className="text-black border-gray-300 shadow-sm focus:ring-4A69E2 focus:border-4A69E2 block w-full text-xl border rounded-md bg-gray-100 py-3 px-4 hover:bg-white"
                            value={personalInfo.email}
                            onChange={handlePersonalChange}
                        />
                    </div>

                    <div className="mb-6">
                        <label htmlFor="phone" className="text-gray-700 block text-xl font-medium mb-2">
                            <strong className="text-xl">Số điện thoại</strong>
                        </label>
                        <input
                            type="tel"
                            id="phone"
                            name="phoneNumber"
                            className="text-black border-gray-300 shadow-sm focus:ring-4A69E2 focus:border-4A69E2 block w-full text-xl border rounded-md bg-gray-100 py-3 px-4 hover:bg-white"
                            value={personalInfo.phoneNumber}
                            onChange={handlePersonalChange}
                        />
                    </div>

                    <div className="mb-6">
                        <label className="text-gray-700 block text-xl font-medium mb-2">
                            <strong className="text-xl">Giới tính</strong>
                        </label>
                        <div className="flex items-center">
                            <div className="flex items-center mr-6">
                                <input
                                    type="radio"
                                    id="male"
                                    className="focus:ring-4A69E2 h-6 w-6 text-4A69E2 border-gray-300 focus:ring-offset-2"
                                    name="gender"
                                    value="MEN"
                                    checked={personalInfo.gender === 'MEN'}
                                    onChange={handleGenderChange}
                                />
                                <label htmlFor="male" className="text-gray-700 ml-2 text-xl">
                                    Nam
                                </label>
                            </div>
                            <div className="flex items-center mr-6">
                                <input
                                    type="radio"
                                    id="female"
                                    className="focus:ring-4A69E2 h-6 w-6 text-4A69E2 border-gray-300 focus:ring-offset-2"
                                    name="gender"
                                    value="WOMEN"
                                    checked={personalInfo.gender === 'WOMEN'}
                                    onChange={handleGenderChange}
                                />
                                <label htmlFor="female" className="text-gray-700 ml-2 text-xl">
                                    Nữ
                                </label>
                            </div>
                            <div className="flex items-center">
                                <input
                                    type="radio"
                                    id="other"
                                    className="focus:ring-4A69E2 h-6 w-6 text-4A69E2 border-gray-300 focus:ring-offset-2"
                                    name="gender"
                                    value="OTHER"
                                    checked={personalInfo.gender === 'OTHER'}
                                    onChange={handleGenderChange}
                                />
                                <label htmlFor="other" className="text-gray-700 ml-2 text-xl">
                                    Khác
                                </label>
                            </div>
                        </div>
                    </div>

                    <div className="mb-6">
                        <label htmlFor="address" className="text-gray-700 block text-xl font-medium mb-2">
                            <strong className="text-xl">Địa chỉ</strong>
                        </label>
                        <input
                            type="text"
                            id="address"
                            name="addressString"
                            className="text-black border-gray-300 shadow-sm focus:ring-4A69E2 focus:border-4A69E2 block w-full text-xl border rounded-md bg-gray-100 py-3 px-4 hover:bg-white"
                            value={personalInfo.addressString}
                            onChange={handlePersonalChange}
                        />
                    </div>

                    <div className="flex justify-center">
                        <button
                            onClick={handleSavePersonal}
                            className="bg-[#4A69E2] text-white font-semibold py-4 px-8 rounded-md text-xl"
                        >
                            Lưu Thông Tin Cá Nhân
                        </button>
                    </div>
                </div>
            )}

            {activeTab === 'login' && (
                <div>
                    <h3 className="text-2xl font-semibold mb-4">Thông Tin Đăng Nhập</h3>
                    <div className="mb-6">
                        <label htmlFor="username" className="text-gray-700 block text-xl font-medium mb-2">
                            <strong className="text-xl">Tên đăng nhập</strong>
                        </label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            className="text-black border-gray-300 shadow-sm focus:ring-4A69E2 focus:border-4A69E2 block w-full text-xl border rounded-md bg-gray-100 py-3 px-4 hover:bg-white"
                            value={loginInfo.username}
                            onChange={handleLoginChange}
                        />
                    </div>

                    <div className="mb-6">
                        <label htmlFor="password" className="text-gray-700 block text-xl font-medium mb-2">
                            <strong className="text-xl">Mật khẩu</strong>
                        </label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            className="text-black border-gray-300 shadow-sm focus:ring-4A69E2 focus:border-4A69E2 block w-full text-xl border rounded-md bg-gray-100 py-3 px-4 hover:bg-white"
                            value={loginInfo.password}
                            onChange={handleLoginChange}
                        />
                    </div>

                    <div className="flex justify-center">
                        <button
                            onClick={handleSaveLogin}
                            className="bg-[#4A69E2] text-white font-semibold py-4 px-8 rounded-md text-xl"
                        >
                            Lưu Thông Tin Đăng Nhập
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProfileForm;
