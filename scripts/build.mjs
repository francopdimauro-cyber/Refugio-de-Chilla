import { copyFileSync, mkdirSync, rmSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const out = resolve(repoRoot, "dist");
rmSync(out, { recursive: true, force: true });
mkdirSync(out, { recursive: true });
copyFileSync(resolve(repoRoot, "index.html"), resolve(out, "index.html"));
console.log("Publicación preparada: dist/index.html (sin exponer agentes/refu.json).");
