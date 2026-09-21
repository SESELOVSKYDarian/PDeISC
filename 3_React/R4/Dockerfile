FROM node:22-alpine AS client-build
WORKDIR /app/client
COPY client/package*.json ./
RUN npm ci
COPY client/ ./
RUN npm run build

FROM node:22-alpine AS production
WORKDIR /app/api
ENV NODE_ENV=production
COPY api/package*.json ./
RUN npm ci --omit=dev
COPY api/ ./
COPY --from=client-build /app/client/dist /app/client/dist
EXPOSE 4000
CMD ["sh", "-c", "npm run db:init && npm run seed && npm start"]
