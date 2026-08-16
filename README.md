<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
</div>

# SecretScape — Guide & Calendrier des Lieux Cachés

Plateforme touristique interactive pour découvrir des lieux cachés, insolites et méconnus, composer un calendrier de voyage sur mesure et le générer par IA.

Voir l'app dans AI Studio : https://ai.studio/apps/0f5b3714-7147-4628-93a9-e96d18483dac

## Fonctionnalités

- **Carte interactive** (Leaflet) avec marqueurs par catégorie + géolocalisation
- **Catalogue** en grille avec filtres (ville, catégorie, niveau de secret, recherche)
- **Favoris** persistés en `localStorage`
- **Calendrier de voyage** jour par jour : réordonnancement par drag & drop, distances estimées, export iCal (Google / Apple), impression, partage
- **Génération IA** de lieux cachés et d'itinéraires complets (Gemini `gemini-3.6-flash`)
- **Proposition de lieux** par la communauté
- **Guide audio** (Web Speech API) et copie de coordonnées GPS

## Stack

React 19 · Vite 6 · TypeScript · Tailwind CSS 4 · Leaflet · Express · `@google/genai`

## Démarrer en local

Prérequis : Node.js 20+

1. Installer les dépendances :
   `npm install`
2. Définir la clé API dans `.env.local` :
   `GEMINI_API_KEY="ta_cle"`
3. Lancer :
   `npm run dev` → http://localhost:3000

## Scripts

| Commande         | Description                                   |
| ---------------- | --------------------------------------------- |
| `npm run dev`    | Serveur de dev (Express + Vite middleware)    |
| `npm run lint`   | Typecheck TypeScript                          |
| `npm test`       | Tests unitaires (vitest)                      |
| `npm run build`  | Build frontend + serveur vers `dist/`         |
| `npm start`      | Serveur de production (`NODE_ENV=production`) |
| `npm run clean`  | Supprime `dist/` et artefacts de build        |

## Tests

Les tests unitaires couvrent la logique pure du domaine dans `src/lib/` :
- `ical.test.ts` — génération iCal (dates, UID, échappement)
- `geo.test.ts` — distances Haversine
- `filter.test.ts` — filtres ville / catégorie / niveau / recherche

## Déploiement

### Docker (recommandé)

```bash
docker build -t secretscape .
docker run -p 3000:3000 -e GEMINI_API_KEY="ta_cle" secretscape
```

### Google Cloud Run

```bash
gcloud run deploy secretscape \
  --source . \
  --region europe-west1 \
  --allow-unauthenticated \
  --set-env-vars=GEMINI_API_KEY="ta_cle"
```

### Variables d'environnement

| Variable          | Requise | Description                             |
| ----------------- | ------- | --------------------------------------- |
| `GEMINI_API_KEY`  | Oui     | Clé API Gemini (fonctionnalités IA)     |
| `NODE_ENV`        | Non     | Forcée à `production` par `npm start`   |

> Les routes Gemini (`/api/gemini/*`) sont côté serveur : la clé n'est jamais exposée au client.

## Structure

```
server.ts                 → API Express (Gemini + statique SPA)
src/App.tsx               → état global, filtres, favoris, calendrier
src/lib/                  → logique pure (ical, geo, filter) testée
src/components/           → 8 composants (carte, modales, calendrier…)
src/data/hiddenSpots.ts   → lieux initiaux + labels
```
