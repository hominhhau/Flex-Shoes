import React, { useState, useEffect } from 'react';
import classNames from 'classnames/bind';
import styles from './Allproduct.module.scss';
import { Api_Inventory } from '../../../../apis/Api_Inventory';
import { useNavigate } from 'react-router-dom';
import config from '../../../config';
import { SlArrowRight, SlCalender } from 'react-icons/sl';

const cx = classNames.bind(styles);

// Hàm giới hạn số từ
const limitWords = (text, maxWords) => {
    if (!text || typeof text !== 'string') return '';
    const words = text.split(' ');
    if (words.length <= maxWords) return text;
    return words.slice(0, maxWords).join(' ') + '...';
};

const AllProduct = () => {
    const navigator = useNavigate();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [products, setProducts] = useState([]);
    const [categorys, setCategories] = useState([]);
    const [brands, setBrands] = useState([]);

    // Filter states
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [selectedBrand, setSelectedBrand] = useState('all');
    const [selectedGender, setSelectedGender] = useState('all');
    const [filteredProducts, setFilteredProducts] = useState([]);

    const today = new Date();
    const formattedDate = `Day ${today.getDate()} Month ${today.getMonth() + 1} Year ${today.getFullYear()}`;

    useEffect(() => {
        const fetchData = async () => {
            try {
                const categoryRes = await Api_Inventory.getCategory();
                const brandRes = await Api_Inventory.getBrand();

                setCategories(categoryRes.data);
                setBrands(brandRes.data);
            } catch (error) {
                console.error('Lỗi khi load :', error);
            }
        };
        fetchData();
    }, []);

    // Fetch products on mount
    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await Api_Inventory.getAllProducts();
                setProducts(response || []);
                setFilteredProducts(response || []);
                console.log('Product Data:', response);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    const handleFilter = () => {
        const filterData = {
            category: selectedCategory !== 'all' ? selectedCategory : '',
            brand: selectedBrand !== 'all' ? selectedBrand : '',
            gender: selectedGender !== 'all' ? selectedGender.toUpperCase() : '',
        };

        console.log('Filter Data:', filterData);

        // Lọc sản phẩm dựa trên filterData
        const filtered = products.filter((product) => {
            const matchCategory = !filterData.category || product.proType === filterData.category;
            const matchBrand = !filterData.brand || product.braType === filterData.brand;
            const matchGender = !filterData.gender || product.gender === filterData.gender;

            return matchCategory && matchBrand && matchGender;
        });

        setFilteredProducts(filtered);
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    if (!products || products.length === 0) {
        return <div>No products available.</div>;
    }

    return (
        <div className={cx('wrapper')}>
            <div className="flex justify-between mb-5">
                <div>
                    <p className="font-bold text-[24px]">All Products</p>
                    <div className={cx('tab')}>
                        Home <SlArrowRight size={10} className="mx-3" /> All Products
                    </div>
                </div>
                <div className="flex items-end ">
                    <SlCalender className="mr-5 mb-2" />
                    {formattedDate}
                </div>
            </div>
            <div className={cx('header')}>
                <h1>All Products</h1>
                <div className={cx('filter-container')}>
                    <div className={cx('inputWrapper')}>
                        <select
                            id="category"
                            className={cx('selectInput')}
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                        >
                            <option value="all">All Categories</option>
                            {categorys.map((category) => (
                                <option key={category._id} value={category._id}>
                                    {category.productTypeName}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className={cx('inputWrapper')}>
                        <select
                            id="brand"
                            className={cx('selectInput')}
                            value={selectedBrand}
                            onChange={(e) => setSelectedBrand(e.target.value)}
                        >
                            <option value="all">All Brands</option>
                            {brands.map((brand) => (
                                <option key={brand._id} value={brand._id}>
                                    {brand.brandTypeName}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className={cx('inputWrapper')}>
                        <select
                            id="gender"
                            className={cx('selectInput')}
                            value={selectedGender}
                            onChange={(e) => setSelectedGender(e.target.value)}
                        >
                            <option value="all">All Genders</option>
                            <option value="MEN">Men</option>
                            <option value="Women">Women</option>
                            <option value="UNISEX">Unisex</option>
                        </select>
                    </div>

                    <button className={cx('filter-button')} onClick={handleFilter}>
                        Filter
                    </button>
                </div>
                <button
                    className={cx('add-product')}
                    onClick={() => {
                        navigator(config.routes.addNewProduct);
                    }}
                >
                    Add New Product
                </button>
            </div>
            <div className={cx('product-list')}>
                {filteredProducts.map((product) => (
                    <div
                        key={product._id}
                        onClick={() => {
                            navigator(config.routes.ProductDetails, { state: { productId: product._id } });
                        }}
                        className={cx('product-card')}
                    >
                        <div className={cx('product-info')}>
                            <img
                                src={product?.image?.[0]?.imageID?.URL || '/default-image.png'}
                                alt={product.productName}
                                className={cx('product-image')}
                            />
                            <div className={cx('product-details')}>
                                <h2>{product.productName}</h2>
                                <p className={cx('price')}>${product.sellingPrice.toFixed(2)}</p>
                            </div>
                        </div>
                        <div>
                            <p className={cx('summary')}>Summary</p>
                            <p className={cx('description')}>{limitWords(product.description, 20)}</p>
                        </div>
                        <div className={cx('stats')}>
                            <div className={cx('stat-item')}>
                                <p>Total Quantity</p>
                                <p>{product.totalQuantity}</p>
                            </div>
                            <div className={cx('stat-item')}>
                                <p>Status</p>
                                <p>{product.status}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AllProduct;
