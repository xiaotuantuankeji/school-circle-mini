# 团团校园圈

基于 `uni-app` 框架开发的校园社交微信小程序，支持校园动态分享、课程管理、玩伴匹配等功能。

## 技术栈

- **框架**: uni-app (Vue 2 + TypeScript)
- **平台**: 微信小程序
- **构建工具**: HBuilderX / Vue CLI
- **代码规范**: ESLint + Prettier

## 快速上手

### 通过 HBuilderX 可视化界面（推荐）

1. 下载安装 [HBuilderX](https://www.dcloud.io/hbuilderx.html)（App 开发版）
2. 导入项目，选择 `school-circle-mini` 目录
3. 配置微信小程序 AppID
4. 运行到微信小程序

### 通过 CLI

```bash
# 安装依赖
npm install

# 代码检查
npm run lint

# 代码格式化
npm run format

# 类型检查
npm run typecheck
```

## 项目结构

```
school-circle-mini/
├── api/                   # API 接口层
├── common/                # 公共工具库
├── components/            # 公共组件
├── libs/                  # 基础库（WebSocket、微信授权等）
├── pages/                 # 主页面
├── package-account/       # 账号管理分包
├── package-agreement/     # 协议分包
├── package-content/       # 内容分包
├── package-course/        # 课程表分包
├── package-playmate/      # 玩伴功能分包
├── package-user/          # 用户分包
├── package-verify/        # 认证审核分包
├── static/                # 静态资源
├── types/                 # TypeScript 类型定义
├── uni_modules/           # uni-app 插件模块
├── App.vue                # 应用入口
└── main.js                # 主入口
```

## 🚀 快速开始（后端服务部署）

### 环境要求

| 依赖 | 版本 |
|------|------|
| Docker | ≥ 20.10 |
| Docker Compose | ≥ 2.0 |

### 1. 一键启动

```bash
git clone <your-repo-url> && cd mdcgs

# 复制配置
mv .env-example .env

# 启动服务
docker-compose up -d
```

服务地址：`http://localhost:7788**` | 默认账号：**admin** / admin123

### 2. 基础设施（如未准备好 MySQL/Redis）

<details>
<summary>📦 点击展开：快速创建 MySQL + Redis 容器</summary>

```bash
# MySQL
docker run -d --name mysql -p 3306:3306 \
  -e MYSQL_ROOT_PASSWORD=123456 \
  -e MYSQL_ROOT_HOST=% mysql

# 创建数据库
docker exec -it mysql mysql -uroot -p123456 \
  -e "CREATE DATABASE IF NOT EXISTS mdcgs DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci"

# Redis
docker run -d --name redis -p 6379:6379 \
  --restart always redis:7-alpine \
  redis-server --requirepass "123456" --appendonly yes
```

</details>

<details>
<summary>⚙️ 点击展开：.env 配置参考</summary>

```bash
# MySQL
DB_HOST=<宿主机IP，不要127.0.0.1>
DB_PORT=3306
DB_USER=root
DB_PASSWORD=123456
DB_NAME=mdcgs
DATABASE_URL=mysql+pymysql://root:密码@宿主机IP:3306/mdcgs

# Redis
REDIS_URL=redis://<宿主机IP>:6379/0
REDIS_PASSWORD=123456
CELERY_BROKER_URL=redis://:密码@宿主机IP:6379/1
CELERY_RESULT_BACKEND=redis://:密码@宿主机IP:6379/2

# 安全（建议随机生成）
SECRET_KEY=your-random-secret-key
ENCRYPT_KEY=your-32-byte-encryption-key
```

</details>

<details>
<summary>🐳 点击展开：Docker 镜像加速</summary>

```bash
sudo mkdir -p /etc/docker && sudo tee /etc/docker/daemon.json <<EOF
{
  "registry-mirrors": [
    "https://docker.xuanyuan.me",
    "https://docker.1ms.run",
    "https://docker.m.daocloud.io",
    "https://docker.1panel.live",
    "https://docker.hlmirror.com",
    "https://hub.rat.dev",
    "https://docker.mirrors.ustc.edu.cn",
    "https://docker-0.unsee.tech"
  ]
}
EOF
sudo systemctl daemon-reload && sudo systemctl restart docker
```

</details>

## 配置说明

项目开源后已移除敏感信息，使用项目前需要修改以下配置：

| 配置项 | 文件 | 说明 |
|--------|------|------|
| 微信小程序 AppID | `manifest.json` | 将 `mp-weixin.appid` 替换为你的微信小程序 AppID |
| 开发服务器地址 | `common/config.ts` | 将 `XXX.XXX.XXX.XXX:XXXXX` 替换为实际的开发环境服务器地址和端口 |
| 生产服务器地址 | `common/config.ts` | 将 `XXX.XXX.XXX.XXX:XXXXX` 替换为实际的生产环境域名和端口 |
| 学校默认图标 | `pages/chooseschool/chooseschool.vue` | 将 `schoolIcon` 替换为实际的学校图标资源路径 |

## 在线演示

| 项目 | 说明 |
|------|------|
| 演示地址 | `<your-demo-url>` |
| 演示账号 | `demo` |
| 演示密码 | `demo123` |

## 许可证

本项目基于 [Apache License 2.0](LICENSE) 开源。

Copyright &copy; 2026 南京校团团科技有限公司

