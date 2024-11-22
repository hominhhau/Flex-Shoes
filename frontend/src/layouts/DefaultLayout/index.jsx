import classNames from 'classnames/bind';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import Header from '../components/Header';
import Footer from '../components/Footer';
import styles from './DefaultLayout.module.scss';

const cx = classNames.bind(styles);

function DefaultLayout({ children }) {
    return (
        <div className={cx('wrapper')}>
            {/* Header */}
            <Header /> {/* Phần tĩnh */}
            {/* Main Content */}
            <div className={cx('container')}>
                <div className={cx('content')}>{children}</div> {/* Phần động */}
            </div>
            {/* Footer */}
            <Footer /> {/* Phần tĩnh */}
        </div>
    );
}

export default DefaultLayout;
