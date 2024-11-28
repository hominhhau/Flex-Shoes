import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import styles from './RecentPurchases.module.scss';

const cx = classNames.bind(styles);

const purchaseData = [
    {
        id: '1',
        color: 'Black',
        size: '42',
        quantity: 1,
    },
    {
        id: '2',
        color: 'White',
        size: '40',
        quantity: 2,
    },
    {
        id: '3',
        color: 'Red',
        size: '43',
        quantity: 1,
    },
];

const PurchaseTableHeader = () => (
    <header className={cx('tableHeader')}>
        <div className={cx('headerCell')}>Color</div>
        <div className={cx('headerCell')}>Size</div>
        <div className={cx('headerCell')}>Quantity</div>
        {/* <div className={cx('headerCell')}>Actions</div> */}
    </header>
);

const PurchaseTableRow = ({ purchase, onQuantityChange, onUpdate, onDelete }) => (
    <div className={cx('tableRow')}>
        <div className={cx('cell')}>{purchase.color}</div>
        <div className={cx('cell')}>{purchase.size}</div>
        <div className={cx('cell')}>
            <input
                type="number"
                className={cx('quantityInput')}
                value={purchase.quantity}
                min="0"
                onChange={(e) => onQuantityChange(purchase.id, parseInt(e.target.value, 10))}
            />
        </div>
        {/* <div className={cx('cell', 'actionCell')}>
            <button className={cx('actionButton', 'updateButton')} onClick={() => onUpdate(purchase.id)}>
                Update
            </button>
            <button className={cx('actionButton', 'deleteButton')} onClick={() => onDelete(purchase.id)}>
                Delete
            </button>
        </div> */}
    </div>
);

PurchaseTableRow.propTypes = {
    purchase: PropTypes.shape({
        id: PropTypes.string.isRequired,
        color: PropTypes.string.isRequired,
        size: PropTypes.string.isRequired,
        quantity: PropTypes.number.isRequired,
    }).isRequired,
    onQuantityChange: PropTypes.func.isRequired,
    onUpdate: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired,
};

const RecentPurchases = () => {
    const handleQuantityChange = (id, newQuantity) => {
        console.log(`Updated quantity for product ${id} to ${newQuantity}`);
        // Update state logic goes here
    };

    const handleUpdate = (id) => {
        console.log(`Update clicked for product ${id}`);
        // Update logic goes here
    };

    const handleDelete = (id) => {
        console.log(`Delete clicked for product ${id}`);
        // Delete logic goes here
    };

    return (
        <section className={cx('container')}>
            {/* <header className={cx('header')}></header> */}
            <div className={cx('divider')} />
            <main className={cx('tableContainer')}>
                <PurchaseTableHeader />
                {purchaseData.map((purchase) => (
                    <PurchaseTableRow
                        key={purchase.id}
                        purchase={purchase}
                        onQuantityChange={handleQuantityChange}
                        onUpdate={handleUpdate}
                        onDelete={handleDelete}
                    />
                ))}
            </main>
        </section>
    );
};

export default RecentPurchases;
