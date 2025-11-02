
import React from 'react';

/**
 * A reusable Input component with consistent styling.
 * @param {object} props - All standard HTML input attributes.
 */
function Input(props) {
    return (
        <input 
            className="flex h-10 w-full rounded-md border border-light-gray bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition duration-150 ease-in-out" 
            {...props} 
        />
    );
}

export default Input;
