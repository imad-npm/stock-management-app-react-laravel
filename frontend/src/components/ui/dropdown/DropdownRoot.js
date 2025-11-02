
import React, { useState, useCallback, useMemo, useRef } from 'react';
import { DropdownContext } from './DropdownContext';

const DropdownRoot = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const rootRef = useRef(null);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);
  const toggle = useCallback(() => setIsOpen(prev => !prev), []);

  const contextValue = useMemo(() => ({
    isOpen,
    open,
    close,
    toggle,
    rootRef,
  }), [isOpen, open, close, toggle, rootRef]);

  return (
    <DropdownContext.Provider value={contextValue}>
      <div className="relative inline-block" ref={rootRef}>{children}</div>
    </DropdownContext.Provider>
  );
};

export default DropdownRoot;
