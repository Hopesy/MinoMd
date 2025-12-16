/**
 * 代码高亮引擎 - Atom One Dark 主题
 */

import React from 'react';
import { AtomColors, FONT_FAMILY } from '@/constants';

/**
 * 高亮代码 - 使用正则表达式进行语法高亮
 */
export const highlightCode = (code: string, _lang: string): React.JSX.Element[] => {
  if (!code) return [];
  const lines = String(code).replace(/\n$/, '').split('\n');

  return lines.map((line, lineIndex) => {
    const parts: React.ReactNode[] = [];
    let remaining = line;
    let key = 0;

    const patterns = [
      { type: 'comment', regex: /^(\/\/.*|#.*)/ },
      { type: 'string', regex: /^(['"`])(.*?)\1/ },
      { type: 'keyword', regex: /^\b(import|export|const|let|var|function|return|if|else|for|while|class|def|from|width)\b/ },
      { type: 'function', regex: /^\b([a-zA-Z_]\w*)(?=\()/ },
      { type: 'number', regex: /^\b\d+(\.\d+)?\b/ },
      { type: 'operator', regex: /^[\+\-\*\/=\<\>!&|]+/ },
      { type: 'text', regex: /^[\s\S]/ }
    ];

    while (remaining.length > 0) {
      let matched = false;
      const spaceMatch = remaining.match(/^\s+/);
      if (spaceMatch) {
        const spaces = spaceMatch[0].replace(/ /g, '\u00A0');
        parts.push(<span key={key++} style={{ fontFamily: FONT_FAMILY }}>{spaces}</span>);
        remaining = remaining.slice(spaceMatch[0].length);
        continue;
      }

      for (const { type, regex } of patterns) {
        const match = remaining.match(regex);
        if (match) {
          const content = match[0];
          let color = AtomColors.text;
          let fontStyle = 'normal';

          if (type === 'comment') { color = AtomColors.comment; fontStyle = 'italic'; }
          else if (type === 'string') color = AtomColors.string;
          else if (type === 'keyword') color = AtomColors.keyword;
          else if (type === 'function') color = AtomColors.function;
          else if (type === 'number') color = AtomColors.number;
          else if (type === 'operator') color = AtomColors.operator;

          parts.push(<span key={key++} style={{ color, fontStyle, fontFamily: FONT_FAMILY }}>{content}</span>);
          remaining = remaining.slice(content.length);
          matched = true;
          break;
        }
      }

      if (!matched) {
        parts.push(<span key={key++} style={{ color: AtomColors.text, fontFamily: FONT_FAMILY }}>{remaining[0]}</span>);
        remaining = remaining.slice(1);
      }
    }

    return (
      <tr key={lineIndex} style={{ border: 'none', backgroundColor: 'transparent' }}>
        <td style={{ userSelect: 'none', textAlign: 'right', paddingRight: '8px', width: '1%', color: '#636d83', borderRight: '1px solid #3e4451', verticalAlign: 'top', fontFamily: FONT_FAMILY, fontSize: '13px', lineHeight: '1.5', whiteSpace: 'nowrap', backgroundColor: 'transparent' }}>{lineIndex + 1}</td>
        <td style={{ paddingLeft: '8px', verticalAlign: 'top', color: '#abb2bf', fontFamily: FONT_FAMILY, fontSize: '13px', lineHeight: '1.5', whiteSpace: 'pre', wordBreak: 'normal', backgroundColor: 'transparent' }}>{parts}</td>
      </tr>
    );
  });
};
