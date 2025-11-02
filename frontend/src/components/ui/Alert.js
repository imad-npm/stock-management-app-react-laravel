
import React from 'react';

import CloseIcon from 'components/ui/icons/CloseIcon';

/**
 * A reusable Alert component for displaying dismissible messages.
 * @param {object} props
 * @param {string} props.message - The message to display in the alert.
 * @param {'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'light' | 'dark'} [props.variant='info'] - The Bootstrap alert style variant.
 * @param {() => void} [props.onClose] - Optional function to call when the alert is dismissed.
 */
function Alert({ message, variant = 'info', onClose }) {
    if (!message) return null;

    let alertClasses = "p-4 rounded-md relative mt-3 border";
    let textClasses = "";
    let closeButtonClasses = "absolute top-1/2 -translate-y-1/2 right-4 text-secondary hover:text-text transition-colors duration-200";

    switch (variant) {
        case 'info':
            alertClasses += " bg-primary/10 border-primary/20";
            textClasses += " text-primary";
            break;
        case 'success':
            alertClasses += " bg-accent/10 border-accent/20";
            textClasses += " text-accent";
            break;
        case 'danger':
            alertClasses += " bg-danger/10 border-danger/20";
            textClasses += " text-danger";
            break;
        case 'warning':
            alertClasses += " bg-warning/10 border-warning/20";
            textClasses += " text-warning";
            break;
        // Add more cases for other variants if needed
        default:
            alertClasses += " bg-secondary/10 border-secondary/20";
            textClasses += " text-secondary";
    }

    return (
        <div className={`${alertClasses} ${textClasses}`} role="alert">
            {message}
            {onClose && (
                <button
                    type="button"
                    className={closeButtonClasses}
                    onClick={onClose}
                >
                    <CloseIcon className="h-5 w-5" />
                </button>
            )}
        </div>
    );
}

export default Alert;
