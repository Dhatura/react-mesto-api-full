import React from "react";
import Card from "./Card";
import { CurrentUserContext } from "../contexts/CurrentUserContext";

function Main({
  onEditAvatar,
  onEditProfile,
  onAddPlace,
  onCardClick,
  onCardLike,
  onCardDelete,
  cards,
}) {
  const currentUser = React.useContext(CurrentUserContext);

  return (
    <main>
      <section className="profile root__container">
        <div className="profile__content">
          <div className="profile__avatar-block">
            <div
              className="profile__avatar-overlay"
              onClick={onEditAvatar}
            ></div>
            <img
              src={currentUser.avatar}
              alt="Аватар"
              className="profile__avatar"
            />
          </div>
          <div className="profile__info">
            <div className="profile__container">
              <h1 className="profile__name">{currentUser.name}</h1>
              <button
                type="button"
                aria-label="Редактировать профиль"
                className="profile__edit-button"
                onClick={onEditProfile}
              ></button>
            </div>
            <p className="profile__vocation">{currentUser.about}</p>
          </div>
        </div>
        <button
          type="button"
          aria-label="Добавить фото"
          className="profile__add-button"
          onClick={onAddPlace}
        ></button>
      </section>

      <section className="cards root__container">
        <ul className="cards__grid">
          {cards.map((item) => (
            <Card
              key={item._id}
              card={item}
              onCardClick={onCardClick}
              onCardLike={onCardLike}
              onCardDelete={onCardDelete}
            />
          ))}
        </ul>
      </section>
    </main>
  );
}

export default Main;
