# 统一门户系统

基于 Vue3 + NestJS 的全栈门户配置系统。

## 🚀 功能特性

- **🏢 销售端/测试端免登录首页** - 两个独立的首页展示区域
- **⚙️ 管理员后台** - 配置系统卡片、页面样式、地址信息
- **🎴 系统卡片管理** - 新增、编辑、删除卡片，支持图片上传和即时回显
- **🔄 系统切换** - 管理后台可在销售端和测试端之间切换
- **🐳 Docker 一键部署** - 完整的容器化部署方案
- **⚡ 快速启动** - 优化的 Docker 构建和启动流程
- **📱 响应式设计** - 支持多端访问

## 🛠️ 技术栈

- **前端**: Vue3 + Vite + Pinia + Ant Design Vue + TailwindCSS
- **后端**: NestJS + TypeORM + MySQL + JWT + Multer
- **部署**: docker-compose + Docker 多阶段构建
- **包管理**: npm (前后端独立管理依赖)

## 👤 默认账户

- 用户名: `admin`
- 密码: `admin123`

## 🧭 页面路由

| 路由 | 说明 |
|------|------|
| `/` | 重定向到销售端 |
| `/sales` | 销售端免登录首页 |
| `/test` | 测试端免登录首页 |
| `/admin/login` | 管理员登录页 |
| `/admin/systems` | 管理系统卡片 |

## 🚀 快速启动

```bash
# 启动开发环境
npm run docker:up

# 停止服务
npm run docker:down
```

**✨ 优化特性**：
- ⚡ **快速启动** - 启动时间从 90+ 秒减少到 14 秒
- 🔥 **热更新** - 源码卷挂载，支持实时开发
- 🗄️ **自动数据库初始化** - 创建默认管理员账户（admin/admin123）
- 🖼️ **图片上传优化** - 支持即时回显
- 🏗️ **多阶段构建** - 优化 Docker 层缓存

### 🌐 访问地址

- **前端应用**: http://localhost:5173
- **后端 API**: http://localhost:3000
- **API 文档**: http://localhost:3000/api/docs

## 🌐 生产部署

### 打包和部署

```bash
# 1. 打包镜像（有网环境）
npm run docker:save

# 2. 传输到内网服务器
# 3. 导入镜像并启动
docker load -i prod-images.tar 加载docker
docker images 确认导入成功
docker-compose -f docker-compose.prod.yml up -d --build 启动docker
```

### 🏗️ 构建优化

- 🚀 **启动速度**: 从 90+ 秒减少到 14 秒
- 📦 **镜像优化**: 多阶段构建，依赖分层缓存
- �️ **图片服务**: 修复静态文件服务配置

### 🐛 故障排除

```bash
# 查看日志
docker logs portal-backend

# 重新构建
docker-compose -f docker-compose.prod.yml build --no-cache

# 清理资源
docker-compose -f docker-compose.prod.yml down -v
```

## 📁 项目结构

```
portal-system/
├── docker-compose.dev.yml      # 开发环境配置
├── docker-compose.prod.yml     # 生产环境配置
├── .env                        # 环境变量
├── backend/                    # NestJS 后端
│   ├── src/
│   │   ├── auth/             # 认证模块
│   │   ├── systems/          # 系统管理
│   │   ├── upload/           # 文件上传
│   │   └── config/           # 配置管理
│   └── Dockerfile
├── frontend/                   # Vue3 前端
│   ├── src/
│   │   ├── views/            # 页面组件
│   │   ├── components/       # 通用组件
│   │   └── api/              # API 接口
│   └── Dockerfile
└── volumes/                    # 数据持久化
    ├── mysql/                # 数据库文件
    └── uploads/              # 上传文件
```

## ⚙️ 配置说明

- **数据持久化**: MySQL 和上传文件通过 volumes 持久化
- **环境变量**: 通过 `.env` 文件配置数据库密码、端口等
- **API 文档**: http://localhost:3000/api/docs

## 📄 许可证

MIT
