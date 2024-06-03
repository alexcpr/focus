import React, { useState, useEffect } from "react";
import { isLoggedIn } from "./utils/auth";

function Account() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [messages, setMessages] = useState([]);
  const [comments, setComments] = useState([]);
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

  const fetchComments = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch("/getcomments", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setComments(data);
        setView("comments");
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
          <button onClick={fetchComments}>Commentaires postés</button>
          <button onClick={() => setView("changePassword")}>
            Modifier votre mot de passe
          </button>
          <button className="delete">Supprimer votre compte</button>
        </>
      ) : view === "messages" ? (
        <MessagesPage messages={messages} setView={setView} toast={toast} setToast={setToast} setMessages={setMessages}/>
      ) : view === "comments" ? (
        <CommentsPage
          comments={comments}
          setView={setView}
          toast={toast}
          setToast={setToast}
          setComments={setComments}
        />
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

function MessagesPage({ messages, setView, toast, setToast, setMessages }) {
  const deleteMessage = async (messageId) => {
    try {
      const headers = {};

      const token = localStorage.getItem("token");
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }
      const response = await fetch(`/deletemessage/${messageId}`, {
        method: "DELETE",
        headers: headers,
      });
      const data = await response.json();
      if (response.ok) {
        const updatedMessages = messages.filter(
          (message) => message.id !== messageId
        );
        setMessages(updatedMessages);
        setToast({
          show: true,
          type: "success",
          message: data.message,
        });
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

  return (
    <>
      <h1>Messages envoyés</h1>
      <div id="toast" className={`${toast.show ? "show" : ""} ${toast.type}`}>
        <strong>{toast.type === "danger" ? "Erreur: " : "Succès: "}</strong>
        {toast.message.split("\n").map((line, index) => (
          <div key={index}>{line}</div>
        ))}
      </div>
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
                <th>Date</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {messages.map((message) => (
                <tr key={message.id}>
                  <td>{message.name}</td>
                  <td>{message.email}</td>
                  <td>{message.message}</td>
                  <td>{formatDate(message.created_at)}</td>
                  <td>
                    <button
                      className="delete"
                      onClick={() => deleteMessage(message.id)}
                    >
                      🗑️
                    </button>
                  </td>
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

function formatDate(dateString) {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-indexed
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${day}/${month}/${year} à ${hours}h${minutes}`;
}

function CommentsPage({ comments, setView, toast, setToast, setComments }) {
  const deleteComment = async (commentId) => {
    try {
      const headers = {};

      const token = localStorage.getItem("token");
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }
      const response = await fetch(`/gallery/comments/${commentId}`, {
        method: "DELETE",
        headers: headers,
      });
      const data = await response.json();
      if (response.ok) {
        const updatedComments = comments.filter(
          (comment) => comment.id !== commentId
        );
        setComments(updatedComments);
        setToast({
          show: true,
          type: "success",
          message: data.message,
        });
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

  return (
    <>
      <h1>Commentaires postés</h1>
      <div id="toast" className={`${toast.show ? "show" : ""} ${toast.type}`}>
        <strong>{toast.type === "danger" ? "Erreur: " : "Succès: "}</strong>
        {toast.message.split("\n").map((line, index) => (
          <div key={index}>{line}</div>
        ))}
      </div>
      <div className="comments-page">
        <button className="backBtn" onClick={() => setView("account")}>
          Retour
        </button>
        {comments.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>Image</th>
                <th>Commentaire</th>
                <th>Date</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {comments.map((comment) => (
                <tr key={comment.id}>
                  <td>
                    <a
                      href={`${window.location.origin}/#/gallery/${comment.image_id}`}
                    >
                      Voir
                    </a>
                  </td>
                  <td>{comment.text}</td>
                  <td>{formatDate(comment.created_at)}</td>
                  <td>
                    <button
                      className="delete"
                      onClick={() => deleteComment(comment.id)}
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>Vous n'avez posté aucun commentaire.</p>
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
