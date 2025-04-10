import classnames from 'classnames/bind';
import { WiDirectionRight } from "react-icons/wi";
import { FcGoogle } from "react-icons/fc";
import { FaApple, FaFacebook, FaPlusSquare } from "react-icons/fa";
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';


import {Api_Auth} from '../../../apis/Api_Auth';
import styles from './Register.module.scss';
import Modal  from '../../components/Modal/Modal'; 


const cx = classnames.bind(styles);

function Register() {
    // State để lưu userInfor, address, loginDetails và kết quả thành công
    const navigate = useNavigate();
    const [userInfor, setUserInfor] = useState({
        email: '',
        gender:'',
        phoneNumber:'',
        registerDate: new Date()
    })
    const [fname, setFname] = useState('')
    const [lname, setLname] = useState('')
    const [addresses, setAddresses] = useState([''])
    const [loginDetails, setLoginDetails] = useState({
        userName: '',
        password: ''
    })
    const [isSuccess, setIsSuccess] = useState(false);
    const [isError, setIsError] = useState(false);
    const [validFields, setValidFields] = useState({
        fname: true,
        lname: true,
        email: true,
        phoneNumber: true,
        address: true,
        userName: true,
        password: true
    });
    const onChangeFName = (e) => {
        const value = e.target.value;
        const regex = /^[A-Za-z\s]{1,30}$/;
        setFname(value);
        setUserInfor({ ...userInfor, firstName: value }); 
        setValidFields({ ...validFields, fname: regex.test(value) });
    };
    const onChangeLName = (e) => {
        const value = e.target.value;
        const regex = /^[A-Za-z\s]{1,30}$/;
        setLname(value);
        setUserInfor({ ...userInfor, lastName: value }); 
        setValidFields({ ...validFields, lname: regex.test(value) });
    };
    
    const onChangeEmail = (e) => {
        const value = e.target.value;
        const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        setUserInfor({ ...userInfor, email: value });
        setValidFields({ ...validFields, email: regex.test(value) });
    };
    const onChangePhoneNumber = (e) => {
        const value = e.target.value;
        const regex = /^0\d{9,10}$/;
        setUserInfor({ ...userInfor, phoneNumber: value });
        setValidFields({ ...validFields, phoneNumber: regex.test(value) });
    };
    const onChangeUserName = (e) => {
        const value = e.target.value;
        const regex = /^[A-Za-z0-9\-\/]{10,20}$/;
        setLoginDetails({ ...loginDetails, userName: value });
        setValidFields({ ...validFields, userName: regex.test(value) });
    };
    const onChangePassword = (e) => {
        const value = e.target.value;
        const regex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@.?])[A-Za-z\d.?@]{8,}$/;
        setLoginDetails({ ...loginDetails, password: value });
        setValidFields({ ...validFields, password: regex.test(value) });
    };

    // Hàm để thêm một ô input mới
    const handleAddAddress = () => {
        setAddresses([...addresses, '']); // Thêm một phần tử trống vào danh sách
        
    };

    // Hàm để cập nhật giá trị của một ô input
    const handleAddressChange = (index, value) => {
        const newAddresses = [...addresses];
        newAddresses[index] = value; // Cập nhật giá trị tại chỉ số tương ứng
        setAddresses(newAddresses);
    };
    // Hàm xử lý khi radio button thay đổi
    const handleChange = (e) => {
        setUserInfor({ ...userInfor, gender: e.target.value })
        
    };

    //Hàm xử lý register
    const handleRegister = async () => {
        try {

            const registerData = {
                ...loginDetails,
                ...userInfor,
                firstName: fname,
                lastName: lname,
                address: addresses,
                roles: ['ROLE_USER']
            };
    
            const response = await Api_Auth.registerAccount(registerData);
            setIsSuccess(true);
        } catch (err) {
            console.error('Register failed:', err.message);
            setIsError(true);
        }
    }
   

    //Hàm xử lý submit
    const handleSubmit = (e) => {
        e.preventDefault();
        handleRegister();

    }
    const handleLoginRedirect = () => {
        navigate("/login"); 
    };

    const handleTryAgain = () => {
        setIsError(false);
    };



    return (
        <div className={cx('container-register')}>
            <div className={cx('form-register')}>
                <div className={cx('content-header')}>
                    <h1>Register</h1>
                    <p>Sign up with</p>
                    <div className={cx('option')}>
                        <button className={cx('custom-icon')}><FcGoogle size={25} /></button>
                        <button className={cx('custom-icon')}><FaApple size={25} /></button>
                        <button className={cx('custom-icon')}><FaFacebook size={25} color='blue' /></button>
                    </div>
                    <h2>OR</h2>
                </div>
                <div className={cx('form')}>
                    <form onSubmit={handleSubmit}>
                        <div className={cx('form-group')}>
                            <h2>Your Name</h2>
                            {!validFields.fname && <p style={{ color: 'red' }}>First name must be 1-30 characters and contain only letters</p>}
                            <input type="text"
                                name="fname"
                                id="fname"
                                value={userInfor.fname}
                                onChange={onChangeFName}
                                pattern="^[A-Za-z\s]{1,30}$"
                                required
                                placeholder="First Name"
                                style={{ borderColor: validFields.fname ? 'black' : 'red' }} 
                            />
                            {!validFields.lname && <p style={{ color: 'red' }}>Last name must be 1-30 characters and contain only letters</p>}
                            <input type="text"
                                name="lname"
                                id="lname"
                                placeholder="Last Name"
                                value={userInfor.lname}
                                pattern="^[A-Za-z\s]{1,30}$"
                                required
                                onChange={onChangeLName}
                                style={{ borderColor: validFields.lname ? 'black' : 'red' }}
                            />
                            {!validFields.email && <p style={{ color: 'red' }}>Email must be in the form of example: example@gmail.com</p>}
                            <input type="email"
                                name="email"
                                id="email"
                                placeholder="Email"
                                required
                                value={userInfor.email}
                                onChange={onChangeEmail}
                                style={{ borderColor: validFields.email ? 'black' : 'red' }}
                            />
                            {!validFields.phoneNumber && <p style={{ color: 'red' }}>Phone number must be start with 0 and have 10-11 digits</p>}
                            <input type="text"
                                name="phoneNumber"
                                id="phoneNumber"
                                placeholder="Phone Number"
                                pattern="^0\d{9,10}$"
                                required
                                value={userInfor.phoneNumber}
                                onChange={onChangePhoneNumber}
                                style={{ borderColor: validFields.phoneNumber ? 'black' : 'red' }}
                            />

                        </div>
                        <div className={cx('form-group')}>

                            <div className='flex justify-between items-center' >
                                <h2>Your Address</h2>
                                <button onClick={handleAddAddress} type='button'><FaPlusSquare className='mb-8 mr-10' size={20} /></button>
                            </div>

                            {addresses.map((address, index) => (
                                <div key={index} className='mb-2'>
                                    <input
                                        type="text"
                                        value={address}
                                        onChange={(e) => handleAddressChange(index, e.target.value)}
                                        placeholder={`Address ${index + 1}`}
                                    />
                                </div>
                            ))}
                        </div>
                        <div className={cx('form-group')}>
                            <h2>Gender</h2>
                            <input type="radio" 
                                    name="gender" 
                                    value="MEN" 
                                    id="radMale"
                                    checked={userInfor.gender === "MEN"}
                                    onChange={handleChange}
                                />&nbsp;&nbsp;
                            <label htmlFor="radMale">MEN</label>&nbsp;&nbsp;
                            <input type="radio" 
                                    name="gender" 
                                    value="WOMEN" 
                                    id='radFemale'
                                    checked={userInfor.gender === "WOMEN"}
                                    onChange={handleChange}
                             />&nbsp;&nbsp;
                            <label htmlFor="radFemale">WOMEN</label>&nbsp;&nbsp;
                            <input type="radio" 
                                    name="gender" 
                                    value="UNISEX" 
                                    id="radOrther"
                                    checked={userInfor.gender === "UNISEX"}
                                    onChange={handleChange}
                             />&nbsp;&nbsp;
                            <label htmlFor="radOrther">UNISEX</label>&nbsp;&nbsp;
                        </div>
                        <div className={cx('form-group')}>
                            <h2>Login Details</h2>
                            {!validFields.userName && <p style={{ color: 'red' }}>User name must be 10-20 characters and contain only letters, numbers, hyphens, and slashes</p>}
                            <input type="text" 
                                    name="userName" 
                                    id="userName" 
                                    placeholder="Username"
                                    required
                                    pattern="^[A-Za-z0-9\-\/]{10,20}$"
                                    value={loginDetails.userName}
                                    onChange={onChangeUserName}
                                    style={{ borderColor: validFields.userName ? 'black' : 'red' }}
                                    />
                            <input type="password" 
                                    name="password" 
                                    id="password" 
                                    placeholder="Password"
                                    required
                                    pattern="^(?=.*[A-Za-z])(?=.*\d)(?=.*[@.?])[A-Za-z\d.?@]{8,}$"
                                    value={loginDetails.password}
                                    onChange={onChangePassword}
                                    style={{ borderColor: validFields.password ? 'black' : 'red' }}
                            />
                            <p>
                                Minimum 8 characters with at least one uppercase, one lowercase, one special character
                                and a number
                            </p>
                        </div>
                        <div className={cx('form-group')}>
                            <input type="checkbox" name="policy1" id='chkPolicy1' />&nbsp;&nbsp;
                            <label htmlFor="chkPolicy1">
                                By clicking 'Log In' you agree to our website KicksClub Terms & Conditions, Kicks
                                Privacy Notice and Terms & Conditions
                            </label>
                        </div>
                        <div className={cx('form-group')}>
                            <input type="checkbox" name="polyci2" id='chkPolicy2' /> &nbsp;&nbsp;
                            <label htmlFor="chkPolicy2">
                                Keep me logged in - applies to all log in options below. More info
                            </label>
                        </div>
                        <div className={cx('form-group')}>
                            <button type="submit" className={cx('custom-button') }>
                                <span class="text">REGISTER</span>
                                <span class="icon"><WiDirectionRight size={50} /></span>
                            </button>
                        </div>
                    </form>
                </div>
            </div>
            <div className={cx('section2')}>
                <div className={cx('content-title')}>
                    <h1>Join Kick Club Get Rewarded Today.</h1>
                </div>
                <div className={cx('content-body')}>
                    <p>
                        As kick club member you get rewarded for doing what you love. Sign up today and receive
                        immediate access to these Level 1 benefits.
                    </p>
                    <ul>
                        <li>Free shipping on all orders</li>
                        <li>A 15% off voucher for your next purchase</li>
                        <li>Access to Members Only products and sales</li>
                        <li>Access to adidas Running and Training apps</li>
                        <li>Special offers and promotions​</li>
                    </ul>
                    <p>
                        Join now to start earning points, reach new levels and unlock more rewards and benefits from
                        adiClub.
                    </p>
                </div>


            </div>
            {isSuccess && (
                <Modal
                    valid={true}
                    title="Registration Successful!"
                    message="You may now login with your account"
                    isConfirm={true}
                    onConfirm={handleLoginRedirect}
                    contentConfirm={'OK'}
                />
            )}
            {
                isError && (
                    <Modal
                        valid={false}
                        title="Registration Failed!"
                        message="Please check your information again!"
                        isConfirm={true}
                        isCancel={true}
                        onConfirm={handleTryAgain}
                        onCancel={handleLoginRedirect}
                        contentConfirm={'Try again'}
                        contentCancel="Login page"
                    />
                )
            }
        </div>
        
    );
}

export default Register;
