# Lyes Design System

Les tokens, le lint et les icônes du design system de Lyes Ouahrani.

Ce dépôt contient la partie technique du système : les variables de couleur, d'espacement et de rayon, exportées depuis Figma, et les outils pour les utiliser sans valeurs en dur. Les maquettes et le fichier Figma restent la source visuelle.

## Contenu

- `tokens/source/` : export Tokens Studio (primitives, sémantiques, espacement et rayons)
- `tokens/dist/tokens.css` : variables CSS générées à partir de l'export
- `lint/` : vérification qui refuse les couleurs et les tailles écrites en dur
- `icons/` : règles et, à terme, les SVG des icônes
- `docs/` : règles d'usage des tokens et des icônes
- `examples/` : exemples conformes

## Utilisation

```bash
npm run build      # génère tokens/dist/tokens.css
npm run lint       # refuse les valeurs en dur
npm test           # build, lint et test de la fixture
```

Aucune dépendance : Node 22 suffit.

```css
@import "tokens/dist/tokens.css";

.button-primary {
  background: var(--button-primary-bg);
  color: var(--button-primary-text);
  padding: var(--spacing-100) var(--spacing-200);
}
```

## Principe

Deux couches : les **primitives** (valeurs brutes, `--red-600`) et les **sémantiques** (noms d'usage, `--accent`). Un composant consomme toujours une sémantique. Si la couleur de marque change, une seule ligne se modifie.

## Licence

MIT. Voir `LICENSE`.
