-- One family's rounds: append-only, deduplicated by (family, player, id). seq orders them
-- for "everything since my last sync".
CREATE TABLE IF NOT EXISTS rounds (
  seq INTEGER PRIMARY KEY AUTOINCREMENT,
  family TEXT NOT NULL,
  player TEXT NOT NULL,
  id TEXT NOT NULL,
  ts INTEGER NOT NULL,
  body TEXT NOT NULL,
  UNIQUE (family, player, id)
);
CREATE INDEX IF NOT EXISTS rounds_family_seq ON rounds (family, seq);

-- One row per player: her name, mascot and language (body), last-write-wins on updated.
-- gone = 1 is a deleted player, kept so every device learns to delete her.
CREATE TABLE IF NOT EXISTS players (
  family TEXT NOT NULL,
  id TEXT NOT NULL,
  body TEXT NOT NULL,
  updated INTEGER NOT NULL,
  gone INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (family, id)
);

-- A family account: its name (lowercased, the login) and a PBKDF2 hash of its password.
-- fails counts wrong passwords in a row; locked is when a lockout ends (ms).
CREATE TABLE IF NOT EXISTS accounts (
  name TEXT PRIMARY KEY,
  display TEXT NOT NULL,
  family TEXT NOT NULL UNIQUE,
  salt TEXT NOT NULL,
  hash TEXT NOT NULL,
  iter INTEGER NOT NULL,
  fails INTEGER NOT NULL DEFAULT 0,
  locked INTEGER NOT NULL DEFAULT 0,
  created INTEGER NOT NULL
);

-- A logged-in device: the SHA-256 of its token, never the token itself.
CREATE TABLE IF NOT EXISTS sessions (
  hash TEXT PRIMARY KEY,
  family TEXT NOT NULL,
  created INTEGER NOT NULL
);

-- A Google account (its stable `sub`, not its email) that opens a family.
CREATE TABLE IF NOT EXISTS google (
  sub TEXT PRIMARY KEY,
  family TEXT NOT NULL
);
