import classNames from 'classnames/bind';

import Filter from '../../components/Filter';
import styles from './Listing.module.scss';
import ProductList from '../../components/ProductList';

const cx = classNames.bind(styles);

function Listing() {
    return (
        <div className={cx('wrapper')}>
            <div className={cx('container-filter')}>
                <Filter />
            </div>
            <div className={cx('container-listproduct')}>
                <ProductList columns={3} />
            </div>
        </div>
    );
}

export default Listing;
