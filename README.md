# MinoMd

一个现代化的 Markdown 编辑器，支持实时预览和代码高亮。

## 功能特性

- ✨ **实时预览** - 左右分栏，支持同步滚动
- 🎨 **代码高亮** - Atom One Dark 主题，支持多种语言
- 📸 **图片处理** - 支持 Ctrl+V 粘贴图片、本地图片上传
- 📱 **响应式设计** - 适配桌面和移动端
- ↩️ **撤销/重做** - 完整的历史记录管理（Ctrl+Z / Ctrl+Shift+Z）
- 📤 **导入/导出** - 支持 Markdown 文件的导入导出
- 📋 **微信公众号** - 一键复制为微信公众号格式

## 技术栈

- **React 19.2.0** - UI 框架
- **TypeScript 5.9.3** - 类型系统
- **Vite 7.2.4** - 构建工具
- **Tailwind CSS** - 样式框架
- **react-markdown** - Markdown 渲染
- **lucide-react** - 图标库

## 快速开始

### 安装依赖

```bash
npm install
```

### 开发模式

```bash
npm run dev
```

### 构建生产版本

```bash
npm run build
```

### 预览生产构建

```bash
npm run preview
```

## 使用说明

### 基础编辑

- 使用工具栏快速插入 Markdown 元素（标题、粗体、斜体、引用等）
- 支持标准 Markdown 语法
- 实时预览渲染结果

### 图片功能

1. **粘贴图片**：在编辑器中直接 Ctrl+V 粘贴剪贴板图片
2. **上传图片**：点击工具栏图片按钮选择本地文件

### 导出功能

- **导出 Markdown**：下载为 .md 文件
- **复制格式**：复制为微信公众号格式（保留样式）

### 键盘快捷键

- `Ctrl+Z` - 撤销
- `Ctrl+Shift+Z` 或 `Ctrl+Y` - 重做
- `Ctrl+V` - 粘贴图片（在编辑器中）

## 代码高亮

支持多种编程语言的语法高亮，采用 Atom One Dark 配色方案：

- Python
- JavaScript
- TypeScript
- 更多语言...

## 项目结构

```
MinoMd/
├── src/
│   ├── App.tsx          # 主应用组件
│   ├── main.tsx         # 应用入口
│   └── index.css        # 全局样式（Tailwind）
├── public/              # 静态资源
├── index.html           # HTML 模板
├── vite.config.ts       # Vite 配置
├── tailwind.config.js   # Tailwind 配置
├── postcss.config.js    # PostCSS 配置
└── tsconfig.json        # TypeScript 配置
```

## 许可证

MIT

