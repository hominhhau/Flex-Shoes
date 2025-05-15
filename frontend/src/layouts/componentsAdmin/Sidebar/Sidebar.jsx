import React from 'react';
import classNames from 'classnames/bind';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell, faCartShopping, faClipboardList, faInbox, faTable, faUser } from '@fortawesome/free-solid-svg-icons';
import styles from './Sidebar.module.scss';
import { Link } from 'react-router-dom';
import { LogoIcon } from '../../../icons';

const cx = classNames.bind(styles);

function Sildebar() {
    return (
        <div className={cx('sidebar')}>
            <div className={cx('menu')}>
                <Link to="/dashboard">
                    <div className={cx('menu-wrapper')}>
                        <FontAwesomeIcon icon={faTable} />
                        <button className={cx('menu-item')}>Dashboard</button>
                    </div>
                </Link>
                <Link to="/invoice">
                    <div className={cx('menu-wrapper')}>
                        <FontAwesomeIcon icon={faCartShopping} />
                        <button className={cx('menu-item')}>Invoice</button>
                    </div>
                </Link>
                <Link to="/AllProduct">
                    <div className={cx('menu-wrapper')}>
                        <FontAwesomeIcon icon={faInbox} />
                        <button className={cx('menu-item')}>All Product</button>
                    </div>
                </Link>
                <Link to="/managerCustomer">
                    <div className={cx('menu-wrapper')}>
                        <FontAwesomeIcon icon={faClipboardList} />
                        <button className={cx('menu-item')}>Customer List</button>
                    </div>
                </Link>
            </div>
        </div>
    );
}

export default Sildebar;
