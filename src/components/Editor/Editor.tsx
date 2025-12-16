/**
 * 编辑器组件
 */

import React from 'react';
import { useMarkdown } from '@/contexts/MarkdownContext';
import { useHistory } from '@/contexts/HistoryContext';
import { useScrollSync } from '@/hooks/useScrollSync';
import { useImageUpload } from '@/hooks/useImageUpload';

export const Editor: React.FC = () => {
  const { markdown, setMarkdown, activeTab } = useMarkdown();
  const { saveToHistory } = useHistory();
  const { editorRef, handleScroll } = useScrollSync();
  const { handlePaste } = useImageUpload();

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    setMarkdown(newText);
    saveToHistory(newText);
  };

  return (
    <div className={`flex-1 bg-white flex flex-col transition-all duration-300 ${activeTab === 'preview' ? 'hidden' : 'block'}`}>
      <textarea
        ref={editorRef}
        onScroll={() => handleScroll('editor')}
        id="editor-textarea"
        className="w-full h-full p-6 resize-none focus:outline-none font-mono text-sm leading-relaxed text-gray-700 overflow-y-auto"
        value={markdown}
        onChange={handleContentChange}
        onPaste={handlePaste}
        placeholder="在此输入 Markdown 内容... (支持 Ctrl+V 粘贴图片)"
        spellCheck={false}
      />
    </div>
  );
};
