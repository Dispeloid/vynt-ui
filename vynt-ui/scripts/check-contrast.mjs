// Calcule le contraste WCAG entre paires de sémantiques, à partir de tokens/dist/tokens.css.
// Usage : node scripts/check-contrast.mjs [--strict]
//   Sans --strict : rapport seulement (code 0). Avec --strict : code 1 si une paire échoue.
import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const strict = process.argv.includes("--strict");
const css = readFileSync(join(root, "tokens", "dist", "tokens.css"), "utf8");
const pairs = JSON.parse(readFileSync(join(root, "lint", "contrast-pairs.json"), "utf8"));

// Table des variables : nom -> valeur brute (hex ou var(--autre))
const vars = {};
for (const m of css.matchAll(/--([\w-]+):\s*([^;]+);/g)) vars[m[1]] = m[2].trim();

function resolve(name, depth = 0) {
  if (depth > 10) throw new Error(`Cycle d'alias pour --${name}`);
  const v = vars[name];
  if (v === undefined) throw new Error(`Variable absente : --${name}`);
  const ref = v.match(/^var\(--([\w-]+)\)$/);
  return ref ? resolve(ref[1], depth + 1) : v;
}

function luminance(hex) {
  const h = hex.replace("#", "");
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16) / 255);
  const lin = (c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
}

function contrast(fg, bg) {
  const [l1, l2] = [luminance(fg), luminance(bg)].sort((a, b) => b - a);
  return (l1 + 0.05) / (l2 + 0.05);
}

let failures = 0;
console.log("Paire".padEnd(44), "Ratio".padStart(7), "Seuil".padStart(7), "Résultat");
for (const p of pairs) {
  const fg = resolve(p.fg), bg = resolve(p.bg);
  const ratio = contrast(fg, bg);
  const ok = ratio >= p.min;
  if (!ok) failures++;
  console.log(p.name.padEnd(44), ratio.toFixed(2).padStart(7), String(p.min).padStart(7), ok ? "OK" : "ÉCHEC");
}
console.log(failures ? `\n${failures} paire(s) sous le seuil.` : "\nToutes les paires respectent le seuil.");
process.exit(strict && failures ? 1 : 0);
