CREATE TABLE IF NOT EXISTS writer_applications (
  id TEXT PRIMARY KEY,
  full_name TEXT NOT NULL,
  contact_email TEXT NOT NULL,
  languages JSONB NOT NULL,
  genres JSONB NOT NULL,
  introduction TEXT NOT NULL,
  experience TEXT NOT NULL DEFAULT '',
  motivation TEXT NOT NULL,
  portfolio_url TEXT,
  message TEXT NOT NULL DEFAULT '',
  consent_to_contact BOOLEAN NOT NULL DEFAULT FALSE CHECK (consent_to_contact = TRUE),
  status TEXT NOT NULL DEFAULT 'pending_review'
    CHECK (status IN ('pending_review', 'in_review', 'accepted', 'rejected', 'withdrawn')),
  review_notes TEXT NOT NULL DEFAULT '',
  notification_status TEXT NOT NULL DEFAULT 'not_configured'
    CHECK (notification_status IN ('not_configured', 'pending', 'sent', 'failed')),
  notification_error TEXT,
  submitted_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS writer_applications_submitted_at_idx
  ON writer_applications (submitted_at DESC);

CREATE INDEX IF NOT EXISTS writer_applications_email_submitted_idx
  ON writer_applications (lower(contact_email), submitted_at DESC);
