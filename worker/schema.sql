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
