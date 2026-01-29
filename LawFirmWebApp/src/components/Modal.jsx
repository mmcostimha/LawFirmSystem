import React from "react";
import style from "./Modal.module.css"

const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null; // don't render if closed

  return (
    <div className={style.backdropStyle} onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
      <button onClick={onClose} className={style.buttonStyle}>Close</button>
    </div>
  );
};

export default Modal;
