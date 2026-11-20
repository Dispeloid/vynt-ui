// Vérifie qu'un chemin est bien REFUSÉ par le lint (code de sortie 1).
// Multiplateforme : fonctionne sous Windows, macOS et Linux.
// Usage : node scripts/expect-fail.mjs lint/fixtures/invalid.css
import { spawnSync } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const target = process.argv[2];
if (!target) {
  console.error("Usage : node scripts/expect-fail.mjs <chemin>");
  process.exit(2);
}

const result = spawnSync(process.execPath, [join(root, "lint", "lint-tokens.mjs"), target], {
  stdio: "ignore",
});

if (result.status === 1) {
  console.log(`OK : ${target} est refusé comme attendu`);
  process.exit(0);
}
console.error(`ERREUR : ${target} aurait dû être refusé (code ${result.status})`);
process.exit(1);
