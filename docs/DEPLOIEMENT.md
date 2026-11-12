# Mise en ligne et dépôt GitHub

## Hébergement

Prévoir un hébergement capable de lancer deux processus Node.js, avec MySQL ou MariaDB et un accès SMTP. Copier le projet, exécuter `npm ci` puis `npm run build`. Importer les scripts SQL dans une base vide et configurer `.env` selon le README. Aucun outil de conteneurisation n’est nécessaire. Sauvegarder la base et tester sa restauration.

Configurer deux services persistants dans le panneau de l’hébergeur ou le gestionnaire de services du serveur, avec le dossier du projet comme répertoire de travail :

- API : `node --env-file=.env server/api.js` (adresse privée `127.0.0.1`, port 3001).
- Site : `node --env-file=.env server/gateway.js` (port 3000, ou `PORT` fourni par l’hébergeur).

Définir `NODE_ENV=production` pour les deux services. Garder `API_URL=http://127.0.0.1:3001`. Seule la passerelle doit être accessible publiquement. Adapter le nom de base dans les scripts et `.env` si l’hébergeur impose un préfixe. Créer un compte SQL limité à SELECT via le panneau ou les instructions du README.

Installer un reverse proxy Nginx sur l'hôte. Exemple HTTP **à compléter avec un certificat TLS avant ouverture au public** :

```nginx
server {
    listen 80;
    server_name artisans.votre-domaine.fr;
    client_max_body_size 32k;
    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Forwarded-For $remote_addr;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Configurer le certificat avec votre procédure Let's Encrypt habituelle et rediriger HTTP vers HTTPS. Définir `PUBLIC_ORIGIN=https://artisans.votre-domaine.fr` et `TRUST_PROXY=1` uniquement si le serveur web n'est joignable que derrière ce proxy de confiance. Nginx remplace X-Forwarded-For pour empêcher la falsification de l'IP utilisée par la limitation.

Démarrer les deux services, ouvrir le domaine, tester toutes les routes en accès direct et après navigation. Tester un message vers une adresse de test maîtrisée et vérifier sa réception. Configurer SPF/DKIM/DMARC du domaine d'envoi. Le message de succès indique la prise en charge par SMTP, pas la lecture par l'artisan.

## GitHub

Créer un dépôt vide depuis son compte GitHub puis, dans le projet :

```sh
git init
git add .
git commit -m "Implémente la plateforme Trouve ton artisan"
git branch -M main
git remote add origin URL_DU_DEPOT_GITHUB
git push -u origin main
```

Remplacer `URL_DU_DEPOT_GITHUB` par l'URL réelle. Vérifier le contenu de `git diff --cached` avant commit ; `.env` doit rester ignoré. Ajouter les URL vérifiées au README et au dossier PDF. Les fichiers de dépendances sont figés par `package-lock.json` ; utiliser `npm ci`.
