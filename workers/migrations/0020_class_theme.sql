-- Apply after the existing classes table has been created.
-- Existing classes remain in their familiar classic theme.
ALTER TABLE classes ADD COLUMN theme_id TEXT NOT NULL DEFAULT 'classic';
CREATE INDEX IF NOT EXISTS idx_classes_theme_id ON classes(theme_id);
