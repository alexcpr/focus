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
      <div className="form-group">
        <label htmlFor="name">Nom</label>
        <input type="text" id="name" name="name" required />
      </div>
      <div className="form-group">
        <label htmlFor="email">E-mail</label>
        <input type="email" id="email" name="email" required />
      </div>
      <div className="form-group">
        <label htmlFor="message">Message</label>
        <textarea id="message" name="message" required rows="10"></textarea>
      </div>
      <button type="submit">Envoyer</button>
    </form>
  );
};

export default Contact;
