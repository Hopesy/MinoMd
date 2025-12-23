/**
 * Mermaid 初始化配置
 */

import mermaid from 'mermaid';

// 初始化 Mermaid
mermaid.initialize({
  startOnLoad: false,
  theme: 'neutral',
  securityLevel: 'loose',
  suppressErrorRendering: true,  // 抑制错误渲染到页面
});

export default mermaid;
