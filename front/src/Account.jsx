// Account.js
import React, { useState, useEffect } from "react";
import { isLoggedIn } from "./utils/auth";

function Account() {
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    async function checkLoginStatus() {
      const isLoggedInValue = await isLoggedIn();
      setLoggedIn(isLoggedInValue);
      if (!isLoggedInValue) {
        window.location.hash = "#/login";
      }
    }
    checkLoginStatus();
  }, []);

  if (!loggedIn) {
    return null;
  }

  return (
    <section className="account">
      <h1>Compte</h1>
      <p>Contenu de la page de compte...</p>
    </section>
  );
}

export default Account;
