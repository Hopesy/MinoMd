/**
 * Markdown 内容状态管理
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { ActiveTab, CopyStatus } from '@/types';
import { DEFAULT_MARKDOWN } from '@/constants';

interface MarkdownContextType {
  markdown: string;
  setMarkdown: (text: string) => void;
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  copyStatus: CopyStatus;
  setCopyStatus: (status: CopyStatus) => void;
  syncScroll: boolean;
  setSyncScroll: (sync: boolean) => void;
}

const MarkdownContext = createContext<MarkdownContextType | undefined>(undefined);

export const MarkdownProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [markdown, setMarkdown] = useState(DEFAULT_MARKDOWN);
  const [activeTab, setActiveTab] = useState<ActiveTab>('both');
  const [copyStatus, setCopyStatus] = useState<CopyStatus>('idle');
  const [syncScroll, setSyncScroll] = useState(true);

  // 响应式布局：窗口小于 768px 时切换到预览模式
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) setActiveTab('preview');
      else setActiveTab('both');
    };
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <MarkdownContext.Provider value={{
      markdown,
      setMarkdown,
      activeTab,
      setActiveTab,
      copyStatus,
      setCopyStatus,
      syncScroll,
      setSyncScroll,
    }}>
      {children}
    </MarkdownContext.Provider>
  );
};

export const useMarkdown = (): MarkdownContextType => {
  const context = useContext(MarkdownContext);
  if (!context) {
    throw new Error('useMarkdown must be used within MarkdownProvider');
  }
  return context;
};
