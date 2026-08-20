/**
 * Собирает юридические PDF в docs/pdf из frontend/src/content/legal-docs.ts
 * через headless Chrome (кириллица без лишних npm-пакетов).
 *
 *   npm run docs:pdf
 *
 * Оператор: VITE_OPERATOR_NAME / VITE_OPERATOR_EMAIL (или значения по умолчанию).
 */
import { spawnSync } from "node:child_process";
import {
  copyFileSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  readdirSync,
  rmSync,
  unlinkSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import {
  LEGAL_DOCUMENTS,
  fillLegalPlaceholders,
  type LegalDocument,
} from "../frontend/src/content/legal-docs.ts";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const outDir = join(root, "docs", "pdf");
const publicDir = join(root, "frontend", "public", "docs");

const operatorName =
  process.env.VITE_OPERATOR_NAME?.trim() || "Оператор сайта «Перевод сигналов животных»";
const operatorEmail = process.env.VITE_OPERATOR_EMAIL?.trim() || "privacy@example.com";

function chromeBin(): string {
  for (const bin of ["google-chrome", "chromium", "chromium-browser"]) {
    const check = spawnSync("which", [bin], { encoding: "utf8" });
    if (check.status === 0 && check.stdout.trim()) return check.stdout.trim();
  }
  throw new Error("Не найден google-chrome / chromium для печати PDF");
}

function escapeHtml(text: string): string {
  return text
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function fill(text: string): string {
  return fillLegalPlaceholders(text, operatorName, operatorEmail);
}

function documentHtml(doc: LegalDocument): string {
  const blocks = doc.body
    .map((block) => {
      if (block.type === "p") return `<p>${escapeHtml(fill(block.text))}</p>`;
      if (block.type === "h2") return `<h2>${escapeHtml(fill(block.text))}</h2>`;
      return `<ul>${block.items.map((item) => `<li>${escapeHtml(fill(item))}</li>`).join("")}</ul>`;
    })
    .join("\n");

  return `<!doctype html>
<html lang="ru">
<head>
  <meta charset="utf-8" />
  <title>${escapeHtml(fill(doc.title))}</title>
  <style>
    body { font-family: "DejaVu Sans", "Noto Sans", "Liberation Sans", sans-serif; font-size: 11pt; line-height: 1.45; color: #111; margin: 18mm 20mm; }
    h1 { font-size: 16pt; margin: 0 0 6pt; }
    h2 { font-size: 12pt; margin: 14pt 0 6pt; }
    .meta { color: #555; font-size: 9pt; margin-bottom: 10pt; }
    .summary { margin-bottom: 12pt; }
    ul { padding-left: 18pt; margin: 6pt 0; }
    li { margin-bottom: 4pt; }
    .foot { margin-top: 20pt; font-size: 8.5pt; color: #666; border-top: 1px solid #ccc; padding-top: 8pt; }
  </style>
</head>
<body>
  <h1>${escapeHtml(fill(doc.title))}</h1>
  <p class="meta">Дата: ${escapeHtml(doc.published)} · Перевод сигналов животных</p>
  <p class="summary"><strong>${escapeHtml(fill(doc.summary))}</strong></p>
  ${blocks}
  <p class="foot">Документ подготовлен для публикации на сайте в соответствии с требованиями законодательства РФ о персональных данных (152-ФЗ). Файл: /docs/${escapeHtml(doc.slug)}.pdf</p>
</body>
</html>`;
}

function printPdf(chrome: string, htmlPath: string, pdfPath: string): void {
  const result = spawnSync(
    chrome,
    [
      "--headless=new",
      "--disable-gpu",
      "--no-sandbox",
      "--disable-dev-shm-usage",
      `--user-data-dir=${join(tmpdir(), "chrome-docs-pdf")}`,
      "--no-pdf-header-footer",
      `--print-to-pdf=${pdfPath}`,
      pathToFileURL(htmlPath).href,
    ],
    { encoding: "utf8" },
  );
  if (result.status !== 0) {
    throw new Error(
      `Chrome не смог напечатать ${pdfPath}: ${result.stderr || result.stdout || result.status}`,
    );
  }
}

function clearPdfDir(dir: string): void {
  mkdirSync(dir, { recursive: true });
  for (const name of readdirSync(dir)) {
    if (name.endsWith(".pdf")) unlinkSync(join(dir, name));
  }
}

clearPdfDir(outDir);
clearPdfDir(publicDir);

const chrome = chromeBin();
const tmp = mkdtempSync(join(tmpdir(), "animal-legal-docs-"));

try {
  for (const doc of LEGAL_DOCUMENTS) {
    const htmlPath = join(tmp, `${doc.slug}.html`);
    const pdfPath = join(outDir, `${doc.slug}.pdf`);
    writeFileSync(htmlPath, documentHtml(doc), "utf8");
    printPdf(chrome, htmlPath, pdfPath);
    copyFileSync(pdfPath, join(publicDir, `${doc.slug}.pdf`));
    const size = readFileSync(pdfPath).length;
    console.log(`ok ${doc.slug}.pdf (${size} bytes)`);
  }
} finally {
  rmSync(tmp, { recursive: true, force: true });
}

writeFileSync(
  join(outDir, "README.md"),
  `# Юридические PDF (Роскомнадзор / 152-ФЗ)

Файлы собираются командой \`npm run docs:pdf\` из \`frontend/src/content/legal-docs.ts\`.

На сайте: \`/docs/<slug>.pdf\` (копия в \`frontend/public/docs/\`). Ссылки — в футере.

Статьи сайта (\`/articles\`) в PDF не входят.

Оператор подставляется из \`VITE_OPERATOR_NAME\` / \`VITE_OPERATOR_EMAIL\`.
`,
  "utf8",
);

console.log(`Done: ${LEGAL_DOCUMENTS.length} PDF → ${outDir}`);
