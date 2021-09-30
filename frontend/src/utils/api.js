class Api {
  constructor({ serverAdress, cohortId, token }) {
    this._serverAdress = serverAdress;
    this._cohortId = cohortId;
    this._token = token;
  }

  _getResponseData(res) {
    if (res.ok) return res.json();
    else return Promise.reject(`Ошибка: ${res.status} ${res.statusText}`);
  }

  //загружаем инофрмацию о пользователе с сервера
  getCurrentUserInfo() {
    return fetch(`${this._serverAdress}/${this._cohortId}/users/me`, {
      headers: {
        authorization: this._token,
      },
    }).then((res) => {
      return this._getResponseData(res);
    });
  }

  //загружаем карточки с сервера
  getCardsInfo() {
    return fetch(`${this._serverAdress}/${this._cohortId}/cards`, {
      headers: {
        authorization: this._token,
      },
    }).then((res) => {
      return this._getResponseData(res);
    });
  }

  //меняем данные профиля на сервере и возвращаем данные профиля
  editUserProfile({ name, about }) {
    return fetch(`${this._serverAdress}/${this._cohortId}/users/me`, {
      method: "PATCH",
      headers: {
        authorization: this._token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: name,
        about: about,
      }),
    }).then((res) => {
      return this._getResponseData(res);
    });
  }

  //добавляем карточку на сервер и возвращаем ответ
  addNewCard({ name, link }) {
    return fetch(`${this._serverAdress}/${this._cohortId}/cards`, {
      method: "POST",
      headers: {
        authorization: this._token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: name,
        link: link,
      }),
    }).then((res) => {
      return this._getResponseData(res);
    });
  }

  //удаляем карточку
  deleteCard(cardId) {
    return fetch(`${this._serverAdress}/${this._cohortId}/cards/${cardId}`, {
      method: "DELETE",
      headers: {
        authorization: this._token,
      },
    }).then((res) => {
      return this._getResponseData(res);
    });
  }

  // Постановка и снятие лайка
  changeLikeCardStatus(cardId, isLiked) {
    return fetch(
      `${this._serverAdress}/${this._cohortId}/cards/likes/${cardId}`,
      {
        method: isLiked ? "DELETE" : "PUT",
        headers: {
          authorization: this._token,
        },
      }
    ).then((res) => {
      return this._getResponseData(res);
    });
  }

  //обновляем аватар пользователя
  updateAvatar({ avatar }) {
    return fetch(`${this._serverAdress}/${this._cohortId}/users/me/avatar`, {
      method: "PATCH",
      headers: {
        authorization: this._token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        avatar: avatar,
      }),
    }).then((res) => {
      return this._getResponseData(res);
    });
  }
}

const api = new Api({
  serverAdress: "https://nomoreparties.co/v1",
  cohortId: "cohort-25",
  token: "63e4bf39-1bd7-4fd2-aabc-671c31ffa94b",
});
export default api;
