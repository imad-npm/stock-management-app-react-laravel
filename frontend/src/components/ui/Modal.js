import React from 'react';
import ReactDOM from 'react-dom';
import Button from 'components/ui/Button';

import CloseIcon from 'components/ui/icons/CloseIcon';

const Modal = ({ onClose, component, title }) => {
  return ReactDOM.createPortal(
    <div className="fixed inset-0 bg-neutral-900/40 bg-opacity-50 h-full flex items-center justify-center z-50 p-4">
      <div className="relative w-full max-w-lg mx-auto bg-background rounded-xl shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between p-5 border-b border-light-gray">
          <h5 className="text-2xl font-bold text-text">{title}</h5>
          <button
            type="button"
            className="text-secondary hover:text-text transition-colors duration-200"
            onClick={onClose}
          >
            <CloseIcon className="h-6 w-6" />
          </button>
        </div>
        <div className="relative p-6">
          {component}
        </div>
        <div className="flex items-center justify-end p-4 border-t border-light-gray bg-background">
          <Button variant="secondary" onClick={onClose}>Close</Button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default Modal;
