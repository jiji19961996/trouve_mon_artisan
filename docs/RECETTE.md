# Recette avant remise

## Effectué
- Compilation Vite de production réussie.
- 21 tests HTTP/validation passés, avec dépôt et SMTP simulés.
- Inspection visuelle de l'accueil à largeur ordinateur et navigation vers Mentions légales sur aperçu statique.
- Vérification des dépendances par npm audit (rapports avant/après joints).

## À effectuer avec MySQL et SMTP
- Importer les deux SQL sur une base vide et vérifier les clés étrangères.
- Exécuter `tests/database-smoke.js` avec le jeu fourni.
- Vérifier les 4 catégories chargées depuis MySQL, les filtres et les 3 artisans du mois.
- Rechercher un nom accentué, un nom partiel, `%`, une chaîne sans résultat.
- Vérifier la pagination avec plus de 12 artisans.
- Vérifier la fiche, le site web facultatif et l'absence d'e-mail dans les réponses publiques.
- Envoyer un message à un SMTP de test, confirmer la réception et le Reply-To.
- Couper SMTP : le formulaire doit afficher une erreur et conserver le texte saisi.
- Couper MySQL : message d'indisponibilité, aucune donnée fictive de secours dans l'application.
- Vérifier qu'aucun port 3306/3001 n'est exposé publiquement.

## Accessibilité et conformité
- Naviguer au clavier (Tab, Entrée), lien d'évitement, menu mobile et focus après changement de page.
- Tester 320, 375, 768 et 1440 px, zoom 200 % et 400 %, sans perte de contenu.
- Vérifier NVDA/Firefox ou VoiceOver/Safari : titres, labels, note annoncée et messages d'état.
- Contrôler les contrastes avec un outil dédié ; ne pas déclarer une conformité WCAG sans audit.
- Passer le DOM rendu de chaque modèle de page au validateur Nu HTML du W3C (https://validator.w3.org/nu/).
- Passer le CSS compilé au validateur CSS (https://jigsaw.w3.org/css-validator/), distinguer erreurs et avertissements liés à Bootstrap.
- Ces validations W3C et l'audit WCAG complet n'ont pas été exécutés dans cette livraison.

## Avant ouverture publique
- Vérifier les 17 artisans du jeu fourni et les droits des images et de Graphik.
- Remplir les pages juridiques avec le cabinet prévu au brief.
- Vérifier HTTPS, sauvegardes, restauration, protection des secrets et rotation de clé.
- Ajouter le lien GitHub et l'URL du site au dossier.
