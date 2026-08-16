# --- Build stage ---
FROM node:22-alpine AS build
WORKDIR /app

# Install dependencies first for better layer caching
COPY package.json package-lock.json ./
RUN npm ci

# Copy sources and build
COPY . .
RUN npm run build

# --- Runtime stage ---
FROM node:22-alpine AS runtime
ENV NODE_ENV=production
WORKDIR /app

# Only production dependencies + built assets
COPY --from=build /app/package.json /app/package-lock.json ./
COPY --from=build /app/dist ./dist
RUN npm ci --omit=dev

EXPOSE 3000
CMD ["node", "dist/server.cjs"]
