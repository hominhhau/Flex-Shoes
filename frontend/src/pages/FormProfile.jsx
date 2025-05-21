import React, { useState, useEffect } from 'react';
import classNames from 'classnames/bind';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline'; // Added Heroicons for eye icons
import styles from './ProfileForm.module.scss';
import { Api_Profile } from '../../apis/Api_Profile';
import { Api_Auth } from '../../apis/Api_Auth';

const cx = classNames.bind(styles);

const CustomToast = ({ message, type }) => (
    <div className={cx('custom-toast', type)}>
        <span className={cx('toast-icon')}>{type === 'success' ? '✅' : '❌'}</span>
        <span className={cx('toast-message')}>{message}</span>
    </div>
);

const ProfileForm = () => {
    const [activeTab, setActiveTab] = useState('personal');
    const [personalInfo, setPersonalInfo] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        gender: 'OTHER',
        addressString: '',
    });
    const [loginInfo, setLoginInfo] = useState({
        oldPassword: '',
        newPassword: '',
        confirmPassword: '',
    });
    const [showPasswords, setShowPasswords] = useState({
        oldPassword: false,
        newPassword: false,
        confirmPassword: false,
    }); // Added state for password visibility
    const [loading, setLoading] = useState(true);
    const [updateLoading, setUpdateLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProfile = async () => {
            setLoading(true);
            setError(null);
            try {
                const userId = localStorage.getItem('profileKey');
                if (!userId) {
                    throw new Error('No user ID found. Please log in again.');
                }
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
                console.error('Profile load error:', error);
                setError(error.message || 'An error occurred while loading profile information.');
                toast.error(
                    <CustomToast message={error.message || 'Failed to load profile information.'} type="error" />,
                    { toastId: 'profile-load-error' },
                );
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

    const togglePasswordVisibility = (field) => {
        setShowPasswords((prev) => ({
            ...prev,
            [field]: !prev[field],
        }));
    }; // Added function to toggle password visibility

    const validatePersonalInfo = () => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const phoneRegex = /^\d{10,11}$/;
        if (!personalInfo.firstName.trim()) {
            return 'First name cannot be empty.';
        }
        if (!personalInfo.lastName.trim()) {
            return 'Last name cannot be empty.';
        }
        if (!emailRegex.test(personalInfo.email)) {
            return 'Invalid email.';
        }
        if (!phoneRegex.test(personalInfo.phoneNumber)) {
            return 'Phone number must have 10-11 digits.';
        }
        return null;
    };

    const handleSavePersonal = async () => {
        if (updateLoading) return;

        const validationError = validatePersonalInfo();
        if (validationError) {
            toast.error(<CustomToast message={validationError} type="error" />, {
                toastId: 'personal-validation-error',
            });
            return;
        }

        setUpdateLoading(true);
        try {
            const userId = localStorage.getItem('profileKey');
            const customerId = localStorage.getItem('customerId');
            if (!userId) {
                toast.error(<CustomToast message="User information not found. Please log in again." type="error" />, {
                    toastId: 'no-user-id',
                });
                window.location.href = '/login';
                return;
            }

            if (!customerId) {
                toast.error(<CustomToast message="User information not found. Please log in again." type="error" />, {
                    toastId: 'no-customer-id',
                });
                window.location.href = '/login';
                return;
            }

            console.log('userID type:', typeof userId);
            const dataToSend = {
                firstName: personalInfo.firstName.trim(),
                lastName: personalInfo.lastName.trim(),
                email: personalInfo.email.trim(),
                phoneNumber: personalInfo.phoneNumber.trim(),
                gender: personalInfo.gender,
                address: personalInfo.addressString
                    .split(',')
                    .map((item) => item.trim())
                    .filter((item) => item),
                userID: customerId,
            };

            // const userIdNumber = parseInt(userId, 10);
            // if (isNaN(userIdNumber)) {
            //     toast.error('User ID không hợp lệ');
            //     return;
            // }
            console.log('Data to send:', dataToSend);
            // console.log('userID type àfter change parse:', typeof userId);

            const result = await Api_Profile.updateProfile(userId, dataToSend);
            console.log('Update profile API response:', JSON.stringify(result, null, 2));
            const resultData = result.data || result;

            if (result.status === 200 && resultData?.status?.toUpperCase() === 'SUCCESS') {
                localStorage.setItem('profile', JSON.stringify(resultData.response));
                toast.success(
                    <CustomToast
                        message={resultData.message || 'Personal information updated successfully!'}
                        type="success"
                    />,
                    { toastId: 'personal-update-success' },
                );
            } else {
                throw new Error(resultData?.message || 'Unable to update personal information.');
            }
        } catch (error) {
            console.error('Error saving personal information:', error);
            toast.error(
                <CustomToast
                    message={error.message || 'An error occurred while updating personal information.'}
                    type="error"
                />,
                { toastId: 'personal-update-error' },
            );
        } finally {
            setUpdateLoading(false);
        }
    };

    const validatePassword = () => {
        if (!loginInfo.oldPassword) {
            return 'Please enter the old password.';
        }
        if (loginInfo.newPassword !== loginInfo.confirmPassword) {
            return 'New password and confirm password do not match.';
        }
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (!passwordRegex.test(loginInfo.newPassword)) {
            return 'New password must be at least 8 characters, including uppercase, lowercase, number, and special character.';
        }
        return null;
    };

    const handleSaveLogin = async () => {
        if (updateLoading) return;

        const validationError = validatePassword();
        if (validationError) {
            toast.error(<CustomToast message={validationError} type="error" />, {
                toastId: 'password-validation-error',
            });
            return;
        }

        setUpdateLoading(true);
        try {
            const userId = localStorage.getItem('customerId');
            if (!userId) {
                toast.error(<CustomToast message="User information not found. Please log in again." type="error" />, {
                    toastId: 'no-customer-id',
                });
                window.location.href = '/login';
                return;
            }

            const passwordData = {
                oldPassword: loginInfo.oldPassword,
                newPassword: loginInfo.newPassword,
            };

            const result = await Api_Auth.updatePassword(userId, passwordData);
            console.log('Update password API response:', JSON.stringify(result, null, 2));

            const resultData = result;

            if (resultData?.status?.toUpperCase() === 'SUCCESS') {
                toast.success(
                    <CustomToast message={resultData.message || 'Password updated successfully!'} type="success" />,
                    { toastId: 'password-update-success' },
                );
                setLoginInfo({
                    oldPassword: '',
                    newPassword: '',
                    confirmPassword: '',
                });
            } else {
                console.warn('API response failed validation:', {
                    status: result.status,
                    data: result.data,
                    result: result,
                });
                throw new Error(
                    resultData?.message ||
                        resultData?.response ||
                        'Unable to update password. Please check the old password again.',
                );
            }
        } catch (error) {
            console.error('Password update error:', error);
            if (error.response?.status === 401) {
                toast.error(<CustomToast message="Login session expired. Please log in again." type="error" />, {
                    toastId: 'session-expired',
                });
                window.location.href = '/login';
            } else if (error.response?.status === 400) {
                const errorData = error.response.data || error.response;
                toast.error(
                    <CustomToast
                        message={
                            errorData?.message || errorData?.response || 'Old password is incorrect. Please try again.'
                        }
                        type="error"
                    />,
                    { toastId: 'invalid-password' },
                );
            } else {
                toast.error(
                    <CustomToast
                        message={
                            error.message || 'An error occurred while updating the password. Please try again later.'
                        }
                        type="error"
                    />,
                    { toastId: 'password-update-error' },
                );
            }
        } finally {
            setUpdateLoading(false);
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
            <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
            />
            <div className={cx('content-section')}>
                <h2 className={cx('content-title')}>Welcome to Flex Shoes!</h2>
                <p className={cx('content-description')}>
                    At Flex Shoes, we bring you the ultimate destination for premium footwear. Explore our diverse
                    collection featuring renowned brands like Nike, Adidas, Puma, and New Balance. Whether you're
                    looking for the latest Air Jordan, the comfort of Adidas Ultraboost, or unique designs from emerging
                    brands, we have something for every sneaker enthusiast.
                    <br />
                    <br />
                    Our mission is not just to provide shoes but a lifestyle. Each pair is meticulously crafted,
                    blending style, comfort, and performance to elevate your everyday look. Update your profile today to
                    receive exclusive offers, early access to new releases, and personalized style recommendations. Join
                    our sneakerhead community and step into a world of limitless fashion!
                </p>
                <div className={cx('image-container')}>
                    <img
                        src="https://png.pngtree.com/png-clipart/20231006/original/pngtree-orange-sneakers-lined-icons-vector-png-image_12972401.png"
                        alt="Flex Shoes"
                        className={cx('image')}
                    />
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
                                disabled={updateLoading}
                            />
                        </div>
                        <div className={cx('form-group')}>
                            <label htmlFor="lastName" className={cx('label')}>
                                <strong>Last Name</strong>
                            </label>
                            <input
                                type="text"
                                name="lastName"
                                className={cx('input')}
                                value={personalInfo.lastName}
                                onChange={handlePersonalChange}
                                disabled={updateLoading}
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
                                disabled={updateLoading}
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
                                disabled={updateLoading}
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
                                        disabled={updateLoading}
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
                                        disabled={updateLoading}
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
                                        disabled={updateLoading}
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
                                disabled={updateLoading}
                            />
                        </div>
                        <div className={cx('button-container')}>
                            <button onClick={handleSavePersonal} className={cx('save-button')} disabled={updateLoading}>
                                {updateLoading ? 'Saving...' : 'Save Personal Information'}
                            </button>
                        </div>
                    </div>
                )}

                {activeTab === 'login' && (
                    <div className={cx('form-container')}>
                        <h3 className={cx('form-title')}>Update Password</h3>
                        <form>
                            <div className={cx('form-group')}>
                                <label htmlFor="oldPassword" className={cx('label')}>
                                    <strong>Old Password</strong>
                                </label>
                                <div className={cx('input-container')}>
                                    <input
                                        type={showPasswords.oldPassword ? 'text' : 'password'} // Toggle input type
                                        id="oldPassword"
                                        name="oldPassword"
                                        className={cx('input')}
                                        value={loginInfo.oldPassword}
                                        onChange={handleLoginChange}
                                        required
                                        disabled={updateLoading}
                                    />
                                    <button
                                        type="button"
                                        className={cx('toggle-password')}
                                        onClick={() => togglePasswordVisibility('oldPassword')}
                                        disabled={updateLoading}
                                    >
                                        {showPasswords.oldPassword ? (
                                            <EyeSlashIcon className={cx('eye-icon')} />
                                        ) : (
                                            <EyeIcon className={cx('eye-icon')} />
                                        )}
                                    </button>
                                </div>
                            </div>
                            <div className={cx('form-group')}>
                                <label htmlFor="newPassword" className={cx('label')}>
                                    <strong>New Password</strong>
                                </label>
                                <div className={cx('input-container')}>
                                    <input
                                        type={showPasswords.newPassword ? 'text' : 'password'} // Toggle input type
                                        id="newPassword"
                                        name="newPassword"
                                        className={cx('input')}
                                        value={loginInfo.newPassword}
                                        onChange={handleLoginChange}
                                        required
                                        disabled={updateLoading}
                                    />
                                    <button
                                        type="button"
                                        className={cx('toggle-password')}
                                        onClick={() => togglePasswordVisibility('newPassword')}
                                        disabled={updateLoading}
                                    >
                                        {showPasswords.newPassword ? (
                                            <EyeSlashIcon className={cx('eye-icon')} />
                                        ) : (
                                            <EyeIcon className={cx('eye-icon')} />
                                        )}
                                    </button>
                                </div>
                            </div>
                            <div className={cx('form-group')}>
                                <label htmlFor="confirmPassword" className={cx('label')}>
                                    <strong>Confirm New Password</strong>
                                </label>
                                <div className={cx('input-container')}>
                                    <input
                                        type={showPasswords.confirmPassword ? 'text' : 'password'} // Toggle input type
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        className={cx('input')}
                                        value={loginInfo.confirmPassword}
                                        onChange={handleLoginChange}
                                        required
                                        disabled={updateLoading}
                                    />
                                    <button
                                        type="button"
                                        className={cx('toggle-password')}
                                        onClick={() => togglePasswordVisibility('confirmPassword')}
                                        disabled={updateLoading}
                                    >
                                        {showPasswords.confirmPassword ? (
                                            <EyeSlashIcon className={cx('eye-icon')} />
                                        ) : (
                                            <EyeIcon className={cx('eye-icon')} />
                                        )}
                                    </button>
                                </div>
                            </div>
                            <div className={cx('button-container')}>
                                <button
                                    type="button"
                                    onClick={handleSaveLogin}
                                    className={cx('save-button')}
                                    disabled={updateLoading}
                                >
                                    {updateLoading ? 'Updating...' : 'Update Password'}
                                </button>
                            </div>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProfileForm;
