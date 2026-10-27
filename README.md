# Créateur de flyers de soutenance

Application de création de flyers de soutenance personnalisés avec aperçu et téléchargement au format PNG.

## Développement local

Prérequis : Node.js et npm.

```sh
npm ci
npm run dev
```

## Commandes

- `npm run build` : compile l'application dans `dist` pour la production.
- `npm run build:dev` : compile en mode développement.
- `npm run preview` : prévisualise la compilation localement.
- `npm run lint` : analyse le code avec ESLint.

## Technologies

React, TypeScript, Vite, shadcn/ui, Tailwind CSS et html-to-image.

Le modèle reprend la composition de l’affiche de référence au format A3 portrait (297 × 420 mm), sans étirer les textes ni les photos. Les champs restent modifiables et le téléchargement PNG est exporté en 3508 × 4961 pixels, avec une résolution de 300 dpi inscrite dans le fichier. Les polices sont embarquées localement avec leurs licences dans `public/fonts`.

## Déploiement

Exécutez `npm run build`, puis publiez le dossier `dist` sur un hébergement statique. Configurez une réécriture vers `index.html` pour les routes de l'application.
