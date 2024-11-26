import React from 'react';
import classNames from 'classnames/bind';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell, faGear, faSignOut, faUser } from '@fortawesome/free-solid-svg-icons';
import styles from './Header.module.scss';
import { Link } from 'react-router-dom';
import { LogoIcon } from '../../../icons';
import Search from '../../components/Search';

// Tippy is a headless tooltip library powered by Popper.j
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css'; // optional
import Menu from '../../components/Popper/Menu';

const cx = classNames.bind(styles);

function Header() {
    const userMenu = [
        {
            icon: <FontAwesomeIcon icon={faGear} />,
            title: 'Setting',
            to: '/settings',
        },
        {
            icon: <FontAwesomeIcon icon={faSignOut} />,
            title: 'Log out',
            to: '/home',
            separate: true,
        },
    ];
    return (
        <div className={cx('header')}>
            <div className={cx('logo')}>
                <Link to="/admin">
                    <LogoIcon />
                </Link>
            </div>
            <div className={cx('menu')}>
                <Search />
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
