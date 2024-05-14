import React, { useState, useEffect } from "react";

function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [toast, setToast] = useState({
    show: false,
    type: "",
    message: "",
  });

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch("/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setToast({
          show: true,
          type: "success",
          message: "Message envoyé avec succès",
        });
        setFormData({
          name: "",
          email: "",
          message: "",
        });
      } else {
        setToast({
          show: true,
          type: "danger",
          message: "Erreur lors de l'envoie du message",
        });
      }
    } catch (error) {
      setToast({
        show: true,
        type: "danger",
        message: "Erreur lors de l'envoie du message : " + error.message,
      });
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
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
    <section className="contact">
      <h1>Contact</h1>
      <div id="toast" className={`${toast.show ? "show" : ""} ${toast.type}`}>
        <strong>{toast.type === "danger" ? "Erreur: " : "Succès: "}</strong>
        {toast.message}
      </div>
      <form className="contact-form" onSubmit={handleSubmit}>
        <FormGroup
          label="Nom"
          id="name"
          name="name"
          type="text"
          value={formData.name}
          onChange={handleChange}
          required={true}
        />
        <FormGroup
          label="E-mail"
          id="email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          required={true}
        />
        <FormGroup
          label="Message"
          id="message"
          name="message"
          type="textarea"
          value={formData.message}
          onChange={handleChange}
          required={true}
          rows={10}
        />
        <button type="submit">Envoyer</button>
      </form>
    </section>
  );
}

const FormGroup = ({
  label,
  id,
  name,
  type,
  value,
  onChange,
  required,
  rows,
}) => {
  return (
    <div className="form-group">
      <label htmlFor={id}>{label}</label>
      {type === "textarea" ? (
        <textarea
          id={id}
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          rows={rows}
        ></textarea>
      ) : (
        <input
          type={type}
          id={id}
          name={name}
          value={value}
          onChange={onChange}
          required={required}
        />
      )}
    </div>
  );
};

export default Contact;
