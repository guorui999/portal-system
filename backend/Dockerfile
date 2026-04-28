ARG NODE_IMAGE=node:24.15-slim

# ---------- 基础阶段：安装依赖 + 复制源码 ----------
FROM ${NODE_IMAGE} AS base
WORKDIR /app
COPY backend/package*.json ./
# 使用 npm ci 替代 npm install，更快且更可靠
RUN npm ci --only=production && npm cache clean --force
COPY backend ./backend

# ---------- 开发依赖阶段 ----------
FROM base AS dev-deps
RUN npm ci

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
WORKDIR /app

COPY backend/package*.json ./
RUN npm install --production

COPY --from=builder /app/backend/dist ./backend/dist
RUN mkdir -p uploads && chown -R node:node uploads

EXPOSE 3000
USER node
CMD ["node", "backend/dist/main"]
