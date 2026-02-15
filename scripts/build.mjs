import { execSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const tsConfigPath = resolve(root, "tsconfig.json");

// Snapshot tsconfig.json before build so we can restore it after.
// next build auto-adds its distDir types path to tsconfig.json which
// triggers the dev server's file watcher to restart if it's running.
const tsConfigBefore = readFileSync(tsConfigPath, "utf8");

try {
  execSync("npx next build", {
    stdio: "inherit",
    cwd: root,
    env: { ...process.env, NEXT_BUILD_DIR: ".next-build" },
  });
} finally {
  // Restore tsconfig.json to prevent the dev server from restarting.
  const tsConfigAfter = readFileSync(tsConfigPath, "utf8");
  if (tsConfigAfter !== tsConfigBefore) {
    writeFileSync(tsConfigPath, tsConfigBefore);
  }
}
