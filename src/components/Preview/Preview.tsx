/**
 * 预览组件
 */

import React from 'react';
import { useMarkdown } from '@/contexts/MarkdownContext';
import { useScrollSync } from '@/hooks/useScrollSync';
import { MarkdownRenderer } from './MarkdownRenderer';
import { useTheme } from '@/contexts/ThemeContext';

export const Preview: React.FC = () => {
  const { markdown, activeTab } = useMarkdown();
  const { previewRef, handleScroll } = useScrollSync();
  const { theme } = useTheme();

  const isDark = theme === 'dark';
  const bgColor = isDark ? '#24273a' : '#FDFDFD';
  const gridColor = isDark ? '#363a4f' : '#e5e7eb';

  return (
    <div
      ref={previewRef}
      onScroll={() => handleScroll('preview')}
      className={`flex-1 overflow-y-auto relative transition-all duration-300 ${activeTab === 'edit' ? 'hidden' : 'block'}`}
      style={{ backgroundColor: bgColor }}
    >
      {/* 网格背景 */}
      <div className="min-h-full relative">
        <div
          className="absolute inset-0 pointer-events-none z-0"
          style={{
            backgroundImage: `linear-gradient(to right, ${gridColor} 1px, transparent 1px), linear-gradient(to bottom, ${gridColor} 1px, transparent 1px)`,
            backgroundSize: '24px 24px',
            opacity: isDark ? 0.3 : 0.4
          }}
        />
        <MarkdownRenderer markdown={markdown} />
      </div>
    </div>
  );
};
