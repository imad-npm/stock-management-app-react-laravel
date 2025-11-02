
import React from 'react';

/**
 * A reusable Button component with consistent styling.
 * @param {object} props
 * @param {'primary' | 'secondary' | 'success' | 'danger' | 'warning'} [props.variant='primary'] - The button style variant.
 * @param {'sm' | 'md' | 'lg'} [props.size='md'] - The button size.
 * @param {React.ReactNode} props.children - The content of the button.
 * @param {() => void} props.onClick - The function to call when the button is clicked.
 * @param {'button' | 'submit' | 'reset'} [props.type='button'] - The button's type.
 */
function Button({ variant = 'primary', size = 'md', children, onClick, type = 'button',className="", ...rest }) {
    let baseClassName = 'inline-flex items-center justify-center whitespace-nowrap rounded-md font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 '+ className;
    let sizeClassName = '';

    switch (size) {
        case 'sm':
            sizeClassName = 'h-7 px-2 text-xs';
            break;
        case 'lg':
            sizeClassName = 'h-12 px-6 text-lg';
            break;
        case 'md':
        default:
            sizeClassName = 'h-10 px-4 py-2 text-sm';
            break;
    }

    let variantClassName = '';

    switch (variant) {
        case 'primary':
            variantClassName = 'bg-primary text-white hover:bg-primary/90';
            break;
        case 'success':
            variantClassName = 'bg-accent text-white hover:bg-accent/90';
            break;
        case 'danger':
            variantClassName = 'bg-danger text-white hover:bg-danger/90';
            break;
        case 'warning':
            variantClassName = 'bg-warning text-white hover:bg-warning/90';
            break;
        case 'secondary':
            variantClassName = 'bg-secondary text-white hover:bg-secondary/90';
            break;
        default:
            variantClassName = 'bg-secondary text-white hover:bg-secondary/90';
    }

    return (
        <button 
            type={type}
            className={`${baseClassName} ${sizeClassName} ${variantClassName}`} 
            onClick={onClick}
            {...rest}
        >
            {children}
        </button>
    );
}

export default Button;
