import classNames from 'classnames/bind';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import Header from '../components/Header';
import Footer from '../components/Footer';
import styles from './DefaultLayout.module.scss';

const cx = classNames.bind(styles);

function DefaultLayout({ children }) {
    return (
        <>
            <Header />
            <div className={cx('wrapper')}>
                {/* Main Content */}
                <div className={cx('container')}>
                    <div className={cx('content')}>{children}</div> {/* Phần động */}
                </div>
            </div>
            <Footer />
        </>
    );
}

export default DefaultLayout;
