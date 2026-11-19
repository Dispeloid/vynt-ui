# Tokens

## Couches

| Couche | Exemple | Rôle |
|---|---|---|
| Primitives | `--red-600` | Valeur brute, nommée par famille et palier |
| Sémantiques | `--accent` | Nom d'usage, pointe vers une primitive |

## Familles

- `neutral` : fonds, textes, bordures (50 à 950)
- `red` : signature unique, ancrée sur `red-600`
- `ambiance` : teal, ochre, brown, sage, navy. Réservée au traitement des images, jamais à l'interface.
- `error`, `warning`, `info`, `success` : statuts, réservés au formulaire de contact

## Espacements et rayons

- `--spacing-0` à `--spacing-800`
- `--border-radius-0` à `--border-radius-500`

## Règles

1. Un composant utilise une sémantique, jamais une primitive.
2. Le rouge de marque passe uniquement par `--accent` et ses dérivés.
3. Pas de dégradé, pas d'effet de texture sur l'interface.
4. Les tokens de statut ne servent que dans le formulaire de contact.

## Exception

La marge de 2 px et le trait de 1,5 px sont des exceptions, limitées à la construction des icônes (`icons/`). Ces valeurs ne sont pas des tokens d'espacement et ne servent jamais à espacer des éléments dans une page.
