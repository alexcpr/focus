const express = require("express");
const app = express();
const port = 3001;
const mysql = require("mysql");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

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

app.post("/register", (req, res) => {
  const { email, password } = req.body;

  bcrypt.genSalt(10, (err, salt) => {
    if (err) {
      console.error("Erreur lors de la génération du sel : ", err);
      res.status(500).json({ error: "Erreur interne du serveur" });
      return;
    }

    bcrypt.hash(password, salt, (err, hash) => {
      if (err) {
        console.error("Erreur lors du chiffrement du mot de passe : ", err);
        res.status(500).json({ error: "Erreur interne du serveur" });
        return;
      }

      connection.query(
        "INSERT INTO utilisateurs (email, mot_de_passe) VALUES (?, ?)",
        [email, hash],
        (err, results) => {
          if (err) {
            console.error(
              "Erreur lors de l'insertion dans la base de données : ",
              err
            );
            res.status(500).json({ error: "Erreur interne du serveur" });
            return;
          }
          const token = jwt.sign({ email: email }, "bKP4SsVq8keD0o4J", {
            expiresIn: "1h",
          });

          res.json({ token });
        }
      );
    });
  });
});

app.post("/login", (req, res) => {
  const { email, password } = req.body;

  connection.query(
    "SELECT * FROM utilisateurs WHERE email = ?",
    [email],
    (err, results) => {
      if (err) {
        console.error("Erreur lors de la requête SQL : ", err);
        res.status(500).json({ error: "Erreur interne du serveur" });
        return;
      }

      if (results.length === 0) {
        res.status(401).json({ error: "E-mail ou mot de passe incorrect" });
        return;
      }

      const user = results[0];
      bcrypt.compare(password, user.mot_de_passe, (err, result) => {
        if (err || !result) {
          res.status(401).json({ error: "E-mail ou mot de passe incorrect" });
          return;
        }

        const token = jwt.sign(
          { userId: user.id, email: user.email },
          "bKP4SsVq8keD0o4J",
          { expiresIn: "1h" }
        );

        res.json({ token });
      });
    }
  );
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

app.listen(port, () => {
  console.log(`Serveur démarré sur le port ${port}`);
});
