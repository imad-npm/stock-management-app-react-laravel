
import React, { useContext } from 'react';
import { DropdownContext } from './DropdownContext';

const DropdownItem = ({ children, onClick, danger }) => {
  const { close } = useContext(DropdownContext);

  const handleClick = () => {
    if (onClick) {
      onClick();
    }
    close();
  };

  const dangerStyles = danger ? 'text-danger hover:bg-danger/10' : 'text-text hover:bg-light-gray';

  return (
    <button
      onClick={handleClick}
      className={`flex items-center w-full px-4 py-2 text-sm rounded-md ${dangerStyles}`}
    >
      {children}
    </button>
  );
};

export default DropdownItem;
