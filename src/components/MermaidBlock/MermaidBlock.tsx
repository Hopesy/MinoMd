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

  useEffect(() => {
    const renderDiagram = async () => {
      if (!code) return;
      try {
        const id = `mermaid-${Date.now()}`;
        const { svg } = await mermaid.render(id, code);
        setSvg(svg);
      } catch (err) {
        console.error('Mermaid render error:', err);
        setSvg(`<pre style="color: red;">流程图渲染错误</pre>`);
      }
    };
    renderDiagram();
  }, [code]);

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
