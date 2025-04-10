import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

import { faCircleXmark, faMagnifyingGlass, faSpinner } from '@fortawesome/free-solid-svg-icons';
import HeadlessTippy from '@tippyjs/react/headless';
import { Wrapper as PopperWrapper } from '../Popper';
import ProductSearch from '../../../components/ProductSearch';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useDebounce } from '../../../hooks';
// import request from '~/utils/request';
// import * as searchServices from '~/services/searchService';
import { Api_Product } from '../../../../apis/Api_Product';

import classNames from 'classnames/bind';
import styles from './Search.module.scss';

const cx = classNames.bind(styles);

function Search() {
    const [searchValue, setSearchValue] = useState('');
    const [searchResult, setSearchResult] = useState([]);
    const [showResult, setShowResult] = useState(true);
    const [loading, setLoading] = useState(false);

    // Debounce search value
    const debounced = useDebounce(searchValue, 500);

    const inputRef = useRef();

    const navigate = useNavigate();

    useEffect(() => {
        if (!debounced.trim()) {
            setSearchResult([]);
            return;
        }

        setLoading(true);

        // Axios search result
        const fetchApi = async () => {
            setLoading(true);
            const result = await Api_Product.searchProduct(debounced);
            setSearchResult(result);
            setLoading(false);
        };
        fetchApi();
    }, [debounced]);

    // useEffect(() => {
    //     setTimeout(() => {
    //         setSearchResult([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    //     }, 0);
    // }, []);

    const handleClear = () => {
        setSearchValue('');
        inputRef.current.focus();
    };

    const handleHideResult = () => {
        setShowResult(false);
    };

    const handleChange = (e) => {
        const value = e.target.value;
        if (!value.startsWith(' ')) {
            setSearchValue(e.target.value);
        }
    };

    const handleProductClick = (productId) => {
        // console.log('Navigating to product detail for ID:', productId);
        navigate(`/productdetail/${productId}`);
    };

    return (
        // Using a wrapper <div> or <span> tag around the reference element solves this by creating a new parentNode context.
        <div>
            <HeadlessTippy
                interactive
                visible={showResult && searchResult.length > 0}
                // visible={true}
                render={(attrs) => (
                    <div className={cx('search-result')} tabIndex="-1" {...attrs}>
                        <PopperWrapper>
                            <h4 className={cx('search-title')}>Shoes</h4>
                            {
                                // Search result
                                searchResult.map((result) => (
                                    <div key={result.productId} onClick={() => handleProductClick(result.productId)}>
                                        <ProductSearch data={result} />
                                    </div>
                                ))
                            }
                        </PopperWrapper>
                    </div>
                )}
                onClickOutside={handleHideResult}
            >
                <div className={cx('search')}>
                    <input
                        ref={inputRef}
                        value={searchValue}
                        type="text"
                        placeholder="Search shoes"
                        spellCheck={false}
                        onChange={handleChange}
                        onFocus={() => setShowResult(true)}
                    />
                    {!!searchValue && !loading && (
                        <button className={cx('clear')} onClick={handleClear}>
                            {/* clear */}
                            <FontAwesomeIcon icon={faCircleXmark} />
                        </button>
                    )}

                    {/* Loading */}
                    {loading && <FontAwesomeIcon className={cx('loading')} icon={faSpinner} />}
                    <button className={cx('search-btn')} onMouseDown={(e) => e.preventDefault()}>
                        {/* Search */}
                        <FontAwesomeIcon icon={faMagnifyingGlass} />
                    </button>
                </div>
            </HeadlessTippy>
        </div>
    );
}

export default Search;
