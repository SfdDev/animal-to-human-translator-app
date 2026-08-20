import { docPdfPath } from "../constants/paths";
import { LEGAL_DOCUMENTS } from "./legal-docs";

export type PdfDocument = {
  slug: string;
  title: string;
  shortTitle: string;
  /** /docs/<slug>.pdf */
  pdf: string;
};

export const PDF_DOCUMENTS: PdfDocument[] = LEGAL_DOCUMENTS.map((doc) => ({
  slug: doc.slug,
  title: doc.title,
  shortTitle: doc.shortTitle,
  pdf: docPdfPath(doc.slug),
}));

export function pdfBySlug(slug: string): PdfDocument | undefined {
  return PDF_DOCUMENTS.find((doc) => doc.slug === slug);
}
