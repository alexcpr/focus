SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données :  `focus`
-- MDP users :
-- 1 : test
-- 2 : test2
-- 3 : test3
-- MDP admin :
-- être connecté au compte 1 + mdp : test2
--

CREATE DATABASE IF NOT EXISTS `focus`;
USE `focus`;

-- --------------------------------------------------------

--
-- Structure de la table `comments`
--

CREATE TABLE `comments` (
  `id` int(11) NOT NULL,
  `userId` int(11) DEFAULT NULL,
  `image_id` int(11) NOT NULL,
  `text` text NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Structure de la table `contact`
--

CREATE TABLE `contact` (
  `id` int(11) NOT NULL,
  `userId` int(11) DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `message` text NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Structure de la table `gallery`
--

CREATE TABLE `gallery` (
  `id` int(11) NOT NULL,
  `file_name` varchar(45) NOT NULL,
  `name` varchar(45) NOT NULL,
  `description` varchar(500) DEFAULT NULL,
  `date` date NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Contenu de la table `gallery`
--

INSERT INTO `gallery` (`id`, `file_name`, `name`, `description`, `date`, `created_at`) VALUES
(1, 'pexels-acam-15903276.jpg', 'L\'Écho des Cimes', 'Un paysage majestueux capturé par l\'objectif de acam, où chaque contour semble murmurer une histoire séculaire, mêlant l\'immensité et l\'intimité d\'un monde naturel préservé.', '2024-05-29', '2024-06-03 12:35:39'),
(2, 'pexels-axp-photography-500641970-19195924.jpg', 'L\'Instant de Grâce', 'Un instant figé dans le temps par l\'artiste de l\'objectif, AXP Photography, où la lumière danse avec les ombres pour créer une scène d\'une beauté éphémère et enchanteresse.', '2024-05-29', '2024-06-03 12:35:39'),
(3, 'pexels-bingqian-li-230971044-17108461.jpg', 'L\'Harmonie de l\'Aube', 'Bingqian Li nous offre une toile vivante où les teintes de l\'aube se mêlent dans une symphonie visuelle, évoquant une harmonie éternelle entre ciel et terre.', '2024-05-29', '2024-06-03 12:35:39'),
(4, 'pexels-eva-mauermann-1243578278-23331323.jpg', 'Silence Évanescent', 'Dans ce silence capturé par l\'objectif d\'Eva Mauermann, chaque rayon de lumière semble chuchoter à l\'oreille de l\'âme, invitant à la contemplation et à l\'évasion.', '2024-05-29', '2024-06-03 12:35:39'),
(5, 'pexels-gabrielrissi-21908890.jpg', 'Voyage au Coeur de la Couleur', 'Les couleurs vibrantes de cette photo prise par Gabrielrissi attirent immédiatement le regard. Chaque détail est capturé avec une netteté incroyable, offrant une expérience visuelle riche et immersive.', '2024-05-29', '2024-06-03 12:35:39'),
(6, 'pexels-jack-atkinson-1289771108-24284122.jpg', 'Lumière Intime', 'Jack Atkinson offre une perspective unique dans cette photo, mettant en avant des éléments subtils et captivants. La composition et les couleurs ajoutent une profondeur remarquable à l\'image.', '2024-05-29', '2024-06-03 12:35:39'),
(7, 'pexels-jeremy-bishop-1260133-15505733.jpg', 'Élégance Envoûtante', 'Capturé par Jeremy Bishop avec une élégance et une précision inégalées, cette photo dégage une atmosphère sereine et captivante. Les détails minutieux et la lumière douce en font une œuvre d\'art visuelle.', '2024-05-29', '2024-06-03 12:35:39'),
(8, 'pexels-jpgata-10863289.jpg', 'Éclats de Vie', 'Un cliché artistique réalisé par jpgata, mettant en avant une composition audacieuse et des couleurs vives. Chaque élément de la photo raconte une histoire, offrant une expérience visuelle fascinante.', '2024-05-29', '2024-06-03 12:35:39'),
(9, 'pexels-marina-zvada-844583049-19987323.jpg', 'Contrastes Énigmatiques', 'Photographie intrigante de Marina Zvada, capturant une scène naturelle avec une précision et une beauté remarquables. Les contrastes et la lumière ajoutent une dimension supplémentaire à l\'image.', '2024-05-29', '2024-06-03 12:35:39'),
(10, 'pexels-oranduu-19158931.jpg', 'Souffle Sauvage', 'Scène dramatique capturée par Oranduu, mettant en avant des éléments naturels dans toute leur splendeur. La composition et l\'éclairage créent une ambiance puissante et mémorable.', '2024-05-29', '2024-06-03 12:35:39'),
(11, 'pexels-pic-itsuda-1233437628-23719480.jpg', 'Sérénité Immuable', 'Itsuda capture un moment de calme et de tranquillité dans cette photo, avec une attention particulière aux détails et à la lumière. L\'image dégage une atmosphère sereine et apaisante.', '2024-05-29', '2024-06-03 12:35:39'),
(12, 'pexels-razone-gn-598584859-17180127.jpg', 'Éclat Vibrant', 'Photo détaillée et vive prise par Razone GN, offrant une vue spectaculaire et riche en couleurs. Chaque élément de la photo est parfaitement capturé, créant une image vivante et dynamique.', '2024-05-29', '2024-06-03 12:35:39'),
(13, 'pexels-sabinakallari-13812120.jpg', 'Mélodie Naturelle', 'Photographie pittoresque de Sabinakallari, mettant en avant un paysage naturel avec une touche artistique. La composition et les couleurs sont harmonieuses, créant une image agréable à contempler.', '2024-05-29', '2024-06-03 12:35:39'),
(14, 'pexels-sarisecils-7566369.jpg', 'L\'Ode au Calme', 'Scène calme et reposante capturée par Sarisecils. Les éléments de la nature sont en parfaite harmonie, offrant une vision paisible et rafraîchissante.', '2024-05-29', '2024-06-03 12:35:39'),
(15, 'pexels-susan-flores-232226967-12295008.jpg', 'Chant de la Nature', 'Belle capture réalisée par Susan Flores, illustrant la beauté naturelle avec une précision incroyable. Les couleurs et la composition sont parfaitement équilibrées, créant une image captivante.', '2024-05-29', '2024-06-03 12:35:39'),
(16, 'pexels-tiagoalvar-21287032.jpg', 'Éclats d\'Instant', 'Photographie accrocheuse de Tiagoalvar, mettant en valeur des éléments visuels saisissants. La lumière et les couleurs sont utilisées de manière créative pour offrir une image dynamique et mémorable.', '2024-05-29', '2024-06-03 12:35:39');

-- --------------------------------------------------------

--
-- Structure de la table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `LSPF5cc3NPHgOQbtIzCjPyQxC4LyCFrM` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Contenu de la table `users`
--

INSERT INTO `users` (`id`, `email`, `password`, `LSPF5cc3NPHgOQbtIzCjPyQxC4LyCFrM`) VALUES
(1, 'alexcipor@gmail.com', '$2b$10$39biTqZ0s38ZmkvOr5CnWO5YxBWFXeOxGKjDh5Cd3Q0iAQlbYoFBy', '$2b$10$7u3FjsE7LaJugSCbn/LybOBmAM.hLp7OtOcj70MxhWbBQbjNDkoV6'),
(2, 'zagar.marionn@gmail.com', '$2b$10$7u3FjsE7LaJugSCbn/LybOBmAM.hLp7OtOcj70MxhWbBQbjNDkoV6', NULL),
(3, 'zagar.marionnn@gmail.com', '$2b$10$/JC0/erqCnaAt1Sh/Jp/POP8uAJhkHEPGeGR70eysxSlubDVXmMei', NULL);

--
-- Index pour les tables exportées
--

--
-- Index pour la table `comments`
--
ALTER TABLE `comments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `image_id` (`image_id`),
  ADD KEY `userId` (`userId`);

--
-- Index pour la table `contact`
--
ALTER TABLE `contact`
  ADD PRIMARY KEY (`id`),
  ADD KEY `userId` (`userId`);

--
-- Index pour la table `gallery`
--
ALTER TABLE `gallery`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT pour les tables exportées
--

--
-- AUTO_INCREMENT pour la table `comments`
--
ALTER TABLE `comments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT pour la table `contact`
--
ALTER TABLE `contact`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT pour la table `gallery`
--
ALTER TABLE `gallery`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;
--
-- AUTO_INCREMENT pour la table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;
--
-- Contraintes pour les tables exportées
--

--
-- Contraintes pour la table `comments`
--
ALTER TABLE `comments`
  ADD CONSTRAINT `comments_ibfk_1` FOREIGN KEY (`image_id`) REFERENCES `gallery` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `comments_ibfk_2` FOREIGN KEY (`userId`) REFERENCES `users` (`id`);

--
-- Contraintes pour la table `contact`
--
ALTER TABLE `contact`
  ADD CONSTRAINT `contact_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`id`);

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
