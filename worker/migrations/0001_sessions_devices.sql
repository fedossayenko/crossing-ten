-- Which devices a family has and when each last synced (the Players screen shows them).
-- Additive: existing sessions keep their rows and read last_seen 0 / device '' until they next sync.
ALTER TABLE sessions ADD COLUMN last_seen INTEGER NOT NULL DEFAULT 0;
ALTER TABLE sessions ADD COLUMN device TEXT NOT NULL DEFAULT '';
