/**
 * 公式转 Base64 图片（通用函数）
 */

import html2canvas from 'html2canvas';
import { trimCanvas } from './trimCanvas';

export const formulaToBase64 = async (
  element: HTMLElement,
  isBlock: boolean
): Promise<{ base64: string; width: number; height: number }> => {
  try {
    const scale = 2;

    // 克隆元素到临时容器
    const container = document.createElement('div');
    container.style.position = 'absolute';
    container.style.left = '-9999px';
    container.style.top = '0';
    container.style.backgroundColor = '#ffffff';
    container.style.padding = '20px';
    container.style.display = 'inline-block';
    container.style.whiteSpace = 'nowrap';

    const clone = element.cloneNode(true) as HTMLElement;
    container.appendChild(clone);
    document.body.appendChild(container);

    // 等待渲染
    await new Promise(resolve => setTimeout(resolve, 50));

    const canvas = await html2canvas(container, {
      backgroundColor: '#ffffff',
      scale: scale,
      logging: false,
      useCORS: true,
    });

    document.body.removeChild(container);

    // 裁剪空白，块级公式保留更多 padding
    const padding = isBlock ? 8 : 4;
    const trimmedCanvas = trimCanvas(canvas, padding * scale);

    return {
      base64: trimmedCanvas.toDataURL('image/png'),
      width: trimmedCanvas.width / scale,
      height: trimmedCanvas.height / scale
    };
  } catch {
    return { base64: '', width: 0, height: 0 };
  }
};
