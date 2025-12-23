/**
 * ReactMarkdown 组件配置
 */

import React from 'react';
import type { Components } from 'react-markdown';
import type { ImageMap } from '@/types';
import { FONT_FAMILY } from '@/constants';
import { MermaidBlock } from '@/components/MermaidBlock';
import { CodeBlock } from '@/components/CodeBlock';

// 全局标题计数器
let headingCounter = 0;

/**
 * 重置标题计数器（在每次渲染前调用）
 */
export const resetHeadingCounter = () => {
  headingCounter = 0;
};

/**
 * 创建 Markdown 组件配置
 */
export const createMarkdownComponents = (imageMap: ImageMap, isDark: boolean = false): Partial<Components> => ({
  h1: ({ children }) => {
    const id = `heading-${headingCounter++}`;
    return (
      <section id={id} style={{ textAlign: 'center', marginTop: '40px', marginBottom: '20px', scrollMarginTop: '20px' }}>
        <span style={{ display: 'inline-block', backgroundColor: '#C66E49', color: '#ffffff', padding: '10px 24px', borderRadius: '8px', fontSize: '20px', fontWeight: 'bold', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
          {children}
        </span>
      </section>
    );
  },

  h2: ({ children }) => {
    const id = `heading-${headingCounter++}`;
    return (
      <section id={id} style={{ textAlign: 'center', marginTop: '30px', marginBottom: '20px', scrollMarginTop: '20px' }}>
        <span style={{ display: 'inline-block', backgroundColor: '#C66E49', color: '#ffffff', padding: '8px 20px', borderRadius: '6px', fontSize: '17px', fontWeight: 'bold', opacity: 0.9 }}>
          {children}
        </span>
      </section>
    );
  },

  h3: ({ children }) => {
    const id = `heading-${headingCounter++}`;
    return (
      <section id={id} style={{ marginTop: '30px', marginBottom: '15px', display: 'flex', alignItems: 'center', borderBottom: '1px dashed #C66E49', paddingBottom: '10px', scrollMarginTop: '20px' }}>
        <span style={{ display: 'inline-block', width: '4px', height: '20px', backgroundColor: '#ea580c', marginRight: '10px', borderRadius: '4px' }} />
        <span style={{ fontSize: '18px', fontWeight: 'bold', color: isDark ? '#e5e7eb' : '#1f2937' }}>{children}</span>
      </section>
    );
  },

  h4: ({ children }) => {
    const id = `heading-${headingCounter++}`;
    return (
      <section id={id} style={{ marginTop: '30px', marginBottom: '15px', display: 'flex', alignItems: 'center', borderBottom: '1px dashed #C66E49', paddingBottom: '10px', scrollMarginTop: '20px' }}>
        <span style={{ display: 'inline-block', width: '4px', height: '20px', backgroundColor: '#ea580c', marginRight: '10px', borderRadius: '4px' }} />
        <span style={{ fontSize: '18px', fontWeight: 'bold', color: isDark ? '#e5e7eb' : '#1f2937' }}>{children}</span>
      </section>
    );
  },

  p: ({ children }) => {
    return (
      <section style={{ marginBottom: '16px', lineHeight: '1.8', fontSize: '14px', color: isDark ? '#e5e7eb' : '#374151', textAlign: 'justify' }}>
        {children}
      </section>
    );
  },

  strong: ({ children }) => (
    <strong style={{ color: '#c2410c', fontWeight: 'bold', fontSize: '14px' }}>
      <span style={{ fontWeight: '300' }}>「</span>
      {children}
      <span style={{ fontWeight: '300' }}>」</span>
    </strong>
  ),

  ul: ({ children }) => {
    return (
      <ul style={{ paddingLeft: '2em', marginBottom: '16px', listStyleType: 'disc', color: isDark ? '#e5e7eb' : '#374151', fontSize: '14px' }}>
        {children}
      </ul>
    );
  },

  ol: ({ children }) => {
    return (
      <ol style={{ paddingLeft: '2em', marginBottom: '16px', listStyleType: 'decimal', color: isDark ? '#e5e7eb' : '#374151', fontSize: '14px' }}>
        {children}
      </ol>
    );
  },

  li: ({ children }) => (
    <li style={{ marginBottom: '6px', lineHeight: '1.6', fontSize: '14px' }}>{children}</li>
  ),

  blockquote: ({ children }) => {
    return (
      <section style={{
        borderLeft: '4px solid #fdba74',
        backgroundColor: isDark ? '#414559' : '#fff7ed',
        padding: '15px',
        margin: '20px 0',
        borderRadius: '4px',
        color: isDark ? '#e5e7eb' : '#666',
        fontStyle: 'italic',
        fontSize: '13px'
      }}>
        {children}
      </section>
    );
  },

  img: ({ src, alt }) => {
    let imageSrc = src;
    if (src && src.startsWith('local://')) {
      const imageId = src.replace('local://', '');
      imageSrc = imageMap[imageId] || src;
    }
    return (
      <section style={{ textAlign: 'center', margin: '20px 0' }}>
        <img style={{ maxWidth: '100%', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', border: '1px solid #f0f0f0' }} src={imageSrc} alt={alt} />
        {alt && alt !== 'AI配图' && <span style={{ display: 'block', fontSize: '13px', color: '#999', marginTop: '8px' }}>{alt}</span>}
      </section>
    );
  },

  hr: () => <hr style={{ border: 'none', borderTop: '1px solid #e5e7eb', margin: '30px 0' }} />,

  // 表格样式
  table: ({ children }) => (
    <section style={{ margin: '20px 0' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', border: '1px solid #e5e7eb' }}>
        {children}
      </table>
    </section>
  ),

  thead: ({ children }) => <thead>{children}</thead>,
  tbody: ({ children }) => <tbody>{children}</tbody>,

  tr: ({ children }) => (
    <tr style={{ borderBottom: '1px solid #e5e7eb' }}>{children}</tr>
  ),

  th: ({ children }) => (
    <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 'bold', color: '#ffffff', border: '1px solid #e5e7eb', backgroundColor: '#C66E49' }}>
      {children}
    </th>
  ),

  td: ({ children }) => {
    return (
      <td style={{
        padding: '12px 16px',
        border: '1px solid #e5e7eb',
        color: isDark ? '#e5e7eb' : '#374151',
        backgroundColor: isDark ? '#414559' : '#f9fafb'
      }}>
        {children}
      </td>
    );
  },

  // 代码块（包括 Mermaid）
  pre: ({ children }: any) => {
    const codeElement = children as React.ReactElement<{ className?: string; children?: string }>;
    if (codeElement?.props?.className?.includes('language-mermaid')) {
      const code = String(codeElement.props.children || '').replace(/\n$/, '');
      return <MermaidBlock code={code} />;
    }
    return <CodeBlock>{children}</CodeBlock>;
  },

  // 行内代码
  code: ({ className, children, ...props }: any) => {
    if (!className) {
      return (
        <code style={{
          backgroundColor: isDark ? '#414559' : '#f3f4f6',
          color: isDark ? '#fb923c' : '#c2410c',
          padding: '2px 6px',
          fontSize: '13px',
          fontFamily: FONT_FAMILY
        }}>
          {children}
        </code>
      );
    }
    return <code className={className} {...props}>{children}</code>;
  },

  // 链接和下划线
  a: ({ href, children, ...props }) => {
    if (href === '__underline__') {
      return (
        <span style={{ borderBottom: '2px dashed #8DE0B4', paddingBottom: '2px', textDecoration: 'none', color: 'inherit' }}>
          {children}
        </span>
      );
    }
    return (
      <a href={href} style={{ color: '#2563eb', textDecoration: 'underline', borderBottom: '1px solid rgba(37, 99, 235, 0.2)' }} target="_blank" rel="noopener noreferrer" {...props}>
        {children}
      </a>
    );
  },
});
