import React , {useState, useEffect }from 'react';
import classNames from 'classnames/bind';
import { useLocation, useNavigate } from 'react-router-dom';


import styles from './ProductForm.module.scss';
import { ProductDetails } from './ProductDetails';
import { ImageUploader } from './ImageUploader';
import { Api_AddProduct } from '../../../../apis/Api_AddProduct';
import { config } from '@fortawesome/fontawesome-svg-core';
import config1 from '../../../config';


const cx = classNames.bind(styles);

const ProductForm = () => {
    const navigator = useNavigate();
    const location = useLocation();
    const { productId } = location.state || {};
    const [product, setProduct] = useState({});
    const [brand, setBrand] = useState([]);
    const [category, setCategory] = useState([]);
    const [quantities, setQuantities] = useState([]);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                // Call API to fetch product details
                const productResp = await Api_AddProduct.getProductById(productId);

                const brandResp = await Api_AddProduct.getBrand();

                const categoryResp = await Api_AddProduct.getCategory();

                const quantityResp = await Api_AddProduct.getQuantity(productId);
                setProduct(productResp);
                setBrand(brandResp);
                setCategory(categoryResp);
                setQuantities(quantityResp);
            } catch (error) {
                console.error('Error fetching product details:', error);
            }
        };
        fetchProduct();
    }, []);

    const handleSummit = async (e) => {
        e.preventDefault();
        try {
            // Call API to update product details
            const response = await Api_AddProduct.updateProduct(product);
            console.log('Product updated:', response);
            alert('Product updated successfully');
        } catch (error) {
            console.error('Error updating product:', error);
            alert('Failed to update product');
        }
    }
    const handleDeleteProduct = async () => {
        try {
            // Call API to delete product
            const response = await Api_AddProduct.deleteProduct(productId);
           if(response){
                alert('Product deleted successfully');
                navigator(config1.routes.AllProduct);
              }
           
        } catch (error) {
            console.error('Error deleting product:', error);
            alert('Failed to delete product');
        }
    }

    return (
        <form className={cx('formContainer')} onSubmit={handleSummit} >
            <div className={cx('formContent')}>
                <ProductDetails 
                    product={product}
                    setProduct={setProduct}
                    brand={brand} 
                    setBrand={setBrand}
                    category={category}
                    setCategory={setCategory}
                    quantities={quantities}
                    setQuantities={setQuantities}
                />
                <ImageUploader />
            </div>

            <div className={cx('actionButtons')}>
                <button type="submit" className={cx('button', 'updateButton')}>
                    Update
                </button>
                <button type="button" className={cx('button', 'deleteButton')} 
                    onClick={handleDeleteProduct}
                >
                    Delete
                </button>
                <button type="button" className={cx('button', 'cancelButton')}
                    onClick={() => navigator(config1.routes.AllProduct)}
                >
                    Cancel
                </button>
            </div>
        </form>
    );
};

export default ProductForm;
