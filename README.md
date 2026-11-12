# Trouve ton artisan

Projet pédagogique réalisé d'après le brief du Centre Européen de Formation.
React + Bootstrap + Sass ; Node.js + Express + Sequelize + MySQL.

## État de livraison

- Code, scripts SQL et tests livrés. Installation directe, sans Docker. Le dossier PDF est fourni séparément.
- Jeu fourni dans `data[1].xlsx` intégré : **17 artisans, 15 spécialités, 4 catégories et 3 artisans du mois**. Source conservée dans `data/artisans-source.xlsx`. Voir `docs/DONNEES.md`.
- Maquettes Figma : https://www.figma.com/design/QBjaynRIZhVDkhjRhkdgjM (les exemples graphiques restent ceux de la conception initiale).
- Logo et favicon extraits du PDF fourni. Police Graphik non distribuée : Arial est utilisée en repli. Ajouter les deux WOFF2 autorisés dans `frontend/public/fonts/`, puis décommenter les règles `@font-face` de `styles.scss`.
- Aucun dépôt GitHub distant ni hébergement public créé : les liens sont à compléter après déploiement.
- Construction et tests HTTP exécutés ; pas de serveur MySQL/SMTP réel disponible dans l'environnement de réalisation. Les tests utilisent un dépôt en mémoire et un transport de courriel simulé.
- Contrôle visuel de l'accueil et navigation légale effectué en aperçu statique. Vérification mobile, audit WCAG complet et validation W3C restent à effectuer sur le site connecté.

## Prérequis

Node.js 24, npm, MySQL 8.4 ou MariaDB compatible avec le schéma SQL. Un compte SMTP et un domaine HTTPS sont nécessaires en production. Le compte SQL de l'application doit avoir uniquement le privilège SELECT.

## Installation et démarrage local

```sh
npm ci
cp .env.example .env
mysql -u root -p < sql/01-schema.sql
mysql -u root -p < sql/02-seed.sql
```

Sous Windows PowerShell, utiliser `Copy-Item .env.example .env`. Importer les deux fichiers SQL dans cet ordre avec MySQL Workbench ou phpMyAdmin (la redirection `<` ci-dessus fonctionne dans un terminal compatible, par exemple cmd).

Créer le compte de lecture avec un secret choisi :

```sql
CREATE USER 'artisan_reader'@'localhost' IDENTIFIED BY 'REMPLACER_PAR_UN_SECRET';
GRANT SELECT ON artisans.* TO 'artisan_reader'@'localhost';
```

Générer la clé interne avec `node -e "console.log(require('node:crypto').randomBytes(32).toString('hex'))"`. Copier le résultat dans `INTERNAL_API_KEY`. Configurer `.env` avec les accès locaux (`DB_PASSWORD` doit correspondre au compte créé), cette clé et `PUBLIC_ORIGIN=http://localhost:5173`. Démarrer un SMTP de test sur le port 1025 (Mailpit par exemple) ou configurer un SMTP valide. Pour les essais du formulaire, utiliser un serveur de capture SMTP : le fichier Excel contient des adresses externes.

```sh
npm run dev
```

Ouvrir http://localhost:5173. Vite relaie `/api` au serveur web 3000 ; le serveur web appelle l'API privée 3001. Il n'y a aucune variable secrète `VITE_*`.

## Lancer le site compilé

Exécuter `npm run build`, puis définir `PUBLIC_ORIGIN=http://localhost:3000` dans `.env`. Ouvrir deux terminaux à la racine du projet :

- Terminal 1 : `npm run start:api`
- Terminal 2 : `npm start`

Ouvrir http://localhost:3000. MySQL doit fonctionner avant de lancer l’API. Pour revenir au mode développement, remettre `PUBLIC_ORIGIN=http://localhost:5173`.

## Compilation et tests

```sh
npm run build
npm test
npm audit
```

Les résultats sont conservés dans `docs/`. Le test HTTP des routes SPA suppose que `npm run build` a été exécuté.
Pour vérifier la vraie base, API démarrée et `.env` configuré :

```sh
node --env-file=.env tests/database-smoke.js
```

Ce contrôle est en lecture seule et suppose les 17 artisans du fichier Excel fourni. Il vérifie les associations Sequelize, la recherche littérale et les trois artisans sélectionnés. Il n'a pas été exécuté sans MySQL disponible.

## Routes

| Interface | Usage |
| --- | --- |
| `/` | Accueil et trois artisans du mois |
| `/artisans?category=1` | Filtre par catégorie |
| `/artisans?q=Chocolaterie&page=1` | Recherche par nom, 12 résultats par page |
| `/artisan/1` | Fiche et formulaire |
| `/mentions-legales`, `/donnees-personnelles`, `/accessibilite`, `/cookies` | Pages en construction |
| Toute autre URL | Page 404 |

API privée (en-tête `x-api-key` obligatoire) : GET `/categories`, GET `/artisans`, GET `/artisans/:id`.
Passerelle publique : GET `/api/categories`, GET `/api/artisans`, GET `/api/artisans/:id`, POST `/api/artisans/:id/contact`.
Contact JSON : `name`, `email`, `subject`, `message`, `website` vide. Codes principaux : 400 validation, 401 API privée, 403 origine, 404 introuvable, 413 taille, 415 format, 429 limite, 503 indisponibilité.

## Organisation

- `frontend/src/main.jsx` : composants React, routes, chargement et formulaire.
- `frontend/src/styles.scss` : styles mobile first et palette du brief.
- `server/api-app.js`, `server/models.js` : API de lecture et modèles Sequelize.
- `server/gateway-app.js` : routes publiques et contact.
- `server/validation.js` : schémas Zod et filtrage des données publiques.
- `sql/01-schema.sql`, `sql/02-seed.sql` : création et alimentation.
- `docs/` : dossier, veille, résultats et recette.

## Identité et droits

Logo et favicon : documents pédagogiques fournis ; vérifier les droits pour un usage public hors exercice. Illustrations SVG : créées pour le projet. Graphik : fournir les fichiers et les droits correspondants. Ne jamais versionner `.env`, des mots de passe ou des données privées.
