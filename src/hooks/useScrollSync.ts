/**
 * 滚动同步 Hook
 */

import { useRef } from 'react';
import { useMarkdown } from '@/contexts/MarkdownContext';

export const useScrollSync = () => {
  const { syncScroll } = useMarkdown();
  const editorRef = useRef<HTMLTextAreaElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const isScrolling = useRef<string | null>(null);

  const handleScroll = (source: string) => {
    if (!syncScroll) return;

    const editor = editorRef.current;
    const preview = previewRef.current;
    if (!editor || !preview) return;
    if (isScrolling.current && isScrolling.current !== source) return;

    isScrolling.current = source;
    let percentage = 0;

    if (source === 'editor') {
      percentage = editor.scrollTop / (editor.scrollHeight - editor.clientHeight);
      preview.scrollTop = percentage * (preview.scrollHeight - preview.clientHeight);
    } else {
      percentage = preview.scrollTop / (preview.scrollHeight - preview.clientHeight);
      editor.scrollTop = percentage * (editor.scrollHeight - editor.clientHeight);
    }

    setTimeout(() => (isScrolling.current = null), 100);
  };

  return {
    editorRef,
    previewRef,
    handleScroll,
  };
};
