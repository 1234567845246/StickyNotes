# StickyNotes 📝

[中文](#中文) | [English](#english)

---

## 中文

### 📖 项目简介

StickyNotes 是一个基于 Electron 和 Vue 3 构建的现代化桌面便签应用程序。它集成了强大的 Markdown 编辑器、智能标签管理、回收站功能和多主题支持，旨在为用户提供高效、美观且功能丰富的便签管理体验。

### ✨ 主要特性

- **📝 便签管理**
  - 创建、编辑、删除和置顶便签
  - 支持便签搜索和快速定位
  - 便签列表排序和筛选

- **🎨 富文本编辑**
  - 集成 md-editor-v3 Markdown 编辑器
  - 支持图片、表格、代码块、数学公式
  - 实时预览和全屏编辑模式
  - 语法高亮和代码折叠

- **🏷️ 标签系统**
  - 智能标签管理和分类
  - 多标签支持，便于组织内容
  - 标签颜色自定义
  - 按标签筛选便签

- **🗑️ 回收站功能**
  - 安全删除机制
  - 支持恢复已删除的便签
  - 彻底删除功能

- **🎨 主题和界面**
  - 多主题支持（系统、明亮、深色）
  - 响应式设计和自适应布局
  - 可调节的侧边栏宽度
  - 现代化 UI 设计

- **🌍 国际化**
  - 完整的中英文双语支持
  - 动态语言切换
  - 本地化界面元素

- **💾 数据管理**
  - 本地 SQLite 数据库存储
  - 数据导入和导出功能
  - 配置项持久化
  - 数据备份和恢复

### 🛠️ 技术栈

- **前端框架**: Vue 3 + TypeScript
- **桌面应用**: Electron
- **状态管理**: Pinia
- **路由管理**: Vue Router
- **构建工具**: Vite
- **编辑器**: md-editor-v3
- **数据库**: Better-SQLite3
- **国际化**: Vue I18n
- **代码高亮**: Highlight.js
- **数学公式**: KaTeX
- **图表支持**: Mermaid

### 🚀 快速开始

#### 环境要求

- Node.js 16.0 或更高版本
- npm 或 yarn 包管理器

#### 安装依赖

```bash
# 克隆项目
git clone <repository-url>
cd HexEditor

# 安装依赖
npm install
# 或者
yarn install
```

#### 开发模式

```bash
# 启动开发服务器
npm run dev
# 或者
yarn dev
```

#### 构建应用

```bash
# 构建生产版本
npm run build
# 或者
yarn build
```

### 📁 项目结构

```
HexEditor/
├── src/
│   ├── Main_renderer/          # 主渲染进程
│   │   ├── components/         # Vue 组件
│   │   ├── router/            # 路由配置
│   │   ├── store/             # 状态管理
│   │   ├── theme/             # 主题配置
│   │   └── views/             # 页面视图
│   ├── main/                  # 主进程
│   │   ├── Config.ts          # 配置管理
│   │   ├── MenuManager.ts     # 菜单管理
│   │   └── db.ts              # 数据库操作
│   └── preload/               # 预加载脚本
├── public/locales/            # 国际化文件
│   ├── en.json               # 英文翻译
│   └── zh.json               # 中文翻译
└── package.json
```

### 🤝 贡献指南

我们欢迎任何形式的贡献！如果您想为这个项目做出贡献，请：

1. Fork 这个项目
2. 创建您的特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交您的更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开一个 Pull Request

### 📄 开源协议

本项目采用 MIT 协议 - 查看 [LICENSE](LICENSE) 文件了解详情。

---

## English

### 📖 Project Introduction

StickyNotes is a modern desktop note-taking application built with Electron and Vue 3. It integrates a powerful Markdown editor, intelligent tag management, trash functionality, and multi-theme support, aiming to provide users with an efficient, beautiful, and feature-rich note management experience.

### ✨ Key Features

- **📝 Note Management**
  - Create, edit, delete, and pin notes
  - Support for note search and quick location
  - Note list sorting and filtering

- **🎨 Rich Text Editing**
  - Integrated md-editor-v3 Markdown editor
  - Support for images, tables, code blocks, and mathematical formulas
  - Real-time preview and full-screen editing mode
  - Syntax highlighting and code folding

- **🏷️ Tag System**
  - Intelligent tag management and categorization
  - Multi-tag support for content organization
  - Custom tag colors
  - Filter notes by tags

- **🗑️ Trash Functionality**
  - Safe deletion mechanism
  - Support for restoring deleted notes
  - Permanent deletion feature

- **🎨 Themes and Interface**
  - Multi-theme support (system, light, dark)
  - Responsive design and adaptive layout
  - Adjustable sidebar width
  - Modern UI design

- **🌍 Internationalization**
  - Complete bilingual support (Chinese and English)
  - Dynamic language switching
  - Localized interface elements

- **💾 Data Management**
  - Local SQLite database storage
  - Data import and export functionality
  - Configuration persistence
  - Data backup and recovery

### 🛠️ Tech Stack

- **Frontend Framework**: Vue 3 + TypeScript
- **Desktop Application**: Electron
- **State Management**: Pinia
- **Router**: Vue Router
- **Build Tool**: Vite
- **Editor**: md-editor-v3
- **Database**: Better-SQLite3
- **Internationalization**: Vue I18n
- **Code Highlighting**: Highlight.js
- **Mathematical Formulas**: KaTeX
- **Chart Support**: Mermaid

### 🚀 Quick Start

#### Requirements

- Node.js 16.0 or higher
- npm or yarn package manager

#### Install Dependencies

```bash
# Clone the project
git clone <repository-url>
cd HexEditor

# Install dependencies
npm install
# or
yarn install
```

#### Development Mode

```bash
# Start development server
npm run dev
# or
yarn dev
```

#### Build Application

```bash
# Build for production
npm run build
# or
yarn build
```

### 📁 Project Structure

```
HexEditor/
├── src/
│   ├── Main_renderer/          # Main renderer process
│   │   ├── components/         # Vue components
│   │   ├── router/            # Router configuration
│   │   ├── store/             # State management
│   │   ├── theme/             # Theme configuration
│   │   └── views/             # Page views
│   ├── main/                  # Main process
│   │   ├── Config.ts          # Configuration management
│   │   ├── MenuManager.ts     # Menu management
│   │   └── db.ts              # Database operations
│   └── preload/               # Preload scripts
├── public/locales/            # Internationalization files
│   ├── en.json               # English translations
│   └── zh.json               # Chinese translations
└── package.json
```

### 🤝 Contributing

We welcome contributions of all kinds! If you'd like to contribute to this project, please:

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

**Made with ❤️ by the StickyNotes Team**
