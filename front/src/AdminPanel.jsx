import React, { useState, useEffect } from "react";
import CustomFileInput from "./CustomFileInput";
import Gallery from "./Gallery";

function AdminPanel({ toast, setToast }) {
  const [view, setView] = useState("admin");
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  useEffect(() => {
    if (toast.show) {
      const timer = setTimeout(() => {
        setToast({ ...toast, show: false });
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [toast]);

  const confirmDeletePhoto = async () => {
    try {
      const response = await fetch(`/gallery/${selectedPhoto.id}`, {
        method: "DELETE",
      });
      const result = await response.json();

      if (response.ok) {
        setToast({
          show: true,
          type: "success",
          message: "Photo supprimée avec succès.",
        });
        setSelectedPhoto(null);
        setView("galleryManagement");
      } else {
        setToast({
          show: true,
          type: "danger",
          message: result.error,
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

  return (
    <section className="admin">
      {view === "admin" ? (
        <>
          <h1>Panel Admin</h1>
          <div
            id="toast"
            className={`${toast.show ? "show" : ""} ${toast.type}`}
          >
            <strong>{toast.type === "danger" ? "Erreur: " : "Succès: "}</strong>
            {toast.message.split("\n").map((line, index) => (
              <div key={index}>{line}</div>
            ))}
          </div>
          <div className="admin-buttons">
            <button onClick={() => setView("galleryManagement")}>
              Gestion de la Galerie
            </button>
          </div>
        </>
      ) : view === "galleryManagement" ? (
        <>
          <h1>Gestion de la Galerie</h1>
          <button className="backBtn" onClick={() => setView("admin")}>
            Retour
          </button>
          <div
            id="toast"
            className={`${toast.show ? "show" : ""} ${toast.type}`}
          >
            <strong>{toast.type === "danger" ? "Erreur: " : "Succès: "}</strong>
            {toast.message.split("\n").map((line, index) => (
              <div key={index}>{line}</div>
            ))}
          </div>
          <div className="admin-buttons">
            <button onClick={() => setView("addPhoto")}>
              Ajouter une photo
            </button>
            <button onClick={() => setView("editPhoto")}>
              Modifier une photo
            </button>
            <button onClick={() => setView("deletePhoto")}>
              Supprimer une photo
            </button>
          </div>
        </>
      ) : view === "addPhoto" ? (
        <AddPhotoPage setView={setView} toast={toast} setToast={setToast} />
      ) : view === "editPhoto" ? (
        <>
          <h1>Modifier une photo</h1>
          <button
            className="backBtn"
            onClick={() => setView("galleryManagement")}
          >
            Retour
          </button>
          {selectedPhoto ? (
            <EditPhotoPage
              setView={setView}
              toast={toast}
              setToast={setToast}
              photo={selectedPhoto}
              setSelectedPhoto={setSelectedPhoto}
            />
          ) : (
            <>
              <p>Sélectionnez une photo à modifier dans la galerie.</p>
              <Gallery
                onSelectPhoto={(photo) => setSelectedPhoto(photo)}
                isAdminPanel={true}
              />
            </>
          )}
        </>
      ) : (
        <>
          <h1>Supprimer une photo</h1>
          <button
            className="backBtn"
            onClick={() => setView("galleryManagement")}
          >
            Retour
          </button>
          {selectedPhoto ? (
            <>
              <div className="delete-form">
                <p>Êtes-vous sûr de vouloir supprimer cette photo ?</p>
                <button className="delete" onClick={confirmDeletePhoto}>
                  Supprimer
                </button>
                <button
                  onClick={() => {
                    setSelectedPhoto(null);
                    setView("deletePhoto");
                  }}
                >
                  Annuler
                </button>
              </div>
            </>
          ) : (
            <>
              <p>Sélectionnez une photo à supprimer dans la galerie.</p>
              <Gallery
                onSelectPhoto={(photo) => setSelectedPhoto(photo)}
                isAdminPanel={true}
              />
            </>
          )}
        </>
      )}
    </section>
  );
}

function AddPhotoPage({ setView, toast, setToast }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("file", file);

    try {
      const response = await fetch("/gallery", {
        method: "POST",
        body: formData,
      });
      const result = await response.json();

      if (response.ok) {
        setToast({
          show: true,
          type: "success",
          message: "Photo ajoutée avec succès.",
        });
        setView("galleryManagement");
      } else {
        setToast({
          show: true,
          type: "danger",
          message: result.error,
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

  return (
    <>
      <h1>Ajouter une photo</h1>
      <button className="backBtn" onClick={() => setView("galleryManagement")}>
        Retour
      </button>
      <div id="toast" className={`${toast.show ? "show" : ""} ${toast.type}`}>
        <strong>{toast.type === "danger" ? "Erreur: " : "Succès: "}</strong>
        {toast.message.split("\n").map((line, index) => (
          <div key={index}>{line}</div>
        ))}
      </div>
      <form className="addPhoto" onSubmit={handleSubmit}>
        <FormGroup
          label="Titre"
          id="name"
          name="name"
          type="text"
          required={true}
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <FormGroup
          label="Description"
          id="description"
          name="description"
          type="textarea"
          required={true}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
        />
        <CustomFileInput
          label="Fichier"
          id="file"
          name="file"
          required={true}
          onChange={(selectedFile) => setFile(selectedFile)}
        />
        <button type="submit">Ajouter</button>
      </form>
    </>
  );
}

function EditPhotoPage({ setView, toast, setToast, photo, setSelectedPhoto }) {
  const [id, setId] = useState(photo.id);
  const [name, setName] = useState(photo.name);
  const [description, setDescription] = useState(photo.description);
  const [file, setFile] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    if (file) formData.append("file", file);

    try {
      const response = await fetch(`/gallery/${id}`, {
        method: "PUT",
        body: formData,
      });
      const result = await response.json();

      if (response.ok) {
        setToast({
          show: true,
          type: "success",
          message: "Photo modifiée avec succès.",
        });
        setView("galleryManagement");
      } else {
        setToast({
          show: true,
          type: "danger",
          message: result.error,
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

  return (
    <>
      <button
        className="changePhotoBtn"
        onClick={() => {
          setSelectedPhoto(null);
          setView("editPhoto");
        }}
      >
        Choisir une autre image
      </button>
      <div id="toast" className={`${toast.show ? "show" : ""} ${toast.type}`}>
        <strong>{toast.type === "danger" ? "Erreur: " : "Succès: "}</strong>
        {toast.message.split("\n").map((line, index) => (
          <div key={index}>{line}</div>
        ))}
      </div>
      <form className="editPhoto" onSubmit={handleSubmit}>
        <FormGroup
          label="ID"
          id="id"
          name="id"
          type="number"
          readonly={true}
          value={id}
          onChange={(e) => setId(e.target.value)}
        />
        <FormGroup
          label="Nom"
          id="name"
          name="name"
          type="text"
          required={true}
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <FormGroup
          label="Description"
          id="description"
          name="description"
          type="textarea"
          required={true}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
        />
        <CustomFileInput
          label="Fichier (optionnel)"
          id="file"
          name="file"
          onChange={(selectedFile) => setFile(selectedFile)}
        />
        <button type="submit">Modifier</button>
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
  readonly,
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
          readOnly={readonly}
        ></textarea>
      ) : (
        <input
          type={type}
          id={id}
          name={name}
          required={required}
          value={value}
          onChange={onChange}
          readOnly={readonly}
        />
      )}
    </div>
  );
};

export default AdminPanel;
