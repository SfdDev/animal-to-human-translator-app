export const SPECIES_IDS = ["cat", "dog", "chicken"] as const;
export type SpeciesId = (typeof SPECIES_IDS)[number];

export const TRANSLATE_PATH = "/perevod";

export function isSpeciesId(id: string): id is SpeciesId {
  return (SPECIES_IDS as readonly string[]).includes(id);
}
