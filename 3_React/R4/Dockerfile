FROM node:22-alpine AS client-build
WORKDIR /app/client
COPY client/package*.json ./
RUN npm ci
COPY client/ ./
RUN npm run build

FROM node:22-alpine AS api-build
WORKDIR /app/api
COPY api/package*.json ./
RUN npm ci
COPY api/ ./
RUN npm run build

FROM node:22-alpine AS production
WORKDIR /app/api
ENV NODE_ENV=production
COPY api/package*.json ./
RUN npm ci --omit=dev
COPY --from=api-build /app/api/dist ./dist
COPY api/database/schema.sql ./dist/database/schema.sql
COPY --from=client-build /app/client/dist /app/client/dist
EXPOSE 4000
CMD ["sh", "-c", "npm run db:init:prod && npm run seed:prod && npm start"]
