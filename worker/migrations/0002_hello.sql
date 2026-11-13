-- A privacy-first visit count: one row per UTC day, site ('pages' | 'cf' | 'other') and whether the device
-- was signed in; no ids, no IP. Additive: a new table only.
CREATE TABLE IF NOT EXISTS hello (
  day TEXT NOT NULL,
  site TEXT NOT NULL,
  signed INTEGER NOT NULL,
  n INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (day, site, signed)
);
