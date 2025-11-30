# PC Pokémon - Front-End Application

Application web React pour la gestion et l'échange de Pokémons.

## Pré-requis

- Node.js 20 ou supérieur
- npm ou yarn

## Installation

1. Installer les dépendances :

```bash
npm install
```

## Scripts disponibles

- `npm run dev` - Lance le serveur de développement
- `npm run build` - Construit l'application pour la production
- `npm run preview` - Prévisualise la build de production
- `npm run lint` - Vérifie la qualité du code avec ESLint
- `npm test` - Lance les tests
- `npm run test:coverage` - Lance les tests avec rapport de couverture

## Structure du projet

```
src/
  ├── components/     # Composants réutilisables
  ├── pages/          # Pages de l'application
  ├── contexts/       # Context providers React
  ├── services/       # Services API
  ├── types/          # Définitions TypeScript
  ├── utils/          # Fonctions utilitaires
  └── test/           # Configuration des tests
```

## Backend

Le backend est fourni dans le dossier `backend-bundle/` et ne doit pas être commité.

Pour lancer le backend :

```bash
cd backend-bundle
docker-compose up db
docker-compose up api
```

L'API sera accessible sur `https://localhost:8000`.

## Développement

1. Lancer le backend (voir ci-dessus)
2. Lancer le frontend :

```bash
npm run dev
```

L'application sera accessible sur `http://localhost:5173`.

## Build de production

```bash
npm run build
npm run preview
```

## Tests

Les tests doivent maintenir une couverture > 75%.

```bash
npm run test:coverage
```

## Linting

Le code doit respecter les règles ESLint (configuré avec Airbnb).

```bash
npm run lint
```

