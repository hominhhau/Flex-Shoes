import classNames from 'classnames/bind';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from 'react-router-dom';
import {
    faSearch,
    faUser,
    faShoppingCart,
    faFire,
    faSignOut,
    faGear,
    faCoins,
} from '@fortawesome/free-solid-svg-icons';
import { Api_Auth } from '../../../../apis/Api_Auth';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

import config from '../../../config';
import styles from './Header.module.scss';
import { LogoIcon } from '../../../icons';
import Button from '../../../components/Button';
import Image from '../../../components/Image';

// Tippy is a headless tooltip library powered by Popper.j
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css'; // optional
import Menu from '../Popper/Menu';
import Search from '../Search';
import { useAuth } from '../../../hooks/useAuth';
import { useEffect } from 'react';

const cx = classNames.bind(styles);

function Header({ user }) {
    const navigate = useNavigate();
    const { isLoggedIn, setIsLoggedIn, role, setRole } = useAuth();

    const customerID = localStorage.getItem('customerId');
    const userMenu = [
        {
            icon: <FontAwesomeIcon icon={faGear} />,
            title: 'History',
            to: `/purchasedProductsList/${customerID}`,
        },
        {
            icon: <FontAwesomeIcon icon={faSignOut} />,
            title: 'Log out',
            to: '/',
            separate: true,
            onClick: () => handleLogout(),
        },
        {
            icon: <FontAwesomeIcon icon={faCoins} />,
            title: 'Update Profile',
            to: '/updateProfile',
            separate: true,
        },
    ];
    const handleLogout = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.post(
                'https://api.flexshoes.io.vn/api/v1/users/logout',
                {}, // hoặc data nếu có payload logout
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                    withCredentials: true,
                },
            );

            // Xóa token và role khỏi localStorage
            localStorage.removeItem('token');
            localStorage.removeItem('role');
            localStorage.removeItem('customerId');
            setIsLoggedIn(false);
            setRole(false);
            navigate(config.routes.home);
        } catch (err) {
            console.log('Logout failed:', err.message);
            setError('Logout failed');
        }
    };

    const location = useLocation();
    const handleGenderClick = (gender) => {
        const search = `?gender=${gender}`;
        if (location.search === search) {
            // Nếu search giống nhau, force reload
            navigate(`${config.routes.listing}${search}`, { replace: true });
            navigate(0); // Force reload page
        } else {
            navigate(`${config.routes.listing}${search}`);
        }
    };
    return (
        <header className={cx('wrapper')}>
            <div className={cx('inner')}>
                <nav className={cx('nav-right')}>
                    <Link to={config.routes.listing}>
                        <button className={cx('nav-item')}>
                            New Drops
                            <FontAwesomeIcon icon={faFire} className="text-orange-500 ml-2" />
                        </button>
                    </Link>

                    <button onClick={() => handleGenderClick('Men')} className={cx('nav-item')}>
                        Men <span className="ml-1">▼</span>
                    </button>

                    <button onClick={() => handleGenderClick('Women')} className={cx('nav-item')}>
                        Women <span className="ml-1">▼</span>
                    </button>
                </nav>

                <div className={cx('logo')}>
                    <Link to={config.routes.home}>
                        <LogoIcon />
                    </Link>
                </div>
                <div className="flex w-[400px] justify-end">
                    <div className={cx('search')}>
                        <Search />
                    </div>

                    <div className={cx('actions')}>
                        {isLoggedIn ? (
                            <>
                                <Link to={config.routes.cart}>
                                    <button className={cx('action-btn', 'ml-8')}>
                                        <FontAwesomeIcon icon={faShoppingCart} />
                                    </button>
                                </Link>
                                <Menu items={userMenu}>
                                    <button className={cx('action-btn', 'ml-8')}>
                                        <FontAwesomeIcon icon={faUser} />
                                    </button>
                                </Menu>
                            </>
                        ) : (
                            <>
                                <Link to={config.routes.register}>
                                    <Button text>Register</Button>
                                </Link>

                                <Link to={config.routes.login}>
                                    <Button primary>Login</Button>
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}

export default Header;
