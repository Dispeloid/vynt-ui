# Contrastes

Le script `scripts/check-contrast.mjs` calcule le contraste WCAG entre les paires listées dans `lint/contrast-pairs.json`, à partir de `tokens/dist/tokens.css`.

- `npm run contrast` : rapport seulement, utilisé par `npm test`.
- `npm run contrast:strict` : échoue si une paire est sous son seuil.

## Décisions prises

- **Liens** : pas de rouge, ni au repos ni au survol. Le lien est souligné en `text_primary`, et le survol épaissit le soulignement (1,5 px vers 2 px). Le rouge reste réservé au disque et aux boutons.
- **Focus clavier** : anneau de 2 px en `neutral-50`, soit 15,67:1 sur le fond principal.

## Résultats actuels

| Paire | Ratio | Seuil | Résultat |
|---|---|---|---|
| Texte principal sur fond principal | 15,67 | 4,5 | OK |
| Texte secondaire sur fond principal | 5,92 | 4,5 | OK |
| Texte sur accent (bouton primaire) | 5,54 | 4,5 | OK |
| Anneau de focus sur fond principal | 15,67 | 3 | OK |

## Décision prise : texte secondaire

`text_secondary` pointe vers `neutral-300` (5,92:1 sur le fond principal, 5,43:1 sur le fond secondaire, 4,75:1 sur le fond tertiaire). L'ancien `neutral-400` (3,48:1) était sous le seuil pour un texte courant.

`npm run contrast:strict` passe au vert.
