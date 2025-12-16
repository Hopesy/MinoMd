/**
 * 代码块组件
 */

import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { highlightCode } from '@/utils/highlight';

interface CodeBlockProps {
  children: any;
}

export const CodeBlock: React.FC<CodeBlockProps> = ({ children }) => {
  const [copied, setCopied] = useState(false);

  if (!children || !children.props) {
    return <pre style={{ background: '#f5f5f5', padding: '10px' }}>{children}</pre>;
  }

  const { children: codeContent, className } = children.props;
  const match = /language-(\w+)/.exec(className || '');
  const language = match ? match[1] : '';
  const codeString = String(codeContent).replace(/\n$/, '');

  const handleCopy = () => {
    navigator.clipboard.writeText(codeString).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }).catch(err => console.error('Copy failed', err));
  };

  return (
    <section style={{ marginTop: '20px', marginBottom: '20px', textAlign: 'left' }}>
      <table
        width="100%"
        border={0}
        cellSpacing="0"
        cellPadding="0"
        style={{
          border: '1px solid rgba(0,0,0,0.1)',
          borderRadius: '8px',
          overflow: 'hidden',
          backgroundColor: '#282c34',
          borderCollapse: 'separate',
          borderSpacing: 0,
          boxShadow: '0 8px 16px -4px rgba(0,0,0,0.4)'
        }}
      >
        <tbody>
          <tr>
            <td style={{ backgroundColor: '#21252b', padding: '8px 12px', borderBottom: '1px solid #181a1f', lineHeight: '1' }}>
              <table width="100%" border={0} cellSpacing="0" cellPadding="0">
                <tbody>
                  <tr>
                    <td align="left" valign="middle" width="20%">
                      <span style={{ display: 'inline-block', width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#ff5f56', marginRight: '8px', verticalAlign: 'middle' }}></span>
                      <span style={{ display: 'inline-block', width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#ffbd2e', marginRight: '8px', verticalAlign: 'middle' }}></span>
                      <span style={{ display: 'inline-block', width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#27c93f', verticalAlign: 'middle' }}></span>
                    </td>
                    <td align="center" valign="middle" width="60%">
                      <span style={{ fontSize: '12px', color: '#6b7280', fontFamily: 'sans-serif', fontWeight: 'bold', textTransform: 'uppercase', verticalAlign: 'middle', display: 'inline-block' }}>
                        {language || 'TEXT'}
                      </span>
                    </td>
                    <td align="right" valign="middle" width="20%">
                      <span onClick={handleCopy} style={{ cursor: 'pointer', display: 'inline-block', verticalAlign: 'middle' }}>
                        {copied ? <Check size={14} color="#4ade80" /> : <Copy size={14} color="#6b7280" />}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
          <tr>
            <td style={{ padding: '12px 0', backgroundColor: '#282c34' }}>
              <div style={{ overflowX: 'auto', width: '100%' }}>
                <table width="100%" border={0} cellSpacing="0" cellPadding="0" style={{ margin: 0, tableLayout: 'auto' }}>
                  <tbody>{highlightCode(codeContent, language)}</tbody>
                </table>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </section>
  );
};
