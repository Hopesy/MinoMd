/**
 * MinoMd - 现代化 Markdown 编辑器
 * 主应用组件
 */

import { MarkdownProvider, HistoryProvider, ImageProvider } from '@/contexts';
import { ThemeProvider, useTheme } from '@/contexts/ThemeContext';
import { Header, Toolbar, Editor, Preview } from '@/components';
import { useKeyboardShortcuts } from '@/hooks';

function AppContent() {
  // 注册键盘快捷键
  useKeyboardShortcuts();
  const { theme } = useTheme();

  return (
    <div
      className="flex flex-col h-screen font-sans transition-colors"
      style={{
        backgroundColor: theme === 'dark' ? '#24273a' : '#f8f9fa',
        color: theme === 'dark' ? '#cad3f5' : '#1f2937'
      }}
    >
      <Header />
      <Toolbar />
      <main className="flex-1 flex overflow-hidden">
        <Editor />
        <div 
          className="w-px hidden md:block" 
          style={{ backgroundColor: theme === 'dark' ? '#494d64' : '#e5e7eb' }}
        />
        <Preview />
      </main>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <MarkdownProvider>
        <HistoryProvider>
          <ImageProvider>
            <AppContent />
          </ImageProvider>
        </HistoryProvider>
      </MarkdownProvider>
    </ThemeProvider>
  );
}
