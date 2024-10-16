import classNames from 'classnames/bind';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from 'react-router-dom';
import { faSearch, faUser, faShoppingCart, faFire } from '@fortawesome/free-solid-svg-icons';

import config from '../../../config';

import styles from './Header.module.scss';
import { LogoIcon } from '../../../icons';
import Button from '../../../components/Button';
import Image from '../../../components/Image';

const cx = classNames.bind(styles);

function Header() {
    const currentUser = true;

    return (
        <header className={cx('wrapper')}>
            <div className={cx('inner')}>
                <nav className={cx('nav-right')}>
                    <button className={cx('nav-item')}>
                        New Drops
                        <FontAwesomeIcon icon={faFire} className="text-orange-500 ml-2" />
                    </button>
                    <button className={cx('nav-item')}>
                        Men
                        <span className="ml-1">▼</span>
                    </button>
                    <button className={cx('nav-item')}>
                        Women
                        <span className="ml-1">▼</span>
                    </button>
                </nav>
                <div className={cx('logo')}>
                    <LogoIcon />
                </div>
                <div className={cx('actions')}>
                    {currentUser ? (
                        <>
                            <button className={cx('action-btn')}>
                                <FontAwesomeIcon icon={faSearch} />
                            </button>
                            <button className={cx('action-btn')}>
                                <FontAwesomeIcon icon={faUser} />
                            </button>
                            <Image
                                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQt1Sw-DyQXoPERYUk3wfWFmjZ6U9sCUNIFzA&s"
                                className={cx('user-avatar')}
                                alt="avatar"
                                fallBack="https://fullstack.edu.vn/assets/f8-icon-lV2rGpF0.png"
                            />
                        </>
                    ) : (
                        <>
                            <Button text>Register</Button>
                            <Button primary>Login</Button>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
}

export default Header;
