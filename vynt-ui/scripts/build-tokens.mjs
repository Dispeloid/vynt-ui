// Transforme les tokens exportés depuis Figma (Tokens Studio) en variables CSS.
// Sans dépendances. Usage : node scripts/build-tokens.mjs
import { readFileSync, writeFileSync, mkdirSync, readdirSync, statSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const srcDir = join(root, "tokens", "source");
const outDir = join(root, "tokens", "dist");

function walkJson(dir) {
  return readdirSync(dir).flatMap((name) => {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) return walkJson(p);
    return name.endsWith(".json") && !name.startsWith("$") ? [p] : [];
  });
}

// Aplatit un fichier Tokens Studio en { "Groupe.sous.nom": valeur }
function flatten(node, prefix = "", out = {}) {
  for (const [key, val] of Object.entries(node)) {
    if (key.startsWith("$")) continue;
    if (val && typeof val === "object" && ("$value" in val || "value" in val)) {
      out[prefix + key] = val.$value ?? val.value;
    } else if (val && typeof val === "object") {
      flatten(val, prefix + key + ".", out);
    }
  }
  return out;
}

// Valeur brute : hex, nombre ou alias "{Groupe.nom}"
function normalize(v) {
  if (v && typeof v === "object" && "hex" in v) return v.hex.toUpperCase();
  if (typeof v === "number") return `${v}px`;
  if (typeof v === "string" && v.startsWith("#")) return v.toUpperCase();
  return String(v);
}

// Nom CSS : dernier segment, en minuscules, underscores remplacés par des tirets
function cssName(path) {
  return path.split(".").pop().replace(/_/g, "-").toLowerCase();
}

const all = {};
for (const file of walkJson(srcDir)) {
  Object.assign(all, flatten(JSON.parse(readFileSync(file, "utf8"))));
}

const lines = [];
const seen = new Set();
for (const [path, raw] of Object.entries(all)) {
  const name = cssName(path);
  if (seen.has(name)) throw new Error(`Nom CSS en double : --${name} (${path})`);
  seen.add(name);
  if (typeof raw === "string" && raw.startsWith("{")) {
    lines.push(`  --${name}: var(--${cssName(raw.slice(1, -1))});`); // alias
  } else {
    lines.push(`  --${name}: ${normalize(raw)};`);
  }
}

const css = `/* Généré par scripts/build-tokens.mjs. Ne pas modifier à la main. */\n:root {\n${lines.join("\n")}\n}\n`;
mkdirSync(outDir, { recursive: true });
writeFileSync(join(outDir, "tokens.css"), css);
console.log(`tokens.css généré : ${lines.length} variables`);
