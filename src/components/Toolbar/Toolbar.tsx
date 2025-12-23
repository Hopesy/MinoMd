/**
 * 工具栏主组件
 */

import React from 'react';
import {
  Bold,
  Italic,
  Heading1,
  Heading2,
  Heading3,
  Heading4,
  Quote,
  Code,
  List,
  Link as LinkIcon,
  Image as ImageIcon,
  Undo,
  Redo
} from 'lucide-react';
import { ToolbarButton } from './ToolbarButton';
import { useHistory } from '@/contexts/HistoryContext';
import { useMarkdownInsert } from '@/hooks/useMarkdownInsert';
import { useImageUpload } from '@/hooks/useImageUpload';
import { useTheme } from '@/contexts/ThemeContext';

export const Toolbar: React.FC = () => {
  const { undo, redo, canUndo, canRedo } = useHistory();
  const { insertText } = useMarkdownInsert();
  const { handleImageUploadClick, imageInputRef, handleImageFileChange } = useImageUpload();
  const { theme } = useTheme();

  const isDark = theme === 'dark';
  const bgColor = isDark ? '#1e2030' : '#ffffff';
  const borderColor = isDark ? '#363a4f' : '#e5e7eb';
  const dividerColor = isDark ? '#494d64' : '#e5e7eb';

  return (
    <div 
      className="flex items-center gap-1 px-4 py-2 overflow-x-auto no-scrollbar transition-colors"
      style={{ backgroundColor: bgColor, borderBottom: `1px solid ${borderColor}` }}
    >
      {/* 撤销/重做 */}
      <div className="flex items-center gap-1 mr-2 pr-2" style={{ borderRight: `1px solid ${dividerColor}` }}>
        <ToolbarButton icon={<Undo size={18} />} onClick={undo} tooltip="撤销 (Ctrl+Z)" disabled={!canUndo} />
        <ToolbarButton icon={<Redo size={18} />} onClick={redo} tooltip="重做 (Ctrl+Shift+Z)" disabled={!canRedo} />
      </div>

      {/* 标题 */}
      <ToolbarButton icon={<Heading1 size={18} />} onClick={() => insertText('# ')} tooltip="一级标题" />
      <ToolbarButton icon={<Heading2 size={18} />} onClick={() => insertText('## ')} tooltip="二级标题" />
      <ToolbarButton icon={<Heading3 size={18} />} onClick={() => insertText('### ')} tooltip="三级标题" />
      <ToolbarButton icon={<Heading4 size={18} />} onClick={() => insertText('#### ')} tooltip="四级标题" />

      <div className="w-px h-6 mx-2" style={{ backgroundColor: dividerColor }} />

      {/* 格式化 */}
      <ToolbarButton icon={<Bold size={18} />} onClick={() => insertText('**', '**')} tooltip="粗体" />
      <ToolbarButton icon={<Italic size={18} />} onClick={() => insertText('*', '*')} tooltip="斜体" />
      <ToolbarButton
        icon={<span className="font-bold underline text-lg">U</span>}
        onClick={() => insertText('<u>', '</u>')}
        tooltip="下划线 (虚线样式)"
      />
      <ToolbarButton icon={<Quote size={18} />} onClick={() => insertText('> ')} tooltip="引用块" />

      <div className="w-px h-6 mx-2" style={{ backgroundColor: dividerColor }} />

      {/* 插入 */}
      <ToolbarButton icon={<List size={18} />} onClick={() => insertText('- ')} tooltip="列表" />
      <ToolbarButton icon={<Code size={18} />} onClick={() => insertText('```python\n', '\n```')} tooltip="代码块" />
      <ToolbarButton icon={<LinkIcon size={18} />} onClick={() => insertText('[', '](url)')} tooltip="链接" />
      <ToolbarButton icon={<ImageIcon size={18} />} onClick={handleImageUploadClick} tooltip="插入/粘贴图片" />

      {/* 隐藏的图片上传 Input */}
      <input
        type="file"
        ref={imageInputRef}
        onChange={handleImageFileChange}
        accept="image/*"
        className="hidden"
      />
    </div>
  );
};
