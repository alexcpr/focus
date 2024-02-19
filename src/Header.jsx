import { useState } from "react";
import { RxHamburgerMenu } from "react-icons/rx";
import { FaHome, FaRegUser } from "react-icons/fa";
import { IoMdPhotos, IoMdClose } from "react-icons/io";
import { GrContact } from "react-icons/gr";
import logo from "./assets/img/logo.png";

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
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
        <HeaderLink
          url="/#/account"
          text="Compte"
          icon={FaRegUser}
          onClick={toggleMenu}
        />
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
