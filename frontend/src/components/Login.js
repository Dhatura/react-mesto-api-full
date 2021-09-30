import React from "react";
import { withRouter } from "react-router-dom";

function Login({ onLogin }) {
  const [values, setValues] = React.useState({
    email: "",
    password: "",
  });

  function handleChange(evt) {
    const { name, value } = evt.target;
    setValues({ ...values, [name]: value });
  }

  function handleSubmit(evt) {
    evt.preventDefault();
    onLogin(values);
  }

  return (
    <section className="sign root__container">
      <h3 className="sign__title">Вход</h3>
      <form
        className="sign__form"
        name="formSignIn"
        onSubmit={handleSubmit}
        noValidate
      >
        <input
          id="sign-email"
          type="email"
          name="email"
          value={values.email}
          className="sign__input"
          placeholder="Email"
          required
          onChange={handleChange}
        />
        <span className="sign-email-error sign__input-error" />
        <input
          id="sign-password"
          type="password"
          name="password"
          value={values.password}
          className="sign__input"
          placeholder="Пароль"
          required
          onChange={handleChange}
        />
        <span className="sign-password-error sign__input-error" />
        <button type="submit" className="sign__button">
          Войти
        </button>
      </form>
    </section>
  );
}

export default withRouter(Login);
