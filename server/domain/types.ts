import type { RuleFit } from "./scoring/fit.js";

export type { RuleFit };

export type SpeciesLogic = "motivational_human" | "graded_context" | "referential";

export type Species = {
  id: string;
  name: string;
  latin: string;
  logic: SpeciesLogic | string;
  logic_label: string;
  logic_note: string;
};

export type Source = {
  id: string;
  species_id?: string | null;
  authors?: string | null;
  year?: number | null;
  title: string;
  venue?: string | null;
  doi?: string | null;
  url?: string | null;
  how_used?: string | null;
};

export type SoundRow = [speciesId: string, id: string, label: string, description: string];
export type ContextRow = [speciesId: string, id: string, label: string];
export type BehaviorRow = [speciesId: string, id: string, label: string];

export type Rule = {
  id: string;
  species_id: string;
  sound_id: string | null;
  context_id: string | null;
  behavior_id: string | null;
  gloss: string;
  function: string;
  state: string;
  confidence: number;
  why: string;
  not_a_fact: string;
  weak: number;
  sources?: string[];
};

export type InterpretInput = {
  speciesId: string;
  soundId?: string | null;
  contextId?: string | null;
  behaviorId?: string | null;
};

export type Alternative = {
  gloss: string;
  confidence: number;
  fit: RuleFit;
  why: string;
  weak: boolean;
};

export type InterpretResult = {
  species: Species;
  input: { sound: string; context: string; behavior: string } | null;
  uncertain: boolean;
  confidence: number;
  fit: RuleFit;
  gloss: string;
  function: string;
  state: string;
  sources: Source[];
  alternatives: Alternative[];
};

export type FormOptions = {
  species: Species;
  sounds: Array<{ species_id: string; id: string; label: string; description: string | null }>;
  contexts: Array<{ species_id: string; id: string; label: string }>;
  behaviors: Array<{ species_id: string; id: string; label: string }>;
};
