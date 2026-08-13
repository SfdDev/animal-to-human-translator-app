import type { RuleFit } from "../constants/fit";

export type Species = {
  id: string;
  name: string;
  latin: string;
  logic: string;
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
};

export type OptionRow = {
  id: string;
  label: string;
};

export type FormOptions = {
  species: Species;
  sounds: OptionRow[];
  contexts: OptionRow[];
  behaviors: OptionRow[];
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
