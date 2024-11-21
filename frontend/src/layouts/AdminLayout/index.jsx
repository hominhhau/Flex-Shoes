import classNames from 'classnames/bind';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styles from './AdminLayout.module.scss';
import Header from '../componentsAdmin/Header';
import Sidebar from '../componentsAdmin/Sidebar';

const cx = classNames.bind(styles);

function AdminLayout({ children }) {
    return (
        <div className={cx('wrapper')}>
            <Header />
            <Sidebar />
            <div className={cx('container')}>
                <div className={cx('content')}>{children}</div> {/* Phần động */}
            </div>
        </div>
    );
}

export default AdminLayout;
