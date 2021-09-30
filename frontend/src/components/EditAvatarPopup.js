import React from "react";
import PopupWithForm from "./PopupWithForm";

function EditAvatarPopup({
  isOpen,
  onClose,
  handleClickOverlayClose,
  onUpdateAvatar,
}) {
  const avatarRef = React.useRef();

  function handleSubmit(e) {
    e.preventDefault();

    onUpdateAvatar({
      avatar: avatarRef.current.value,
    });
  }

  React.useEffect(() => {
    if (!isOpen) {
      avatarRef.current.value = "";
    }
  }, [isOpen]);

  return (
    <PopupWithForm
      title="Обновить аватар"
      name="edit-avatar"
      buttonText="Сохранить"
      isOpen={isOpen}
      onClose={onClose}
      handleClickOverlayClose={handleClickOverlayClose}
      onSubmit={handleSubmit}
    >
      <input
        id="input-link-avatar"
        name="link"
        type="url"
        placeholder="Ссылка на аватар"
        required
        className="popup__input popup__input_text_link-avatar"
        ref={avatarRef}
      />
      <span className="input-link-avatar-error popup__error"></span>
    </PopupWithForm>
  );
}

export default EditAvatarPopup;
