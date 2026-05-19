# 动漫相册网站模板

一个使用 Next.js 构建的现代化、响应式动漫相册收藏网站模板。该模板提供了一个美观且交互式的方式来展示您的动漫收藏，具有视频背景、天气效果和 Live2D 角色互动等功能。

## 部署

[![部署到 EdgeOne](https://cdnstatic.tencentcs.com/edgeone/pages/deploy.svg)](https://edgeone.ai/pages/new?template=https://github.com/tomcomtang/anime-albums-website&output-directory=./out&build-command=npm%20run%20build)

[更多模板](https://edgeone.ai/pages/templates)

您可以一键快速将此模板部署到 EdgeOne。部署过程将自动：
- 设置 Next.js 环境
- 安装所有依赖项
- 配置构建设置
- 部署到生产就绪环境

## 功能特性

- 🎥 动态视频背景轮播
- 🌤️ 交互式天气效果（雨、雪、晴天）
- 🎭 带有交互式响应的 Live2D 角色
- 📱 完全响应式设计
- 🌐 多语言支持
- 🎨 深色/浅色主题支持
- 📂 基于分类的画廊布局
- 🔄 无限滚动加载
- 🖼️ 带导航的精美图片模态框

## 技术栈

- **框架**：Next.js 14（App Router）
- **语言**：TypeScript
- **样式**：Tailwind CSS
- **UI 组件**：shadcn/ui
- **动画**：Framer Motion
- **Live2D**：Live2D Widget
- **数据源**：AniList GraphQL API

## 快速开始

### 前置要求

- Node.js 18.0 或更高版本
- npm 或 yarn

### 安装步骤

1. 克隆仓库：
```bash
git clone https://github.com/tomcomtang/anime-albums-website.git
cd anime-albums-website
```

2. 安装依赖：
```bash
yarn install
```

3. 获取初始动漫数据：
```bash
node scripts/fetch-anilist-data.js
```
此脚本将从 AniList API 获取动漫数据并在 `public/data` 目录中生成配置文件。

### 开发

运行开发服务器：

```bash
npm run dev
# 或
yarn dev
```

在浏览器中打开 [http://localhost:3000](http://localhost:3000) 查看结果。

### 生产构建

```bash
npm run build
# 或
yarn build
```

如果您想在每次部署时更新动漫数据，可以修改 `package.json` 中的构建脚本：

```json
{
  "scripts": {
    "build": "node scripts/fetch-anilist-data.js && next build"
  }
}
```

然后，您可以启动生产服务器：

```bash
npm run start
# 或
yarn start
```

## 自定义

### 动漫数据

网站使用 `public/data` 目录中的 JSON 配置文件来存储动漫数据。您可以通过以下方式自定义内容：

1. 修改 `public/data` 中的现有 JSON 文件
2. 使用不同参数运行 `fetch-anilist-data.js` 脚本
3. 按照相同结构创建自己的 JSON 文件

### 天气效果

天气效果可以在以下位置自定义：
- `components/weather/weather-effects.tsx`
- `app/globals.css`（天气相关样式）

## 项目结构

```
├── app/                    # Next.js app 目录
│   ├── [locale]/          # 国际化路由
│   ├── gallery/           # 画廊页面
│   └── globals.css        # 全局样式
├── components/            # React 组件
│   ├── gallery/          # 画廊组件
│   ├── live2d/           # Live2D 组件
│   └── weather/          # 天气效果组件
├── lib/                   # 工具函数
├── public/               # 静态文件
│   ├── data/            # 动漫数据 JSON 文件
│   └── videos/          # 背景视频
└── scripts/             # 工具脚本
    └── fetch-anilist-data.js  # 数据获取脚本
```

## 许可证

本项目采用 MIT 许可证。商业使用请参考 [Live2D](https://www.live2d.com/en/terms/) 和 [AniList](https://anilist.gitbook.io/anilist-apiv2-docs/overview/rate-limiting) 的许可条款。

## 参考资料

- [AniList GraphQL API](https://anilist.gitbook.io/anilist-apiv2-docs/) - 动漫数据源
- [Live2D Widget](https://github.com/stevenjoezhang/live2d-widget) - Live2D 集成
