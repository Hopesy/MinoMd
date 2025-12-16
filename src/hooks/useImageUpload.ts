/**
 * 图片上传 Hook
 */

import { useRef } from 'react';
import { useMarkdown } from '@/contexts/MarkdownContext';
import { useImage } from '@/contexts/ImageContext';
import { useHistory } from '@/contexts/HistoryContext';

export const useImageUpload = () => {
  const { setMarkdown } = useMarkdown();
  const { addImage } = useImage();
  const { saveHistoryImmediate } = useHistory();
  const imageInputRef = useRef<HTMLInputElement>(null);

  // 处理图片文件（统一逻辑）
  const processImageFile = (file: File | null) => {
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        const fullDataUrl = e.target.result as string;
        const imageId = `img-upload-${Date.now()}`;

        // 存入 Map
        addImage(imageId, fullDataUrl);

        // 插入 Markdown 引用
        const newImageMarkdown = `![图片](local://${imageId})`;

        // 在光标位置插入
        const textarea = document.getElementById('editor-textarea') as HTMLTextAreaElement;
        if (textarea) {
          const start = textarea.selectionStart;
          const end = textarea.selectionEnd;
          const text = textarea.value;
          const newText = text.substring(0, start) + newImageMarkdown + text.substring(end);
          setMarkdown(newText);
          saveHistoryImmediate(newText);
        } else {
          // 兜底：追加到末尾（已经被注释，暂时不使用）
          // setMarkdown(prev => prev + '\n' + newImageMarkdown);
        }
      }
    };
    reader.readAsDataURL(file);
  };

  // 粘贴事件处理
  const handlePaste = (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    const items = e.clipboardData?.items;
    if (!items) return;

    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf('image') !== -1) {
        e.preventDefault();
        const file = items[i].getAsFile();
        processImageFile(file);
        break;
      }
    }
  };

  // 图片上传按钮点击
  const handleImageUploadClick = () => {
    imageInputRef.current?.click();
  };

  // 图片文件选择回调
  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    processImageFile(file || null);
    e.target.value = '';
  };

  return {
    imageInputRef,
    handlePaste,
    handleImageUploadClick,
    handleImageFileChange,
  };
};
