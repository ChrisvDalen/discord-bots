import { readJson, writeJson } from "./jsonStore.js";

const STORE_FILE = "streaks.json";

function todayKey(date) {
  return date.toISOString().slice(0, 10);
}

function daysBetween(a, b) {
  const msPerDay = 24 * 60 * 60 * 1000;
  return Math.round((Date.parse(b) - Date.parse(a)) / msPerDay);
}

// Returns { streak, alreadyCheckedInToday }. `now` is injectable for tests.
export function checkIn(userId, now = new Date()) {
  const store = readJson(STORE_FILE, {});
  const today = todayKey(now);
  const entry = store[userId];

  if (!entry) {
    store[userId] = { streak: 1, lastCheckIn: today };
    writeJson(STORE_FILE, store);
    return { streak: 1, alreadyCheckedInToday: false };
  }

  if (entry.lastCheckIn === today) {
    return { streak: entry.streak, alreadyCheckedInToday: true };
  }

  const gap = daysBetween(entry.lastCheckIn, today);
  entry.streak = gap === 1 ? entry.streak + 1 : 1;
  entry.lastCheckIn = today;
  writeJson(STORE_FILE, store);
  return { streak: entry.streak, alreadyCheckedInToday: false };
}
