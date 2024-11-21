import classNames from 'classnames/bind';
import { Link } from 'react-router-dom';
import config from '../../config';

import styles from './Login.module.scss';

const cx = classNames.bind(styles);

function Login() {
    return (
        <div className={cx('container-login')}>
            <div className={cx('form-login')}>
                <div className={cx('content-header')}>
                    <h1>Login</h1>
                    <a href="#">Forgot your password?</a>
                </div>
                <div className={cx('form')}>
                    <form>
                        <div className={cx('form-group')}>
                            <input type="email" name="email" id="email" placeholder="Email" />
                        </div>
                        <div className={cx('form-group')}>
                            <input type="password" name="password" id="password" placeholder="password" />
                        </div>
                        <div className={cx('form-group')}>
                            <input type="checkbox" name="remember" id="remember" />
                            <label htmlFor="remember">
                                Join now to start earning points, reach new levels, and unlock more rewards and benefits
                                from adiClub
                            </label>
                        </div>
                        <div className={cx('form-group')}>
                            <input type="submit" value="EMAIL LOGIN" />
                        </div>
                    </form>
                </div>
                <div className={cx('option')}>
                    <button>Google</button>
                    <button>Apple</button>
                    <button>Facebook</button>
                </div>
                <div className={cx('content-bottom')}>
                    <p>
                        Don't have an account? <a href="#">Sign up</a>
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
                <div className={cx('content-footer')}>
                    <button>JOIN THE CLUB</button>
                </div>
            </div>
        </div>
    );
}

export default Login;
