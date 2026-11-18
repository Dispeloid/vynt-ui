# Contrastes

Le script `scripts/check-contrast.mjs` calcule le contraste WCAG entre les paires listées dans `lint/contrast-pairs.json`, à partir de `tokens/dist/tokens.css`.

- `npm run contrast` : rapport seulement, utilisé par `npm test`.
- `npm run contrast:strict` : échoue si une paire est sous son seuil.

## Résultats actuels

| Paire | Ratio | Seuil | Résultat |
|---|---|---|---|
| Texte principal sur fond principal | 15,67 | 4,5 | OK |
| Texte secondaire sur fond principal | 3,48 | 4,5 | Échec |
| Accent (texte de lien) sur fond principal | 2,83 | 4,5 | Échec |
| Texte sur accent (bouton primaire) | 5,54 | 4,5 | OK |
| Bordure de focus sur fond principal | 2,83 | 3 | Échec |

## Corrections proposées (à valider)

Ce sont des décisions de design. Elles ne sont pas appliquées.

- **Texte secondaire** : passer de `neutral-400` à `neutral-300` (5,92:1).
- **Accent en texte, sur fond sombre** : créer une sémantique `accent-text` pointant vers `red-400` (5,36:1). Le disque et les boutons gardent `red-600`.
- **Bordure de focus** : passer à `red-500` (3,76:1), suffisant pour un élément non textuel (3:1).

Tant que ces décisions ne sont pas prises, `npm test` reste vert grâce au mode rapport. `contrast:strict` échoue, ce qui matérialise la dette.

## Pourquoi c'est important

Un contraste insuffisant ne se voit pas forcément à l'écran de conception, mais il pénalise les personnes malvoyantes et les lectures en plein jour. Le script rend le problème visible à chaque modification des tokens.
