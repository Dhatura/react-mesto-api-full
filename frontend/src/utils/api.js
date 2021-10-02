class Api {
  constructor(options) {
    this._baseUrl = options.baseUrl;
    this._headers = options.headers;
  }

  _getResponseData(res) {
    if (res.ok) return res.json();
    else return Promise.reject(`Ошибка: ${res.status} ${res.statusText}`);
  }

  //загружаем инофрмацию о пользователе с сервера
  getCurrentUserInfo() {
    return fetch(`${this._baseUrl}/users/me`, {
      credentials: "include",
      method: "GET",
      headers: {
        "Authorization": `Bearer ${localStorage.getItem('token')}`,
      }
    }).then((res) => {
      return this._getResponseData(res);
    });
  }

  //загружаем карточки с сервера
  getCardsInfo() {
    return fetch(`${this._baseUrl}/cards`, {
      credentials: "include",
      method: "GET",
      headers: {
        "Authorization": `Bearer ${localStorage.getItem('token')}`,
      }
    }).then((res) => {
      return this._getResponseData(res);
    });
  }

  //меняем данные профиля на сервере и возвращаем данные профиля
  editUserProfile({ name, about }) {
    return fetch(`${this._baseUrl}/users/me`, {
      credentials: "include",
      method: "PATCH",
      headers: {
        "Authorization": `Bearer ${localStorage.getItem('token')}`,
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
    return fetch(`${this._baseUrl}/cards`, {
      credentials: "include",
      method: "POST",
      headers: {
        "Authorization": `Bearer ${localStorage.getItem('token')}`,
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
    return fetch(`${this._baseUrl}/cards/${cardId}`, {
      credentials: "include",
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${localStorage.getItem('token')}`,
      },
    }).then((res) => {
      return this._getResponseData(res);
    });
  }

  // Постановка и снятие лайка
  changeLikeCardStatus(cardId, isLiked) {
    return fetch(
      `${this._baseUrl}/cards/${cardId}/likes`,
      {
        credentials: "include",
        method: isLiked ? "DELETE" : "PUT",
        headers: {
          "Authorization": `Bearer ${localStorage.getItem('token')}`
        },
      }).then((res) => {
      return this._getResponseData(res);
    });
  }

  //обновляем аватар пользователя
  updateAvatar({ avatar }) {
    return fetch(`${this._baseUrl}/users/me/avatar`, {
      credentials: "include",
      method: "PATCH",
      headers: {
        "Authorization": `Bearer ${localStorage.getItem('token')}`,
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
  baseUrl: "https://api.mesto-datura.students.nomoredomains.club",
  headers: {
    "Content-Type": "application/json"
  }
});
export default api;
