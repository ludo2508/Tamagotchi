# Évoli Odyssey

Jeu Tamagotchi + clicker réalisé avec React + Vite.

## Lancement ultra simple (Windows)

Double-clique simplement sur :

- `launch-game.bat`

Ce lanceur fait automatiquement :
1. détection de Node.js / npm,
2. si nécessaire, tentative d'installation automatique de Node.js LTS (winget, choco ou scoop),
3. installation des dépendances (`npm install`),
4. démarrage du serveur (`npm run dev`),
5. ouverture du navigateur sur `http://localhost:5173`.

> Si Windows demande une autorisation administrateur pendant l'installation de Node.js, accepte-la puis laisse le script continuer.

## Lancer manuellement

```bash
npm install
npm run dev
```

Puis ouvrir l'URL affichée dans le terminal (généralement `http://localhost:5173`).

## Build production

```bash
npm run build
npm run preview
```
