import React from "react";

function PopupWithForm({
  name,
  title,
  buttonText,
  isOpen,
  onClose,
  onSubmit,
  handleClickOverlayClose,
  children,
}) {
  return (
    <article
      className={`popup popup_${name} ${isOpen ? "popup_opened" : ""}`}
      onClick={handleClickOverlayClose}
    >
      <div className="popup__container">
        <h3 className="popup__title">{title}</h3>
        <form
          className={`popup__form popup__form_${name}`}
          name={`form-${name}`}
          onSubmit={onSubmit}
          noValidate
        >
          {children}
          <button className="popup__btn-submit" type="submit">
            {buttonText}
          </button>
        </form>
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

export default PopupWithForm;
