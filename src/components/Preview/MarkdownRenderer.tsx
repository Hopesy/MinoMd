/**
 * Markdown 渲染器组件
 */

import React, { useMemo, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';
import { useImage } from '@/contexts/ImageContext';
import { processMarkdown } from '@/utils/markdown';
import { createMarkdownComponents, resetHeadingCounter } from '@/config';
import { extractHeadings } from '@/utils/extractHeadings';
import { TableOfContents } from '@/components/TableOfContents';

interface MarkdownRendererProps {
  markdown: string;
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ markdown }) => {
  const { imageMap } = useImage();
  const processedMarkdown = processMarkdown(markdown);

  // 提取标题生成目录
  const headings = useMemo(() => extractHeadings(markdown), [markdown]);

  // 每次渲染前重置标题计数器
  useEffect(() => {
    resetHeadingCounter();
  }, [markdown]);

  return (
    <div id="preview-content-wechat" className="relative z-10 max-w-3xl mx-auto p-8 md:p-12 min-h-full" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      {/* 目录 */}
      {headings.length > 0 && <TableOfContents headings={headings} />}

      {/* Markdown 内容 */}
      <ReactMarkdown
        urlTransform={(value) => value}
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[rehypeKatex]}
        components={createMarkdownComponents(imageMap)}
      >
        {processedMarkdown}
      </ReactMarkdown>
      <div className="h-24"></div>
    </div>
  );
};
