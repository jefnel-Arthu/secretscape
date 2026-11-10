<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
</div>

# SecretScape — Guide & Calendrier des Lieux Cachés

Plateforme touristique interactive pour découvrir des lieux cachés, insolites et méconnus, composer un calendrier de voyage sur mesure et le générer par IA.

Voir l'app dans AI Studio : https://ai.studio/apps/0f5b3714-7147-4628-93a9-e96d18483dac

## Fonctionnalités

- **Carte interactive** (Leaflet) avec marqueurs par catégorie + géolocalisation
- **Catalogue** en grille avec filtres (ville, catégorie, niveau de secret, recherche insensible aux accents)
- **Favoris** persistés en `localStorage`
- **Calendrier de voyage** jour par jour : réordonnancement par drag & drop, distances estimées, impression, partage
- **Génération IA** de lieux cachés et d'itinéraires complets (Gemini `gemini-3.6-flash`)
- **Proposition de lieux** par la communauté
- **Galerie et souvenirs** : photos d'événements locales + photos envoyées par les visiteurs, modérées depuis l'espace admin
- **Espace admin** : messages reçus, photos à valider, gestion des lieux et dashboard LiveOps
- **Itinéraires** vers Google Maps (à pied, transports, voiture) depuis la fiche du lieu

## Stack

React 19 · Vite 6 · TypeScript · Tailwind CSS 4 · Leaflet · Express · `@google/genai`

## Démarrer en local

Prérequis : Node.js 20+

1. Installer les dépendances :
   `npm install`
2. Créer `.env.local` (modèle dans `.env.example`) :
   `GEMINI_API_KEY="ta_cle"` et `ADMIN_PASSWORD="mot_de_passe_admin"`
3. Lancer :
   `npm run dev` → http://localhost:3000

Sans `ADMIN_PASSWORD`, l'espace admin répond `503` et reste inaccessible ; le reste du site fonctionne.

## Scripts

| Commande         | Description                                              |
| ---------------- | -------------------------------------------------------- |
| `npm run dev`    | Serveur de dev (Express + Vite middleware)               |
| `npm run lint`   | Typecheck TypeScript                                     |
| `npm test`       | Tests unitaires (vitest)                                 |
| `npm run build`  | Build frontend + serveur vers `dist/`                    |
| `npm start`      | Serveur de production (`NODE_ENV=production`)            |
| `npm run restart`| Rebuild, stoppe le processus sur le port 3000, relance en prod |
| `npm run preview`| Prévisualisation du build Vite                           |
| `npm run clean`  | Supprime `dist/` et artefacts de build                   |

## Tests

Les tests unitaires couvrent la logique pure du domaine dans `src/lib/` :
- `geo.test.ts` — distances Haversine
- `filter.test.ts` — filtres ville / catégorie / niveau, recherche insensible aux accents et aux ligatures, cohérence des villes du catalogue

## Déploiement

### Docker (recommandé)

```bash
docker build -t secretscape .
docker run -p 3000:3000 -e GEMINI_API_KEY="ta_cle" -e ADMIN_PASSWORD="..." secretscape
```

### Google Cloud Run

```bash
gcloud run deploy secretscape \
  --source . \
  --region europe-west1 \
  --allow-unauthenticated \
  --set-env-vars=GEMINI_API_KEY="ta_cle",ADMIN_PASSWORD="..." \
  --set-secrets=...
```

### Variables d'environnement

| Variable          | Requise | Description                                              |
| ----------------- | ------- | -------------------------------------------------------- |
| `GEMINI_API_KEY`  | Oui     | Clé API Gemini (fonctionnalités IA)                       |
| `ADMIN_PASSWORD`  | Oui     | Mot de passe de l'espace admin (vide = espace désactivé)  |
| `NODE_ENV`        | Non     | Forcée à `production` par `npm start`                     |

> Les routes Gemini (`/api/gemini/*`) sont côté serveur : la clé n'est jamais exposée au client.
> Le jeton admin est régénéré à chaque démarrage du serveur : une session ne survit pas à un redémarrage.
> `data/` (messages, photos, statistiques) est ignoré par git et n'est pas versionné.

## Structure

```
server.ts                  → API Express (admin, tracking, Gemini + statique SPA)
src/App.tsx                → état global, filtres, favoris, calendrier
src/lib/                   → logique pure (geo, filter, image, transport, googleMaps, visitorPhotos) testée
src/components/            → 20 composants (carte, galerie, modales, calendrier, admin…)
src/components/dashboard/  → vues LiveOps montées par le dashboard admin
src/data/hiddenSpots.ts    → lieux initiaux + labels
src/data/contact.ts        → coordonnées de l'agence et endpoint Formspree
public/images/localized/   → visuels hébergés localement (galerie, page d'accueil)
scripts/restart-server.cjs → redémarrage build + prod sur le port 3000
```
