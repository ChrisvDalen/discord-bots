import assert from "node:assert/strict";
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { afterEach, describe, it } from "node:test";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.join(__dirname, "..", "data");

// The stores resolve their paths at import time, so tests share the real data
// directory and clean up after themselves.
function resetData() {
  rmSync(DATA_DIR, { recursive: true, force: true });
}

const { checkIn } = await import("../src/lib/streakStore.js");
const { isOptedOut, setOptOut } = await import("../src/lib/roastOptOutStore.js");
const { readJson, writeJson } = await import("../src/lib/jsonStore.js");

afterEach(resetData);

describe("jsonStore", () => {
  it("returns the fallback when the store does not exist yet", () => {
    assert.deepEqual(readJson("missing.json", {}), {});
    assert.deepEqual(readJson("missing.json", []), []);
  });

  it("round-trips data", () => {
    writeJson("round-trip.json", { a: 1 });
    assert.deepEqual(readJson("round-trip.json", {}), { a: 1 });
  });

  it("leaves no temp file behind", () => {
    writeJson("clean.json", { a: 1 });
    assert.equal(existsSync(path.join(DATA_DIR, "clean.json.tmp")), false);
  });

  it("does not truncate the previous store when the new value cannot be serialised", () => {
    writeJson("survives.json", { keep: "me" });

    const circular = {};
    circular.self = circular;
    assert.throws(() => writeJson("survives.json", circular));

    // The point of the temp-file-plus-rename: the old data is still readable.
    assert.deepEqual(readJson("survives.json", {}), { keep: "me" });
  });

  it("falls back without throwing when the store is corrupt", () => {
    mkdirSync(DATA_DIR, { recursive: true });
    writeFileSync(path.join(DATA_DIR, "corrupt.json"), "{ not json");
    assert.deepEqual(readJson("corrupt.json", {}), {});
  });
});

describe("streakStore", () => {
  const day = (iso) => new Date(`${iso}T12:00:00Z`);

  it("starts a new user at 1", () => {
    assert.deepEqual(checkIn("u1", day("2026-01-01")), { streak: 1, alreadyCheckedInToday: false });
  });

  it("is idempotent within the same day", () => {
    checkIn("u1", day("2026-01-01"));
    assert.deepEqual(checkIn("u1", day("2026-01-01")), { streak: 1, alreadyCheckedInToday: true });
  });

  it("increments on consecutive days", () => {
    checkIn("u1", day("2026-01-01"));
    checkIn("u1", day("2026-01-02"));
    assert.equal(checkIn("u1", day("2026-01-03")).streak, 3);
  });

  it("resets after a missed day", () => {
    checkIn("u1", day("2026-01-01"));
    checkIn("u1", day("2026-01-02"));
    assert.equal(checkIn("u1", day("2026-01-04")).streak, 1);
  });

  it("keeps users independent", () => {
    checkIn("u1", day("2026-01-01"));
    checkIn("u1", day("2026-01-02"));
    assert.equal(checkIn("u2", day("2026-01-02")).streak, 1);
    assert.equal(checkIn("u1", day("2026-01-03")).streak, 3);
  });

  it("survives a month boundary", () => {
    checkIn("u1", day("2026-01-31"));
    assert.equal(checkIn("u1", day("2026-02-01")).streak, 2);
  });

  it("persists across a fresh read", () => {
    checkIn("u1", day("2026-01-01"));
    const stored = JSON.parse(readFileSync(path.join(DATA_DIR, "streaks.json"), "utf8"));
    assert.deepEqual(stored.u1, { streak: 1, lastCheckIn: "2026-01-01" });
  });
});

describe("roastOptOutStore", () => {
  it("defaults to opted in", () => {
    assert.equal(isOptedOut("u1"), false);
  });

  it("opts a user out and back in", () => {
    setOptOut("u1", true);
    assert.equal(isOptedOut("u1"), true);
    setOptOut("u1", false);
    assert.equal(isOptedOut("u1"), false);
  });

  it("does not affect other users", () => {
    setOptOut("u1", true);
    assert.equal(isOptedOut("u2"), false);
  });

  it("stores a user only once", () => {
    setOptOut("u1", true);
    setOptOut("u1", true);
    assert.deepEqual(readJson("roast-optout.json", []), ["u1"]);
  });
});
