import React, { useState } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import styles from './RecentPurchases.module.scss';
import { Api_AddProduct } from '../../../../apis/Api_AddProduct';

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
        <div className={cx('headerCell')}>Actions</div>
    </header>
);

const PurchaseTableRow = ({ purchase, onQuantityChange, onUpdate, onDelete }) => (
    <div className={cx('tableRow')}>
        <div className={cx('cell')}>{purchase.colorName}</div>
        <div className={cx('cell')}>{purchase.sizeName}</div>
        <div className={cx('cell')}>
            <input
                type="number"
                className={cx('quantityInput')}
                value={purchase.quantity}
                min="1"
                onChange={(e) => onQuantityChange(purchase.id, parseInt(e.target.value, 10))}
            />
        </div>
        <div className={cx('cell', 'actionCell')}>
            <button className={cx('actionButton', 'updateButton')} onClick={() => onUpdate(purchase.id)}>
                Update
            </button>
            <button className={cx('actionButton', 'deleteButton')} onClick={() => onDelete(purchase.id)}>
                Delete
            </button>
        </div>
    </div>
);

PurchaseTableRow.propTypes = {
    purchase: PropTypes.shape({
        id: PropTypes.string.isRequired,
        colorName: PropTypes.string.isRequired,
        sizeName: PropTypes.string.isRequired,
        quantity: PropTypes.number.isRequired,
    }).isRequired,
    onQuantityChange: PropTypes.func.isRequired,
    onUpdate: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired,
};

const RecentPurchases = ( { quantities, setQuantities}) => {
    
    const handleQuantityChange = (id, newQuantity) => {
        setQuantities((prevQuantities) => {
            const updatedQuantities = prevQuantities.map((purchase) => {
                if (purchase.id === id) {
                    return { ...purchase, quantity: newQuantity };
                }
                return purchase;
            });
            console.log('Updated quantities:', updatedQuantities);
            return updatedQuantities;
        });
    };

    const handleUpdateOne = (id, data) => {
      try {
        //Xu ly tim quantity theo id

        data = quantities.find((quantity) => quantity.id === id);
        console.log('Data:', data);
        const response = Api_AddProduct.updateQuantity(id, data);
        console.log('Quantity updated:', response);
      } catch (error) {
        console.error('Error updating quantity:', error);
        alert('Failed to update quantity');
        
      }
    };

    const handleDeleteOne = (id) => {
       try {
        const response = Api_AddProduct.deleteQuantity(id);
        // console.log('Quantity deleted:', response);
        const updatedQuantities = quantities.filter((purchase) => purchase.id !== id);
        setQuantities(updatedQuantities);
       } catch (error) {
        console.error('Error deleting quantity:', error);
        alert('Failed to delete quantity');
        
       }
    };


    return (
        <section className={cx('container')}>
            {/* <header className={cx('header')}></header> */}
            <div className={cx('divider')} />
            <main className={cx('tableContainer')}>
                <PurchaseTableHeader />
                {quantities.map((purchase) => (
                    <PurchaseTableRow 
                        key={purchase.id}
                        purchase={purchase}
                        onQuantityChange={handleQuantityChange}
                        onUpdate={handleUpdateOne}
                        onDelete={handleDeleteOne}
                    />
                ))}
            </main>
        </section>
    );
};

export default RecentPurchases;