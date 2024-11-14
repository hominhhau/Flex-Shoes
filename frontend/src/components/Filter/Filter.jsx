import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronUp, faChevronDown } from '@fortawesome/free-solid-svg-icons';
import classNames from 'classnames/bind';
import { Range } from 'react-range';
import styles from './Filter.module.scss';
import { Api_Listing } from '../../../apis/Api_Listing';

const cx = classNames.bind(styles);

const FilterSection = ({ title, children }) => {
    const [isOpen, setIsOpen] = useState(true);

    const toggleOpen = () => setIsOpen((prev) => !prev);

    return (
        <div className={cx('filter-section')}>
            <div className={cx('filter-header')} onClick={toggleOpen}>
                <span>{title}</span>
                <FontAwesomeIcon icon={isOpen ? faChevronUp : faChevronDown} className={cx('chevron')} />
            </div>
            {isOpen && <div className={cx('filter-content')}>{children}</div>}
        </div>
    );
};

const FilterButton = ({ label, active, onClick, isColor }) => (
    <button
        className={cx('filter-button', { active })}
        onClick={onClick}
        style={isColor ? { backgroundColor: label } : {}}
    >
        {!isColor && label}
    </button>
);

const FilterColorBox = ({ color, onClick }) => (
    <div className={cx('filter-color-box')} style={{ backgroundColor: color }} onClick={onClick} />
);

const Filter = () => {
    const [selectedFilters, setSelectedFilters] = useState({
        refineBy: [],
        size: [],
        color: [],
        category: [],
        gender: [],
        price: [0, 1000],
        brand: [],
    });
    const [filteredProducts, setFilteredProducts] = useState([]);

    useEffect(() => {
        const timer = setTimeout(() => {
            const getData = async () => {
                try {
                    console.log('Selected filters:', selectedFilters.refineBy);
                    const response = await Api_Listing.filterProductsByCriteria({
                        colors: selectedFilters.color,
                        sizes: selectedFilters.size,
                        brands: selectedFilters.brand,
                        category: selectedFilters.category,
                        genders: selectedFilters.gender,
                        minPrice: selectedFilters.price[0],
                        maxPrice: selectedFilters.price[1],
                    });
                    console.log('Filtered products:', response);
                    // luu vao state
                    setFilteredProducts(response);
                    
                } catch (error) {
                    console.error('Error:', error);
                }
            };
            getData(); // Gọi hàm getData sau khi định nghĩa
        }, 1000);

        return () => clearTimeout(timer);
    }, [selectedFilters]);

    const colorMap = {
        '#FF0000': 'Red',
        '#0000FF': 'Blue',
        '#008000': 'Green',
        '#000000': 'Black',
        '#FFFFFF': 'White',
        '#808080': 'Gray',
        '#FFFF00': 'Yellow',
        '#FFC0CB': 'Pink',
        '#A52A2A': 'Brown',
        '#800080': 'Purple',
    };

    const sizeMap = [38, 39, 40, 41, 42, 43, 44, 45, 46, 47];

    const brandMap = {
        Nike: 'BR001',
        Adidas: 'BR002',
        Puma: 'BR003',
        NewBalance: 'BR004',
        Reebok: 'BR005',
        Converse: 'BR006',
        Vans: 'BR007',
        UnderArmour: 'BR008',
        ASICS: 'BR009',
        Fila: 'BR010',
    };

    const handleFilterChange = (section, value) => {
        setSelectedFilters((prev) => {
            let updatedSection;
            let updatedRefineBy = [...prev.refineBy];

            if (section === 'color') {
                const colorName = colorMap[value];
                if (colorName) {
                    value = colorName;
                }
            }

            if (section === 'refineBy') {
                updatedRefineBy = updatedRefineBy.filter((item) => item !== value);
            } else if (section === 'price') {
                updatedSection = value;
                const priceRange = `$${value[0]} - $${value[1]}`;
                updatedRefineBy = updatedRefineBy.filter((item) => !item.includes('$'));
                updatedRefineBy.push(priceRange);
            } else {
                updatedSection = prev[section].includes(value)
                    ? prev[section].filter((item) => item !== value)
                    : [...prev[section], value];

                if (section === 'size') {
                    if (updatedSection.includes(value) && !updatedRefineBy.includes(`Size: ${value}`)) {
                        updatedRefineBy.push(`Size: ${value}`);
                    } else {
                        updatedRefineBy = updatedRefineBy.filter((item) => item !== `Size: ${value}`);
                    }
                } else if (section === 'brand') {
                    if (updatedSection.includes(value) && !updatedRefineBy.includes(value)) {
                        updatedRefineBy.push(value);
                    } else {
                        updatedRefineBy = updatedRefineBy.filter((item) => item !== value);
                    }
                } else if (section === 'gender') {
                    if (updatedSection.includes(value) && !updatedRefineBy.includes(value)) {
                        updatedRefineBy.push(value);
                    } else {
                        updatedRefineBy = updatedRefineBy.filter((item) => item !== value);
                    }
                } else if (section === 'category') {
                    if (updatedSection.includes(value) && !updatedRefineBy.includes(value)) {
                        updatedRefineBy.push(value);
                    } else {
                        updatedRefineBy = updatedRefineBy.filter((item) => item !== value);
                    }
                }
            }

            return {
                ...prev,
                [section]: updatedSection,
                refineBy: updatedRefineBy,
            };
        });
    };

    const handlePriceChange = (values) => {
        setSelectedFilters((prev) => {
            const priceRange = `$${values[0]} - $${values[1]}`;
            const updatedRefineBy = prev.refineBy.filter((item) => !item.includes('$'));
            updatedRefineBy.push(priceRange);

            return {
                ...prev,
                price: values,
                refineBy: updatedRefineBy,
            };
        });
    };

    return (
        <div className={cx('filters')}>
            <h2>Filters</h2>

            <FilterSection title="REFINE BY">
                <div className={cx('filter-buttons')}>
                    {selectedFilters.refineBy.map((item, index) => (
                        <FilterButton
                            key={index}
                            label={item}
                            active={true}
                            onClick={() => handleFilterChange('refineBy', item)}
                            isColor={Object.keys(colorMap).includes(item)}
                        />
                    ))}
                </div>
            </FilterSection>

            <FilterSection title="SIZE">
                <div className={cx('filter-buttons')}>
                    {sizeMap.map((size) => (
                        <FilterButton
                            key={size}
                            label={size}
                            active={selectedFilters.size.includes(size)}
                            onClick={() => handleFilterChange('size', size)}
                        />
                    ))}
                </div>
            </FilterSection>

            <FilterSection title="COLOR">
                <div className={cx('filter-colors')}>
                    {Object.keys(colorMap).map((color, index) => (
                        <FilterColorBox key={index} color={color} onClick={() => handleFilterChange('color', color)} />
                    ))}
                </div>
            </FilterSection>

            <FilterSection title="BRAND">
                <div className={cx('filter-buttons')}>
                    {Object.keys(brandMap).map((brand) => (
                        <FilterButton
                            key={brand}
                            label={brand}
                            active={selectedFilters.brand.includes(brand)}
                            onClick={() => handleFilterChange('brand', brand)}
                        />
                    ))}
                </div>
            </FilterSection>

            <FilterSection title="CATEGORY">
                {['Casual shoes', 'Runners', 'Hiking', 'Sneaker', 'Basketball', 'Golf', 'Outdoor'].map((category) => (
                    <label key={category} className={cx('checkbox-label')}>
                        <input
                            type="checkbox"
                            checked={selectedFilters.category.includes(category)}
                            onChange={() => handleFilterChange('category', category)}
                        />
                        {category}
                    </label>
                ))}
            </FilterSection>

            <FilterSection title="GENDER">
                {['Men', 'Women', 'Unisex'].map((gender) => (
                    <label key={gender} className={cx('checkbox-label')}>
                        <input
                            type="checkbox"
                            checked={selectedFilters.gender.includes(gender)}
                            onChange={() => handleFilterChange('gender', gender)}
                        />
                        {gender}
                    </label>
                ))}
            </FilterSection>

            <FilterSection title="PRICE">
                <div className={cx('price-slider')}>
                    <Range
                        values={selectedFilters.price}
                        step={1}
                        min={0}
                        max={1000}
                        onChange={handlePriceChange}
                        renderTrack={({ props, children }) => (
                            <div
                                {...props}
                                style={{
                                    ...props.style,
                                    height: '6px',
                                    width: '100%',
                                    backgroundColor: '#ddd',
                                    marginTop: '10px',
                                }}
                            >
                                {children}
                            </div>
                        )}
                        renderThumb={({ props }) => (
                            <div
                                {...props}
                                style={{
                                    ...props.style,
                                    height: '20px',
                                    width: '20px',
                                    borderRadius: '50%',
                                    backgroundColor: 'red',
                                }}
                            />
                        )}
                    />
                    <div className={cx('price-values')}>
                        <span>${selectedFilters.price[0]}</span>
                        <span>${selectedFilters.price[1]}</span>
                    </div>
                </div>
            </FilterSection>
        </div>
    );
};

export default Filter;
