/**
 * 文件导入 Hook
 */

import { useRef } from 'react';
import { useMarkdown } from '@/contexts/MarkdownContext';
import { useHistory } from '@/contexts/HistoryContext';

export const useFileImport = () => {
  const { setMarkdown } = useMarkdown();
  const { saveHistoryImmediate } = useHistory();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        const content = e.target.result as string;
        setMarkdown(content);
        saveHistoryImmediate(content);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return {
    fileInputRef,
    handleImportClick,
    handleFileChange,
  };
};
