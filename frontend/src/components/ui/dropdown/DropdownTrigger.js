
import React, { useContext } from 'react';
import { DropdownContext } from './DropdownContext';

const DropdownTrigger = ({ children, as: Component = 'button' }) => {
  const { toggle } = useContext(DropdownContext);

  return (
    <Component onClick={toggle} className="flex items-center gap-2 p-2 rounded-lg">
      {children}
    </Component>
  );
};

export default DropdownTrigger;
