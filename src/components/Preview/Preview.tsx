/**
 * 预览组件
 */

import React from 'react';
import { useMarkdown } from '@/contexts/MarkdownContext';
import { useScrollSync } from '@/hooks/useScrollSync';
import { MarkdownRenderer } from './MarkdownRenderer';

export const Preview: React.FC = () => {
  const { markdown, activeTab } = useMarkdown();
  const { previewRef, handleScroll } = useScrollSync();

  return (
    <div
      ref={previewRef}
      onScroll={() => handleScroll('preview')}
      className={`flex-1 overflow-y-auto bg-[#FDFDFD] relative transition-all duration-300 ${activeTab === 'edit' ? 'hidden' : 'block'}`}
    >
      {/* 网格背景 */}
      <div className="min-h-full relative">
        <div
          className="absolute inset-0 pointer-events-none z-0 opacity-40"
          style={{
            backgroundImage: `linear-gradient(to right, #e5e7eb 1px, transparent 1px), linear-gradient(to bottom, #e5e7eb 1px, transparent 1px)`,
            backgroundSize: '24px 24px'
          }}
        />
        <MarkdownRenderer markdown={markdown} />
      </div>
    </div>
  );
};
