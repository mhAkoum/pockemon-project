# PC Pokémon - Front-End Application

Application web React pour la gestion et l'échange de Pokémons.

## 📋 Table des matières

- [Prérequis](#prérequis)
- [Installation](#installation)
- [Scripts disponibles](#scripts-disponibles)
- [Structure du projet](#structure-du-projet)
- [Fonctionnalités](#fonctionnalités)
- [Routes de l'application](#routes-de-lapplication)
- [Backend](#backend)
- [Développement](#développement)
- [Build de production](#build-de-production)
- [Tests](#tests)
- [Linting](#linting)
- [Technologies utilisées](#technologies-utilisées)

---

## Prérequis

- **Node.js** 20 ou supérieur
- **npm** ou **yarn**
- **Docker** et **Docker Compose** (pour le backend)

---

## Installation

1. Cloner le dépôt (si applicable) ou naviguer dans le dossier du projet

2. Installer les dépendances :

```bash
npm install
```

---

## Scripts disponibles

| Commande | Description |
|----------|-------------|
| `npm run dev` | Lance le serveur de développement (Vite) |
| `npm run build` | Construit l'application pour la production |
| `npm run preview` | Prévisualise la build de production |
| `npm run lint` | Vérifie la qualité du code avec ESLint |
| `npm test` | Lance les tests en mode watch |
| `npm test -- --run` | Lance les tests une fois |
| `npm run test:coverage` | Lance les tests avec rapport de couverture |
| `npm run test:ui` | Lance l'interface graphique des tests |

---

## Structure du projet

```
src/
  ├── components/        # Composants réutilisables
  │   ├── Header.tsx
  │   ├── Footer.tsx
  │   ├── ProtectedRoute.tsx
  │   └── PokemonSelectModal.tsx
  ├── pages/             # Pages de l'application
  │   ├── Home.tsx
  │   ├── About.tsx
  │   ├── Login.tsx
  │   ├── Register.tsx
  │   ├── BoxList.tsx
  │   ├── BoxDetail.tsx
  │   ├── BoxCreate.tsx
  │   ├── PokemonDetail.tsx
  │   ├── PokemonAdd.tsx
  │   ├── PokemonSearch.tsx
  │   ├── TrainerProfile.tsx
  │   ├── TrainerSearch.tsx
  │   ├── ProfileEdit.tsx
  │   ├── TradeList.tsx
  │   ├── TradeDetail.tsx
  │   └── TradeCreate.tsx
  ├── contexts/          # Context providers React
  │   └── AuthContext.tsx
  ├── services/          # Services API
  │   ├── api.ts
  │   ├── authService.ts
  │   ├── boxService.ts
  │   ├── pokemonService.ts
  │   ├── trainerService.ts
  │   └── tradeService.ts
  ├── types/             # Définitions TypeScript
  │   ├── auth.ts
  │   ├── box.ts
  │   ├── pokemon.ts
  │   ├── trainer.ts
  │   └── trade.ts
  ├── utils/             # Fonctions utilitaires
  │   ├── errors.ts
  │   └── storage.ts
  └── test/              # Configuration des tests
      └── setup.ts
```

---

## Fonctionnalités

### 🔐 Authentification
- **Inscription** : Création de compte avec email, nom, prénom, date de naissance
- **Connexion** : Authentification avec email et mot de passe
- **Déconnexion** : Gestion de la session utilisateur
- **Protection des routes** : Accès restreint aux pages nécessitant une authentification

### 📦 Gestion des Boîtes
- **Liste des boîtes** : Affichage de toutes les boîtes du trainer
- **Création de boîte** : Création d'une nouvelle boîte (nom max 16 caractères)
- **Détails de boîte** : Visualisation des Pokémons contenus dans une boîte
- **Navigation** : Liens vers les détails des Pokémons

### 🎮 Gestion des Pokémons
- **Ajout de Pokémon** : Création d'un nouveau Pokémon avec toutes ses caractéristiques
  - Espèce, nom, niveau (1-100)
  - Genre (MALE, FEMALE, NOT_DEFINED)
  - Taille, poids
  - Statut shiny
  - Assignation à une boîte
- **Détails de Pokémon** : Affichage complet des informations d'un Pokémon
- **Recherche de Pokémons** : Recherche avec filtres avancés
  - Filtres : espèce, niveau (min/max), genre, taille (min/max), poids (min/max), shiny
  - Pagination
  - Synchronisation avec l'URL (query parameters)
- **Suppression** : Suppression d'un Pokémon (propriétaire uniquement)

### 👤 Gestion des Trainers
- **Profil** : Affichage des informations du trainer
  - Nom, prénom, email, date de naissance
- **Édition de profil** : Modification des informations personnelles
  - Changement de mot de passe optionnel
  - Validation des données
- **Recherche de trainers** : Recherche d'autres trainers
  - Filtres : prénom, nom, email
  - Pagination
  - Accès au profil et création de trade

### 🔄 Système d'Échange
- **Liste des trades** : Affichage de tous les trades du trainer
  - Filtrage par statut (PROPOSITION, ACCEPTED, DECLINED)
  - Tri ascendant/descendant
  - Pagination
- **Création de trade** : Proposition d'échange
  - Sélection de jusqu'à 6 Pokémons à offrir
  - Sélection de jusqu'à 6 Pokémons à demander
  - Validation avant envoi
- **Détails de trade** : Visualisation complète d'un trade
  - Informations du sender et receiver
  - Liste des Pokémons offerts et demandés
  - Actions disponibles selon le statut
- **Acceptation/Refus** : Gestion des trades reçus
  - Acceptation d'un trade (receiver uniquement)
  - Refus d'un trade (receiver uniquement)
  - Confirmation avant action

---

## Routes de l'application

### Routes publiques
- `/` - Page d'accueil
- `/login` - Connexion
- `/register` - Inscription
- `/about` - À propos

### Routes protégées (nécessitent une authentification)

#### Boîtes
- `/boxes` - Liste des boîtes
- `/boxes/create` - Création d'une boîte
- `/boxes/:boxId` - Détails d'une boîte

#### Pokémons
- `/pokemons/add` - Ajout d'un Pokémon
- `/pokemons/search` - Recherche de Pokémons
- `/pokemons/:pokemonId` - Détails d'un Pokémon

#### Trainers
- `/profile` - Profil du trainer connecté
- `/profile/edit` - Édition du profil
- `/trainers/search` - Recherche de trainers
- `/trainers/:trainerId` - Profil d'un autre trainer

#### Trades
- `/trades` - Liste des trades
- `/trades/create` - Création d'un trade (avec `?receiverId=X`)
- `/trades/:tradeId` - Détails d'un trade

---

## Backend

Le backend est fourni dans le dossier `backend-bundle/` et **ne doit pas être commité**.

### Lancer le backend

1. Naviguer dans le dossier backend :

```bash
cd backend-bundle
```

2. Démarrer la base de données :

```bash
docker-compose up db
```

3. Dans un autre terminal, démarrer l'API :

```bash
docker-compose up api
```

**Note** : Attendre que la base de données soit complètement démarrée avant de lancer l'API.

L'API sera accessible sur `http://localhost:8000`.

### Configuration du proxy

Le frontend utilise un proxy Vite pour éviter les problèmes CORS en développement. Les requêtes vers `/api/*` sont automatiquement redirigées vers `http://localhost:8000`.

---

## Développement

### Démarrage rapide

1. **Lancer le backend** (voir section [Backend](#backend))

2. **Lancer le frontend** :

```bash
npm run dev
```

L'application sera accessible sur `http://localhost:5173`.

### Hot Module Replacement (HMR)

Vite offre un rechargement automatique lors des modifications du code.

---

## Build de production

### Créer la build

```bash
npm run build
```

La build sera créée dans le dossier `dist/`.

### Prévisualiser la build

```bash
npm run preview
```

Le serveur de prévisualisation démarre généralement sur `http://localhost:4173`.

**Note** : Pour une fonctionnalité complète, le backend doit être en cours d'exécution.

---

## Tests

### Lancer les tests

```bash
# Mode watch (re-exécution automatique)
npm test

# Exécution unique
npm test -- --run

# Interface graphique
npm run test:ui
```

### Couverture de code

Les tests doivent maintenir une couverture **> 75%**.

```bash
npm run test:coverage
```

Le rapport de couverture sera généré dans le dossier `coverage/`. Ouvrir `coverage/index.html` dans un navigateur pour voir le rapport détaillé.

### Structure des tests

- Tests unitaires pour les composants
- Tests unitaires pour les services
- Tests unitaires pour les utilitaires
- Tests d'intégration pour les pages

---

## Linting

Le code doit respecter les règles ESLint (configuré avec **Airbnb**).

### Vérifier le code

```bash
npm run lint
```

### Corriger automatiquement

```bash
npm run lint -- --fix
```

### Règles principales

- Pas d'erreurs ESLint
- Pas d'avertissements
- Formatage cohérent
- Bonnes pratiques React
- Accessibilité (ARIA)

---

## Technologies utilisées

### Core
- **React** 18.3 - Bibliothèque UI
- **TypeScript** 5.5 - Typage statique
- **Vite** 5.4 - Build tool et dev server

### Routing
- **React Router DOM** 6.26 - Gestion des routes

### HTTP Client
- **Axios** 1.7 - Requêtes HTTP

### Styling
- **Tailwind CSS** 3.4 - Framework CSS utility-first

### Testing
- **Vitest** 2.0 - Framework de tests
- **React Testing Library** 16.0 - Tests de composants
- **@testing-library/user-event** 14.5 - Simulation d'interactions utilisateur

### Code Quality
- **ESLint** 8.57 - Linter JavaScript/TypeScript
- **Airbnb ESLint Config** - Configuration de règles

### Icons
- **React Icons** 5.3 - Bibliothèque d'icônes

---

## Configuration

### TypeScript

Le projet utilise TypeScript en mode strict. La configuration se trouve dans `tsconfig.json`.

### Vite

La configuration Vite inclut :
- Proxy pour le backend en développement
- Alias de chemins (`@/*` pour `src/*`)
- Configuration de build optimisée

### ESLint

Configuration ESLint avec :
- Règles Airbnb
- Support TypeScript
- Règles React et React Hooks
- Règles d'accessibilité

---

## Notes importantes

### Backend Bundle

⚠️ **IMPORTANT** : Le dossier `backend-bundle/` est exclu du contrôle de version (`.gitignore`). Ne jamais commiter ce dossier.

### Variables d'environnement

Le projet utilise un proxy Vite en développement. Aucune variable d'environnement n'est nécessaire pour le développement local.

### Accessibilité

L'application inclut des attributs ARIA pour améliorer l'accessibilité. Tous les formulaires et interactions doivent être accessibles au clavier.

### Gestion des erreurs

Toutes les erreurs API sont capturées et affichées de manière conviviale à l'utilisateur. Les messages d'erreur sont extraits de la réponse API ou affichés avec un message générique.

---

## Support

Pour toute question ou problème, consulter :
- La documentation du projet
- Les guides de test (`TEST_STEP*.md`)
- Les commentaires dans le code

---

## Licence

Ce projet est un projet académique.

---

**Dernière mise à jour** : Décembre 2024
