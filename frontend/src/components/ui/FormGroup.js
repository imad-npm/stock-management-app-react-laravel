
import React from 'react';

/**
 * A reusable FormGroup component to structure form fields with a label.
 * @param {object} props
 * @param {string} props.label - The text label for the form control.
 * @param {string} props.htmlFor - The ID of the associated form control.
 * @param {React.ReactNode} props.children - The form control element (Input, Select, Textarea, etc.).
 */
function FormGroup({ label, htmlFor, children }) {
    return (
        <div className="mb-4">
            <label htmlFor={htmlFor} className="block text-sm font-medium mb-1 text-text">{label}</label>
            {children}
        </div>
    );
}

export default FormGroup;
