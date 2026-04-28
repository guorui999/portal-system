# 参数化 Node 镜像，默认使用确定性版本
ARG NODE_IMAGE=node:24-alpine

# ---------- 基础阶段：安装依赖 ----------
FROM ${NODE_IMAGE} AS base
WORKDIR /app
COPY frontend/package*.json ./
RUN npm ci
COPY frontend/ ./

# ---------- 开发阶段 ----------
FROM base AS dev
EXPOSE 5173
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "5173"]

# ---------- 构建阶段 ----------
FROM base AS builder
RUN npm run build

# ---------- 生产阶段 ----------
FROM nginx:alpine
# 源码平铺后 dist 直接在 /app/dist
COPY --from=builder /app/dist /usr/share/nginx/html
COPY frontend/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]