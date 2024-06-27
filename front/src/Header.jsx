import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { RxHamburgerMenu } from "react-icons/rx";
import { FaHome, FaRegUser, FaSun, FaMoon } from "react-icons/fa";
import { IoMdPhotos, IoMdClose } from "react-icons/io";
import { GrContact, GrLogin } from "react-icons/gr";
import { SlLogout } from "react-icons/sl";
import logo from "./assets/img/logo.png";
import { isLoggedIn, checkAdmin } from "./utils/auth";

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
  const [isDarkMode, setIsDarkMode] = useState(theme === "dark");
  const location = useLocation();

  useEffect(() => {
    const fetchData = async () => {
      const isLoggedInValue = await isLoggedIn();
      setLoggedIn(isLoggedInValue);
      if (isLoggedInValue) {
        const isAdminValue = await fetchAdminStatus();
        setIsAdmin(isAdminValue);
      }
    };
    fetchData();
  }, [location]);

  useEffect(() => {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (
          mutation.type === "attributes" &&
          mutation.attributeName === "data-theme"
        ) {
          setTheme(document.documentElement.getAttribute("data-theme"));
        }
      });
    });

    const storedTheme = localStorage.getItem("theme");
    if (storedTheme === "dark") {
      setTheme("dark");
      document.documentElement.setAttribute("data-theme", "dark");
    }

    observer.observe(document.documentElement, { attributes: true });

    return () => observer.disconnect();
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleTheme = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    localStorage.setItem("theme", newMode ? "dark" : "light");
    document.documentElement.setAttribute(
      "data-theme",
      newMode ? "dark" : "light"
    );
  };

  const handleLogout = () => {
    setIsMenuOpen(!isMenuOpen);
    localStorage.removeItem("token");
    localStorage.removeItem("tokenadmin");
    window.location.hash = "#/login";
  };

  const fetchAdminStatus = async () => {
    const isAdminValue = await checkAdmin();
    return isAdminValue;
  };

  return (
    <header>
      <HeaderLogo theme={theme} />
      <NavMenu isMenuOpen={isMenuOpen}>
        <HeaderLink
          url="/#/"
          text="Accueil"
          icon={FaHome}
          onClick={toggleMenu}
        />
        <HeaderLink
          url="/#/gallery"
          text="Galerie"
          icon={IoMdPhotos}
          onClick={toggleMenu}
        />
        {loggedIn && (
          <>
            <HeaderLink
              url="/#/account"
              text="Compte"
              icon={FaRegUser}
              onClick={toggleMenu}
            />
            {isAdmin && (
              <HeaderLink
                url="/#/admin"
                text="Admin"
                icon={FaRegUser}
                onClick={toggleMenu}
              />
            )}
            <HeaderLink
              url={null}
              text="Déconnexion"
              icon={SlLogout}
              onClick={handleLogout}
            />
          </>
        )}
        {!loggedIn && (
          <>
            <HeaderLink
              url="/#/login"
              text="Connexion"
              icon={GrLogin}
              onClick={toggleMenu}
            />
            <HeaderLink
              url="/#/register"
              text="Inscription"
              icon={GrLogin}
              onClick={toggleMenu}
            />
          </>
        )}
        <HeaderLink
          url="/#/contact"
          text="Contact"
          icon={GrContact}
          onClick={toggleMenu}
        />
        <label className="theme-toggle">
          <input
            type="checkbox"
            checked={isDarkMode}
            onChange={toggleTheme}
            onClick={toggleMenu}
            aria-label="Toggle Theme"
          />
          <div className="slider">
            <div className="slider-icon">
              {isDarkMode ? (
                <FaMoon className="icon" />
              ) : (
                <FaSun className="icon" />
              )}
            </div>
          </div>
        </label>
      </NavMenu>
      <BurgerMenuIcon isMenuOpen={isMenuOpen} toggleMenu={toggleMenu} />
    </header>
  );
}

function HeaderLogo({ theme }) {
  return (
    <a href="/#/">
      <img
        className="logo"
        src={logo}
        alt="Focus logo"
        style={{ filter: theme === "dark" ? "invert(1)" : "none" }}
      />
      <h1>Focus</h1>
    </a>
  );
}

function NavMenu({ isMenuOpen, children }) {
  return (
    <nav className={`links${isMenuOpen ? " menu-open" : ""}`}>{children}</nav>
  );
}

function HeaderLink({ url, text, icon: Icon, onClick }) {
  const handleClick = () => {
    if (onClick) {
      onClick();
    }
  };

  return (
    <a href={url} onClick={handleClick}>
      {Icon && <Icon />}
      {text}
    </a>
  );
}

function BurgerMenuIcon({ isMenuOpen, toggleMenu }) {
  return (
    <>
      <div
        className={`burger-menu ${isMenuOpen ? "hidden" : "visible"}`}
        onClick={toggleMenu}
      >
        <RxHamburgerMenu />
      </div>
      <div
        className={`burger-menu ${isMenuOpen ? "visible" : "hidden"}`}
        onClick={toggleMenu}
      >
        <IoMdClose />
      </div>
    </>
  );
}

export default Header;
