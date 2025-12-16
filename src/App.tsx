/**
 * MinoMd - 现代化 Markdown 编辑器
 * 主应用组件
 */

import { MarkdownProvider, HistoryProvider, ImageProvider } from '@/contexts';
import { Header, Toolbar, Editor, Preview } from '@/components';
import { useKeyboardShortcuts } from '@/hooks';

function AppContent() {
  // 注册键盘快捷键
  useKeyboardShortcuts();

  return (
    <div className="flex flex-col h-screen bg-gray-50 text-gray-800 font-sans">
      <Header />
      <Toolbar />
      <main className="flex-1 flex overflow-hidden">
        <Editor />
        <div className="w-px bg-gray-200 hidden md:block" />
        <Preview />
      </main>
    </div>
  );
}

export default function App() {
  return (
    <MarkdownProvider>
      <HistoryProvider>
        <ImageProvider>
          <AppContent />
        </ImageProvider>
      </HistoryProvider>
    </MarkdownProvider>
  );
}
