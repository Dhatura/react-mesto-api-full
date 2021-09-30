import React from "react";
import PopupWithForm from "./PopupWithForm";
import { CurrentUserContext } from "../contexts/CurrentUserContext";

function EditProfilePopup({
  isOpen,
  onClose,
  handleClickOverlayClose,
  onUpdateUser,
}) {
  const currentUser = React.useContext(CurrentUserContext);
  const [name, setName] = React.useState("");
  const [description, setDescription] = React.useState("");

  React.useEffect(() => {
    if (currentUser.about && currentUser.name) {
      setName(currentUser.name);
      setDescription(currentUser.about);
    }
  }, [currentUser, isOpen]);

  function handleChangeName(e) {
    setName(e.target.value);
  }

  function handleChangeDescription(e) {
    setDescription(e.target.value);
  }

  function handleSubmit(e) {
    e.preventDefault();
    onUpdateUser({
      name,
      about: description,
    });
  }

  return (
    <PopupWithForm
      title="Редактировать профиль"
      name="edit-profile"
      buttonText="Сохранить"
      isOpen={isOpen}
      onClose={onClose}
      handleClickOverlayClose={handleClickOverlayClose}
      onSubmit={handleSubmit}
    >
      <input
        onChange={handleChangeName}
        value={name}
        id="input-name"
        name="name-profile"
        type="text"
        placeholder="Имя"
        required
        minLength="2"
        maxLength="40"
        className="popup__input popup__input_text_name"
      />
      <span className="input-name-error popup__error"></span>
      <input
        onChange={handleChangeDescription}
        value={description}
        id="input-bio"
        name="bio-profile"
        type="text"
        placeholder="О себе"
        required
        minLength="2"
        maxLength="200"
        className="popup__input popup__input_text_bio"
      />
      <span className="input-bio-error popup__error"></span>
    </PopupWithForm>
  );
}

export default EditProfilePopup;
