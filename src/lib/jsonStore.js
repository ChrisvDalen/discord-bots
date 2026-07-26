import { mkdirSync, readFileSync, renameSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.join(__dirname, "..", "..", "data");

export function readJson(fileName, fallback) {
  try {
    return JSON.parse(readFileSync(path.join(DATA_DIR, fileName), "utf8"));
  } catch (error) {
    // A missing store is normal on first run. Anything else means we are about to
    // silently replace real data with an empty store, so make that visible.
    if (error.code !== "ENOENT") {
      console.error(`Could not read ${fileName}, falling back to an empty store:`, error);
    }
    return fallback;
  }
}

// Write to a temp file and rename it into place: rename is atomic, so a crash
// mid-write leaves the previous store intact instead of truncating it.
export function writeJson(fileName, data) {
  mkdirSync(DATA_DIR, { recursive: true });
  const target = path.join(DATA_DIR, fileName);
  const temp = `${target}.tmp`;
  writeFileSync(temp, JSON.stringify(data, null, 2));
  renameSync(temp, target);
}
