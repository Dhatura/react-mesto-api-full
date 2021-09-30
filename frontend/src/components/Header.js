import React from "react";
import { Link, Route } from "react-router-dom";
import HeaderLogo from "../images/header-logo.svg";

function Header({ onSignOut, email }) {
  const [isMenuOpen, setMenuOpen] = React.useState(false);

  function handleMenuClick() {
    setMenuOpen(!isMenuOpen);
  }

  return (
    <header className="header">
      <div
        className={`header__menu ${
          isMenuOpen ? "header__menu_block-information" : ""
        }`}
      >
        <img
          src={HeaderLogo}
          alt="Места России"
          className={`header__logo ${
            isMenuOpen ? "header__logo_block-information" : ""
          }`}
        />

        <Route exact path="/">
          <div
            className={`header__burger-menu ${
              isMenuOpen ? "header__burger-menu_close" : ""
            }`}
            onClick={handleMenuClick}
          >
            <span></span>
            <span></span>
            <span></span>
          </div>
          <div
            className={`header__info ${
              isMenuOpen ? "header__info_block-information" : ""
            }`}
          >
            <p className="header__email">{email}</p>
            <Link
              to="/sign-in"
              className="header__logout"
              onClick={() => {
                onSignOut();
                handleMenuClick();
              }}
            >
              Выйти
            </Link>
          </div>
        </Route>

        <Route path="/sign-in">
          <div className="header__entrance-container">
            <Link to="/sign-up" className="header__entrance">
              Регистрация
            </Link>
          </div>
        </Route>

        <Route path="/sign-up">
          <div className="header__entrance-container">
            <Link to="/sign-in" className="header__entrance">
              Войти
            </Link>
          </div>
        </Route>
      </div>
    </header>
  );
}

export default Header;
