const express = require("express");
const app = express();
const port = 3001;
const mysql = require("mysql");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "focus",
});

connection.connect((err) => {
  if (err) {
    console.error("Erreur de connexion à la base de données : ", err);
    return;
  }
  console.log("Connecté à la base de données MySQL");
});

app.use(express.json());

app.use("/images", express.static(path.join(__dirname, "images")));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images/");
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const uniqueName = `${uuidv4()}${ext}`;
    cb(null, uniqueName);
  },
});

const upload = multer({ storage: storage });
app.post("/gallery", upload.single("file"), (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ error: "Token non fourni" });
  }

  jwt.verify(token, "E5vJNoXOAvNDVbel", (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: "Token invalide" });
    }

    const { name, description } = req.body;
    const file = req.file;

    if (!name || !description || !file) {
      return res.status(400).json({ error: "Tous les champs sont requis." });
    }

    if (!file.mimetype.startsWith("image/")) {
      return res
        .status(400)
        .json({ error: "Seules les images sont acceptées." });
    }

    const fileName = file.filename;

    connection.query(
      "INSERT INTO gallery (file_name, name, description, date) VALUES (?, ?, ?, NOW())",
      [fileName, name, description],
      (err, results) => {
        if (err) {
          res.status(500).json({
            error: "Une erreur inattendue s'est produite.\nVeuillez réessayer.",
          });
        }
        res.json({ message: "Photo ajoutée avec succès." });
      }
    );
  });
});

app.put("/gallery/:id", upload.single("file"), (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ error: "Token non fourni" });
  }

  jwt.verify(token, "E5vJNoXOAvNDVbel", (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: "Token invalide" });
    }

    const { id } = req.params;
    const { name, description } = req.body;
    const file = req.file;

    if (!name || !description) {
      return res.status(400).json({ error: "Tous les champs sont requis." });
    }

    connection.query(
      "SELECT file_name FROM gallery WHERE id = ?",
      [id],
      (err, results) => {
        if (err) {
          res.status(500).json({
            error: "Erreur lors de la récupération de la photo actuelle.",
          });
          return;
        }

        if (results.length === 0) {
          res.status(404).json({ error: "Photo non trouvée." });
          return;
        }

        const currentFileName = results[0].file_name;

        let updateQuery = "UPDATE gallery SET name = ?, description = ?";
        let queryParams = [name, description];

        if (file) {
          const fileName = file.filename;
          updateQuery += ", file_name = ?";
          queryParams.push(fileName);
        }

        updateQuery += " WHERE id = ?";
        queryParams.push(id);

        connection.query(updateQuery, queryParams, (err, results) => {
          if (err) {
            res.status(500).json({
              error:
                "Une erreur inattendue s'est produite.\nVeuillez réessayer.",
            });
            return;
          }
          if (results.affectedRows === 0) {
            res.status(404).json({ error: "Photo non trouvée." });
            return;
          }

          if (file && currentFileName) {
            const oldFilePath = path.join(__dirname, "images", currentFileName);
            fs.unlink(oldFilePath, (err) => {
              if (err) {
                console.error(
                  "Erreur lors de la suppression de l'ancienne image : ",
                  err
                );
              }
            });
          }

          res.json({ message: "Photo modifiée avec succès." });
        });
      }
    );
  });
});

app.delete("/gallery/:id", (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ error: "Token non fourni" });
  }

  jwt.verify(token, "E5vJNoXOAvNDVbel", (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: "Token invalide" });
    }

    const { id } = req.params;

    connection.query(
      "SELECT file_name FROM gallery WHERE id = ?",
      [id],
      (err, results) => {
        if (err) {
          res.status(500).json({
            error: "Erreur lors de la récupération de la photo.",
          });
          return;
        }

        if (results.length === 0) {
          res.status(404).json({ error: "Photo non trouvée." });
          return;
        }

        const fileName = results[0].file_name;

        connection.query(
          "DELETE FROM gallery WHERE id = ?",
          [id],
          (err, results) => {
            if (err) {
              res.status(500).json({
                error: "Erreur lors de la suppression de la photo.",
              });
              return;
            }

            const filePath = path.join(__dirname, "images", fileName);
            fs.unlink(filePath, (err) => {
              if (err) {
                console.error(
                  "Erreur lors de la suppression du fichier :",
                  err
                );
              }
            });

            res.json({ message: "Photo supprimée avec succès." });
          }
        );
      }
    );
  });
});

app.post("/register", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Veuillez remplir tous les champs." });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res
      .status(400)
      .json({ error: "Veuillez saisir une adresse e-mail valide." });
  }

  if (password.length < 4) {
    return res.status(400).json({
      error:
        "Le mot de passe doit contenir au moins 4 caractères.\nVeuillez réessayer.",
    });
  }

  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{4,}$/;
  if (!passwordRegex.test(password)) {
    return res.status(400).json({
      error:
        "Le mot de passe doit contenir au moins une majuscule, une minuscule, un chiffre et un caractère spécial.\nVeuillez réessayer.",
    });
  }

  bcrypt.genSalt(10, (err, salt) => {
    if (err) {
      res.status(500).json({
        error: "Une erreur inattendue s'est produite.\nVeuillez réessayer.",
      });
      return;
    }

    bcrypt.hash(password, salt, (err, hash) => {
      if (err) {
        res.status(500).json({
          error: "Une erreur inattendue s'est produite.\nVeuillez réessayer.",
        });
        return;
      }

      connection.query(
        "INSERT INTO users (email, password) VALUES (?, ?)",
        [email, hash],
        (err, results) => {
          if (err) {
            res.status(500).json({
              error: "Adresse e-mail déjà utilisée.\nVeuillez réessayer.",
            });
            return;
          }
          res.status(200).json({ message: "Utilisateur créé avec succès." });
        }
      );
    });
  });
});

app.post("/login", (req, res) => {
  const { email, password } = req.body;

  connection.query(
    "SELECT * FROM users WHERE email = ?",
    [email],
    (err, results) => {
      if (err) {
        res.status(500).json({
          error: "Une erreur inattendue s'est produite.\nVeuillez réessayer.",
        });
        return;
      }

      if (results.length === 0) {
        // En réalité il n'y a pas d'utilisateur avec cet e-mail mais on renvoie le même message pour éviter les attaques par force brute (l'attaquant ne saura pas si l'e-mail existe ou non)
        res.status(401).json({
          error: "E-mail ou mot de passe incorrect.\nVeuillez réessayer.",
        });
        return;
      }

      const user = results[0];
      bcrypt.compare(password, user.password, (err, result) => {
        if (err || !result) {
          res.status(401).json({
            error: "E-mail ou mot de passe incorrect.\nVeuillez réessayer.",
          });
          return;
        }

        let tokenPayload = { userId: user.id, email: user.email };

        if (user.LSPF5cc3NPHgOQbtIzCjPyQxC4LyCFrM !== null) {
          tokenPayload.hKhDTg2rpde1SaDVm8CKBhjDb2jIXqIE = 1;
        }

        const token = jwt.sign(tokenPayload, "bKP4SsVq8keD0o4J", {
          expiresIn: "1h",
        });

        res.json({ token });
      });
    }
  );
});

app.post("/loginadmin", (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ error: "Token non fourni" });
  }

  jwt.verify(token, "bKP4SsVq8keD0o4J", (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: "Token invalide" });
    }
    const email = decoded.email;
    const { password } = req.body;

    connection.query(
      "SELECT * FROM users WHERE email = ?",
      [email],
      (err, results) => {
        if (err) {
          res.status(500).json({
            error: "Une erreur inattendue s'est produite.\nVeuillez réessayer.",
          });
          return;
        }

        if (results.length === 0) {
          res.status(401).json({
            error: "Mot de passe incorrect.\nVeuillez réessayer.",
          });
          return;
        }

        const user = results[0];
        bcrypt.compare(
          password,
          user.LSPF5cc3NPHgOQbtIzCjPyQxC4LyCFrM,
          (err, result) => {
            if (err || !result) {
              res.status(401).json({
                error: "Mot de passe incorrect.\nVeuillez réessayer.",
              });
              return;
            }

            let tokenPayload = { userId: user.id, email: user.email };

            const token = jwt.sign(tokenPayload, "E5vJNoXOAvNDVbel", {
              expiresIn: "1h",
            });

            res.json({ token });
          }
        );
      }
    );
  });
});

app.post("/verify", (req, res) => {
  // middleware pour vérifier le token
  const token = req.body.token;
  if (!token) {
    return res.status(401).json({ error: "Token non fourni" });
  }

  jwt.verify(token, "bKP4SsVq8keD0o4J", (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: "Token invalide" });
    }
    res.status(200).json({ message: "Token valide" });
  });
});

app.post("/verifyadmin", (req, res) => {
  // middleware pour vérifier le token admin
  const token = req.body.token;
  if (!token) {
    return res.status(401).json({ error: "Token non fourni" });
  }

  jwt.verify(token, "E5vJNoXOAvNDVbel", (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: "Token invalide" });
    }
    res.status(200).json({ message: "Token valide" });
  });
});

app.get("/gallery", (req, res) => {
  connection.query("SELECT * FROM gallery", (err, results) => {
    if (err) {
      console.error("Erreur lors de la requête SQL : ", err);
      res.status(500).json({ error: "Erreur interne du serveur" });
      return;
    }
    res.json(results);
  });
});

app.get("/gallery/:id", (req, res) => {
  const { id } = req.params;
  connection.query(
    "SELECT * FROM gallery WHERE id = ?",
    [id],
    (err, results) => {
      if (err) {
        console.error("Erreur lors de la requête SQL : ", err);
        res.status(500).json({ error: "Erreur interne du serveur" });
        return;
      }
      if (results.length === 0) {
        res.status(404).json({ error: "Image non trouvée" });
        return;
      }
      res.json(results[0]);
    }
  );
});

app.get("/gallery/:id/comments", (req, res) => {
  const { id } = req.params;
  connection.query(
    "SELECT * FROM comments WHERE image_id = ?",
    [id],
    (err, results) => {
      if (err) {
        console.error("Erreur lors de la requête SQL : ", err);
        res.status(500).json({ error: "Erreur interne du serveur" });
        return;
      }
      res.json(results);
    }
  );
});

app.post("/gallery/:id/comments", (req, res) => {
  const { id } = req.params;
  const { text } = req.body;

  connection.query(
    "INSERT INTO comments (image_id, text) VALUES (?, ?)",
    [id, text],
    (err, results) => {
      if (err) {
        console.error("Erreur lors de la requête SQL : ", err);
        res.status(500).json({ error: "Erreur interne du serveur" });
        return;
      }
      res.json({ message: "Commentaire ajoutée avec succès" });
    }
  );
});

// app.delete("/gallery/comments/:commentId", (req, res) => {
//   const { commentId } = req.params;

//   connection.query(
//     "DELETE FROM comments WHERE id = ?",
//     [commentId],
//     (err, results) => {
//       if (err) {
//         console.error("Erreur lors de la requête SQL : ", err);
//         res.status(500).json({ error: "Erreur interne du serveur" });
//         return;
//       }
//       res.json({ message: "Commentaire supprimée avec succès" });
//     }
//   );
// });

app.post("/contact", (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: "Veuillez remplir tous les champs." });
  }

  if (token) {
    jwt.verify(token, "bKP4SsVq8keD0o4J", (err, decoded) => {
      if (err) {
        return res.status(401).json({ error: "Token invalide" });
      }

      const userId = decoded.userId;

      connection.query(
        "INSERT INTO contact (userId, name, email, message) VALUES (?, ?, ?, ?)",
        [userId, name, email, message],
        (err, results) => {
          if (err) {
            console.error("Erreur lors de la requête SQL : ", err);
            res.status(500).json({ error: "Erreur interne du serveur" });
            return;
          }
          res.json({ message: "Message envoyé avec succès" });
        }
      );
    });
  } else {
    connection.query(
      "INSERT INTO contact (name, email, message) VALUES (?, ?, ?)",
      [name, email, message],
      (err, results) => {
        if (err) {
          console.error("Erreur lors de la requête SQL : ", err);
          res.status(500).json({ error: "Erreur interne du serveur" });
          return;
        }
        res.json({ message: "Message envoyé avec succès" });
      }
    );
  }
});

app.get("/getmessages", (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ error: "Token non fourni" });
  }

  jwt.verify(token, "bKP4SsVq8keD0o4J", (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: "Token invalide" });
    }

    const id = decoded.userId;

    connection.query(
      "SELECT * FROM contact WHERE userId = ?",
      [id],
      (err, results) => {
        if (err) {
          res.status(500).json({
            error: "Une erreur inattendue s'est produite.\nVeuillez réessayer.",
          });
          return;
        }
        res.json(results);
      }
    );
  });
});

app.post("/changepassword", (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Token non fourni" });
  }

  jwt.verify(token, "bKP4SsVq8keD0o4J", (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: "Token invalide" });
    }

    const { currentPassword, newPassword, confirmPassword } = req.body;

    if (!currentPassword || !newPassword || !confirmPassword) {
      return res
        .status(400)
        .json({ error: "Veuillez remplir tous les champs." });
    }
    const userId = decoded.userId;

    connection.query(
      "SELECT * FROM users WHERE id = ?",
      [userId],
      (err, results) => {
        if (err || results.length === 0) {
          return res.status(500).json({ error: "Utilisateur non trouvé." });
        }

        const user = results[0];
        bcrypt.compare(currentPassword, user.password, (err, isMatch) => {
          if (err || !isMatch) {
            return res
              .status(401)
              .json({ error: "Mot de passe actuel incorrect." });
          }

          if (newPassword !== confirmPassword) {
            return res.status(400).json({
              error:
                "Le nouveau mot de passe et le mot de passe de confirmation ne correspondent pas.",
            });
          }

          bcrypt.genSalt(10, (err, salt) => {
            if (err) {
              return res
                .status(500)
                .json({ error: "Erreur de génération de salt." });
            }

            bcrypt.hash(newPassword, salt, (err, hash) => {
              if (err) {
                return res
                  .status(500)
                  .json({ error: "Erreur de hachage du mot de passe." });
              }

              connection.query(
                "UPDATE users SET password = ? WHERE id = ?",
                [hash, userId],
                (err) => {
                  if (err) {
                    return res.status(500).json({
                      error: "Erreur lors de la mise à jour du mot de passe.",
                    });
                  }
                  res.json({ message: "Mot de passe mis à jour avec succès." });
                }
              );
            });
          });
        });
      }
    );
  });
});

app.listen(port, () => {
  console.log(`Serveur démarré sur le port ${port}`);
});
