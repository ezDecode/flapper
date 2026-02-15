import { execSync } from "node:child_process";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");

execSync("npx next start", {
  stdio: "inherit",
  cwd: root,
  env: { ...process.env, NEXT_BUILD_DIR: ".next-build" },
});
