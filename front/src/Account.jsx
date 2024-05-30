import React, { useState, useEffect } from "react";
import { isLoggedIn } from "./utils/auth";

function Account() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [messages, setMessages] = useState([]);
  const [toast, setToast] = useState({
    show: false,
    type: "",
    message: "",
  });
  const [view, setView] = useState("account");

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

  const fetchMessages = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch("/getmessages", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setMessages(data);
        setView("messages");
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
        message: error.message,
      });
    }
  };

  const changePassword = async (
    currentPassword,
    newPassword,
    confirmPassword
  ) => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch("/changepassword", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ currentPassword, newPassword, confirmPassword }),
      });
      const data = await response.json();
      if (response.ok) {
        setToast({
          show: true,
          type: "success",
          message: data.message,
        });
        setView("account");
      } else {
        setToast({
          show: true,
          type: "danger",
          message: data.error,
        });
      }
    } catch (error) {
      setToast({
        show: true,
        type: "danger",
        message: error.message,
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

  if (!loggedIn) {
    return null;
  }

  return (
    <section className="account">
      {view === "account" ? (
        <>
          <h1>Compte</h1>
          <div
            id="toast"
            className={`${toast.show ? "show" : ""} ${toast.type}`}
          >
            <strong>{toast.type === "danger" ? "Erreur: " : "Succès: "}</strong>
            {toast.message.split("\n").map((line, index) => (
              <div key={index}>{line}</div>
            ))}
          </div>
          <button onClick={fetchMessages}>Messages envoyés</button>
          <button onClick={() => setView("changePassword")}>
            Modifier votre mot de passe
          </button>
          <button className="delete">Supprimer votre compte</button>
        </>
      ) : view === "messages" ? (
        <MessagesPage messages={messages} setView={setView} />
      ) : (
        <ChangePasswordPage
          changePassword={changePassword}
          setView={setView}
          toast={toast}
          FormGroup={FormGroup}
        />
      )}
    </section>
  );
}

function MessagesPage({ messages, setView }) {
  return (
    <>
      <h1>Messages envoyés</h1>
      <div className="messages-page">
        <button className="backBtn" onClick={() => setView("account")}>
          Retour
        </button>
        {messages.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>Nom</th>
                <th>E-mail</th>
                <th>Message</th>
              </tr>
            </thead>
            <tbody>
              {messages.map((message) => (
                <tr key={message.id}>
                  <td>{message.name}</td>
                  <td>{message.email}</td>
                  <td>{message.message}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>Vous n'avez envoyé aucun message.</p>
        )}
      </div>
    </>
  );
}

function ChangePasswordPage({ changePassword, setView, toast, FormGroup }) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    changePassword(currentPassword, newPassword, confirmPassword);
  };

  return (
    <>
      <h1>Changer le mot de passe</h1>
      <div id="toast" className={`${toast.show ? "show" : ""} ${toast.type}`}>
        <strong>{toast.type === "danger" ? "Erreur: " : "Info: "}</strong>
        {toast.message.split("\n").map((line, index) => (
          <div key={index}>{line}</div>
        ))}
      </div>
      <button className="backBtn" onClick={() => setView("account")}>
        Retour
      </button>
      <form className="passwordChange" onSubmit={handleSubmit}>
        <FormGroup
          label="Mot de passe actuel"
          type="password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          required
        />
        <FormGroup
          label="Nouveau mot de passe"
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />
        <FormGroup
          label="Confirmer le nouveau mot de passe"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
        <button type="submit">Changer le mot de passe</button>
      </form>
    </>
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

export default Account;
