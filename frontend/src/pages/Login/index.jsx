import classNames from 'classnames/bind';
import { useState, useEffect } from 'react';
import { WiDirectionRight } from 'react-icons/wi';
import { FcGoogle } from 'react-icons/fc';
import { FaApple, FaFacebook } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

import styles from './Login.module.scss';
import config from '../../config';

import { Api_Auth } from '../../../apis/Api_Auth';
import { useAuth } from '../../hooks/useAuth';

const cx = classNames.bind(styles);

function Login() {
    // State để lưu email và password
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const { setIsLoggedIn } = useAuth();
    const [error, setError] = useState(null);

    const onChangeUserName = (e) => {
        setUsername(e.target.value);
    };
    const handleLogin = async () => {
        try {
            const response = await Api_Auth.login(username, password); // Gọi API login
            // Lưu token và role vào localStorage
            localStorage.setItem('token', response.result.token);
            localStorage.setItem('role', response.result.role);
            setIsLoggedIn(true);
            navigate(config.routes.home);
        } catch (err) {
            console.error('Login failed:', err.message);
            setError('Invalid username or password');
        }
    };

    // Hàm xử lý khi form được submit
    const handleSubmit = (e) => {
        e.preventDefault();
        handleLogin();
    };

    return (
        <div className={cx('container-login')}>
            <div className={cx('form-login')}>
                <div className={cx('content-header')}>
                    <h1>Login</h1>
                    <a href="#">Forgot your password?</a>
                </div>
                <div className={cx('form')}>
                    <form onSubmit={handleSubmit}>
                        <div className={cx('form-group')}>
                            <input
                                type="text"
                                name="username"
                                id="username"
                                placeholder="Username"
                                value={username} // Giá trị được lấy từ state
                                onChange={(e) => setUsername(e.target.value)} // Cập nhật state khi người dùng nhập
                            />
                        </div>
                        <div className={cx('form-group')}>
                            <input
                                type="password"
                                name="password"
                                id="password"
                                placeholder="Password"
                                value={password} // Giá trị được lấy từ state
                                onChange={(e) => setPassword(e.target.value)} // Cập nhật state khi người dùng nhập
                            />
                        </div>
                        <div className={cx('form-group')}>
                            <input type="checkbox" name="remember" id="remember" /> &nbsp;&nbsp;
                            <label htmlFor="remember">
                                Join now to start earning points, reach new levels, and unlock more rewards and benefits
                                from adiClub
                            </label>
                        </div>
                        <div className={cx('form-group')}>
                            <button type="submit" className={cx('custom-button')}>
                                <span className="text">LOGIN</span>
                                <span className="icon">
                                    <WiDirectionRight size={50} />
                                </span>
                            </button>
                        </div>
                    </form>
                </div>
                <div className={cx('option')}>
                    <button className={cx('custom-icon')}>
                        <FcGoogle size={25} />
                    </button>
                    <button className={cx('custom-icon')}>
                        <FaApple size={25} />
                    </button>
                    <button className={cx('custom-icon')}>
                        <FaFacebook size={25} color="blue" />
                    </button>
                </div>
                <div className={cx('content-bottom')}>
                    <p>
                        Don't have an account?
                        <Link to={config.routes.register}>
                            <span>Sign up</span>
                        </Link>
                    </p>
                </div>
            </div>
            <div className={cx('section2')}>
                <div className={cx('content-title')}>
                    <h1>Join Kick Club Get Rewarded Today.</h1>
                </div>
                <div className={cx('content-body')}>
                    <p>
                        As a Kick Club member, you get rewarded for doing what you love. Sign up today and receive
                        immediate access to these Level 1 benefits.
                    </p>
                    <ul>
                        <li>Free shipping on all orders</li>
                        <li>A 15% off voucher for your next purchase</li>
                        <li>Access to Members Only products and sales</li>
                        <li>Access to adidas Running and Training apps</li>
                        <li>Special offers and promotions</li>
                    </ul>
                    <p>
                        Join now to start earning points, reach new levels and unlock more rewards and benefits from
                        adiClub.
                    </p>
                </div>
                <div>
                    <button className={cx('custom-button')}>
                        <span className="text">JOIN TO CLUB</span>
                        <span className="icon">
                            <WiDirectionRight size={50} />
                        </span>
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Login;
