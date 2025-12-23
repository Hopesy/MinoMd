/**
 * 编辑器组件
 */

import React from 'react';
import { useMarkdown } from '@/contexts/MarkdownContext';
import { useHistory } from '@/contexts/HistoryContext';
import { useScrollSync } from '@/hooks/useScrollSync';
import { useImageUpload } from '@/hooks/useImageUpload';
import { useTheme } from '@/contexts/ThemeContext';

export const Editor: React.FC = () => {
  const { markdown, setMarkdown, activeTab } = useMarkdown();
  const { saveToHistory } = useHistory();
  const { editorRef, handleScroll } = useScrollSync();
  const { handlePaste } = useImageUpload();
  const { theme } = useTheme();

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    setMarkdown(newText);
    saveToHistory(newText);
  };

  const isDark = theme === 'dark';
  const bgColor = isDark ? '#24273a' : '#ffffff';
  const textColor = isDark ? '#cad3f5' : '#374151';
  const placeholderColor = isDark ? '#6e738d' : '#9ca3af';

  return (
    <div 
      className={`flex-1 flex flex-col transition-all duration-300 ${activeTab === 'preview' ? 'hidden' : 'block'}`} 
      style={{ backgroundColor: bgColor }}
    >
      <textarea
        ref={editorRef}
        onScroll={() => handleScroll('editor')}
        id="editor-textarea"
        className="w-full h-full p-6 resize-none focus:outline-none font-mono text-sm leading-relaxed overflow-y-auto"
        style={{ 
          backgroundColor: bgColor,
          color: textColor,
          caretColor: isDark ? '#f5a97f' : '#ea580c'
        }}
        value={markdown}
        onChange={handleContentChange}
        onPaste={handlePaste}
        placeholder="在此输入 Markdown 内容... (支持 Ctrl+V 粘贴图片)"
        spellCheck={false}
      />
      <style>{`
        #editor-textarea::placeholder {
          color: ${placeholderColor};
        }
      `}</style>
    </div>
  );
};
