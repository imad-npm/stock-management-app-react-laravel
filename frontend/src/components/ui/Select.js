import React, { useState, useRef, useEffect } from 'react';
import ChevronDownIcon from './icons/ChevronDownIcon';

/**
 * A modern, custom Select component (non-native) with accessible keyboard support.
 * @param {object} props
 * @param {Array<{value: string, label: string}>} props.options
 * @param {string} props.value
 * @param {(value: string) => void} props.onChange
 * @param {string} [props.placeholder]
 * @param {boolean} [props.disabled]
 * @param {string} [props.name] - Name for form integration
 * @param {'default' | 'small'} [props.variant] - Control Select size
 */
export default function Select({
  options = [],
  value,
  onChange,
  placeholder = 'Select an option',
  disabled = false,
  name,
  variant = 'default',
}) {
  const [open, setOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const wrapperRef = useRef(null);

  const selectedOption = options.find(opt => opt.value === value);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Keyboard navigation
  const handleKeyDown = (e) => {
    if (disabled) return;
    if (!open && (e.key === 'Enter' || e.key === ' ')) {
      setOpen(true);
      return;
    }
    if (open) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setFocusedIndex((prev) => (prev + 1) % options.length);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setFocusedIndex((prev) => (prev - 1 + options.length) % options.length);
      } else if (e.key === 'Enter') {
        const focused = options[focusedIndex];
        if (focused) {
          onChange(focused.value);
          setOpen(false);
        }
      } else if (e.key === 'Escape') {
        setOpen(false);
      }
    }
  };

  // Variants
  const sizeClasses =
    variant === 'small'
      ? 'px-3 py-1.5 text-xs rounded-lg'
      : 'px-4 py-2 text-sm rounded-xl';

  return (
    <div
      ref={wrapperRef}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      className={`
        relative w-full border bg-background shadow-sm
        ${disabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}
        transition-all duration-150 ease-in-out
        focus-within:ring-2 focus-within:ring-primary/40 border-gray-300
        ${variant === 'small' ? 'rounded-lg' : 'rounded-xl'}
      `}
      onClick={() => !disabled && setOpen(!open)}
    >
      {/* Hidden input for form submission */}
      {name && <input type="hidden" name={name} value={value || ''} />}

      {/* Trigger */}
      <div
        className={`flex items-center justify-between text-gray-800 ${sizeClasses}`}
      >
        <span className={!selectedOption ? 'text-gray-400' : ''}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDownIcon
          className={`${
            variant === 'small' ? 'w-4 h-4' : 'w-5 h-5'
          } text-gray-500 transform transition-transform duration-150 ${
            open ? 'rotate-180' : ''
          }`}
        />
      </div>

      {/* Dropdown */}
      {open && (
        <ul
          className="absolute z-10 mt-1 w-full rounded-lg border border-gray-200 
          bg-background shadow-lg max-h-60 overflow-y-auto"
        >
          {options.map((opt, i) => (
            <li
              key={opt.value}
              onClick={() => {
                onChange(opt.value);
                setOpen(false);
              }}
              className={`
                ${variant === 'small' ? 'px-3 py-1.5 text-xs' : 'px-4 py-2 text-sm'}
                transition-colors duration-100
                ${opt.value === value ? 'bg-primary/10 text-primary font-medium' : 'text-gray-700'}
                ${i === focusedIndex ? 'bg-gray-100' : ''}
                hover:bg-gray-100
              `}
            >
              {opt.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
