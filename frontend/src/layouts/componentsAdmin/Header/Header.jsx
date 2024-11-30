import React from 'react';
import classNames from 'classnames/bind';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell, faGear, faSignOut, faUser } from '@fortawesome/free-solid-svg-icons';
import styles from './Header.module.scss';
import { Link } from 'react-router-dom';
import { LogoIcon } from '../../../icons';
import Search from '../../components/Search';
import { useNavigate } from 'react-router-dom';

// Tippy is a headless tooltip library powered by Popper.j
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css'; // optional
import Menu from '../../components/Popper/Menu';
import { useAuth } from '../../../hooks/useAuth';
import { Api_Auth } from '../../../../apis/Api_Auth';
import config from '../../../config';

const cx = classNames.bind(styles);

function Header() {
    const navigate = useNavigate();
    const { isLoggedIn, setIsLoggedIn, role, setRole } = useAuth();
    const userMenu = [
        {
            icon: <FontAwesomeIcon icon={faGear} />,
            title: 'Setting',
            to: '/settings',
        },
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
            const response = await Api_Auth.logout(token); // Gọi API login
            // Xóa token và role vào localStorage
            localStorage.removeItem('token');
            localStorage.removeItem('role');
            setIsLoggedIn(false);
            setRole(false);
            navigate(config.routes.home);
        } catch (err) {
            console.error('Logout failed:', err.message);
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
