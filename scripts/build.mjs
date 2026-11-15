import { cpSync, mkdirSync, rmSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const out = resolve(repoRoot, "dist");

rmSync(out, { recursive: true, force: true });
mkdirSync(out, { recursive: true });

for (const source of ["index.html", "css", "js", "img"]) {
  cpSync(resolve(repoRoot, source), resolve(out, source), { recursive: true });
}

console.log("Sitio preparado en dist/: HTML, CSS, JS e imágenes. Se excluye agents/refu.json.");
