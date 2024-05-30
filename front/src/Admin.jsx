import React, { useState, useEffect } from "react";
import { isLoggedIn, isAdminLoggedIn } from "./utils/auth";
import AdminPanel from "./AdminPanel";

function Admin() {
  const [password, setPassword] = useState("");
  const [toast, setToast] = useState({
    show: false,
    type: "",
    message: "",
  });
  const [isAdmin, setIsAdmin] = useState(null);

  useEffect(() => {
    const verifyAdmin = async () => {
      const loggedIn = await isLoggedIn();
      if (!loggedIn) {
        window.location.hash = "#/login";
        return;
      }
      const adminStatus = await isAdminLoggedIn();
      setIsAdmin(adminStatus);
    };

    verifyAdmin();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("/loginadmin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ password }),
      });
      if (response.ok) {
        const { token } = await response.json();
        localStorage.setItem("tokenadmin", token);
        setToast({
          show: true,
          type: "success",
          message:
            "Connexion administrateur réussie.\nRedirection vers le panel.",
        });
        setTimeout(() => {
          window.location.reload();
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

  if (isAdmin === null) {
    return;
  }

  if (!isAdmin) {
    return (
      <section className="login">
        <h1>Connexion Administrateur</h1>
        <div id="toast" className={`${toast.show ? "show" : ""} ${toast.type}`}>
          <strong>{toast.type === "danger" ? "Erreur: " : "Succès: "}</strong>
          {toast.message.split("\n").map((line, index) => (
            <div key={index}>{line}</div>
          ))}
        </div>
        <form className="login-form" onSubmit={handleSubmit}>
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

  return <AdminPanel setToast={setToast} toast={toast} />;
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

export default Admin;
