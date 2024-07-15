/* global PayPal */

import React, { useEffect, useState } from "react";
import logo from "./assets/img/logo.png";

function Footer() {
  const [theme, setTheme] = useState(
    document.documentElement.getAttribute("data-theme") || "light"
  );
  
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

  useEffect(() => {
    PayPal.Donation.Button({
      env: "production",
      hosted_button_id: "S7SCYRQM8PY4N",
      image: {
        src: "https://www.paypalobjects.com/fr_FR/FR/i/btn/btn_donate_LG.gif",
        alt: "Bouton Faites un don avec PayPal",
        title: "PayPal - The safer, easier way to pay online!",
      },
    }).render("#donate-button");
  }, []);
  return (
    <footer>
      <FooterHeader theme={theme} />
      <FooterContent />
      <FooterSeparator />
      <FooterBottom />
    </footer>
  );
}

function FooterHeader({ theme }) {
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

function FooterContent() {
  const handleLegalClick = (e) => {
    e.preventDefault();

    window.location.href = `#/legal`;
    setTimeout(() => {
      window.scrollTo(0, 0);
    }, 1);
  };
  return (
    <div className="footer-container">
      <div className="grid-item">
        {/* <p>C'est du lard.</p> */}
        <DonateButton />
      </div>
      <div className="grid-item">
        <span>Legal</span>
        <a href="/#/legal" onClick={handleLegalClick}>
          Mentions Légales
        </a>
      </div>
      <div className="grid-item">
        <span>Contact</span>
        <a href="mailto:focus@alexandrecipor.com">E-mail</a>
        <a href="https://instagram.com/aleksshrv.art">Instagram</a>
        <a href="https://github.com/alexcpr/focus/issues">GitHub</a>
      </div>
    </div>
  );
}

function FooterSeparator() {
  return <div className="footer-separator"></div>;
}

function FooterBottom() {
  return (
    <div className="footer-bottom">
      <p>
        Fait par{" "}
        <a href="https://alexandrecipor.com" target="_blank">
          Alexandre CIPOR
        </a>{" "}
        avec <span className="heart">❤</span>
      </p>
      <small>© 2024 Focus. Tous droits reservés.</small>
    </div>
  );
}

function DonateButton() {
  return (
    <div id="donate-button-container">
      <div className="donate-button" id="donate-button"></div>
    </div>
  );
}

export default Footer;
