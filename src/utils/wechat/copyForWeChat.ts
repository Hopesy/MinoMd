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

  // ========== 第1.5步：DOM 层面转换代码块结构（参考微信兼容格式） ==========
  // 将 table 结构的代码块转换为 <pre><code> 结构，参考 mdnice 编辑器格式
  const sections = previewElement.querySelectorAll('section');
  for (const section of Array.from(sections)) {
    // 查找代码块的外层 table
    const outerTable = section.querySelector('table');
    if (!outerTable) continue;

    // 获取语言标签
    const languageSpan = section.querySelector('td[align="center"] span');
    const language = languageSpan ? languageSpan.textContent?.trim() || 'TEXT' : 'TEXT';

    // 查找包含代码的 div 和内部 table
    const scrollDiv = section.querySelector('div');
    const innerTable = scrollDiv?.querySelector('table');
    if (!innerTable) continue;

    // 提取所有代码行
    const rows = innerTable.querySelectorAll('tr');
    const codeLines: string[] = [];

    for (const row of Array.from(rows)) {
      const tds = row.querySelectorAll('td');
      if (tds.length >= 2) {
        // 第二个 td 是代码内容
        const codeCell = tds[1] as HTMLElement;
        // 保留代码内容和样式，正确处理HTML实体和空格
        let lineContent = '';
        const spans = codeCell.querySelectorAll('span');
        for (const span of Array.from(spans)) {
          const spanEl = span as HTMLElement;
          const color = spanEl.style.color;
          const fontStyle = spanEl.style.fontStyle;
          // 使用innerHTML保留空格和特殊字符
          const text = spanEl.innerHTML || '';

          if (color && color !== '#abb2bf') {
            // 保留语法高亮颜色
            lineContent += `<span style="color: ${color}; ${fontStyle ? 'font-style: ' + fontStyle + ';' : ''}">${text}</span>`;
          } else {
            lineContent += text;
          }
        }
        codeLines.push(lineContent || '&nbsp;');  // 空行用&nbsp;占位
      }
    }

    // 创建新的 <pre><code> 结构
    const pre = document.createElement('pre');
    pre.style.marginTop = '10px';
    pre.style.marginBottom = '10px';
    pre.style.borderRadius = '5px';
    pre.style.boxShadow = 'rgba(0, 0, 0, 0.55) 0px 2px 10px';

    // 创建标题栏 span（包含三个圆圈和语言标签）
    const headerSpan = document.createElement('span');
    headerSpan.style.display = 'block';
    headerSpan.style.height = '30px';
    headerSpan.style.width = '100%';
    headerSpan.style.backgroundColor = '#282c34';
    headerSpan.style.marginBottom = '-7px';
    headerSpan.style.borderRadius = '5px';
    headerSpan.style.padding = '8px 12px';
    headerSpan.style.fontSize = '12px';
    headerSpan.style.lineHeight = '30px';

    // 添加三个圆圈（红、黄、绿）
    const redCircle = document.createElement('span');
    redCircle.style.display = 'inline-block';
    redCircle.style.width = '12px';
    redCircle.style.height = '12px';
    redCircle.style.borderRadius = '50%';
    redCircle.style.backgroundColor = '#ff5f56';
    redCircle.style.marginRight = '8px';
    redCircle.style.verticalAlign = 'middle';

    const yellowCircle = document.createElement('span');
    yellowCircle.style.display = 'inline-block';
    yellowCircle.style.width = '12px';
    yellowCircle.style.height = '12px';
    yellowCircle.style.borderRadius = '50%';
    yellowCircle.style.backgroundColor = '#ffbd2e';
    yellowCircle.style.marginRight = '8px';
    yellowCircle.style.verticalAlign = 'middle';

    const greenCircle = document.createElement('span');
    greenCircle.style.display = 'inline-block';
    greenCircle.style.width = '12px';
    greenCircle.style.height = '12px';
    greenCircle.style.borderRadius = '50%';
    greenCircle.style.backgroundColor = '#27c93f';
    greenCircle.style.marginRight = '8px';
    greenCircle.style.verticalAlign = 'middle';

    // 添加语言标签
    const langSpan = document.createElement('span');
    langSpan.style.color = '#6b7280';
    langSpan.style.fontWeight = 'bold';
    langSpan.style.verticalAlign = 'middle';
    langSpan.textContent = language;

    headerSpan.appendChild(redCircle);
    headerSpan.appendChild(yellowCircle);
    headerSpan.appendChild(greenCircle);
    headerSpan.appendChild(langSpan);

    // 创建 code 元素（关键：使用 display: -webkit-box）
    const code = document.createElement('code');
    code.style.overflowX = 'auto';
    code.style.padding = '16px';
    code.style.color = '#abb2bf';
    code.style.display = '-webkit-box';  // 关键属性！
    code.style.fontFamily = 'Operator Mono, Consolas, Monaco, Menlo, monospace';
    code.style.fontSize = '12px';
    code.style.setProperty('-webkit-overflow-scrolling', 'touch');
    code.style.paddingTop = '15px';
    code.style.background = '#282c34';
    code.style.borderRadius = '5px';
    code.style.lineHeight = '1.2';
    code.style.whiteSpace = 'nowrap';  // 确保不换行

    // 将代码行用 <br> 连接
    code.innerHTML = codeLines.join('<br>');

    // 组装新结构
    pre.appendChild(headerSpan);
    pre.appendChild(code);

    // 替换原来的 section 内容
    section.innerHTML = '';
    section.style.marginTop = '20px';
    section.style.marginBottom = '20px';
    section.appendChild(pre);
  }

  // ========== 第二步：获取 HTML 并处理微信兼容性 ==========
  let html = previewElement.innerHTML;

  // 移除微信不支持的 CSS 属性
  html = html.replace(/box-shadow:\s*[^;]+;?/gi, '');  // 移除所有阴影（包括H1、H2、图片）
  html = html.replace(/opacity:\s*[^;]+;?/gi, '');
  html = html.replace(/text-transform:\s*[^;]+;?/gi, '');
  html = html.replace(/user-select:\s*[^;]+;?/gi, '');
  html = html.replace(/-webkit-user-select:\s*[^;]+;?/gi, '');
  html = html.replace(/cursor:\s*[^;]+;?/gi, '');

  // 移除图片的边框和阴影（img标签）
  html = html.replace(/(<img[^>]*style="[^"]*?)border:\s*1px solid #f0f0f0;?([^"]*")/gi, '$1$2');
  html = html.replace(/(<img[^>]*style="[^"]*?)border:\s*[^;]+;?([^"]*")/gi, '$1$2');

  // 修复文字对齐问题：将两端对齐改为左对齐
  html = html.replace(/text-align:\s*justify;?/gi, 'text-align: left;');

  // rgba 转 hex
  html = html.replace(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*[\d.]+)?\)/gi, (_, r, g, b) => {
    return '#' + [r, g, b].map(x => parseInt(x).toString(16).padStart(2, '0')).join('');
  });

  // display: flex 转 display: block
  html = html.replace(/display:\s*flex;?/gi, 'display: block;');

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
