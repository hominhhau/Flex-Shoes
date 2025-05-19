import React, { useState } from 'react';
import classNames from 'classnames/bind';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell, faGear, faSignOut, faUser } from '@fortawesome/free-solid-svg-icons';
import styles from './Header.module.scss';
import { Link } from 'react-router-dom';
import { LogoIcon } from '../../../icons';
import { useNavigate } from 'react-router-dom';

// Tippy is a headless tooltip library powered by Popper.j
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css'; // optional
import Menu from '../../components/Popper/Menu';
import { useAuth } from '../../../hooks/useAuth';
import config from '../../../config';
import axios from 'axios';

const cx = classNames.bind(styles);

function Header() {
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { isLoggedIn, setIsLoggedIn, role, setRole } = useAuth();
    const userMenu = [
        // {
        //     icon: <FontAwesomeIcon icon={faGear} />,
        //     title: 'Setting',
        //     to: '/settings',
        // },
        {
            icon: <FontAwesomeIcon icon={faSignOut} />,
            title: 'Log out',
            separate: true,
            onClick: () => handleLogout(),
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

    return (
        <div className={cx('header')}>
            <div className={cx('logo')}>
                <Link to="/admin">
                    <LogoIcon />
                </Link>
            </div>
            <div className={cx('menu')}>
                {/* <Search /> */}
                <Link to="/admin">
                    <button className={cx('menu-item')}>
                        <FontAwesomeIcon icon={faBell} />
                    </button>
                </Link>
                <Menu items={userMenu}>
                    <button className={cx('menu-item')}>
                        <FontAwesomeIcon icon={faUser} />
                    </button>
                </Menu>
            </div>
        </div>
    );
}

export default Header;
