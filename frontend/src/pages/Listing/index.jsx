import classNames from 'classnames/bind';

import Filter from '../../components/Filter';
import styles from './Listing.module.scss';

const cx = classNames.bind(styles);

function Listing() {
    return (
        <div className={cx('wrapper')}>
            <div className={cx('container-filter')}>
                <Filter />
            </div>
            <div className={cs('container-listproduct')}></div>
        </div>
    );
}

export default Listing;
