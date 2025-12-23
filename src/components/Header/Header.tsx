/**
 * 顶部导航栏组件
 */

import React from 'react';
import {
  Eye,
  Edit3,
  Download,
  Upload,
  Link as LinkIcon,
  Unlink,
  MessageSquare,
  Check,
  Sun,
  Moon
} from 'lucide-react';
import { useMarkdown } from '@/contexts/MarkdownContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useFileImport } from '@/hooks/useFileImport';
import { downloadMarkdown, copyForWeChat } from '@/utils';

export const Header: React.FC = () => {
  const { activeTab, setActiveTab, syncScroll, setSyncScroll, copyStatus, setCopyStatus, markdown } = useMarkdown();
  const { theme, toggleTheme } = useTheme();
  const { fileInputRef, handleImportClick, handleFileChange } = useFileImport();

  const handleDownload = () => {
    downloadMarkdown(markdown);
  };

  const handleWeChatCopy = () => {
    copyForWeChat(setCopyStatus);
  };

  // 暗色主题配色
  const isDark = theme === 'dark';
  const headerBg = isDark ? '#1e2030' : '#ffffff';
  const borderColor = isDark ? '#363a4f' : '#e5e7eb';
  const textColor = isDark ? '#cad3f5' : '#1f2937';
  const subtextColor = isDark ? '#a5adcb' : '#6b7280';
  const surfaceBg = isDark ? '#363a4f' : '#f3f4f6';
  const hoverBg = isDark ? '#494d64' : '#f3f4f6';
  const accentColor = isDark ? '#f5a97f' : '#ea580c';
  const accentBg = isDark ? 'rgba(245, 169, 127, 0.15)' : '#fff7ed';
  const greenColor = isDark ? '#a6da95' : '#16a34a';
  const greenBg = isDark ? 'rgba(166, 218, 149, 0.15)' : '#f0fdf4';

  return (
    <header 
      className="flex items-center justify-between px-6 py-3 shadow-sm z-10 transition-colors"
      style={{ backgroundColor: headerBg, borderBottom: `1px solid ${borderColor}` }}
    >
      {/* Logo 和功能按钮 */}
      <div className="flex items-center gap-4">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div 
            className="w-8 h-8 rounded-md flex items-center justify-center text-white font-bold text-lg"
            style={{ backgroundColor: accentColor }}
          >
            M
          </div>
          <h1 className="text-xl font-bold tracking-tight" style={{ color: textColor }}>MinoMd</h1>
        </div>

        {/* 移动端标签切换 */}
        <div className="md:hidden flex rounded-lg p-1" style={{ backgroundColor: surfaceBg }}>
          <button
            onClick={() => setActiveTab('edit')}
            className="p-2 rounded-md transition-colors"
            style={{ 
              backgroundColor: activeTab === 'edit' ? (isDark ? '#494d64' : '#ffffff') : 'transparent',
              color: activeTab === 'edit' ? accentColor : subtextColor
            }}
          >
            <Edit3 size={18} />
          </button>
          <button
            onClick={() => setActiveTab('preview')}
            className="p-2 rounded-md transition-colors"
            style={{ 
              backgroundColor: activeTab === 'preview' ? (isDark ? '#494d64' : '#ffffff') : 'transparent',
              color: activeTab === 'preview' ? accentColor : subtextColor
            }}
          >
            <Eye size={18} />
          </button>
        </div>

        {/* 文件导入 Input */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept=".md,.txt,.markdown"
          className="hidden"
        />

        {/* 滚动同步 */}
        <button
          onClick={() => setSyncScroll(!syncScroll)}
          className="flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md transition-all duration-200"
          style={{ 
            backgroundColor: syncScroll ? accentBg : (isDark ? '#363a4f' : '#ffffff'),
            color: syncScroll ? accentColor : subtextColor,
            border: `1px solid ${syncScroll ? accentColor : borderColor}`
          }}
          title={syncScroll ? "关闭滚动同步" : "开启滚动同步"}
        >
          {syncScroll ? <LinkIcon size={16} /> : <Unlink size={16} />}
          <span className="hidden sm:inline">同步</span>
        </button>

        {/* 微信复制 */}
        <button
          onClick={handleWeChatCopy}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-all duration-200"
          style={{ 
            backgroundColor: copyStatus === 'success' ? greenBg : (isDark ? '#363a4f' : '#ffffff'),
            color: copyStatus === 'success' ? greenColor : subtextColor,
            border: `1px solid ${copyStatus === 'success' ? greenColor : borderColor}`
          }}
        >
          {copyStatus === 'success' ? <Check size={16} /> : <MessageSquare size={16} />}
          <span className="hidden sm:inline">{copyStatus === 'success' ? '已复制' : '复制'}</span>
        </button>

        {/* 导入 */}
        <button
          onClick={handleImportClick}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-colors"
          style={{ 
            backgroundColor: isDark ? '#363a4f' : '#ffffff',
            color: subtextColor,
            border: `1px solid ${borderColor}`
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = hoverBg;
            e.currentTarget.style.color = accentColor;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = isDark ? '#363a4f' : '#ffffff';
            e.currentTarget.style.color = subtextColor;
          }}
        >
          <Upload size={16} />
          <span className="hidden sm:inline">导入</span>
        </button>

        {/* 导出 */}
        <button
          onClick={handleDownload}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white rounded-md transition-colors"
          style={{ backgroundColor: isDark ? '#494d64' : '#1f2937' }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = isDark ? '#5b6078' : '#374151';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = isDark ? '#494d64' : '#1f2937';
          }}
        >
          <Download size={16} />
          <span className="hidden sm:inline">导出</span>
        </button>
      </div>

      {/* 主题切换按钮 */}
      <button
        onClick={toggleTheme}
        className="flex items-center justify-center w-10 h-10 rounded-md transition-colors"
        style={{ 
          backgroundColor: isDark ? '#363a4f' : '#ffffff',
          color: isDark ? '#eed49f' : '#6b7280',
          border: `1px solid ${borderColor}`
        }}
        title={theme === 'light' ? '切换到深色模式' : '切换到浅色模式'}
      >
        {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
      </button>
    </header>
  );
};
