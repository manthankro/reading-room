CREATE TABLE IF NOT EXISTS reading_progress (
  user_id TEXT NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
  work_slug TEXT NOT NULL,
  progress JSONB NOT NULL,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (user_id, work_slug)
);
