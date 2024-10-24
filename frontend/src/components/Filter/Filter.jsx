import React, { useState } from 'react';
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
    });

    const colorMap = {
        '#4A69E2': 'Blue',
        '#FFA52F': 'Orange',
        '#232321': 'Black',
        '#234D41': 'Dark Green',
        '#353336': 'Dark Grey',
        '#F08155': 'Coral',
        '#C9CCC6': 'Light Grey',
        '#677282': 'Steel Blue',
        '#925513': 'Brown',
        '#BB8056': 'Tan',
    };
    const sizeMap = [38, 39, 40, 41, 42, 43, 44, 45, 46, 47];

    const handleFilterChange = (section, value) => {
        setSelectedFilters((prev) => {
            let updatedSection;
            if (section === 'price') {
                updatedSection = value;
            } else {
                updatedSection = prev[section].includes(value)
                    ? prev[section].filter((item) => item !== value)
                    : [value]; // Only keep the new value
            }

            const displayValue = section === 'color' ? value : value;

            let updatedRefineBy = prev.refineBy.filter((item) => item !== displayValue); // Remove old value
            if (section !== 'refineBy' && section !== 'price') {
                updatedRefineBy.push(displayValue); // Add new value
            }

            if (section === 'price') {
                const priceRange = `$${value[0]} - $${value[1]}`; // Display price range
                updatedRefineBy = updatedRefineBy.filter((item) => !item.includes('$')); // Remove previous price ranges
                updatedRefineBy.push(priceRange); // Add the new price range
            }

            return {
                ...prev,
                [section]: updatedSection,
                refineBy: section === 'refineBy' ? updatedSection : updatedRefineBy,
            };
        });
    };

    const handlePriceChange = (values) => {
        setSelectedFilters((prev) => ({
            ...prev,
            price: values,
            refineBy: prev.refineBy.filter((item) => !item.includes('$')).concat(`$${values[0]} - $${values[1]}`),
        }));
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
                            >
                                {/* <div
                                    style={{
                                        position: 'absolute',
                                        top: '-28px',
                                        color: '#fff',
                                        fontWeight: 'bold',
                                        fontSize: '12px',
                                        backgroundColor: '#4A69E2',
                                        padding: '2px 4px',
                                        borderRadius: '4px',
                                    }}
                                >
                                    {selectedFilters.price[index]}
                                </div> */}
                            </div>
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
