import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronUp, faChevronDown } from '@fortawesome/free-solid-svg-icons';
import classNames from 'classnames/bind';
import { Range } from 'react-range'; // Import Range from react-range
import styles from './Filter.module.scss';

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
        price: [0, 1000], // Initial price range
        brand: [], // New brand filter
    });

    // Log selected filters to console after 3 seconds
    useEffect(() => {
        const timer = setTimeout(() => {
            console.log('Selected Filters after 3 seconds:', selectedFilters);
        }, 3000);

        return () => clearTimeout(timer);
    }, [selectedFilters]); // Run effect when selectedFilters change

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
            if (section === 'price') {
                updatedSection = value;
            } else {
                updatedSection = prev[section].includes(value)
                    ? prev[section].filter((item) => item !== value)
                    : [...prev[section], value]; // Add value if not found
            }

            // Update refineBy to include all selected filters
            let updatedRefineBy = [...prev.refineBy]; // Start with existing refineBy

            // Handle size selection
            if (section === 'size') {
                if (!updatedRefineBy.includes(`Size: ${value}`)) {
                    updatedRefineBy.push(`${value}`); // Add the new size if not already included
                }
            }
            // Handle removal from refineBy
            else if (section === 'refineBy') {
                updatedRefineBy = updatedRefineBy.filter((item) => item !== value);
            }
            // Handle other sections
            else if (section !== 'price') {
                if (!updatedRefineBy.includes(value)) {
                    updatedRefineBy.push(value); // Add new value for other sections
                }
            }

            // Handle price selection
            if (section === 'price') {
                const priceRange = `$${value[0]} - $${value[1]}`; // Display price range
                updatedRefineBy = updatedRefineBy.filter((item) => typeof item === 'string' && !item.includes('$')); // Remove previous price ranges
                updatedRefineBy.push(priceRange); // Add the new price range
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
            const priceRange = `$${values[0]} - $${values[1]}`; // Display price range
            const updatedRefineBy = prev.refineBy.filter((item) => typeof item === 'string' && !item.includes('$')); // Remove previous price ranges
            updatedRefineBy.push(priceRange); // Add the new price range

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
                {['Men', 'Women'].map((gender) => (
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
                        renderThumb={({ props, index }) => (
                            <div
                                {...props}
                                style={{
                                    ...props.style,
                                    height: '20px',
                                    width: '20px',
                                    backgroundColor: '#f00',
                                    borderRadius: '50%',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    boxShadow: '0 0 5px rgba(0, 0, 0, 0.2)',
                                }}
                            ></div>
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
