import React from "react";

function InfoTooltip({
  isOpen,
  onClose,
  handleClickOverlayClose,
  icon,
  title,
}) {
  return (
    <article
      className={`popup ${isOpen ? "popup_opened" : ""}`}
      onClick={handleClickOverlayClose}
    >
      <div className="popup__container">
        <img className="popup__tooltip-icon" src={icon} alt="Статус ответа" />
        <h3 className="popup__title popup__title_for_tooltip">{title}</h3>
        <button
          className="popup__btn-close"
          type="button"
          aria-label="Закрыть"
          onClick={onClose}
        ></button>
      </div>
    </article>
  );
}

export default InfoTooltip;
