-- Source : data/artisans-source.xlsx (data[1].xlsx), feuille data2.
-- 17 artisans, 15 spécialités, 4 catégories, 3 artisans du mois.
-- Initialisation uniquement : les trois tables doivent être vides.
-- Aucun effacement automatique des données existantes.
SET NAMES utf8mb4;
USE artisans;
START TRANSACTION;
INSERT INTO categories(id,name) VALUES
(1,'Bâtiment'),
(2,'Services'),
(3,'Fabrication'),
(4,'Alimentation');
INSERT INTO specialties(id,name,category_id) VALUES
(1,'Boucher',4),
(2,'Boulanger',4),
(3,'Chocolatier',4),
(4,'Traiteur',4),
(5,'Chauffagiste',1),
(6,'Electricien',1),
(7,'Menuisier',1),
(8,'Plombier',1),
(9,'Bijoutier',3),
(10,'Couturier',3),
(11,'Ferronier',3),
(12,'Coiffeur',2),
(13,'Fleuriste',2),
(14,'Toiletteur',2),
(15,'Webdesign',2);
INSERT INTO artisans(id,name,rating,city,about,email,website,image,featured,specialty_id) VALUES
(1,'Boucherie Dumont',4.5,'Lyon','Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus eleifend ante sem, id volutpat massa fermentum nec. Praesent volutpat scelerisque mauris, quis sollicitudin tellus sollicitudin. ','boucherie.dumond@gmail.com',NULL,'/artisan.svg',0,1),
(2,'Au pain chaud',4.8,'Montélimar','Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus eleifend ante sem, id volutpat massa fermentum nec. Praesent volutpat scelerisque mauris, quis sollicitudin tellus sollicitudin. ','aupainchaud@hotmail.com',NULL,'/artisan.svg',1,2),
(3,'Chocolaterie Labbé',4.9,'Lyon','Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus eleifend ante sem, id volutpat massa fermentum nec. Praesent volutpat scelerisque mauris, quis sollicitudin tellus sollicitudin. ','chocolaterie-labbe@gmail.com','https://chocolaterie-labbe.fr','/artisan.svg',1,3),
(4,'Traiteur Truchon',4.1,'Lyon','Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus eleifend ante sem, id volutpat massa fermentum nec. Praesent volutpat scelerisque mauris, quis sollicitudin tellus sollicitudin. ','contact@truchon-traiteur.fr','https://truchon-traiteur.fr','/artisan.svg',0,4),
(5,'Orville Salmons',5,'Evian','Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus eleifend ante sem, id volutpat massa fermentum nec. Praesent volutpat scelerisque mauris, quis sollicitudin tellus sollicitudin. ','o-salmons@live.com',NULL,'/artisan.svg',1,5),
(6,'Mont Blanc Eléctricité',4.5,'Chamonix','Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus eleifend ante sem, id volutpat massa fermentum nec. Praesent volutpat scelerisque mauris, quis sollicitudin tellus sollicitudin. ','contact@mont-blanc-electricite.com','https://mont-blanc-electricite.com','/artisan.svg',0,6),
(7,'Boutot & fils',4.7,'Bourg-en-bresse','Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus eleifend ante sem, id volutpat massa fermentum nec. Praesent volutpat scelerisque mauris, quis sollicitudin tellus sollicitudin. ','boutot-menuiserie@gmail.com','https://boutot-menuiserie.com','/artisan.svg',0,7),
(8,'Vallis Bellemare',4,'Vienne','Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus eleifend ante sem, id volutpat massa fermentum nec. Praesent volutpat scelerisque mauris, quis sollicitudin tellus sollicitudin. ','v.bellemare@gmail.com','https://plomberie-bellemare.com','/artisan.svg',0,8),
(9,'Claude Quinn',4.2,'Aix-les-bains','Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus eleifend ante sem, id volutpat massa fermentum nec. Praesent volutpat scelerisque mauris, quis sollicitudin tellus sollicitudin. ','claude.quinn@gmail.com',NULL,'/artisan.svg',0,9),
(10,'Amitee Lécuyer',4.5,'Annecy','Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus eleifend ante sem, id volutpat massa fermentum nec. Praesent volutpat scelerisque mauris, quis sollicitudin tellus sollicitudin. ','a.amitee@hotmail.com','https://lecuyer-couture.com','/artisan.svg',0,10),
(11,'Ernest Carignan',5,'Le Puy-en-Velay','Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus eleifend ante sem, id volutpat massa fermentum nec. Praesent volutpat scelerisque mauris, quis sollicitudin tellus sollicitudin. ','e-carigan@hotmail.com',NULL,'/artisan.svg',0,11),
(12,'Royden Charbonneau',3.8,'Saint-Priest','Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus eleifend ante sem, id volutpat massa fermentum nec. Praesent volutpat scelerisque mauris, quis sollicitudin tellus sollicitudin. ','r.charbonneau@gmail.com',NULL,'/artisan.svg',0,12),
(13,'Leala Dennis',3.8,'Chambéry','Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus eleifend ante sem, id volutpat massa fermentum nec. Praesent volutpat scelerisque mauris, quis sollicitudin tellus sollicitudin. ','l.dennos@hotmail.fr','https://coiffure-leala-chambery.fr','/artisan.svg',0,12),
(14,'C''est sup''hair',4.1,'Romans-sur-Isère','Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus eleifend ante sem, id volutpat massa fermentum nec. Praesent volutpat scelerisque mauris, quis sollicitudin tellus sollicitudin. ','sup-hair@gmail.com','https://sup-hair.fr','/artisan.svg',0,12),
(15,'Le monde des fleurs',4.6,'Annonay','Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus eleifend ante sem, id volutpat massa fermentum nec. Praesent volutpat scelerisque mauris, quis sollicitudin tellus sollicitudin. ','contact@le-monde-des-fleurs-annonay.fr','https://le-monde-des-fleurs-annonay.fr','/artisan.svg',0,13),
(16,'Valérie Laderoute',4.5,'Valence','Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus eleifend ante sem, id volutpat massa fermentum nec. Praesent volutpat scelerisque mauris, quis sollicitudin tellus sollicitudin. ','v-laredoute@gmail.com',NULL,'/artisan.svg',0,14),
(17,'CM Graphisme',4.4,'Valence','Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus eleifend ante sem, id volutpat massa fermentum nec. Praesent volutpat scelerisque mauris, quis sollicitudin tellus sollicitudin. ','contact@cm-graphisme.com','https://cm-graphisme.com','/artisan.svg',0,15);
COMMIT;
