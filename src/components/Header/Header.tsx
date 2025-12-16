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
  Check
} from 'lucide-react';
import { useMarkdown } from '@/contexts/MarkdownContext';
import { useFileImport } from '@/hooks/useFileImport';
import { downloadMarkdown, copyForWeChat } from '@/utils';

export const Header: React.FC = () => {
  const { activeTab, setActiveTab, syncScroll, setSyncScroll, copyStatus, setCopyStatus, markdown } = useMarkdown();
  const { fileInputRef, handleImportClick, handleFileChange } = useFileImport();

  const handleDownload = () => {
    downloadMarkdown(markdown);
  };

  const handleWeChatCopy = () => {
    copyForWeChat(setCopyStatus);
  };

  return (
    <header className="flex items-center justify-between px-6 py-3 bg-white border-b border-gray-200 shadow-sm z-10">
      {/* Logo */}
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-orange-600 rounded-md flex items-center justify-center text-white font-bold text-lg">M</div>
        <h1 className="text-xl font-bold text-gray-800 tracking-tight">MinoMd</h1>
      </div>

      {/* 按钮组 */}
      <div className="flex items-center gap-2">
        {/* 移动端标签切换 */}
        <div className="md:hidden flex bg-gray-100 rounded-lg p-1 mr-2">
          <button
            onClick={() => setActiveTab('edit')}
            className={`p-2 rounded-md ${activeTab === 'edit' ? 'bg-white shadow text-orange-600' : 'text-gray-500'}`}
          >
            <Edit3 size={18} />
          </button>
          <button
            onClick={() => setActiveTab('preview')}
            className={`p-2 rounded-md ${activeTab === 'preview' ? 'bg-white shadow text-orange-600' : 'text-gray-500'}`}
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
          className={`flex items-center gap-2 px-3 py-2 text-sm font-medium border border-gray-200 rounded-md transition-all duration-200
            ${syncScroll ? 'bg-orange-50 text-orange-700 border-orange-200' : 'bg-white text-gray-500 hover:text-gray-700'}
          `}
          title={syncScroll ? "关闭滚动同步" : "开启滚动同步"}
        >
          {syncScroll ? <LinkIcon size={16} /> : <Unlink size={16} />}
          <span className="hidden sm:inline">同步</span>
        </button>

        {/* 微信复制 */}
        <button
          onClick={handleWeChatCopy}
          className={`flex items-center gap-2 px-4 py-2 text-sm font-medium border border-gray-200 rounded-md transition-all duration-200 ${copyStatus === 'success' ? 'bg-green-50 text-green-600 border-green-200' : 'bg-white text-gray-700 hover:bg-gray-50 hover:text-green-600'}`}
        >
          {copyStatus === 'success' ? <Check size={16} /> : <MessageSquare size={16} />}
          <span className="hidden sm:inline">{copyStatus === 'success' ? '已复制' : '复制'}</span>
        </button>

        {/* 导入 */}
        <button
          onClick={handleImportClick}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-md hover:bg-gray-50 hover:text-orange-600 transition-colors"
        >
          <Upload size={16} />
          <span className="hidden sm:inline">导入</span>
        </button>

        {/* 导出 */}
        <button
          onClick={handleDownload}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-md hover:bg-gray-800 transition-colors"
        >
          <Download size={16} />
          <span className="hidden sm:inline">导出</span>
        </button>
      </div>
    </header>
  );
};
