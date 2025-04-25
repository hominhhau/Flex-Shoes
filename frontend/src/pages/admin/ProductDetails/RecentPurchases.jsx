// import React from 'react';
// import PropTypes from 'prop-types';
// import classNames from 'classnames/bind';
// import styles from './RecentPurchases.module.scss';
// import { Api_Inventory } from '../../../../apis/Api_Inventory';

// const cx = classNames.bind(styles);

// const PurchaseTableHeader = () => (
//     <header className={cx('tableHeader')}>
//         <div className={cx('headerCell')}>Color</div>
//         <div className={cx('headerCell')}>Size</div>
//         <div className={cx('headerCell')}>Quantity</div>
//         <div className={cx('headerCell')}>Actions</div>
//     </header>
// );

// const PurchaseTableRow = ({ purchase, onQuantityChange, onUpdate, onDelete }) => (
//     <div className={cx('tableRow')}>
//         <div className={cx('cell')}>
//             {purchase.numberOfProduct.color && purchase.numberOfProduct.color.colorName
//                 ? purchase.numberOfProduct.color.colorName
//                 : 'N/A'}
//         </div>
//         <div className={cx('cell')}>
//             {purchase.numberOfProduct.size && purchase.numberOfProduct.size.nameSize
//                 ? purchase.numberOfProduct.size.nameSize
//                 : 'N/A'}
//         </div>
//         <div className={cx('cell')}>
//             <input
//                 type="number"
//                 className={cx('quantityInput')}
//                 value={purchase.numberOfProduct.quantity || 1}
//                 min="1"
//                 onChange={(e) => {
//                     const value = parseInt(e.target.value, 10);
//                     if (value >= 1) {
//                         onQuantityChange(purchase._id, value);
//                     }
//                 }}
//             />
//         </div>
//         <div className={cx('cell', 'actionCell')}>
//             <button
//                 className={cx('actionButton', 'updateButton')}
//                 onClick={() => onUpdate(purchase.numberOfProduct._id)}
//                 disabled={!purchase.numberOfProduct.color || !purchase.numberOfProduct.size}
//             >
//                 Update
//             </button>
//             <button
//                 className={cx('actionButton', 'deleteButton')}
//                 onClick={() => onDelete(purchase.numberOfProduct._id)}
//             >
//                 Delete
//             </button>
//         </div>
//     </div>
// );

// PurchaseTableRow.propTypes = {
//     purchase: PropTypes.shape({
//         _id: PropTypes.string.isRequired,
//         quantity: PropTypes.number.isRequired,
//         color: PropTypes.shape({
//             _id: PropTypes.string,
//             colorName: PropTypes.string,
//         }),
//         size: PropTypes.shape({
//             _id: PropTypes.string,
//             nameSize: PropTypes.string,
//         }),
//     }).isRequired,
//     onQuantityChange: PropTypes.func.isRequired,
//     onUpdate: PropTypes.func.isRequired,
//     onDelete: PropTypes.func.isRequired,
// };

// const RecentPurchases = ({ inventory = [], setProduct }) => {
//     const handleQuantityChange = (id, newQuantity) => {
//         setProduct((prevProduct) => ({
//             ...prevProduct,
//             inventory: (prevProduct.inventory || []).map((item) =>
//                 item._id === id ? { ...item, quantity: newQuantity } : item,
//             ),
//         }));
//     };

//     const handleUpdateOne = async (id) => {
//         try {
//             const data = inventory.find((item) => item._id === id);
//             if (!data) {
//                 alert('Inventory item not found.');
//                 return;
//             }
//             if (!data.color || !data.color._id || !data.size || !data.size._id) {
//                 alert('Invalid color or size data.');
//                 return;
//             }
//             if (data.quantity < 1) {
//                 alert('Số lượng phải lớn hơn hoặc bằng 1.');
//                 return;
//             }
//             const response = await Api_Inventory.updateQuantity(id, {
//                 quantity: data.quantity,
//                 color: data.color._id,
//                 size: data.size._id,
//             });
//             console.log('Quantity updated:', response);
//             alert('Cập nhật số lượng thành công!');
//         } catch (error) {
//             console.error('Error updating quantity:', error);
//             alert('Không thể cập nhật số lượng. Vui lòng thử lại.');
//         }
//     };

//     const handleDeleteOne = async (id) => {
//         try {
//             const response = await Api_Inventory.deleteQuantity(id);
//             console.log('Quantity deleted:', response);
//             setProduct((prevProduct) => ({
//                 ...prevProduct,
//                 inventory: (prevProduct.inventory || []).filter((item) => item._id !== id),
//             }));
//             alert('Xóa số lượng thành công!');
//         } catch (error) {
//             console.error('Error deleting quantity:', error);
//             alert('Không thể xóa số lượng. Vui lòng thử lại.');
//         }
//     };

//     return (
//         <section className={cx('container')}>
//             <div className={cx('divider')} />
//             <main className={cx('tableContainer')}>
//                 <PurchaseTableHeader />
//                 {inventory.length === 0 ? (
//                     <div className={cx('emptyState')}>No inventory items available.</div>
//                 ) : (
//                     inventory.map((item, index) => (
//                         <PurchaseTableRow
//                             key={item._id || index} // Fallback key for invalid items
//                             purchase={item}
//                             onQuantityChange={handleQuantityChange}
//                             onUpdate={handleUpdateOne}
//                             onDelete={handleDeleteOne}
//                         />
//                     ))
//                 )}
//             </main>
//         </section>
//     );
// };

// RecentPurchases.propTypes = {
//     inventory: PropTypes.arrayOf(
//         PropTypes.shape({
//             _id: PropTypes.string,
//             quantity: PropTypes.number,
//             color: PropTypes.shape({
//                 _id: PropTypes.string,
//                 colorName: PropTypes.string,
//             }),
//             size: PropTypes.shape({
//                 _id: PropTypes.string,
//                 nameSize: PropTypes.string,
//             }),
//         }),
//     ),
//     setProduct: PropTypes.func.isRequired,
// };

// RecentPurchases.defaultProps = {
//     inventory: [],
// };

// export default RecentPurchases;
