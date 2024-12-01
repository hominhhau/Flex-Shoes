import React , {useState, useEffect }from 'react';
import classNames from 'classnames/bind';
import { useLocation, useNavigate } from 'react-router-dom';


import styles from './ProductForm.module.scss';
import { ProductDetails } from './ProductDetails';
import { ImageUploader } from './ImageUploader';
import { Api_AddProduct } from '../../../../apis/Api_AddProduct';
import { config } from '@fortawesome/fontawesome-svg-core';
import config1 from '../../../config';
import  Modal from '../../../components/Modal';


const cx = classNames.bind(styles);

const ProductForm = () => {
    const navigator = useNavigate();
    const location = useLocation();
    const { productId } = location.state || {};
    const [product, setProduct] = useState({});
    const [brand, setBrand] = useState([]);
    const [category, setCategory] = useState([]);
    const [quantities, setQuantities] = useState([]);
    const [isSuccess, setIsSuccess] = useState(false);
    const [isError, setIsError] = useState(false);
    const [isAnnounce, setIsAnnounce] = useState(false);

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
            setIsSuccess(true);
        } catch (error) {
            console.error('Error updating product:', error);
            setIsError(true);
        }
    }
    const handleDeleteProduct = async () => {
        try {
            // Call API to delete product
            const response = await Api_AddProduct.deleteProduct(productId);
           if(response){
                setIsSuccess(true);
              }
           
        } catch (error) {
            console.error('Error deleting product:', error);
            setIsError(true);

        }
    }
    

    return (
        <>
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
                    onClick={() => setIsAnnounce(true)}
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
          {isSuccess && (
                <Modal
                    valid={true}
                    title="Success!"
                    message="Your information has been updated successfully"
                    isConfirm={true}
                    onConfirm={() => navigator(config1.routes.AllProduct)}
                    contentConfirm={'OK'}
                />
            )}
            {
                isError && (
                    <Modal
                        valid={false}
                        title="Failed!"
                        message="Please check your information again or try again later"
                        isConfirm={true}
                        onConfirm={handleTryAgain}
                        contentConfirm={'OK'}
                        
                    />
                )
            }
            {
                isAnnounce && (
                    <Modal
                        valid={true}
                        title="Announce!"
                        message="Do you want to delete this product?"
                        isConfirm={true}
                        isCancel={true}
                        onConfirm={
                            () => {
                                handleDeleteProduct();
                                setIsAnnounce(false);
                            }}
                        onCancel={() => setIsAnnounce(false)}
                        contentConfirm={'Yes'}
                        contentCancel={'No'}
                    />
                )
            }
        
        </>
    );
};

export default ProductForm;
