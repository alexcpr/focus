async function isLoggedIn() {
  const token = localStorage.getItem("token");
  if (!token) return false;

  try {
    const response = await fetch("/verify", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token }),
    });
    if (response.ok) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error(
      "Erreur lors de la vérification de l'authentification :",
      error
    );
    return false;
  }
}

async function isAdminLoggedIn() {
  const token = localStorage.getItem("tokenadmin");
  if (!token) return false;

  try {
    const response = await fetch("/verifyadmin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token }),
    });
    if (response.ok) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error(
      "Erreur lors de la vérification de l'authentification :",
      error
    );
    return false;
  }
}

async function decodeToken(token) {
  try {
    const payload = token.split(".")[1];
    return JSON.parse(atob(payload));
  } catch (error) {
    console.error("Erreur lors du décodage du token JWT :", error);
    return null;
  }
}

async function checkAdmin() {
  const token = localStorage.getItem("token");
  if (!token) return false;

  try {
    const decodedToken = await decodeToken(token);
    return decodedToken && decodedToken.hKhDTg2rpde1SaDVm8CKBhjDb2jIXqIE === 1;
  } catch (error) {
    console.error(
      "Erreur lors de la vérification du statut administrateur :",
      error
    );
    return false;
  }
}

export { isLoggedIn, isAdminLoggedIn, checkAdmin, decodeToken };
