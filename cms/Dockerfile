FROM node:22-bookworm-slim AS strapi-base
WORKDIR /opt/app
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    gcc \
    autoconf \
    automake \
    zlib1g-dev \
    libpng-dev \
    libvips-dev \
    git \
    && rm -rf /var/lib/apt/lists/*
COPY cms/package.json cms/package-lock.json ./
RUN npm ci
COPY cms/ ./
ENV NODE_ENV=production
RUN npm run build

FROM node:22-bookworm-slim AS strapi
WORKDIR /opt/app
RUN apt-get update && apt-get install -y --no-install-recommends libvips42 \
    && rm -rf /var/lib/apt/lists/*
COPY --from=strapi-base /opt/app ./
ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=1337
EXPOSE 1337
CMD ["npm", "run", "start"]
