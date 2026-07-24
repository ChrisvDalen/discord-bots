import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.join(__dirname, "..", "..", "data");
const STORE_PATH = path.join(DATA_DIR, "streaks.json");

function readStore() {
  if (!existsSync(STORE_PATH)) return {};
  try {
    return JSON.parse(readFileSync(STORE_PATH, "utf8"));
  } catch {
    return {};
  }
}

function writeStore(store) {
  if (!existsSync(DATA_DIR)) mkdirSync(DATA_DIR, { recursive: true });
  writeFileSync(STORE_PATH, JSON.stringify(store, null, 2));
}

function todayKey(date = new Date()) {
  return date.toISOString().slice(0, 10);
}

function daysBetween(a, b) {
  const msPerDay = 24 * 60 * 60 * 1000;
  return Math.round((Date.parse(b) - Date.parse(a)) / msPerDay);
}

// Returns { streak, alreadyCheckedInToday }
export function checkIn(userId) {
  const store = readStore();
  const today = todayKey();
  const entry = store[userId];

  if (!entry) {
    store[userId] = { streak: 1, lastCheckIn: today };
    writeStore(store);
    return { streak: 1, alreadyCheckedInToday: false };
  }

  if (entry.lastCheckIn === today) {
    return { streak: entry.streak, alreadyCheckedInToday: true };
  }

  const gap = daysBetween(entry.lastCheckIn, today);
  entry.streak = gap === 1 ? entry.streak + 1 : 1;
  entry.lastCheckIn = today;
  writeStore(store);
  return { streak: entry.streak, alreadyCheckedInToday: false };
}
