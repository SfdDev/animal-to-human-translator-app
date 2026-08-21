# Strapi CMS (блог)

Админка и API статей. Статьи в Postgres (БД `strapi`).

## Через Docker (рекомендуется)

Из корня репозитория:

```bash
docker compose up --build
# или
docker compose -f docker-compose.dev.yml up --build
```

Compose сам:

1. поднимает Postgres;
2. сервис `migrate` создаёт БД `strapi` (если нет) и схему переводчика;
3. стартует Strapi и бэкенд;
4. фронт ждёт healthy backend + strapi.

Админка: http://127.0.0.1:1337/admin — при первом заходе создайте admin.  
Public `find` / `findOne` и seed из `cms/data/articles.seed.json` — в bootstrap Strapi.

## Локально без compose-сервиса strapi

```bash
docker compose up -d postgres
npm run migrate
cp cms/.env.example cms/.env   # если ещё нет
npm run cms
```

## API

- Список: `GET /api/articles`
- По slug: `GET /api/articles?filters[slug][$eq]=myaukanie-u-dveri`

Фронт: `VITE_STRAPI_URL` (по умолчанию `http://127.0.0.1:1337`).
