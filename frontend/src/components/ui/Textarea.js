import React from 'react';

/**
 * A reusable Textarea component with consistent styling.
 * @param {object} props - All standard HTML textarea attributes.
 */
function Textarea(props) {
    return (
        <textarea
            className="flex min-h-[80px] w-full rounded-md border border-light-gray bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition duration-150 ease-in-out"
            {...props}
        />
    );
}

export default Textarea;