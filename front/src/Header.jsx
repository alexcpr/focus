import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { RxHamburgerMenu } from "react-icons/rx";
import { FaHome, FaRegUser } from "react-icons/fa";
import { IoMdPhotos, IoMdClose } from "react-icons/io";
import { GrContact, GrLogin } from "react-icons/gr";
import { SlLogout } from "react-icons/sl";
import logo from "./assets/img/logo.png";
import { isLoggedIn, checkAdmin } from "./utils/auth";

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
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

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
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
      <HeaderLogo />
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
      </NavMenu>
      <BurgerMenuIcon isMenuOpen={isMenuOpen} toggleMenu={toggleMenu} />
    </header>
  );
}

function HeaderLogo() {
  return (
    <a href="/#/">
      <img className="logo" src={logo} alt="Focus logo" />
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
