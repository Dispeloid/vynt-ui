// Refuse les valeurs en dur (couleurs hexadécimales, pixels) hors du fichier de tokens.
// Usage : node lint/lint-tokens.mjs [dossier ou fichier...]   (par défaut : examples/ et icons/)
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, dirname, relative, extname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const args = process.argv.slice(2);
const targets = args.length ? args : ["examples", "icons"];
const EXTS = new Set([".css", ".html", ".js", ".mjs", ".ts", ".tsx", ".astro"]);
const IGNORE = new Set(["node_modules", ".git", "dist", "source", "fixtures"]);

// Exceptions documentées (voir docs/tokens.md) : construction de l'asset icône uniquement
const PX_ALLOWED_IN = ["icons/"];
const PX_ALLOWED_VALUES = new Set(["1.5px", "2px"]);

const rules = [
  { id: "hex", re: /#[0-9a-fA-F]{3,8}\b/g, msg: "couleur en dur : utilise une variable var(--…)" },
  { id: "px", re: /\b\d+(\.\d+)?px\b/g, msg: "taille en dur : utilise une variable d'espacement ou de rayon" },
];

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    if (IGNORE.has(name)) continue;
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (EXTS.has(extname(name))) out.push(p);
  }
  return out;
}

const files = targets.flatMap((t) => {
  const p = join(root, t);
  try { return statSync(p).isDirectory() ? walk(p) : [p]; } catch { return []; }
});

let errors = 0;
for (const file of files) {
  const rel = relative(root, file).replace(/\\/g, "/");
  readFileSync(file, "utf8").split("\n").forEach((line, i) => {
    if (rel.startsWith("tokens/") && /--[\w-]+\s*:/.test(line)) return; // déclaration de token
    for (const rule of rules) {
      for (const m of line.matchAll(rule.re)) {
        if (rule.id === "px" && PX_ALLOWED_VALUES.has(m[0]) && PX_ALLOWED_IN.some((p) => rel.startsWith(p))) continue;
        console.error(`${rel}:${i + 1} : ${m[0]} : ${rule.msg}`);
        errors++;
      }
    }
  });
}

if (errors) {
  console.error(`\n${errors} valeur(s) en dur détectée(s).`);
  process.exit(1);
}
console.log(`Lint OK : ${files.length} fichier(s) vérifié(s).`);
