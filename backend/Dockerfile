ARG NODE_IMAGE=node:24.15-slim

# ---------- 开发依赖阶段 ----------
FROM ${NODE_IMAGE} AS dev-deps
WORKDIR /app/backend
COPY backend/package*.json ./
RUN npm ci
COPY backend .

# ---------- 数据库初始化阶段 ----------
FROM dev-deps AS db-init

# ---------- 开发阶段 ----------
FROM dev-deps AS dev
EXPOSE 3000
CMD ["npm", "run", "dev"]
# ---------- 构建阶段 ----------
FROM dev-deps AS builder
RUN npm run build

# ---------- 生产阶段 ----------
FROM ${NODE_IMAGE} AS production
ENV NODE_ENV=production
WORKDIR /app/backend

COPY backend/package*.json ./
RUN npm ci --production && npm cache clean --force

COPY --from=builder /app/backend/dist ./dist
RUN mkdir -p uploads && chown -R node:node uploads

EXPOSE 3000
USER node
CMD ["node", "dist/main"]