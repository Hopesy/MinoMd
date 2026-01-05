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
        // 统一换行符：将 \r\n 和 \r 转换为 \n，避免微信导出时出现多余空行
        const content = (e.target.result as string).replace(/\r\n/g, '\n').replace(/\r/g, '\n');
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
