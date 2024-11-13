import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';

export function Chevron({ direction, onClick }) {
    const icon = direction === 'left' ? faChevronLeft : faChevronRight;

    return (
        <button onClick={onClick}>
            <FontAwesomeIcon icon={icon} className="h-10 w-10" color="#fff" />
        </button>
    );
}

/**
 * @param {Omit<ChevronProps, 'direction'>} props
 */
export function ChevronLeft({ onClick, className }) {
    return <Chevron direction="left" onClick={onClick} className={className} />;
}

/**
 * @param {Omit<ChevronProps, 'direction'>} props
 */
export function ChevronRight({ onClick, className }) {
    return <Chevron direction="right" onClick={onClick} className={className} />;
}
