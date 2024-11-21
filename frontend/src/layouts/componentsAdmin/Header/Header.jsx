import React from 'react';
import classNames from 'classnames/bind';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell, faUser } from '@fortawesome/free-solid-svg-icons';
import styles from './Header.module.scss';
import { Link } from 'react-router-dom';
import { LogoIcon } from '../../../icons';
import Search from '../../components/Search';

const cx = classNames.bind(styles);

function Header() {
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
                <Link to="/admin">
                    <button className={cx('menu-item')}>
                        <FontAwesomeIcon icon={faUser} />
                    </button>
                </Link>
            </div>
        </div>
    );
}

export default Header;
