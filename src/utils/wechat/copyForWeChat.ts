/**
 * 微信公众号格式复制
 */

import type { CopyStatus } from '@/types';
import { svgToBase64Image } from './svgToImage';
import { formulaToBase64 } from './formulaToImage';

export const copyForWeChat = async (
  setCopyStatus: (status: CopyStatus) => void
): Promise<void> => {
  const previewElement = document.getElementById('preview-content-wechat');
  if (!previewElement) return;

  // ========== 第一步：处理公式和流程图，转成图片 ==========
  const svgReplacements: { svg: Element; img: HTMLImageElement; parent: Node }[] = [];
  const katexReplacements: { katex: Element; img: HTMLImageElement; parent: Node }[] = [];

  // 1. Mermaid 流程图 SVG 转图片
  const mermaidContainers = previewElement.querySelectorAll('[data-mermaid]');
  for (const container of Array.from(mermaidContainers)) {
    const svg = container.querySelector('svg');
    if (svg) {
      const result = await svgToBase64Image(svg as SVGElement);
      if (result.base64 && svg.parentNode) {
        const img = document.createElement('img');
        img.src = result.base64;
        img.style.width = `${result.width}px`;
        img.style.height = `${result.height}px`;
        img.style.maxWidth = '100%';
        img.style.display = 'block';
        img.style.margin = '0 auto';
        svgReplacements.push({ svg, img, parent: svg.parentNode });
        svg.parentNode.replaceChild(img, svg);
      }
    }
  }

  // 2. 块级公式转图片
  const katexDisplays = previewElement.querySelectorAll('.katex-display');
  for (const display of Array.from(katexDisplays)) {
    const el = display as HTMLElement;
    const result = await formulaToBase64(el, true);
    if (result.base64 && display.parentNode) {
      const img = document.createElement('img');
      img.src = result.base64;
      img.style.width = `${result.width}px`;
      img.style.height = `${result.height}px`;
      img.style.maxWidth = '100%';
      img.style.display = 'block';
      img.style.margin = '16px auto';
      katexReplacements.push({ katex: display, img, parent: display.parentNode });
      display.parentNode.replaceChild(img, display);
    }
  }

  // 3. 行内公式转图片
  const inlineKatex = previewElement.querySelectorAll('.katex:not(.katex-display .katex)');
  for (const katex of Array.from(inlineKatex)) {
    if (!katex.parentNode) continue;
    const el = katex as HTMLElement;
    const result = await formulaToBase64(el, false);
    if (result.base64 && katex.parentNode) {
      const img = document.createElement('img');
      img.src = result.base64;
      img.style.display = 'inline';
      img.style.verticalAlign = 'middle';
      img.style.width = `${result.width}px`;
      img.style.height = `${result.height}px`;
      katexReplacements.push({ katex, img, parent: katex.parentNode });
      katex.parentNode.replaceChild(img, katex);
    }
  }

  // ========== 第二步：获取 HTML 并处理微信兼容性 ==========
  let html = previewElement.innerHTML;

  // 移除微信不支持的 CSS 属性
  html = html.replace(/box-shadow:\s*[^;]+;?/gi, '');
  html = html.replace(/opacity:\s*[^;]+;?/gi, '');
  html = html.replace(/overflow:\s*hidden;?/gi, '');
  html = html.replace(/text-transform:\s*[^;]+;?/gi, '');
  html = html.replace(/user-select:\s*[^;]+;?/gi, '');
  html = html.replace(/-webkit-user-select:\s*[^;]+;?/gi, '');
  html = html.replace(/cursor:\s*[^;]+;?/gi, '');

  // rgba 转 hex
  html = html.replace(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*[\d.]+)?\)/gi, (_, r, g, b) => {
    return '#' + [r, g, b].map(x => parseInt(x).toString(16).padStart(2, '0')).join('');
  });

  // display: flex 转 display: block
  html = html.replace(/display:\s*flex;?/gi, 'display: block;');

  // 给 table/tr 添加 border:none
  html = html.replace(/<table([^>]*)style="([^"]*)"/gi, '<table$1style="$2 border:none;"');
  html = html.replace(/<table(?![^>]*style=)([^>]*)>/gi, '<table style="border:none;"$1>');
  html = html.replace(/<tr([^>]*)style="([^"]*)"/gi, '<tr$1style="$2 border:none;"');
  html = html.replace(/<tr(?![^>]*style=)([^>]*)>/gi, '<tr style="border:none;"$1>');
  html = html.replace(/<td([^>]*)style="([^"]*)"/gi, '<td$1style="$2 border-top:none; border-bottom:none; border-left:none;"');
  html = html.replace(/<td(?![^>]*style=)([^>]*)>/gi, '<td style="border:none;"$1>');

  // 代码块样式调整
  html = html.replace(/padding:\s*8px 12px;?/gi, 'padding: 4px 12px;');
  html = html.replace(/padding:\s*12px 0;?/gi, 'padding: 6px 0;');
  html = html.replace(/line-height:\s*1\.5;?/gi, 'line-height: 1.3;');

  // 清理空 style
  html = html.replace(/style="\s*"/gi, '');
  html = html.replace(/;\s*;/g, ';');

  // ========== 第三步：恢复原始 DOM ==========
  const restoreDOM = () => {
    for (let i = katexReplacements.length - 1; i >= 0; i--) {
      const { katex, img, parent } = katexReplacements[i];
      if (img.parentNode === parent) {
        parent.replaceChild(katex, img);
      }
    }
    for (let i = svgReplacements.length - 1; i >= 0; i--) {
      const { svg, img, parent } = svgReplacements[i];
      if (img.parentNode === parent) {
        parent.replaceChild(svg, img);
      }
    }
  };

  // ========== 第四步：复制到剪贴板 ==========
  try {
    await navigator.clipboard.write([
      new ClipboardItem({
        'text/html': new Blob([html], { type: 'text/html' }),
        'text/plain': new Blob([previewElement.innerText], { type: 'text/plain' })
      })
    ]);
    setCopyStatus('success');
  } catch (err) {
    console.error('Clipboard API failed, falling back:', err);
    const selection = window.getSelection();
    const range = document.createRange();
    range.selectNodeContents(previewElement);
    selection?.removeAllRanges();
    selection?.addRange(range);
    try {
      document.execCommand('copy');
      setCopyStatus('success');
    } catch (e) {
      console.error('Copy failed', e);
      setCopyStatus('error');
    }
    selection?.removeAllRanges();
  }

  restoreDOM();

  setTimeout(() => setCopyStatus('idle'), 2000);
};
