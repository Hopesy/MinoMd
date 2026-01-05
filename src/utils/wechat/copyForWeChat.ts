/**
 * 微信公众号格式复制
 */

import type { CopyStatus } from '@/types';
import { svgToBase64Image } from './svgToImage';
import { formulaToBase64 } from './formulaToImage';

/**
 * 将代码块转换为 mdnice 兼容的 HTML 格式
 * 完全按照参考格式生成，确保微信保存时不丢失空格
 */
function convertCodeBlockToMdnice(section: Element): string | null {
  // 查找代码块的外层 table
  const outerTable = section.querySelector('table');
  if (!outerTable) return null;

  // 查找包含代码的 div 和内部 table
  const scrollDiv = section.querySelector('div');
  const innerTable = scrollDiv?.querySelector('table');
  if (!innerTable) return null;

  // 提取所有代码行
  const rows = innerTable.querySelectorAll('tr');
  const codeLines: string[] = [];

  for (const row of Array.from(rows)) {
    const tds = row.querySelectorAll('td');
    if (tds.length >= 2) {
      const codeCell = tds[1] as HTMLElement;
      const spans = codeCell.querySelectorAll('span');
      let lineContent = '';

      for (const span of Array.from(spans)) {
        const spanEl = span as HTMLElement;
        const color = spanEl.style.color;
        const fontStyle = spanEl.style.fontStyle;
        const text = spanEl.textContent || '';

        if (!text) continue;

        // 根据颜色确定 hljs class
        let hljsClass = '';
        const colorLower = color?.toLowerCase() || '';
        if (colorLower.includes('198') || colorLower === '#c678dd') {
          hljsClass = 'hljs-keyword';
        } else if (colorLower.includes('97') || colorLower === '#61aeee') {
          hljsClass = 'hljs-title';
        } else if (colorLower.includes('152') || colorLower === '#98c379') {
          hljsClass = 'hljs-string';
        } else if (colorLower.includes('92') || colorLower === '#5c6370') {
          hljsClass = 'hljs-comment';
        }

        // 逐字符处理，空格转 &nbsp;
        for (let i = 0; i < text.length; i++) {
          const char = text[i];
          if (char === ' ') {
            lineContent += '&nbsp;';
          } else if (char === '<') {
            lineContent += '&lt;';
          } else if (char === '>') {
            lineContent += '&gt;';
          } else if (char === '&') {
            lineContent += '&amp;';
          } else {
            // 有颜色的字符包在 span 里
            if (hljsClass) {
              lineContent += `<span class="${hljsClass}" style="color: ${color}${fontStyle === 'italic' ? '; font-style: italic' : ''}; line-height: 26px">${char}</span>`;
            } else if (color && color !== '#abb2bf' && color !== 'rgb(171, 178, 191)') {
              lineContent += `<span style="color: ${color}${fontStyle === 'italic' ? '; font-style: italic' : ''}; line-height: 26px">${char}</span>`;
            } else {
              lineContent += char;
            }
          }
        }
      }

      codeLines.push(lineContent || '&nbsp;');
    }
  }

  // 合并相邻的相同样式 span（优化输出）
  let codeContent = codeLines.join('<br>');
  // 合并相邻相同 span: </span><span class="X" style="Y">  -> 直接连接内容
  codeContent = codeContent.replace(/<\/span><span class="([^"]*)" style="([^"]*)">/g, (match, cls, style, offset, str) => {
    // 检查前一个 span 的 class 和 style 是否相同
    const prevMatch = str.substring(0, offset).match(/<span class="([^"]*)" style="([^"]*)">[^<]*$/);
    if (prevMatch && prevMatch[1] === cls && prevMatch[2] === style) {
      return ''; // 合并
    }
    return match;
  });

  // 生成完全符合 mdnice 格式的 HTML
  return `<pre class="custom" data-tool="mdnice编辑器" style="border-radius: 5px; box-shadow: rgba(0, 0, 0, 0.55) 0px 2px 10px; text-align: left; margin-top: 10px; margin-bottom: 10px; margin-left: 0px; margin-right: 0px; padding-top: 0px; padding-bottom: 0px; padding-left: 0px; padding-right: 0px;"><span style="display: block; background: url(https://files.mdnice.com/user/3441/876cad08-0422-409d-bb5a-08afec5da8ee.svg); height: 30px; width: 100%; background-size: 40px; background-repeat: no-repeat; background-color: #282c34; margin-bottom: -7px; border-radius: 5px; background-position: 10px 10px;"></span><code class="hljs" style="overflow-x: auto; padding: 16px; color: #abb2bf; padding-top: 15px; background: #282c34; border-radius: 5px; display: -webkit-box; font-family: Consolas, Monaco, Menlo, monospace; font-size: 12px;">${codeContent}</code></pre>`;
}

export const copyForWeChat = async (
  setCopyStatus: (status: CopyStatus) => void
): Promise<void> => {
  const previewElement = document.getElementById('preview-content-wechat');
  if (!previewElement) return;

  // 克隆 DOM，避免修改原始内容
  const clonedElement = previewElement.cloneNode(true) as HTMLElement;

  // ========== 第一步：移除目录 ==========
  const tocElements = clonedElement.querySelectorAll('[data-toc]');
  for (const toc of Array.from(tocElements)) {
    toc.parentNode?.removeChild(toc);
  }

  // ========== 第二步：处理公式和流程图，转成图片 ==========
  // Mermaid 流程图
  const mermaidContainers = clonedElement.querySelectorAll('[data-mermaid]');
  for (const container of Array.from(mermaidContainers)) {
    const originalSvg = previewElement.querySelector(`[data-mermaid] svg`);
    if (originalSvg) {
      const result = await svgToBase64Image(originalSvg as SVGElement);
      if (result.base64) {
        const img = document.createElement('img');
        img.src = result.base64;
        img.style.cssText = `width: ${result.width}px; height: ${result.height}px; max-width: 100%; display: block; margin: 0 auto;`;
        container.innerHTML = '';
        container.appendChild(img);
      }
    }
  }

  // 块级公式
  const katexDisplays = clonedElement.querySelectorAll('.katex-display');
  for (let i = 0; i < katexDisplays.length; i++) {
    const display = katexDisplays[i];
    const originalDisplay = previewElement.querySelectorAll('.katex-display')[i];
    if (originalDisplay) {
      const result = await formulaToBase64(originalDisplay as HTMLElement, true);
      if (result.base64 && display.parentNode) {
        const img = document.createElement('img');
        img.src = result.base64;
        img.style.cssText = `width: ${result.width}px; height: ${result.height}px; max-width: 100%; display: block; margin: 16px auto;`;
        display.parentNode.replaceChild(img, display);
      }
    }
  }

  // 行内公式
  const inlineKatex = clonedElement.querySelectorAll('.katex:not(.katex-display .katex)');
  for (let i = 0; i < inlineKatex.length; i++) {
    const katex = inlineKatex[i];
    const originalKatex = previewElement.querySelectorAll('.katex:not(.katex-display .katex)')[i];
    if (originalKatex && katex.parentNode) {
      const result = await formulaToBase64(originalKatex as HTMLElement, false);
      if (result.base64) {
        const img = document.createElement('img');
        img.src = result.base64;
        img.style.cssText = `display: inline; vertical-align: middle; width: ${result.width}px; height: ${result.height}px;`;
        katex.parentNode.replaceChild(img, katex);
      }
    }
  }

  // ========== 第三步：获取 HTML ==========
  let html = clonedElement.innerHTML;

  // ========== 第四步：替换代码块为 mdnice 格式 ==========
  // 找到所有代码块 section 并替换
  const sections = clonedElement.querySelectorAll('section');
  for (const section of Array.from(sections)) {
    const mdniceHtml = convertCodeBlockToMdnice(section);
    if (mdniceHtml) {
      // 在 html 字符串中替换这个 section
      const sectionHtml = section.outerHTML;
      html = html.replace(sectionHtml, mdniceHtml);
    }
  }

  // ========== 第五步：处理微信兼容性 ==========
  // 确保 &nbsp; 实体形式
  html = html.replace(/\u00A0/g, '&nbsp;');

  // 移除微信不支持的 CSS 属性
  html = html.replace(/box-shadow:\s*[^;]+;?/gi, '');
  html = html.replace(/opacity:\s*[^;]+;?/gi, '');
  html = html.replace(/text-transform:\s*[^;]+;?/gi, '');
  html = html.replace(/user-select:\s*[^;]+;?/gi, '');
  html = html.replace(/-webkit-user-select:\s*[^;]+;?/gi, '');
  html = html.replace(/cursor:\s*[^;]+;?/gi, '');

  // 移除图片边框
  html = html.replace(/(<img[^>]*style="[^"]*?)border:\s*[^;]+;?([^"]*")/gi, '$1$2');

  // 文字对齐
  html = html.replace(/text-align:\s*justify;?/gi, 'text-align: left;');

  // 调整字号
  html = html.replace(/(<p[^>]*style="[^"]*?)font-size:\s*16px;?([^"]*")/gi, '$1font-size: 14px;$2');
  html = html.replace(/(<ul[^>]*style="[^"]*?)font-size:\s*16px;?([^"]*")/gi, '$1font-size: 14px;$2');
  html = html.replace(/(<ol[^>]*style="[^"]*?)font-size:\s*16px;?([^"]*")/gi, '$1font-size: 14px;$2');
  html = html.replace(/(<li[^>]*style="[^"]*?)font-size:\s*16px;?([^"]*")/gi, '$1font-size: 14px;$2');
  html = html.replace(/(<blockquote[^>]*style="[^"]*?)font-size:\s*16px;?([^"]*")/gi, '$1font-size: 13px;$2');

  // rgba 转 hex
  html = html.replace(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*[\d.]+)?\)/gi, (_, r, g, b) => {
    return '#' + [r, g, b].map(x => parseInt(x).toString(16).padStart(2, '0')).join('');
  });

  // display: flex 转 block
  html = html.replace(/display:\s*flex;?/gi, 'display: block;');
  html = html.replace(/display:\s*inline-flex;?/gi, 'display: inline;');

  // 清理
  html = html.replace(/style="\s*"/gi, '');
  html = html.replace(/;\s*;/g, ';');

  // ========== 第六步：复制到剪贴板 ==========
  try {
    await navigator.clipboard.write([
      new ClipboardItem({
        'text/html': new Blob([html], { type: 'text/html' }),
        'text/plain': new Blob([previewElement.innerText], { type: 'text/plain' })
      })
    ]);
    setCopyStatus('success');
  } catch (err) {
    console.error('Clipboard API failed:', err);
    // fallback
    const textarea = document.createElement('textarea');
    textarea.value = previewElement.innerText;
    document.body.appendChild(textarea);
    textarea.select();
    try {
      document.execCommand('copy');
      setCopyStatus('success');
    } catch (e) {
      setCopyStatus('error');
    }
    document.body.removeChild(textarea);
  }

  setTimeout(() => setCopyStatus('idle'), 2000);
};
