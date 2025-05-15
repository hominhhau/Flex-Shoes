import React from 'react';
import classNames from 'classnames/bind';
import styles from './ProductSearch.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import Image from '../Image';

const cx = classNames.bind(styles);

function ProductSearch({ data }) {
    return (
        <Link className={cx('wrapper')}>
            <Image
                className={cx('avatar')}
                src={data.image?.[0]?.imageID?.URL || 'https://fullstack.edu.vn/assets/f8-icon-lV2rGpF0.png'}
                alt="logo"
                fallBack="https://fullstack.edu.vn/assets/f8-icon-lV2rGpF0.png"
            />
            <div className={cx('info')}>
                <h4 className={cx('name')}>
                    {/* Name */}
                    <span>{data.productName}</span>
                    {/* {data.tick && <FontAwesomeIcon className={cx('check')} icon={faCheckCircle} />} */}
                </h4>
                <span className={cx('username')}>
                    {data.description?.length > 60 ? `${data.description.slice(0, 60)}...` : data.description}
                </span>
            </div>
        </Link>
    );
}

export default ProductSearch;
