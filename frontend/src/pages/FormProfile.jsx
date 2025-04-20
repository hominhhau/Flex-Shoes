import React, { useState } from 'react';

const ProfileForm = () => {
  const [formData, setFormData] = useState({
    username: 'nhi.nhi0311',
    name: 'Nguyễn Văn A',
    email: 'pnnhi@gmail.com',
    phone: '034390600303',
    gender: 'Nữ',
    address: '123 Đường ABC, Phường XYZ, Quận UVW, Thành phố Hồ Chí Minh',
    password: 'thuynhi@0099', //
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleGenderChange = (event) => {
    setFormData({
      ...formData,
      gender: event.target.value,
    });
  };

  const handleUpdate = () => {
    // Xử lý logic cập nhật thông tin (Tên, Địa chỉ, Giới tính)
    console.log('Thông tin cập nhật:', { name: formData.name, address: formData.address, gender: formData.gender });
    alert('Thông tin hồ sơ đã được cập nhật!');
  };

  const handleSave = () => {
    // Xử lý logic lưu toàn bộ dữ liệu
    console.log('Dữ liệu đã lưu:', formData);
    alert('Thông tin hồ sơ đã được lưu!');
  };

  return (
    <div className="container mx-auto p-6 bg-white shadow-md rounded-lg mt-10 text-lg" style={{ maxWidth: '700px' }}>
      <h2 className="text-black text-3xl font-semibold mb-6">Hồ Sơ Của Tôi</h2>
      <p className="text-gray-700 text-xl mb-6">Quản lý thông tin hồ sơ để bảo mật tài khoản</p>

      <div className="mb-6">
        <label htmlFor="username" className="text-gray-700 block text-xl font-medium mb-2">
          Tên đăng nhập
        </label>
        <input
          type="text"
          id="username"
          name="username" // Thêm thuộc tính 'name'
          className="text-black border-gray-300 shadow-sm focus:ring-4A69E2 focus:border-4A69E2 block w-full sm:text-xl border rounded-md bg-gray-100 py-3 px-4 hover:bg-white" // Loại bỏ cursor-not-allowed
          value={formData.username}
          onChange={handleChange} // Thêm hàm xử lý sự kiện onChange
        />
      </div>

      <div className="mb-6">
        <label htmlFor="name" className="text-gray-700 block text-xl font-medium mb-2">
          Tên
        </label>
        <input
          type="text"
          id="name"
          name="name"
          className="text-black border-gray-300 shadow-sm focus:ring-4A69E2 focus:border-4A69E2 block w-full sm:text-xl border rounded-md bg-gray-100 py-3 px-4 hover:bg-white" // Loại bỏ cursor-not-allowed (nếu có)
          value={formData.name}
          onChange={handleChange}
        />
      </div>

      <div className="mb-6">
        <label htmlFor="email" className="text-gray-700 block text-xl font-medium mb-2">
          Email
        </label>
        <input
          type="email"
          id="email"
          name="email" // Thêm thuộc tính 'name'
          className="text-black border-gray-300 shadow-sm focus:ring-4A69E2 focus:border-4A69E2 block w-full sm:text-xl border rounded-md bg-gray-100 py-3 px-4 hover:bg-white" // Loại bỏ cursor-not-allowed
          value={formData.email}
          onChange={handleChange} // Thêm hàm xử lý sự kiện onChange
        />
      </div>

      <div className="mb-6">
        <label htmlFor="phone" className="text-gray-700 block text-xl font-medium mb-2">
          Số điện thoại
        </label>
        <input
          type="tel"
          id="phone"
          name="phone" // Thêm thuộc tính 'name'
          className="text-black border-gray-300 shadow-sm focus:ring-4A69E2 focus:border-4A69E2 block w-full sm:text-xl border rounded-md bg-gray-100 py-3 px-4 hover:bg-white" // Loại bỏ cursor-not-allowed
          value={formData.phone}
          onChange={handleChange} // Thêm hàm xử lý sự kiện onChange
        />
      </div>

      <div className="mb-6">
        <label className="text-gray-700 block text-xl font-medium mb-2">
          Giới tính
        </label>
        <div className="flex items-center">
          <div className="flex items-center mr-6">
            <input
              type="radio"
              id="male"
              className="focus:ring-4A69E2 h-6 w-6 text-4A69E2 border-gray-300 focus:ring-offset-2"
              name="gender"
              value="Nam"
              checked={formData.gender === 'Nam'}
              onChange={handleGenderChange}
            />
            <label htmlFor="male" className="text-gray-700 ml-2 text-xl">Nam</label>
          </div>
          <div className="flex items-center mr-6">
            <input
              type="radio"
              id="female"
              className="focus:ring-4A69E2 h-6 w-6 text-4A69E2 border-gray-300 focus:ring-offset-2"
              name="gender"
              value="Nữ"
              checked={formData.gender === 'Nữ'}
              onChange={handleGenderChange}
            />
            <label htmlFor="female" className="text-gray-700 ml-2 text-xl">Nữ</label>
          </div>
          <div className="flex items-center">
            <input
              type="radio"
              id="other"
              className="focus:ring-4A69E2 h-6 w-6 text-4A69E2 border-gray-300 focus:ring-offset-2"
              name="gender"
              value="Khác"
              checked={formData.gender === 'Khác'}
              onChange={handleGenderChange}
            />
            <label htmlFor="other" className="text-gray-700 ml-2 text-xl">Khác</label>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <label htmlFor="address" className="text-gray-700 block text-xl font-medium mb-2">
          Địa chỉ
        </label>
        <input
          type="text"
          id="address"
          name="address"
          className="text-black border-gray-300 shadow-sm focus:ring-4A69E2 focus:border-4A69E2 block w-full sm:text-xl border rounded-md bg-gray-100 py-3 px-4 hover:bg-white" // Loại bỏ cursor-not-allowed (nếu có)
          value={formData.address}
          onChange={handleChange}
        />
      </div>

      <div className="mb-6">
        <label htmlFor="password" className="text-gray-700 block text-xl font-medium mb-2">
          Mật khẩu
        </label>
        <input
          type="password"
          id="password"
          name="password" // Thêm thuộc tính 'name'
          className="text-black border-gray-300 shadow-sm focus:ring-4A69E2 focus:border-4A69E2 block w-full sm:text-xl border rounded-md bg-gray-100 py-3 px-4 hover:bg-white" // Loại bỏ cursor-not-allowed
          value={formData.password}
          onChange={handleChange} // Thêm hàm xử lý sự kiện onChange
        />
      </div>

      <div className="flex justify-center">
        <button
          onClick={handleUpdate}
          className="bg-[#4A69E2] text-white font-semibold py-4 px-8 rounded-md text-xl mr-4"
        >
          Cập Nhật
        </button>
        <button
          onClick={handleSave}
          className="bg-[#4A69E2] text-white font-semibold py-4 px-8 rounded-md text-xl"
        >
          Lưu
        </button>
      </div>
    </div>
  );
};

export default ProfileForm;