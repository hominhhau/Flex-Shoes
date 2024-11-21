import classnames from 'classnames/bind';

import styles from './Register.module.scss';

const cx = classnames.bind(styles);

function Register() {
    return (
        <div className={cx('container-login')}>
            <div className={cx('form-login')}>
                <div className={cx('content-header')}>
                    <h1>Register</h1>
                    <p>Sign up with</p>
                    <div className={cx('option')}>
                        <button>Google</button>
                        <button>Apple</button>
                        <button>Facebook</button>
                    </div>
                    <p>OR</p>
                </div>
                <div className={cx('form')}>
                    <form action="">
                        <div className={cx('form-group')}>
                            <h2>Your Name</h2>
                            <input type="text" name="fname" id="email" placeholder="First Name" />
                            <input type="text" name="lname" id="password" placeholder="Last Name" />
                        </div>
                        <div className={cx('form-group')}>
                            <h2>Gender</h2>
                            <input type="radio" name="gender" value="male" />
                            <label htmlFor="remember">Male</label>
                            <input type="radio" name="gender" value="female" />
                            <label htmlFor="remember">Female</label>
                            <input type="radio" name="gender" id="other" />
                            <label htmlFor="remember">Other</label>
                        </div>
                        <div className={cx('form-group')}>
                            <h2>Login Details</h2>
                            <input type="email" name="email" id="email" placeholder="Email" />
                            <input type="password" name="password" id="password" placeholder="Password" />
                            <p>
                                Minimum 8 characters with at least one uppercase, one lowercase, one special character
                                and a number
                            </p>
                        </div>
                        <div className={cx('form-group')}>
                            <input type="checkbox" name="chkbox1" />
                            <label htmlFor="remember">
                                By clicking 'Log In' you agree to our website KicksClub Terms & Conditions, Kicks
                                Privacy Notice and Terms & Conditions
                            </label>
                        </div>
                        <div className={cx('form-group')}>
                            <input type="checkbox" name="chkbox2" />
                            <label htmlFor="remember">
                                Keep me logged in - applies to all log in options below. More info
                            </label>
                        </div>
                        <div className={cx('form-group')}>
                            <input type="submit" value="REGISTER" />
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
                <div className={cx('content-footer')}>
                    <button>JOIN THE CLUB</button>
                </div>
            </div>
        </div>
    );
}

export default Register;
