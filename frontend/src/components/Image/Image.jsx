import { useState, forwardRef } from 'react';
import images from '../../assets/images';
import styles from './Image.module.scss';
import classNames from 'classnames';

const Image = forwardRef(
    ({ className, src, alt, width, height, fallBack: customFallBack = images.noImage, ...props }, ref) => {
        // eslint-disable-next-line jsx-a11y/alt-text
        const [fallBack, setFallBack] = useState('');

        const handleError = () => {
            setFallBack(customFallBack);
        };

        return (
            <img
                className={classNames(styles.wrapper, className)}
                src={fallBack || src}
                alt={alt}
                ref={ref}
                width={width}
                height={height}
                {...props}
                onError={handleError}
            />
        );
    },
);

export default Image;

// Use forwardRef to forward ref to the img element
