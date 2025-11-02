
import React, { useContext, useEffect } from 'react';
import { DropdownContext } from './DropdownContext';

const DropdownContent = ({ children,className }) => {
  const { isOpen, close, rootRef } = useContext(DropdownContext);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (rootRef.current && !rootRef.current.contains(event.target)) {
        close();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, close, rootRef]);

  if (!isOpen) return null;

  return (
    <div className={`absolute right-0 mt-2  bg-background shadow-lg rounded-xl ring-1 ring-light-gray z-10 ${className}`}>
      {children}
    </div>
  );
};

export default DropdownContent;
