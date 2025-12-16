/**
 * SVG 转 Base64 图片（用于流程图）
 */

export const svgToBase64Image = async (
  svgElement: SVGElement
): Promise<{ base64: string; width: number; height: number }> => {
  return new Promise((resolve) => {
    const rect = svgElement.getBoundingClientRect();
    const width = rect.width || 400;
    const height = rect.height || 300;

    const clonedSvg = svgElement.cloneNode(true) as SVGElement;
    clonedSvg.setAttribute('width', String(width));
    clonedSvg.setAttribute('height', String(height));

    const svgData = new XMLSerializer().serializeToString(clonedSvg);
    const svgBase64 = btoa(unescape(encodeURIComponent(svgData)));
    const dataUrl = `data:image/svg+xml;base64,${svgBase64}`;

    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, width, height);
        ctx.drawImage(img, 0, 0, width, height);
      }
      resolve({ base64: canvas.toDataURL('image/png'), width, height });
    };
    img.onerror = () => {
      resolve({ base64: '', width: 0, height: 0 });
    };
    img.src = dataUrl;
  });
};
