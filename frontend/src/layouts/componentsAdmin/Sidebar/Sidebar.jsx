import React from 'react';
import classNames from 'classnames/bind';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styles from './Sidebar.module.scss';
import { Link } from 'react-router-dom';
import { LogoIcon } from '../../../icons';

const cx = classNames.bind(styles);

function Sildebar() {
    return (
        <div className={cx('sidebar')}>
            <div className={cx('logo')}>
                <Link to="/admin">
                    <LogoIcon />
                </Link>
            </div>
            <div className={cx('menu')}>
                <ul>
                    <li>
                        <Link to="/admin/users">
                            <FontAwesomeIcon icon={['fas', 'user']} />
                            <span>Users</span>
                        </Link>
                    </li>
                    <li>
                        <Link to="/admin/products">
                            <FontAwesomeIcon icon={['fas', 'shopping-cart']} />
                            <span>Products</span>
                        </Link>
                    </li>
                    <li>
                        <Link to="/admin/orders">
                            <FontAwesomeIcon icon={['fas', 'file-invoice']} />
                            <span>Orders</span>
                        </Link>
                    </li>
                </ul>
            </div>
        </div>
    );
}

export default Sildebar;
