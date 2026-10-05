import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { spawn } from "node:child_process";
const root = new URL("../", import.meta.url);
const envFile = fileURLToPath(new URL(".env", root));
if (existsSync(envFile)) process.loadEnvFile(envFile);
const next = fileURLToPath(new URL("node_modules/next/dist/bin/next", root));
const child = spawn(process.execPath, [next, ...process.argv.slice(2)], {
  cwd: fileURLToPath(new URL("apps/web/", root)),
  env: process.env,
  stdio: "inherit",
});
child.on("exit", (code) => process.exit(code ?? 1));
for (const signal of ["SIGINT", "SIGTERM"])
  process.on(signal, () => child.kill(signal));
