FROM node:22-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

FROM deps AS backend-build
COPY tsconfig.server.json ./
COPY server ./server
RUN npx tsc -p tsconfig.server.json
COPY server/infrastructure/db/schema.sql ./dist-server/infrastructure/db/schema.sql

FROM node:22-alpine AS backend
WORKDIR /app
ENV NODE_ENV=production
COPY package.json package-lock.json ./
RUN npm ci --omit=dev
COPY --from=backend-build --chown=node:node /app/dist-server ./dist-server
USER node
EXPOSE 3001
CMD ["node", "dist-server/main.js"]

FROM deps AS frontend-build
ARG VITE_SITE_URL=http://localhost:5173
ENV VITE_SITE_URL=$VITE_SITE_URL
COPY tsconfig.json ./
COPY frontend ./frontend
RUN npx vue-tsc --noEmit -p tsconfig.json && npx vite build --config frontend/vite.config.ts

FROM deps AS frontend
ENV NODE_ENV=production
COPY --from=frontend-build /app/frontend/dist ./frontend/dist
COPY frontend/vite.preview.config.ts ./frontend/vite.preview.config.ts
EXPOSE 4173
CMD ["npx", "vite", "preview", "--config", "frontend/vite.preview.config.ts", "--host", "0.0.0.0", "--port", "4173"]

FROM deps AS backend-dev
COPY tsconfig.server.json ./
COPY server ./server
EXPOSE 3001
CMD ["npx", "tsx", "watch", "server/main.ts"]

FROM deps AS frontend-dev
COPY tsconfig.json ./
COPY frontend ./frontend
EXPOSE 5173
CMD ["npx", "vite", "--config", "frontend/vite.config.ts", "--host", "0.0.0.0", "--port", "5173"]
