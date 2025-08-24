import React from 'react';

const Modal = ({ isOpen, onClose, title, message, buttonText = "Close" }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-title">{title}</div>
        <div className="modal-message">{message}</div>
        <button className="modal-button" onClick={onClose}>
          {buttonText}
        </button>
      </div>
    </div>
  );
};

export default Modal; 