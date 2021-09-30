import React from "react";
import PopupWithForm from "./PopupWithForm";

function AddPlacePopup({
  isOpen,
  onClose,
  handleClickOverlayClose,
  onAddPlace,
}) {
  const [name, setName] = React.useState("");
  const [link, setLink] = React.useState("");

  function handleChangeName(e) {
    setName(e.target.value);
  }

  function handleChangeLink(e) {
    setLink(e.target.value);
  }

  function handleSubmit(e) {
    e.preventDefault();
    onAddPlace({ name, link });
  }

  React.useEffect(() => {
    if (!isOpen) {
      setName("");
      setLink("");
    }
  }, [isOpen]);

  return (
    <PopupWithForm
      title="Новое место"
      name="add-card"
      buttonText="Создать"
      isOpen={isOpen}
      onClose={onClose}
      handleClickOverlayClose={handleClickOverlayClose}
      onSubmit={handleSubmit}
    >
      <input
        id="input-name-card"
        name="name"
        type="text"
        placeholder="Название"
        required
        minLength="2"
        maxLength="30"
        className="popup__input popup__input_text_name-card"
        onChange={handleChangeName}
        value={name}
      />
      <span className="input-name-card-error popup__error"></span>
      <input
        id="input-link-card"
        name="link"
        type="url"
        placeholder="Ссылка на картинку"
        required
        className="popup__input popup__input_text_link-card"
        onChange={handleChangeLink}
        value={link}
      />
      <span className="input-link-card-error popup__error"></span>
    </PopupWithForm>
  );
}

export default AddPlacePopup;
