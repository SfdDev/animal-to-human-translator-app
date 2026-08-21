import type { SpeciesId } from "../constants/species";

export type ContentBlock =
  { type: "p"; text: string } | { type: "h2"; text: string } | { type: "ul"; items: string[] };

export type Article = {
  slug: string;
  title: string;
  description: string;
  speciesId: SpeciesId;
  published: string;
  summary: string;
  translateSoundHint?: string;
  body: ContentBlock[];
  /** Override for <title>; falls back to title */
  seoTitle?: string;
  /** Override for meta description; falls back to description */
  seoDescription?: string;
};

export type GuideSection = {
  heading: string;
  paragraphs: string[];
};

export type SpeciesGuide = {
  speciesId: SpeciesId;
  title: string;
  description: string;
  heading: string;
  lede: string;
  sections: GuideSection[];
  relatedArticleSlugs: string[];
};

export type FaqItem = {
  question: string;
  answer: string;
};
