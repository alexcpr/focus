/* global PayPal */

import React, { useEffect } from "react";
import logo from "./assets/img/logo.png";

function Footer() {
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
      <FooterHeader />
      <FooterContent />
      <FooterSeparator />
      <FooterBottom />
    </footer>
  );
}

function FooterHeader() {
  return (
    <a href="/#/">
      <img className="logo" src={logo} alt="Focus logo" />
      <h1>Focus</h1>
    </a>
  );
}

function FooterContent() {
  return (
    <div className="footer-container">
      <div className="grid-item">
        {/* <p>C'est du lard.</p> */}
        <DonateButton />
      </div>
      <div className="grid-item">
        <span>LEGAL</span>
        <a href="#">Privacy</a>
        <a href="#">Terms</a>
        <a href="#">Cookies</a>
      </div>
      <div className="grid-item">
        <span>Contact</span>
        <a href="/#/contact">E-mail</a>
        <a href="https://instagram.com/aleksshrv.art">Instagram</a>
        <a href="https://github.com/alexcpr/focus">GitHub</a>
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
