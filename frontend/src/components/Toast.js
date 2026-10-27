import React from 'react';
import { FaCheckCircle, FaInfoCircle, FaTimes } from 'react-icons/fa';
import './Toast.css';

function Toast({ message, type = 'success', onClose }) {
  if (!message) return null;

  return (
    <div className={`toast-notification ${type}`}>
      <div className="toast-icon">
        {type === 'success' ? <FaCheckCircle /> : <FaInfoCircle />}
      </div>
      <div className="toast-message">{message}</div>
      {onClose && (
        <button type="button" className="toast-close" onClick={onClose}>
          <FaTimes />
        </button>
      )}
    </div>
  );
}

export default Toast;
