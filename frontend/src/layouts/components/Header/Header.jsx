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
import { useNavigate } from 'react-router-dom';
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
                "http://localhost:8888/api/v1/users/logout",
                {}, // hoặc data nếu có payload logout
                {
                    headers: {
                        "Content-Type": "application/json",
                        'Authorization': `Bearer ${token}`,
                    },
                    withCredentials: true,
                }
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

                    <Link to={{ pathname: config.routes.listing, search: '?gender=Men' }}>
                        <button className={cx('nav-item')}>
                            Men
                            <span className="ml-1">▼</span>
                        </button>
                    </Link>
                    <Link to={{ pathname: config.routes.listing, search: '?gender=Women' }}>
                        <button className={cx('nav-item')}>
                            Women
                            <span className="ml-1">▼</span>
                        </button>
                    </Link>
                </nav>
                <Link to={config.routes.home}>
                    <div className={cx('logo')}>
                        <LogoIcon />
                    </div>
                </Link>
                <div className={cx('search')}>
                    <Search />
                </div>
               
                <div className={cx('actions')}>
                    {isLoggedIn ? (
                        <>
                            <Link to={config.routes.cart}>
                                <button className={cx('action-btn')}>
                                    <FontAwesomeIcon icon={faShoppingCart} />
                                </button>
                            </Link>
                            <Menu items={userMenu}>
                                <button className={cx('action-btn')}>
                                    <FontAwesomeIcon icon={faUser} />
                                </button>
                            </Menu>

                            {/* <Image
                                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQt1Sw-DyQXoPERYUk3wfWFmjZ6U9sCUNIFzA&s"
                                className={cx('user-avatar')}
                                alt="avatar"
                                fallBack="https://fullstack.edu.vn/assets/f8-icon-lV2rGpF0.png"
                            /> */}
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
        </header>
    );
}

export default Header;
