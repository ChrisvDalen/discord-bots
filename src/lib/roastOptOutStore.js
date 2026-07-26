import { readJson, writeJson } from "./jsonStore.js";

const STORE_FILE = "roast-optout.json";

export function isOptedOut(userId) {
  return readJson(STORE_FILE, []).includes(userId);
}

export function setOptOut(userId, optedOut) {
  const store = new Set(readJson(STORE_FILE, []));
  if (optedOut) {
    store.add(userId);
  } else {
    store.delete(userId);
  }
  writeJson(STORE_FILE, [...store]);
}
