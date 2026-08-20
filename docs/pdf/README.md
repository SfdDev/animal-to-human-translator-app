# Юридические PDF (Роскомнадзор / 152-ФЗ)

Файлы собираются командой `npm run docs:pdf` из `frontend/src/content/legal-docs.ts`.

На сайте: `/docs/<slug>.pdf` (копия в `frontend/public/docs/`). Ссылки — в футере.

Статьи сайта (`/articles`) в PDF не входят.

Оператор подставляется из `VITE_OPERATOR_NAME` / `VITE_OPERATOR_EMAIL`.
