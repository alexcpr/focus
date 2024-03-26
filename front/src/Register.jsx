import React, { useState } from "react";

function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
      if (response.ok) {
        const { token } = await response.json();
        localStorage.setItem("token", token);
        window.location.hash = "#/account";
      } else {
        // inscription échouée
      }
    } catch (error) {
      console.error("Une erreur s'est produite :", error);
    }
  };

  return (
    <section className="register">
      <h1>Inscription</h1>
      <form className="register-form" onSubmit={handleSubmit}>
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
        <button type="submit">Valider</button>
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

export default Register;
