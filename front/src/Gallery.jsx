import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { decodeToken, isAdminLoggedIn } from "./utils/auth";

function CommentSection({ itemId }) {
  const [comments, setComments] = useState([]);
  const [decodedUserId, setDecodedUserId] = useState(null);
  const [toast, setToast] = useState({
    show: false,
    type: "",
    message: "",
  });

  const fetchComments = async () => {
    try {
      const response = await fetch(`/gallery/${itemId}/comments`);
      if (!response.ok) {
        throw new Error("Erreur lors de la récupération des commentaires");
      }
      const data = await response.json();
      setComments(data);
    } catch (error) {
      console.error(
        "Erreur lors de la récupération des commentaires : ",
        error
      );
    }
  };

  useEffect(() => {
    fetchComments();
  }, [itemId]);

  useEffect(() => {
    if (toast.show) {
      const timer = setTimeout(() => {
        setToast({ ...toast, show: false });
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [toast]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      decodeToken(token)
        .then((decoded) => {
          setDecodedUserId(decoded.userId);
        })
        .catch((error) => {
          console.error("Erreur lors du décodage du token : ", error);
        });
    }
  }, []);

  const formatRelativeTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now - date;

    const seconds = Math.floor(diffInMs / 1000);
    if (seconds === 0) {
      return "À l'instant";
    }
    if (seconds < 60) {
      return `Il y a ${seconds} seconde${seconds !== 1 ? "s" : ""}`;
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    if (minutes < 60) {
      if (remainingSeconds === 0) {
        return `Il y a ${minutes} minute${minutes !== 1 ? "s" : ""}`;
      } else {
        return `Il y a ${minutes} minute${
          minutes !== 1 ? "s" : ""
        } et ${remainingSeconds} seconde${remainingSeconds !== 1 ? "s" : ""}`;
      }
    }

    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    if (hours < 24) {
      if (remainingMinutes === 0) {
        return `Il y a ${hours} heure${hours !== 1 ? "s" : ""}`;
      } else {
        return `Il y a ${hours} heure${
          hours !== 1 ? "s" : ""
        } et ${remainingMinutes} minute${remainingMinutes !== 1 ? "s" : ""}`;
      }
    }

    const days = Math.floor(hours / 24);
    return `Il y a ${days} jour${days !== 1 ? "s" : ""}`;
  };

  const handleSubmitComment = async (commentText) => {
    try {
      const headers = {
        "Content-Type": "application/json",
      };

      const token = localStorage.getItem("token");
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }
      const response = await fetch(`/gallery/${itemId}/comments`, {
        method: "POST",
        headers: headers,
        body: JSON.stringify({ text: commentText }),
      });
      if (response.ok) {
        setToast({
          show: true,
          type: "success",
          message: "Votre commentaire à bien été enregistré.",
        });
        fetchComments();
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

  const deleteComment = async (commentId) => {
    try {
      const token = localStorage.getItem("token");
      const headers = {
        Authorization: `Bearer ${token}`,
      };

      const response = await fetch(`/gallery/comments/${commentId}`, {
        method: "DELETE",
        headers: headers,
      });

      if (response.ok) {
        setToast({
          show: true,
          type: "success",
          message: "Le commentaire a été supprimé avec succès.",
        });
        fetchComments();
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
        message: `Erreur lors de la suppression du commentaire : ${error}`,
      });
    }
  };

  return (
    <>
      <div id="toast" className={`${toast.show ? "show" : ""} ${toast.type}`}>
        <strong>{toast.type === "danger" ? "Erreur: " : "Succès: "}</strong>
        {toast.message.split("\n").map((line, index) => (
          <div key={index}>{line}</div>
        ))}
      </div>
      <div className="comment-section">
        <h2>
          {comments.length} Commentaire{comments.length > 1 ? "s" : ""}
        </h2>
        <div className="comments">
          {comments.map((comment, index) => (
            <React.Fragment key={comment.id}>
              <div className="comment">
                <span>{comment.text}</span>
                <small>
                  {formatRelativeTime(comment.created_at)}{" "}
                  {decodedUserId === comment.userId &&
                  comment.userId !== null ? (
                    <a
                      className="delete"
                      onClick={() => deleteComment(comment.id)}
                    >
                      🗑️
                    </a>
                  ) : null}
                </small>
              </div>
              {index !== comments.length - 1 && <hr />}
            </React.Fragment>
          ))}
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const commentText = e.target.comment.value;
            handleSubmitComment(commentText);
            e.target.comment.value = "";
          }}
        >
          <textarea
            name="comment"
            rows="4"
            placeholder="Ajouter un commentaire..."
            required
          ></textarea>
          <button type="submit">Poster</button>
        </form>
      </div>
    </>
  );
}

function Gallery({ onSelectPhoto, isAdminPanel }) {
  const [galleryItems, setGalleryItems] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const { id } = useParams();

  useEffect(() => {
    const fetchGalleryData = async () => {
      try {
        let url = "/gallery";
        if (id) {
          url += `/${id}`;
        }
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(
            "Erreur lors de la récupération des données de la galerie"
          );
        }
        const data = await response.json();
        if (id) {
          setGalleryItems([data]);
        } else {
          setGalleryItems(data);
        }
      } catch (error) {
        console.error(
          "Erreur lors de la récupération des données de la galerie : ",
          error
        );
      }
    };

    fetchGalleryData();
    isAdminLoggedIn().then((isAdmin) => {
      setIsAdmin(isAdmin);
    });
  }, [id]);

  const openModal = (image) => {
    setSelectedImage(image);
    setModalOpen(true);
    document.body.classList.add("modal-open");
  };

  const closeModal = () => {
    setSelectedImage(null);
    setModalOpen(false);
    document.body.classList.remove("modal-open");
  };

  const formatDate = (dateString) => {
    const options = {
      year: "numeric",
      month: "numeric",
      day: "numeric",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handleClick = (item) => {
    if (isAdminPanel) {
      onSelectPhoto(item);
      setTimeout(() => {
        window.scrollTo(0, 0);
      }, 100);
    } else {
      window.location.href = `#/gallery/${item.id}`;
      setTimeout(() => {
        window.scrollTo(0, 0);
      }, 100);
    }
  };

  const handleClickSingle = (item) => {
    if (isAdminPanel) {
      onSelectPhoto(item);
      setTimeout(() => {
        window.scrollTo(0, 0);
      }, 100);
    } else {
      openModal(item);
    }
  };

  const handleEditPhoto = () => {
    window.location.href = "#/admin/";
  };
  
  const handleDeletePhoto = () => {
    window.location.href = "#/admin/";
  };

  return (
    <div className="gallery" id="gallery">
      {galleryItems.length === 1 ? (
        <>
          <div className="item-container">
            <div className="gallery-item" key={galleryItems[0].id}>
              <img
                src={`${window.location.origin}/images/${galleryItems[0].file_name}`}
                onClick={() => handleClickSingle(galleryItems[0])}
              />
              {/* <div className="vignette"></div> */}
            </div>
            <div className="gallery-item-description">
              <h1>{galleryItems[0].name}</h1>
              <small>
                <em>{formatDate(galleryItems[0].date)}</em>
              </small>
              <p>{galleryItems[0].description}</p>
              <div
                className="admin-options"
                style={{ display: isAdmin ? "flex" : "none" }}
              >
                <button onClick={() => handleEditPhoto()}>
                  Modifier la photo
                </button>
                <button onClick={() => handleDeletePhoto()} className="delete">
                  Supprimer la photo
                </button>
              </div>
            </div>
          </div>
          <CommentSection itemId={galleryItems[0].id} />
        </>
      ) : (
        <div className="gallery-grid">
          {galleryItems.map((item) => (
            <div className="gallery-item" key={item.id}>
              <img
                src={`${window.location.origin}/images/${item.file_name}`}
                onClick={() => handleClick(item)}
              />
              {/* <div className="vignette"></div> */}
            </div>
          ))}
        </div>
      )}
      {modalOpen && (
        <div className="modal" onClick={closeModal}>
          <div className="modal-content">
            <img
              src={`${window.location.origin}/images/${selectedImage.file_name}`}
              alt={selectedImage.description}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default Gallery;
