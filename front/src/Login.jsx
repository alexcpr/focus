import React, { useState, useEffect } from "react";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [toast, setToast] = useState({
    show: false,
    type: "",
    message: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
      if (response.ok) {
        const { token } = await response.json();
        localStorage.setItem("token", token);
        setToast({
          show: true,
          type: "success",
          message:
            "Connexion réussie.\nVous allez être redirigé vers la page compte.",
        });
        setTimeout(() => {
          window.location.hash = "#/account";
        }, 3000);
      } else {
        const message = await response.json();
        setToast({
          show: true,
          type: "danger",
          message: message.error,
        });
      }
    } catch (error) {
      setToast({
        show: true,
        type: "danger",
        message: "Une erreur s'est produite : " + error.message,
      });
    }
  };

  useEffect(() => {
    if (toast.show) {
      const timer = setTimeout(() => {
        setToast({ ...toast, show: false });
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [toast]);

  return (
    <section className="login">
      <h1>Connexion</h1>
      <div id="toast" className={`${toast.show ? "show" : ""} ${toast.type}`}>
        <strong>{toast.type === "danger" ? "Erreur: " : "Succès: "}</strong>
        {toast.message.split("\n").map((line, index) => (
          <div key={index}>{line}</div>
        ))}
      </div>
      <form className="login-form" onSubmit={handleSubmit}>
        <FormGroup
          label="E-mail"
          id="email"
          name="email"
          type="email"
          required={true}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <FormGroup
          label="Mot de passe"
          id="password"
          name="password"
          type="password"
          required={true}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Connexion</button>
      </form>
    </section>
  );
}

const FormGroup = ({
  label,
  id,
  name,
  type,
  required,
  value,
  onChange,
  rows,
}) => {
  return (
    <div className="form-group">
      <label htmlFor={id}>{label}</label>
      {type === "textarea" ? (
        <textarea
          id={id}
          name={name}
          required={required}
          rows={rows}
          value={value}
          onChange={onChange}
        ></textarea>
      ) : (
        <input
          type={type}
          id={id}
          name={name}
          required={required}
          value={value}
          onChange={onChange}
        />
      )}
    </div>
  );
};

export default Login;
