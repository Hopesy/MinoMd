/**
 * Markdown 插入 Hook
 */

import { useCallback } from 'react';
import { useMarkdown } from '@/contexts/MarkdownContext';
import { useHistory } from '@/contexts/HistoryContext';

export const useMarkdownInsert = () => {
  const { markdown, setMarkdown } = useMarkdown();
  const { saveHistoryImmediate } = useHistory();

  const insertText = useCallback((before: string, after = '') => {
    const textarea = document.getElementById('editor-textarea') as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const newText = text.substring(0, start) + before + text.substring(start, end) + after + text.substring(end);

    setMarkdown(newText);
    saveHistoryImmediate(newText);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + before.length, end + before.length);
    }, 0);
  }, [markdown, setMarkdown, saveHistoryImmediate]);

  return { insertText };
};
