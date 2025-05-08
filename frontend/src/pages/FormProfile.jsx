import React, { useState, useEffect } from 'react';
import { Api_Profile } from '../../apis/Api_Profile';

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
                    setError('Unable to load profile information.');
                }
            } catch (error) {
                setError('An error occurred while loading profile information.');
                console.error('Error loading profile:', error);
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
                alert('Profile updated successfully');
            } else {
                alert('Update failed');
            }
        } catch (error) {
            console.error('Error saving personal information:', error);
            alert('An error occurred while saving personal information.');
        }
    };

    const handleSaveLogin = () => {
        console.log('Saved login information:', loginInfo);
        alert('Login information saved!');
        // Call API to save login information (not implemented)
    };

    if (loading) {
        return <div className="container mx-auto p-6 mt-10 text-2xl">Loading information...</div>;
    }

    if (error) {
        return <div className="container mx-auto p-6 mt-10 text-2xl text-red-500">{error}</div>;
    }

    return (
        <div
            className="container mx-auto p-6 bg-white shadow-md rounded-lg mt-10 text-2xl w-full"
            style={{ maxWidth: '1200px', padding: '50px' }}
        >
            <h2 className="text-black text-4xl font-semibold mb-6">My Profile</h2>
            <p className="text-gray-700 text-2xl mb-6">Manage your profile information to secure your account</p>

            <div className="mb-4">
                <button
                    className={`py-2 px-4 rounded-md text-2xl ${
                        activeTab === 'personal'
                            ? 'bg-[#4A69E2] text-white'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    } mr-2`}
                    onClick={() => handleTabChange('personal')}
                >
                    Manage Personal Information
                </button>
                <button
                    className={`py-2 px-4 rounded-md text-2xl ${
                        activeTab === 'login'
                            ? 'bg-[#4A69E2] text-white'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                    onClick={() => handleTabChange('login')}
                >
                    Manage Login Information
                </button>
            </div>

            {activeTab === 'personal' && (
                <div>
                    <h3 className="text-3xl font-semibold mb-4">Personal Information</h3>
                    <div className="mb-6">
                        <label htmlFor="firstName" className="text-gray-700 block text-2xl font-medium mb-2">
                            <strong className="text-2xl">First Name</strong>
                        </label>
                        <input
                            type="text"
                            id="firstName"
                            name="firstName"
                            className="text-black border-gray-300 shadow-sm focus:ring-4A69E2 focus:border-4A69E2 block w-full text-2xl border rounded-md bg-gray-100 py-3 px-4 hover:bg-white"
                            value={personalInfo.firstName}
                            onChange={handlePersonalChange}
                        />
                    </div>
                    <div className="mb-6">
                        <label htmlFor="lastName" className="text-gray-700 block text-2xl font-medium mb-2">
                            <strong className="text-2xl">Last Name</strong>
                        </label>
                        <input
                            type="text"
                            id="lastName"
                            name="lastName"
                            className="text-black border-gray-300 shadow-sm focus:ring-4A69E2 focus:border-4A69E2 block w-full text-2xl border rounded-md bg-gray-100 py-3 px-4 hover:bg-white"
                            value={personalInfo.lastName}
                            onChange={handlePersonalChange}
                        />
                    </div>

                    <div className="mb-6">
                        <label htmlFor="email" className="text-gray-700 block text-2xl font-medium mb-2">
                            <strong className="text-2xl">Email</strong>
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            className="text-black border-gray-300 shadow-sm focus:ring-4A69E2 focus:border-4A69E2 block w-full text-2xl border rounded-md bg-gray-100 py-3 px-4 hover:bg-white"
                            value={personalInfo.email}
                            onChange={handlePersonalChange}
                        />
                    </div>

                    <div className="mb-6">
                        <label htmlFor="phone" className="text-gray-700 block text-2xl font-medium mb-2">
                            <strong className="text-2xl">Phone Number</strong>
                        </label>
                        <input
                            type="tel"
                            id="phone"
                            name="phoneNumber"
                            className="text-black border-gray-300 shadow-sm focus:ring-4A69E2 focus:border-4A69E2 block w-full text-2xl border rounded-md bg-gray-100 py-3 px-4 hover:bg-white"
                            value={personalInfo.phoneNumber}
                            onChange={handlePersonalChange}
                        />
                    </div>

                    <div className="mb-6">
                        <label className="text-gray-700 block text-2xl font-medium mb-2">
                            <strong className="text-2xl">Gender</strong>
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
                                <label htmlFor="male" className="text-gray-700 ml-2 text-2xl">
                                    Male
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
                                <label htmlFor="female" className="text-gray-700 ml-2 text-2xl">
                                    Female
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
                                <label htmlFor="other" className="text-gray-700 ml-2 text-2xl">
                                    Other
                                </label>
                            </div>
                        </div>
                    </div>

                    <div className="mb-6">
                        <label htmlFor="address" className="text-gray-700 block text-2xl font-medium mb-2">
                            <strong className="text-2xl">Address</strong>
                        </label>
                        <input
                            type="text"
                            id="address"
                            name="addressString"
                            className="text-black border-gray-300 shadow-sm focus:ring-4A69E2 focus:border-4A69E2 block w-full text-2xl border rounded-md bg-gray-100 py-3 px-4 hover:bg-white"
                            value={personalInfo.addressString}
                            onChange={handlePersonalChange}
                        />
                    </div>

                    <div className="flex justify-center">
                        <button
                            onClick={handleSavePersonal}
                            className="bg-[#4A69E2] text-white font-semibold py-4 px-8 rounded-md text-2xl"
                        >
                            Save Personal Information
                        </button>
                    </div>
                </div>
            )}

            {activeTab === 'login' && (
                <div>
                    <h3 className="text-3xl font-semibold mb-4">Login Information</h3>
                    <div className="mb-6">
                        <label htmlFor="username" className="text-gray-700 block text-2xl font-medium mb-2">
                            <strong className="text-2xl">Username</strong>
                        </label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            className="text-black border-gray-300 shadow-sm focus:ring-4A69E2 focus:border-4A69E2 block w-full text-2xl border rounded-md bg-gray-100 py-3 px-4 hover:bg-white"
                            value={loginInfo.username}
                            onChange={handleLoginChange}
                        />
                    </div>

                    <div className="mb-6">
                        <label htmlFor="password" className="text-gray-700 block text-2xl font-medium mb-2">
                            <strong className="text-2xl">Password</strong>
                        </label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            className="text-black border-gray-300 shadow-sm focus:ring-4A69E2 focus:border-4A69E2 block w-full text-2xl border rounded-md bg-gray-100 py-3 px-4 hover:bg-white"
                            value={loginInfo.password}
                            onChange={handleLoginChange}
                        />
                    </div>

                    <div className="flex justify-center">
                        <button
                            onClick={handleSaveLogin}
                            className="bg-[#4A69E2] text-white font-semibold py-4 px-8 rounded-md text-2xl"
                        >
                            Save Login Information
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProfileForm;