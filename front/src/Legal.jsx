function Legal() {
  return (
    <section className="legal">
      <h1>Mentions Légales</h1>
      <h3>En vigueur le 15 jul. 2024</h3>
      <Box title="Éditeur du site">
        <div>
          <strong>Nom</strong>: CIPOR Alexandre
        </div>
        <div>
          <strong>Email</strong>:{" "}
          <a href="mailto:focus@alexandrecipor.com">focus@alexandrecipor.com</a>
        </div>
      </Box>
      <Box title="Hébérgeur">
        <div>
          <strong>Nom</strong>: Oracle Cloud
        </div>
        <div>
          <strong>Adresse</strong>: 15 Bd Charles de Gaulle, 92715 Colombes
        </div>
        <div>
          <strong>Téléphone</strong>: 04 37 43 46 06
        </div>
      </Box>
      <Box title="Directeur de la publication">
        <div>M. CIPOR Alexandre</div>
      </Box>
      <Box title="Propriété Intellectuelle">
        <p>
          L'ensemble des contenus présents sur le site focus.alexandrecipor.com,
          incluant notamment les photographies, les textes, les images, les
          logos et les vidéos, sont la propriété exclusive de{" "}
          <strong>CIPOR Alexandre</strong>, sauf mention contraire. Toute
          reproduction, distribution, modification, adaptation, retransmission
          ou publication de ces différents éléments est strictement interdite
          sans l'accord exprès par écrit de <strong>CIPOR Alexandre</strong>.
        </p>
        <p>
          Les photos présentes sur ce site ont été réalisées avec un Canon EOS
          6D Mark II ou un iPhone 15 Pro Max. Les retouches éventuelles sont
          effectuées à l'aide d'Adobe Lightroom.
        </p>
      </Box>
      <Box title="Protection des Données Personnelles">
        <p>
          Aucune donnée personnelle n'est automatiquement collectée. Les seules
          données personnelles stockées sont celles fournies volontairement par
          les utilisateurs via la création de comptes utilisateurs, les
          commentaires postés et les messages envoyés via le formulaire de
          contact.
        </p>
        <p>
          Les mots de passe des utilisateurs sont hashés pour assurer leur
          sécurité.
        </p>
        <p>
          Les utilisateurs disposent d'un droit d'accès, de rectification, de
          suppression et d'opposition aux données personnelles les concernant.
        </p>
        <p>
          Pour exercer ces droits, vous pouvez nous contacter à l'adresse
          suivante{" "}
          <a href="mailto:focus@alexandrecipor.com">focus@alexandrecipor.com</a>
          .
        </p>
      </Box>
      <Box title="Cookies">
        <p>
          Focus n'exploite ni ne requiert aucun cookie.
        </p>
      </Box>
      <Box title="Contact">
        <p>
          Pour toute question concernant les mentions légales du site, vous
          pouvez nous contacter à l'adresse{" "}
          <a href="mailto:focus@alexandrecipor.com">focus@alexandrecipor.com</a>
          .
        </p>
      </Box>
    </section>
  );
}

function Box({ title, children }) {
  return (
    <div className="box">
      <h2>{title}</h2>
      {children}
    </div>
  );
}

export default Legal;
