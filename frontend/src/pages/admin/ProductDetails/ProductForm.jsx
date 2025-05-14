import React, { useState, useEffect } from 'react';
import classNames from 'classnames/bind';
import { useLocation, useNavigate } from 'react-router-dom';
import styles from './ProductForm.module.scss';
import { ProductDetails } from './ProductDetails';
import { ImageUploader } from './ImageUploader';
import { Api_Inventory } from '../../../../apis/Api_Inventory';
import config1 from '../../../config';
import Modal from '../../../components/Modal';
import { SlArrowRight, SlCalender } from 'react-icons/sl';

const cx = classNames.bind(styles);

const ProductForm = () => {
    const navigator = useNavigate();
    const location = useLocation();
    const { productId } = location.state || {};
    const [product, setProduct] = useState();
    const [brand, setBrand] = useState([]);
    const [category, setCategory] = useState([]);
    const [quantities, setQuantities] = useState([]);
    const [isSuccess, setIsSuccess] = useState(false);
    const [isError, setIsError] = useState(false);
    const [isAnnounce, setIsAnnounce] = useState(false);
    const [loading, setLoading] = useState(true); // Add loading state

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                setLoading(true);
                console.log('Product ID:', productId);
                const productResp = await Api_Inventory.getProductById(productId);
                console.log('Data product detail:', productResp);

                const brandResp = await Api_Inventory.getBrand();
                const categoryResp = await Api_Inventory.getCategory();

                console.log('Data category detail:', categoryResp);

                setProduct({ ...productResp.data });
                setBrand(brandResp.data || []);
                setCategory(categoryResp.data || []);
                setQuantities(productResp.inventory);
            } catch (error) {
                console.error('Error fetching product details:', error);
                setProduct({ inventory: [] }); // Fallback to empty inventory
                setBrand([]);
                setCategory([]);
                setQuantities([]);
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [productId]);

    const handleSummit = async (e) => {
        e.preventDefault();
        console.log('Product data to be submitted:', product);

        const formDataToSend = new FormData();

        formDataToSend.append('productId', product._id);
        formDataToSend.append('productName', product.productName);
        formDataToSend.append('description', product.description);
        formDataToSend.append('originalPrice', product.originalPrice);
        formDataToSend.append('discount', product.discount);
        formDataToSend.append('vat', product.tax);
        formDataToSend.append('status', product.status);
        formDataToSend.append('gender', product.gender);
        formDataToSend.append('brandId', product.braType._id);
        formDataToSend.append('categoryId', product.proType._id);

        formDataToSend.append(
            'inventory',
            JSON.stringify(
                product.inventory.map((item) => ({
                    ...item,
                })),
            ),
        );

        // Phân biệt ảnh cũ và ảnh mới
        const oldImages = [];
        const newImageFiles = [];

        product.image.forEach((img) => {
            if (img.imageID && img.imageID._id) {
                oldImages.push(img.imageID._id); // gửi ID ảnh cũ
            } else if (img.file) {
                newImageFiles.push(img.file); // gửi file ảnh mới
            }
        });

        // Gửi danh sách ID ảnh cũ
        formDataToSend.append('oldImageIds', JSON.stringify(oldImages));

        // Gửi từng file ảnh mới
        newImageFiles.forEach((file) => {
            formDataToSend.append('images', file);
        });

        try {
            const response = await Api_Inventory.updateProduct(formDataToSend);
            console.log('Product updated:', response);
            setIsSuccess(true);
        } catch (error) {
            console.error('Error updating product:', error);
            setIsError(true);
        }
    };

    const handleDeleteProduct = async () => {
        try {
            const response = await Api_Inventory.deleteProduct(productId);
            if (response) {
                //setIsSuccess(true);
                navigator(config1.routes.AllProduct);
            }
        } catch (error) {
            console.error('Error deleting product:', error);
            setIsError(true);
        }
    };
    const handleImagesChange = (newImages) => {
        setProduct((prevProduct) => ({
            ...prevProduct,
            image: newImages, // Cập nhật image trong product
        }));
    };

    const handleTryAgain = () => {
        setIsError(false);
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <>
            <div className={cx('tab-1')}>
                <p className="font-bold text-[24px]">Invoice</p>
                <div className={cx('tab')}>
                    Home <SlArrowRight size={10} className="mx-3" /> All Products
                    <SlArrowRight size={10} className="mx-3" /> Products Detail
                </div>
            </div>
            <form className={cx('formContainer')} onSubmit={handleSummit}>
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
                    <ImageUploader onImagesChange={handleImagesChange} images={product.image || []} />
                </div>

                <div className={cx('actionButtons')}>
                    <button type="submit" className={cx('button', 'updateButton')}>
                        Update
                    </button>
                    <button type="button" className={cx('button', 'deleteButton')} onClick={() => setIsAnnounce(true)}>
                        Delete
                    </button>
                    <button
                        type="button"
                        className={cx('button', 'cancelButton')}
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
            {isError && (
                <Modal
                    valid={false}
                    title="Failed!"
                    message="Please check your information again or try again later"
                    isConfirm={true}
                    onConfirm={handleTryAgain}
                    contentConfirm={'OK'}
                />
            )}
            {isAnnounce && (
                <Modal
                    valid={true}
                    title="Announce!"
                    message="Do you want to delete this product?"
                    isConfirm={true}
                    isCancel={true}
                    onConfirm={() => {
                        handleDeleteProduct();
                        setIsAnnounce(false);
                    }}
                    onCancel={() => setIsAnnounce(false)}
                    contentConfirm={'Yes'}
                    contentCancel={'No'}
                />
            )}
        </>
    );
};

export default ProductForm;
