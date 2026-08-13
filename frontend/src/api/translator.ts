import type { FormOptions, InterpretResult, Species } from "../types/translator";
import { request } from "./http";

export function fetchSpecies(): Promise<Species[]> {
  return request("/api/species");
}

export function fetchForm(speciesId: string): Promise<FormOptions> {
  return request(`/api/form/${encodeURIComponent(speciesId)}`);
}

export function interpret(body: {
  speciesId: string;
  soundId: string;
  contextId: string;
  behaviorId: string;
}): Promise<InterpretResult> {
  return request("/api/interpret", { method: "POST", body: JSON.stringify(body) });
}
