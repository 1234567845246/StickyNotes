# StickyNotes 📝

[中文](README-CH) | English

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
