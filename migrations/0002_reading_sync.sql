create table if not exists reading_sync (
  user_id text primary key references "user" ("id") on delete cascade,
  snapshot jsonb not null,
  updated_at timestamptz not null default now()
);
