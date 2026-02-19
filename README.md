# Évoli Odyssey

Jeu Tamagotchi + clicker réalisé avec React + Vite.

## Lancement ultra simple (Windows)

Double-clique simplement sur :

- `launch-game.bat`

Le lanceur fait automatiquement :
1. détection de Node.js / npm,
2. tentative d'installation automatique de Node.js LTS (winget, choco, scoop),
3. installation des dépendances **si nécessaire**,
4. ouverture d'une nouvelle fenêtre pour le serveur (`npm run dev`),
5. attente de disponibilité du serveur,
6. ouverture du navigateur sur `http://127.0.0.1:5173`.

### Si ça ne marche pas

- Un fichier `launch-game.log` est créé à côté du `.bat` avec le détail des erreurs.
- Si Windows demande une autorisation admin pendant l'installation de Node.js, accepte-la.
- Si le navigateur s'ouvre avant la compilation complète, attends quelques secondes puis actualise.

## Lancer manuellement

```bash
npm install
npm run dev
```

Puis ouvrir l'URL affichée dans le terminal (généralement `http://127.0.0.1:5173`).

## Build production

```bash
npm run build
npm run preview
```
