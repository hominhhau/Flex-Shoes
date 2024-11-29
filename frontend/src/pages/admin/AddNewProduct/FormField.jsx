import classNames from 'classnames/bind';
import styles from './AddNewProduct.module.scss';
const cx = classNames.bind(styles);

export function FormField({ label, id, type = 'text', error = null, helperText = null, required = false, ...props }) {
    const InputComponent = type === 'textarea' ? 'textarea' : 'input';
    const inputClassName = cx('textInput', { textArea: type === 'textarea' });

    return (
        <div className={cx('formField')}>
            {label && (
                <label htmlFor={id} className={cx('fieldLabel', { requiredLabel: required })}>
                    {label}
                </label>
            )}
            <InputComponent
                id={id}
                type={type}
                className={cx(inputClassName, { inputError: error })}
                {...props}
            />
            {error && <p className={cx('errorText')}>{error}</p>}
            {helperText && !error && <p className={cx('helperText')}>{helperText}</p>}
        </div>
    );
}
