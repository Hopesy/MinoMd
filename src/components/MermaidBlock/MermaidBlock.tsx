/**
 * Mermaid 流程图组件
 */

import React, { useState, useEffect, useRef } from 'react';
import mermaid from '@/config/mermaid';

interface MermaidBlockProps {
  code: string;
}

export const MermaidBlock: React.FC<MermaidBlockProps> = ({ code }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [svg, setSvg] = useState<string>('');
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const renderDiagram = async () => {
      if (!code || !code.trim()) {
        setError('流程图代码为空');
        return;
      }
      
      try {
        setError('');
        const id = `mermaid-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        const { svg } = await mermaid.render(id, code.trim());
        setSvg(svg);
      } catch (err: any) {
        console.error('Mermaid render error:', err);
        setError(err?.message || '流程图渲染错误');
        setSvg('');
      }
    };
    renderDiagram();
  }, [code]);

  if (error) {
    return (
      <section style={{ margin: '20px 0', textAlign: 'center' }}>
        <div style={{
          display: 'inline-block',
          backgroundColor: '#fef2f2',
          padding: '16px 24px',
          borderRadius: '8px',
          border: '1px solid #fecaca',
          color: '#dc2626',
          fontSize: '14px'
        }}>
          流程图语法错误
        </div>
      </section>
    );
  }

  if (!svg) {
    return (
      <section style={{ margin: '20px 0', textAlign: 'center' }}>
        <div style={{
          display: 'inline-block',
          backgroundColor: '#f3f4f6',
          padding: '20px',
          borderRadius: '8px',
          color: '#6b7280',
          fontSize: '14px'
        }}>
          加载中...
        </div>
      </section>
    );
  }

  return (
    <section style={{ margin: '20px 0', textAlign: 'center' }}>
      <div
        ref={containerRef}
        data-mermaid="true"
        dangerouslySetInnerHTML={{ __html: svg }}
        style={{
          display: 'inline-block',
          backgroundColor: '#ffffff',
          padding: '20px',
          borderRadius: '8px',
          border: '1px solid #e5e7eb'
        }}
      />
    </section>
  );
};
