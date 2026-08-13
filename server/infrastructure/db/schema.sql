CREATE TABLE IF NOT EXISTS species (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  latin TEXT NOT NULL,
  logic TEXT NOT NULL,
  logic_label TEXT NOT NULL,
  logic_note TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS sources (
  id TEXT PRIMARY KEY,
  species_id TEXT REFERENCES species (id) ON DELETE SET NULL,
  authors TEXT,
  year INTEGER,
  title TEXT NOT NULL,
  venue TEXT,
  doi TEXT,
  url TEXT,
  how_used TEXT
);

CREATE TABLE IF NOT EXISTS sounds (
  species_id TEXT NOT NULL REFERENCES species (id) ON DELETE CASCADE,
  id TEXT NOT NULL,
  label TEXT NOT NULL,
  description TEXT,
  PRIMARY KEY (species_id, id)
);

CREATE TABLE IF NOT EXISTS contexts (
  species_id TEXT NOT NULL REFERENCES species (id) ON DELETE CASCADE,
  id TEXT NOT NULL,
  label TEXT NOT NULL,
  PRIMARY KEY (species_id, id)
);

CREATE TABLE IF NOT EXISTS behaviors (
  species_id TEXT NOT NULL REFERENCES species (id) ON DELETE CASCADE,
  id TEXT NOT NULL,
  label TEXT NOT NULL,
  PRIMARY KEY (species_id, id)
);

CREATE TABLE IF NOT EXISTS rules (
  id TEXT PRIMARY KEY,
  species_id TEXT NOT NULL REFERENCES species (id) ON DELETE CASCADE,
  sound_id TEXT,
  context_id TEXT,
  behavior_id TEXT,
  gloss TEXT NOT NULL,
  "function" TEXT,
  state TEXT,
  confidence DOUBLE PRECISION NOT NULL,
  why TEXT NOT NULL,
  not_a_fact TEXT,
  weak SMALLINT NOT NULL DEFAULT 0,
  CONSTRAINT rules_sound_fk FOREIGN KEY (species_id, sound_id) REFERENCES sounds (species_id, id),
  CONSTRAINT rules_context_fk FOREIGN KEY (species_id, context_id) REFERENCES contexts (species_id, id),
  CONSTRAINT rules_behavior_fk FOREIGN KEY (species_id, behavior_id) REFERENCES behaviors (species_id, id)
);

CREATE TABLE IF NOT EXISTS rule_sources (
  rule_id TEXT NOT NULL REFERENCES rules (id) ON DELETE CASCADE,
  source_id TEXT NOT NULL REFERENCES sources (id) ON DELETE CASCADE,
  PRIMARY KEY (rule_id, source_id)
);

CREATE INDEX IF NOT EXISTS rules_species_id_idx ON rules (species_id);
CREATE INDEX IF NOT EXISTS sources_species_year_idx ON sources (species_id, year);
CREATE INDEX IF NOT EXISTS rule_sources_source_id_idx ON rule_sources (source_id);
CREATE INDEX IF NOT EXISTS sounds_species_label_idx ON sounds (species_id, label);
CREATE INDEX IF NOT EXISTS contexts_species_label_idx ON contexts (species_id, label);
CREATE INDEX IF NOT EXISTS behaviors_species_label_idx ON behaviors (species_id, label);
