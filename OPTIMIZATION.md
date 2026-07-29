# 团团校园圈 - 项目优化文档

## 项目概述

- **框架**: uni-app + Vue 2 (兼容 Vue 3)
- **目标平台**: 微信小程序（主）、H5、APP
- **状态管理**: `$storage` 本地存储方案（已移除未使用的 Vuex Store）
- **请求层**: TypeScript 封装的统一请求模块

## 项目结构

```
school-circle-mini/
├── api/                    # API 接口定义（TypeScript）
│   └── index.ts
├── common/                 # 公共模块
│   ├── config.js           # 环境配置
│   ├── request.ts          # 统一请求封装
│   ├── storage.ts          # 统一存储管理
│   ├── util.ts             # 工具函数
│   ├── Base64.js           # Base64 编解码
│   └── gotoPage.js         # 页面路由
├── components/             # 全局组件
│   ├── lazy-image/         # 图片懒加载组件
│   ├── card-item/          # 帖子卡片组件
│   └── swiper-image/       # 轮播图组件
├── libs/                   # 第三方库封装
│   └── wechat_auth.js      # 微信授权
├── pages/                  # 主包页面
│   ├── index/              # 首页
│   ├── message/            # 消息
│   ├── add/                # 发帖
│   ├── playmate/           # 搭子
│   ├── personal/           # 我的
│   ├── carddetail/         # 帖子详情
│   ├── chooseschool/       # 选择学校
│   └── screen/             # 开屏
├── package-content/        # 分包：内容相关
├── package-playmate/       # 分包：搭子功能
├── package-user/           # 分包：个人中心
├── package-verify/         # 分包：认证流程
├── package-account/        # 分包：账号管理
├── package-agreement/      # 分包：协议页面
├── types/                  # TypeScript 类型定义
│   └── modules.d.ts
├── static/                 # 静态资源（图片、字体）
├── pages.json              # 页面路由与分包配置
├── main.js                 # 应用入口
└── package.json            # 依赖管理
```

## 优化内容记录

### 1. 代码质量

#### 1.1 清理冗余日志
- 删除全项目 56 处 `console.log` 调试输出
- 仅保留错误处理中的必要日志

#### 1.2 代码规范
- 配置 ESLint + TypeScript 规则
- 配置 Prettier 统一代码格式
- 可用脚本：
  ```bash
  npm run lint          # 检查代码规范
  npm run lint:fix      # 自动修复
  npm run format        # 格式化代码
  npm run format:check  # 检查格式
  npm run typecheck     # TypeScript 类型检查
  ```

#### 1.3 TypeScript 迁移
- `common/request.ts` - 请求层完整类型定义
- `common/storage.ts` - 存储层类型定义
- `common/util.ts` - 工具函数类型标注
- `api/index.ts` - API 接口层
- `types/modules.d.ts` - 全局模块声明

### 2. 性能优化

#### 2.1 图片懒加载
- 实现 `components/lazy-image/lazy-image.vue` 全局懒加载组件
- 基于 `IntersectionObserver` 实现视口检测
- 支持自定义占位图、加载阈值、宽高控制
- 已替换以下页面中的 `<image>` 标签：
  - `components/card-item/card-item.vue`
  - `components/swiper-image/swiper-image.vue`
  - `pages/message/message.vue`
  - `pages/carddetail/carddetail.vue`
  - `pages/playmate/playmate.vue`
  - `package-playmate/playmate-detail/playmate-detail.vue`
  - `package-content/group-content/group-content.vue`
  - `package-user/my-message/my-message.vue`
  - `package-user/my-follow/my-follow.vue`

**使用方式：**
```vue
<!-- 替代 <image class="my-class" :src="url" mode="aspectFill" /> -->
<lazy-image :src="url" mode="aspectFill" custom-class="my-class" />
```

**Props：**
| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| src | String | '' | 图片地址 |
| mode | String | 'scaleToFill' | 裁剪模式 |
| customClass | String | '' | 自定义 class（应用到 wrapper） |
| customStyle | String/Object | '' | 自定义样式 |
| placeholder | String | 默认头像 | 占位图 |
| rootMargin | Number | 100 | 预加载距离(px) |
| width | String | '' | 宽度 |
| height | String | '' | 高度 |

#### 2.2 分包优化
- 已配置 6 个分包，主包仅保留核心页面
- 分包策略：
  - 主包：首页、消息、发帖、搭子、我的、详情等核心页面
  - `package-content`：内容发布相关
  - `package-playmate`：搭子功能
  - `package-user`：个人中心扩展
  - `package-verify`：认证流程
  - `package-account`：账号管理
  - `package-agreement`：协议页面

#### 2.3 API 防抖节流
- `common/util.ts` 新增 `debounce` 和 `throttle` 工具函数
- 已挂载到全局：`this.$util.debounce(fn, 500)`
- `common/request.ts` 内置 `pendingRequests` 防重复提交机制

### 3. 架构重构

#### 3.1 统一请求层 (`common/request.ts`)
功能特性：
- **请求/响应拦截器**：统一处理 Token 注入、错误码
- **接口缓存**：基于 Map 的内存缓存，支持 TTL 过期
- **防重复提交**：相同请求自动去重
- **统一错误处理**：401 自动跳转登录，网络异常提示
- **内容类型支持**：form / json 两种格式

```typescript
// 使用示例
this.$request.globalRequest('/api/xxx', 'GET', { page: 1 }, 'form', 5000)
// 参数：url, method, data, contentType, cacheTTL(ms, 0=不缓存)
```

#### 3.2 统一存储层 (`common/storage.ts`)
功能特性：
- **命名空间管理**：`$storage.token.set()` / `$storage.token.get()`
- **数据序列化**：自动 JSON 序列化/反序列化
- **过期时间**：支持设置 TTL
- **加密存储**：内置 XOR + Base64 加密（默认关闭，可配置启用）

```typescript
// 预设命名空间
this.$storage.token.set('xxx')        // Token
this.$storage.userInfo.set({ ... })   // 用户信息
this.$storage.unreadCount.set({ ... }) // 未读数

// 通用存储
this.$storage.config.set('key', value)
this.$storage.config.get('key', defaultValue)
```

#### 3.3 清理 Vuex Store
- 移除 `store/index.ts`（100% 死代码，未被任何组件引用）
- 项目实际使用 `$storage` 管理状态，无需 Vuex
- 移除 `main.js` 中 store 导入和挂载
- 移除 `types/modules.d.ts` 中 vuex 模块声明

#### 3.4 工具函数 (`common/util.ts`)
全局挂载：`this.$util`

| 方法 | 说明 |
|------|------|
| `formatTime(seconds)` | 格式化时间为 HH:MM:SS |
| `formatLocation(longitude, latitude)` | 格式化经纬度 |
| `dateUtils` | 日期工具集 |
| `getNowTime()` | 获取当前时间字符串 |
| `getNowDate()` | 获取当前日期字符串 |
| `checkEmail(email)` | 邮箱格式校验 |
| `getDateBeforeNow(days)` | 获取 N 天前的日期 |
| `debounce(fn, delay)` | 防抖函数（默认 500ms） |
| `throttle(fn, delay)` | 节流函数（默认 300ms） |

### 4. 全局挂载

`main.js` 中挂载到 Vue 原型的全局对象：

| 挂载名 | 来源 | 说明 |
|--------|------|------|
| `$request` | common/request.ts | 统一请求 |
| `$api` | api/index.ts | API 接口 |
| `$configData` | common/config.js | 环境配置 |
| `$Base64` | common/Base64.js | Base64 工具 |
| `$storage` | common/storage.ts | 统一存储 |
| `$util` | common/util.ts | 工具函数 |
| `$wechatAuth` | libs/wechat_auth.js | 微信授权 |

## 开发规范

### 命名规范
- **文件名**：kebab-case（如 `card-item.vue`、`playmate-detail.vue`）
- **组件名**：PascalCase（如 `LazyImage`、`CardItem`）
- **CSS 类名**：camelCase 或 kebab-case，保持页面内一致
- **变量/函数**：camelCase
- **常量**：UPPER_SNAKE_CASE

### 组件开发
- 优先使用 `components/` 下的全局组件
- uni-app 自动注册规则：`components/组件名/组件名.vue`
- 动态图片使用 `<lazy-image>` 替代 `<image>`
- 静态图标/装饰图可继续使用 `<image>`

### API 调用
```javascript
// 标准 API 调用方式
this.$api.getSendCardList({ page: 1, size: 10 }).then(res => {
    // 处理响应
}).catch(err => {
    // 错误已由 request 层统一处理，此处可选
})

// 需要缓存的 GET 请求（缓存 5 分钟）
this.$request.globalRequest('/api/data', 'GET', params, 'form', 300000)
```

### 存储操作
```javascript
// 读取/写入 Token
const token = this.$storage.token.get()
this.$storage.token.set('new-token-value')

// 读取/写入用户信息
const userInfo = this.$storage.userInfo.get()
this.$storage.userInfo.set({ name: 'xxx' })

// 通用配置存储
this.$storage.config.set('theme', 'dark')
const theme = this.$storage.config.get('theme', 'light')  // 带默认值
```

### 新增页面
1. 在对应目录创建 `.vue` 文件
2. 在 `pages.json` 中注册路由
3. 如为新功能模块，放入对应分包目录
4. 动态图片统一使用 `<lazy-image>` 组件

## 待优化项

- [ ] **压缩静态图片**：`static/` 目录下 116 张图片可使用 TinyPNG 批量压缩，预计减少 60% 体积
- [ ] **图片 CDN 迁移**：将大图片迁移至 CDN，进一步减少包体积
- [ ] **Vue 3 迁移**：当前兼容 Vue 3 但未完全迁移，后续可逐步升级
