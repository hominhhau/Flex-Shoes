import React, { useState, useEffect } from 'react';
import classNames from 'classnames/bind';
import styles from './ProfileForm.module.scss';
import { Api_Profile } from '../../apis/Api_Profile';
import { Api_Auth } from '../../apis/Api_Auth';

const cx = classNames.bind(styles);

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
        oldPassword: '',
        newPassword: '',
        confirmPassword: '',
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
                    setError('Could not load profile information.');
                }
            } catch (error) {
                setError('An error occurred while loading profile information.');
                console.error('Profile load error:', error);
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

            const result = await Api_Profile.updateProfile(localStorage.getItem('profileKey'), dataToSend);

            if (result.status === 200 && result.data.status === 'SUCCESS') {
                localStorage.setItem('profile', JSON.stringify(result.data.response));
                alert('Personal information updated successfully');
            } else {
                alert('Failed to update personal information');
            }
        } catch (error) {
            console.error('Error saving personal information:', error);
            alert('An error occurred while saving personal information.');
        }
    };

    const handleSaveLogin = async () => {
        // Check if the new password and confirm password match
        if (loginInfo.newPassword !== loginInfo.confirmPassword) {
            alert('New password and confirm password do not match.');
            return;
        }

        // Check the length of the new password (backend rule: minimum 8 characters)
        if (loginInfo.newPassword.length < 8) {
            alert('New password must be at least 8 characters long.');
            return;
        }

        try {
            const userId = localStorage.getItem('profileKey');
            const passwordData = {
                userId,
                oldPassword: loginInfo.oldPassword,
                newPassword: loginInfo.newPassword,
            };

            const result = await Api_Auth.updatePassword(passwordData);
            console.log('Password update result:', result);

            if (result.status === 200 && result.data.status === 'SUCCESS') {
                alert('Password updated successfully!');
                setLoginInfo({
                    oldPassword: '',
                    newPassword: '',
                    confirmPassword: '',
                });
            } else {
                alert('Failed to update password. Please check your old password.');
            }
        } catch (error) {
            console.error('Password update error:', error);
            alert('An error occurred while updating the password. Please try again.');
        }
    };

    if (loading) {
        return <div className={cx('loading')}>Loading information...</div>;
    }

    if (error) {
        return <div className={cx('error')}>{error}</div>;
    }

    return (
        <div className={cx('page-container')}>
            <div className={cx('content-section')}>
                <h2 className={cx('content-title')}>Welcome to Flex Shoes!</h2>
                <p className={cx('content-description')}>
                    At Flex Shoes, we bring you the ultimate destination for premium footwear.
                    Explore our extensive collection featuring renowned brands like Nike, Adidas,
                    Puma, and New Balance. Whether you're looking for the latest Air Jordans, the
                    comfort of Adidas Ultraboost, or unique designs from emerging brands, we have
                    something for every sneaker enthusiast.
                    <br /><br />
                    Our mission is to provide not just shoes, but a lifestyle. Each pair is
                    carefully crafted, blending style, comfort, and performance to elevate your
                    everyday look. Update your profile today to receive exclusive offers, early
                    access to new releases, and personalized recommendations tailored to your style.
                    Join our community of sneakerheads and step into a world of limitless fashion!
                </p>
                <div className={cx('image-container')}>
                    <img src="https://png.pngtree.com/png-clipart/20231006/original/pngtree-orange-sneakers-lined-icons-vector-png-image_12972401.png" alt="Flex Shoes" className={cx('image')} />
                </div>
            </div>
            <div className={cx('form-section')}>
                <h2 className={cx('title')}>My Profile</h2>
                <p className={cx('description')}>Manage your profile information to secure your account</p>

                <div className={cx('tab-container')}>
                    <button
                        className={cx('tab-button', { active: activeTab === 'personal' })}
                        onClick={() => handleTabChange('personal')}
                    >
                        Manage Personal Information
                    </button>
                    <button
                        className={cx('tab-button', { active: activeTab === 'login' })}
                        onClick={() => handleTabChange('login')}
                    >
                        Manage Login Information
                    </button>
                </div>

                {activeTab === 'personal' && (
                    <div className={cx('form-container')}>
                        <h3 className={cx('form-title')}>Personal Information</h3>
                        <div className={cx('form-group')}>
                            <label htmlFor="firstName" className={cx('label')}>
                                <strong>First Name</strong>
                            </label>
                            <input
                                type="text"
                                id="firstName"
                                name="firstName"
                                className={cx('input')}
                                value={personalInfo.firstName}
                                onChange={handlePersonalChange}
                            />
                        </div>
                        <div className={cx('form-group')}>
                            <label htmlFor="lastName" className={cx('label')}>
                                <strong>Last Name</strong>
                            </label>
                            <input
                                type="text"
                                id="lastName"
                                name="lastName"
                                className={cx('input')}
                                value={personalInfo.lastName}
                                onChange={handlePersonalChange}
                            />
                        </div>
                        <div className={cx('form-group')}>
                            <label htmlFor="email" className={cx('label')}>
                                <strong>Email</strong>
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                className={cx('input')}
                                value={personalInfo.email}
                                onChange={handlePersonalChange}
                            />
                        </div>
                        <div className={cx('form-group')}>
                            <label htmlFor="phone" className={cx('label')}>
                                <strong>Phone Number</strong>
                            </label>
                            <input
                                type="tel"
                                id="phone"
                                name="phoneNumber"
                                className={cx('input')}
                                value={personalInfo.phoneNumber}
                                onChange={handlePersonalChange}
                            />
                        </div>
                        <div className={cx('form-group')}>
                            <label className={cx('label')}>
                                <strong>Gender</strong>
                            </label>
                            <div className={cx('radio-group')}>
                                <div className={cx('radio-option')}>
                                    <input
                                        type="radio"
                                        id="male"
                                        name="gender"
                                        value="MEN"
                                        checked={personalInfo.gender === 'MEN'}
                                        onChange={handleGenderChange}
                                        className={cx('radio')}
                                    />
                                    <label htmlFor="male" className={cx('radio-label')}>
                                        Male
                                    </label>
                                </div>
                                <div className={cx('radio-option')}>
                                    <input
                                        type="radio"
                                        id="female"
                                        name="gender"
                                        value="WOMEN"
                                        checked={personalInfo.gender === 'WOMEN'}
                                        onChange={handleGenderChange}
                                        className={cx('radio')}
                                    />
                                    <label htmlFor="female" className={cx('radio-label')}>
                                        Female
                                    </label>
                                </div>
                                <div className={cx('radio-option')}>
                                    <input
                                        type="radio"
                                        id="other"
                                        name="gender"
                                        value="OTHER"
                                        checked={personalInfo.gender === 'OTHER'}
                                        onChange={handleGenderChange}
                                        className={cx('radio')}
                                    />
                                    <label htmlFor="other" className={cx('radio-label')}>
                                        Other
                                    </label>
                                </div>
                            </div>
                        </div>
                        <div className={cx('form-group')}>
                            <label htmlFor="address" className={cx('label')}>
                                <strong>Address</strong>
                            </label>
                            <input
                                type="text"
                                id="address"
                                name="addressString"
                                className={cx('input')}
                                value={personalInfo.addressString}
                                onChange={handlePersonalChange}
                            />
                        </div>
                        <div className={cx('button-container')}>
                            <button
                                onClick={handleSavePersonal}
                                className={cx('save-button')}
                            >
                                Save Personal Information
                            </button>
                        </div>
                    </div>
                )}

                {activeTab === 'login' && (
                    <div className={cx('form-container')}>
                        <h3 className={cx('form-title')}>Update Password</h3>
                        <div className={cx('form-group')}>
                            <label htmlFor="oldPassword" className={cx('label')}>
                                <strong>Old Password</strong>
                            </label>
                            <input
                                type="password"
                                id="oldPassword"
                                name="oldPassword"
                                className={cx('input')}
                                value={loginInfo.oldPassword}
                                onChange={handleLoginChange}
                            />
                        </div>
                        <div className={cx('form-group')}>
                            <label htmlFor="newPassword" className={cx('label')}>
                                <strong>New Password</strong>
                            </label>
                            <input
                                type="password"
                                id="newPassword"
                                name="newPassword"
                                className={cx('input')}
                                value={loginInfo.newPassword}
                                onChange={handleLoginChange}
                            />
                        </div>
                        <div className={cx('form-group')}>
                            <label htmlFor="confirmPassword" className={cx('label')}>
                                <strong>Confirm New Password</strong>
                            </label>
                            <input
                                type="password"
                                id="confirmPassword"
                                name="confirmPassword"
                                className={cx('input')}
                                value={loginInfo.confirmPassword}
                                onChange={handleLoginChange}
                            />
                        </div>
                        <div className={cx('button-container')}>
                            <button
                                onClick={handleSaveLogin}
                                className={cx('save-button')}
                            >
                                Update Password
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProfileForm;