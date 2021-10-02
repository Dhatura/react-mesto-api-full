import React from "react";
import { Route, Switch, useHistory } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import Main from "./Main";
import ImagePopup from "./ImagePopup";
import EditProfilePopup from "./EditProfilePopup";
import EditAvatarPopup from "./EditAvatarPopup";
import AddPlacePopup from "./AddPlacePopup";
import InfoTooltip from "./InfoTooltip";
import ProtectedRoute from "./ProtectedRoute";
import IconConfirm from "../images/IconConfirm.svg";
import IconRefusal from "../images/IconRefusal.svg";
import Register from "./Register.js";
import Login from "./Login.js";
import * as auth from "../utils/auth";

import { CurrentUserContext } from "../contexts/CurrentUserContext";
import api from "../utils/api";

function App() {
  const [isEditProfilePopupOpen, setEditProfilePopupOpen] = React.useState(false);
  const [isEditAvatarPopupOpen, setEditAvatarPopupOpen] = React.useState(false);
  const [isAddPlacePopupOpen, setAddPlacePopupOpen] = React.useState(false);
  const [isInfoTooltipOpen, setInfoTooltipOpen] = React.useState(false);
  const [selectedCard, setSelectedCard] = React.useState({});
  const [currentUser, setCurrentUser] = React.useState({});
  const [cards, setCards] = React.useState([]);
  const [status, setStatus] = React.useState("");
  const [loggedIn, setLoggedIn] = React.useState(false);
  const [email, setEmail] = React.useState("");
  const [infoTooltipIcon, setInfoTooltipIcon] = React.useState("");
  const history = useHistory();

  React.useEffect(() => {
    if (localStorage.getItem("token")) api.getCurrentUserInfo()
    .then(() => setLoggedIn(true))
  }, []);

  React.useEffect(() => {
    if (loggedIn) {
      Promise.all([api.getCurrentUserInfo(), api.getCardsInfo()])
        .then(([userData, data]) => {
          setCurrentUser(userData);
          setEmail(userData.email);
          setCards(data);
          history.push("/");
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [loggedIn, history]);

  function handleCardClick(card) {
    setSelectedCard(card);
  }

  function handleEditProfileClick() {
    setEditProfilePopupOpen(true);
  }

  function handleEditAvatarClick() {
    setEditAvatarPopupOpen(true);
  }

  function handleAddPlaceClick() {
    setAddPlacePopupOpen(true);
  }

  function closeAllPopups() {
    setEditAvatarPopupOpen(false);
    setEditProfilePopupOpen(false);
    setAddPlacePopupOpen(false);
    setSelectedCard({});
    setInfoTooltipOpen(false);
    setInfoTooltipIcon("");
    setStatus("");
  }

  function handleOverlayClose(evt) {
    if (evt.target === evt.currentTarget) {
      closeAllPopups();
    }
  }

  function handleCardLike(card) {
    const isLiked = card.likes.some((i) => i._id === currentUser._id);

    api
      .changeLikeCardStatus(card._id, isLiked)
      .then((newCard) => {
        setCards((state) =>
          state.map((c) => (c._id === card._id ? newCard : c))
        );
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function handleCardDelete(card) {
    api
      .deleteCard(card._id)
      .then(() => {
        setCards((state) => state.filter((c) => c._id !== card._id));
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function handleUpdateUser({ name, about }) {
    api
      .editUserProfile({ name, about })
      .then((res) => {
        setCurrentUser(res);
        closeAllPopups();
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function handleUpdateAvatar({ avatar }) {
    api
      .updateAvatar({ avatar })
      .then((res) => {
        setCurrentUser(res);
        closeAllPopups();
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function handleAddPlaceSubmit({ name, link }) {
    api
      .addNewCard({ name, link })
      .then((newCard) => {
        setCards([newCard, ...cards]);
        closeAllPopups();
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function handleRegister(data) {
    auth
      .register(data)
      .then(() => {
        setStatus("Вы успешно зарегистрировались!");
        setInfoTooltipOpen(true);
        setInfoTooltipIcon(IconConfirm);
        history.push("/signin");
      })
      .catch((err) => {
        setStatus(`Что-то пошло не так!\nПопробуйте ещё раз.`);
        setInfoTooltipOpen(true);
        setInfoTooltipIcon(IconRefusal);
        if (err === 400) {
          console.log(`Ошибка: ${err} - Некорректно заполнено одно из полей`);
        }
      });
  }

  function handleLogin(data) {
    auth
      .login(data)
      .then((res) => {
        if (res.token) {
          localStorage.setItem("token", res.token);
          setEmail(data.email);
          setLoggedIn(true);
          history.push("/");
        }
      })
      .catch((err) => {
        setStatus(`Что-то пошло не так!\nПопробуйте ещё раз.`);
        setInfoTooltipOpen(true);
        setInfoTooltipIcon(IconRefusal);
        if (err === 400) {
          console.log(`Ошибка: ${err} - Не передано одно из полей`);
        } else if (err === 401) {
          console.log(`Ошибка: ${err} - Пользователь с email не найден`);
        }
      });
  }

  function handleSignOut() {
    localStorage.removeItem("token");
    setLoggedIn(false);
    setEmail("");
    history.push("/signin");
  }

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <div className="root">
        <div className="root__container">
          <Header onSignOut={handleSignOut} email={email} />
          <Switch>
            <Route path="/signin">
              <Login onLogin={handleLogin} />
            </Route>

            <Route path="/signup">
              <Register onRegister={handleRegister} />
            </Route>

            <ProtectedRoute
              exact
              path="/"
              component={Main}
              loggedIn={loggedIn}
              onCardClick={handleCardClick}
              onEditProfile={handleEditProfileClick}
              onAddPlace={handleAddPlaceClick}
              onEditAvatar={handleEditAvatarClick}
              onCardLike={handleCardLike}
              onCardDelete={handleCardDelete}
              cards={cards}
            />
          </Switch>
          {loggedIn && <Footer />}

          {/* попап просмотра фотографии */}
          <ImagePopup
            card={selectedCard}
            onClose={closeAllPopups}
            handleClickOverlayClose={handleOverlayClose}
          />

          {/* попап редактирования профиля */}
          <EditProfilePopup
            isOpen={isEditProfilePopupOpen}
            onClose={closeAllPopups}
            handleClickOverlayClose={handleOverlayClose}
            onUpdateUser={handleUpdateUser}
          />

          {/* попап добавления карточки */}
          <AddPlacePopup
            isOpen={isAddPlacePopupOpen}
            onClose={closeAllPopups}
            handleClickOverlayClose={handleOverlayClose}
            onAddPlace={handleAddPlaceSubmit}
          />

          {/* попап обновления аватара */}
          <EditAvatarPopup
            isOpen={isEditAvatarPopupOpen}
            onClose={closeAllPopups}
            handleClickOverlayClose={handleOverlayClose}
            onUpdateAvatar={handleUpdateAvatar}
          />

          {/* попап статуса регистрации */}
          <InfoTooltip
            isOpen={isInfoTooltipOpen}
            onClose={closeAllPopups}
            handleClickOverlayClose={handleOverlayClose}
            icon={infoTooltipIcon}
            title={status}
          />
        </div>
      </div>
    </CurrentUserContext.Provider>
  );
}

export default App;
