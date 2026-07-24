import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.join(__dirname, "..", "..", "data");
const STORE_PATH = path.join(DATA_DIR, "roast-optout.json");

function readStore() {
  if (!existsSync(STORE_PATH)) return [];
  try {
    return JSON.parse(readFileSync(STORE_PATH, "utf8"));
  } catch {
    return [];
  }
}

function writeStore(userIds) {
  if (!existsSync(DATA_DIR)) mkdirSync(DATA_DIR, { recursive: true });
  writeFileSync(STORE_PATH, JSON.stringify(userIds, null, 2));
}

export function isOptedOut(userId) {
  return readStore().includes(userId);
}

export function setOptOut(userId, optedOut) {
  const store = new Set(readStore());
  if (optedOut) {
    store.add(userId);
  } else {
    store.delete(userId);
  }
  writeStore([...store]);
}
