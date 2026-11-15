import { cpSync, mkdirSync, rmSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const out = resolve(repoRoot, "dist");
rmSync(out, { recursive: true, force: true });
mkdirSync(out, { recursive: true });

for (const source of ["index.html", "css", "js", "img", "_headers"]) {
  cpSync(resolve(repoRoot, source), resolve(out, source), { recursive: true });
}
console.log("Sitio de pruebas preparado en dist/: web completa y cabeceras de staging. Agentes/ excluido.");
