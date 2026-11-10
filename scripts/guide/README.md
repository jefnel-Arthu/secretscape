# SecretScape — guide « Bénin, les lieux secrets »

Maquette de validation du guide vendu (PDF A4). Le spécimen fait 10 pages et sert à valider la direction artistique avant la production des 50 fiches.

## Construire le spécimen

```bash
npm run guide:specimen
```

Le PDF est généré dans `scripts/guide/out/secret-scape-specimen.pdf`.

Le build :

1. lit `assets/benin.geo.json` et projette l’outline du Bénin ;
2. génère `assets/benin-map.svg` (carte avec les 9 chapitres) et `assets/benin-outline.svg` (silhouette pour la couverture et le dos) ;
3. imprime `specimen.html` avec Chrome headless (`--headless=new`, A4, marges 0) ;
4. vérifie le nombre de pages.

## Structure du spécimen

| # | Page | Rôle |
|---|------|------|
| 01 | Couverture | Photo Ganvié, bandeau navy, titre Playfair |
| 02 | Page de garde | Épigraphe, intention éditoriale, colophon |
| 03 | Sommaire | 9 chapitres + carnet pratique, photo, chiffres clés |
| 04 | Introduction | Édito + carte des 9 territoires |
| 05 | Ouverture chapitre 02 | Photo Ouidah, grand numéro, sommaire du chapitre |
| 06 | Fiche Ganvié | Fiche « site » avec photo pleine largeur |
| 07 | Fiche La Bouche du Roi | Variante éditoriale photo à gauche + citation |
| 08 | Fiche Jaaba | Fiche restaurant + sélection de tables |
| 09 | Itinéraire 7 jours | Timeline et variantes 4 / 10 jours |
| 10 | Dos | Signature de marque et chiffres clés |

## Fichiers

- `specimen.html` — contenu des 10 pages + audit de mise en page
- `styles.css` — design system (couleurs, typographies, grilles)
- `build.mjs` — carte SVG + impression Chrome + contrôle du PDF
- `assets/fonts/` — Playfair Display (variable + italique), Poppins 300/400/500/600
- `assets/benin.geo.json` — outline simplifié du Bénin
- `assets/specimen-data.json` — données des lieux utilisées dans le spécimen

## Contrôles automatiques

Le spécimen embarque un audit qui s’exécute après chargement des polices :

```bash
chrome --headless=new --allow-file-access-from-files --dump-dom scripts/guide/specimen.html
```

Le bloc `<pre id="audit">` indique, pour chaque page, les images manquantes et le texte qui dépasse. Il est masqué à l’impression.

## Avant la production complète

- [ ] Valider la direction artistique (couverture, densité des fiches, rythme)
- [ ] Sécuriser les droits des 34 visuels externes et remplacer les images basse résolution
- [ ] Rédiger et relire les 50 fiches (32 sites/plages, 12 restaurants, 6 hôtels)
- [ ] Compléter les 9 chapitres, les 3 itinéraires, l’agenda et le répertoire des 296 adresses
- [ ] Ajouter la page de présentation du guide sur le site, sans héberger le PDF
- [ ] Mettre en place Gumroad ou Lemon Squeezy pour le paiement et la livraison
- [ ] Ajouter les crédits photo définitifs et les mentions légales

## Crédits photo du spécimen

- Ganvié : Wikimedia Commons
- La Bouche du Roi, Jaaba, Ouidah : images localisées du projet SecretScape
- Les crédits complets seront consolidés dans l’édition finale.
