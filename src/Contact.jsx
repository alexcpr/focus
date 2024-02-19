import React from "react";

function Contact() {
  return (
    <section className="contact">
      <h1>Contact</h1>
      <ContactForm />
    </section>
  );
}

const ContactForm = () => {
  return (
    <form className="contact-form">
      <FormGroup
        label="Nom"
        id="name"
        name="name"
        type="text"
        required={true}
      />
      <FormGroup
        label="E-mail"
        id="email"
        name="email"
        type="email"
        required={true}
      />
      <FormGroup
        label="Message"
        id="message"
        name="message"
        type="textarea"
        required={true}
        rows={10}
      />
      <button type="submit">Envoyer</button>
    </form>
  );
};

const FormGroup = ({ label, id, name, type, required, rows }) => {
  return (
    <div className="form-group">
      <label htmlFor={id}>{label}</label>
      {type === "textarea" ? (
        <textarea
          id={id}
          name={name}
          required={required}
          rows={rows}
        ></textarea>
      ) : (
        <input type={type} id={id} name={name} required={required} />
      )}
    </div>
  );
};

export default Contact;
