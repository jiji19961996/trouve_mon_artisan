# Jeu de données fourni

Source : `data[1].xlsx`, feuille `data2`, reçue le 12 novembre 2026 ; copie originale conservée dans `data/artisans-source.xlsx`.

Le seed contient 17 artisans, 15 spécialités, 4 catégories et 3 artisans du mois. Répartition : Alimentation 4, Bâtiment 4, Fabrication 3, Services 6.

## Correspondance

| Excel | Base |
|---|---|
| Nom | artisans.name |
| Spécialité | specialties.name, liée par artisans.specialty_id |
| Note | artisans.rating |
| Ville | artisans.city |
| A propos | artisans.about |
| Email | artisans.email |
| Site Web | artisans.website ; cellule vide → NULL |
| Catégorie | categories.name, liée par specialties.category_id |
| Top | artisans.featured ; 1 = sélection du mois, 0 = non |

Les identifiants d'artisans suivent l'ordre du fichier (1 à 17). Les catégories gardent les identifiants du menu : Bâtiment 1, Services 2, Fabrication 3, Alimentation 4. Une spécialité n'est créée qu'une fois : les trois coiffeurs partagent la même spécialité.

Les noms, accents, descriptions Lorem ipsum et adresses sont repris sans correction éditoriale, y compris les éventuelles différences d'orthographe entre nom et e-mail. Les apostrophes de `C'est sup'hair` sont échappées dans le SQL. Aucune image n'étant présente, `/artisan.svg` est conservée pour chaque fiche. Aucun message n'a été envoyé aux adresses fournies.

## Import sans Docker

Sur une base neuve, importer `sql/01-schema.sql`, puis `sql/02-seed.sql` avec un compte autorisé à créer/alimenter les tables, par exemple via phpMyAdmin, ou :

```sh
mysql --default-character-set=utf8mb4 -u VOTRE_COMPTE -p < sql/01-schema.sql
mysql --default-character-set=utf8mb4 -u VOTRE_COMPTE -p < sql/02-seed.sql
```

Les scripts utilisent le nom de base `artisans` ; l'adapter dans les deux scripts et dans `.env` si l'hébergeur impose un préfixe. Le compte de l'application reste limité à SELECT.

Le seed sert à initialiser des tables vides : il ne supprime pas les données déjà présentes et n'est pas une migration depuis le précédent jeu fictif. Ne pas l'importer tel quel sur une base contenant l'ancien jeu : préparer une base neuve ou une migration après sauvegarde. Aucun serveur existant n'a été modifié ici.

Pour régénérer le SQL depuis la source (Python 3, sans dépendance) :

```sh
python3 scripts/generate-seed.py
```

Le PDF et les maquettes déjà remis présentent les données de conception initiales ; le présent fichier et le seed décrivent le jeu désormais fourni. Les validations MySQL/SMTP réelles restent à exécuter sur l'environnement cible.
