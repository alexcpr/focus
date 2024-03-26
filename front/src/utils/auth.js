async function isLoggedIn() {
  const token = localStorage.getItem("token");
  if (!token) return false;

  try {
    const response = await fetch("/verify", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ token })
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

export { isLoggedIn };
