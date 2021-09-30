import React from "react";

function ImagePopup({ card, onClose, handleClickOverlayClose }) {
  return (
    <article
      className={`popup popup_photo-view ${card.link ? "popup_opened" : ""}`}
      onClick={handleClickOverlayClose}
    >
      <figure className="popup__view-container">
        <img
          src={card ? card.link : ""}
          alt={card ? card.name : ""}
          className="popup__view-picture"
        />
        <button
          type="button"
          aria-label="Закрыть"
          className="popup__btn-close"
          onClick={onClose}
        ></button>
        <figcaption className="popup__view-caption">
          {card ? card.name : ""}
        </figcaption>
      </figure>
    </article>
  );
}

export default ImagePopup;
