-- Theme is part of a classroom's identity and cannot change after creation.
-- Existing classrooms keep their current theme; new classrooms choose once.
-- SQLite trigger protects the invariant even if an older Worker PATCH route is still deployed.
CREATE TRIGGER IF NOT EXISTS trg_classes_theme_immutable
BEFORE UPDATE OF theme_id ON classes
FOR EACH ROW
WHEN NEW.theme_id IS NOT OLD.theme_id
BEGIN
  SELECT RAISE(ABORT, 'THEME_LOCKED');
END;
