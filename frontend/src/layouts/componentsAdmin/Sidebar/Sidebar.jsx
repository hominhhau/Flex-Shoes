import React from 'react';
import classNames from 'classnames/bind';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell, faClipboardList, faInbox, faTable, faUser } from '@fortawesome/free-solid-svg-icons';
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
                <Link to="/admin">
                    <div className={cx('menu-wrapper')}>
                        <FontAwesomeIcon icon={faInbox} />
                        <button className={cx('menu-item')}>All Product</button>
                    </div>
                </Link>
                <Link to="/admin">
                    <div className={cx('menu-wrapper')}>
                        <FontAwesomeIcon icon={faClipboardList} />
                        <button className={cx('menu-item')}>Order List</button>
                    </div>
                </Link>
            </div>
        </div>
    );
}

export default Sildebar;
