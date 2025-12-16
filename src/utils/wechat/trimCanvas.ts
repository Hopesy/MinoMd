/**
 * 裁剪 Canvas 空白区域
 */

export const trimCanvas = (canvas: HTMLCanvasElement, padding: number): HTMLCanvasElement => {
  const ctx = canvas.getContext('2d');
  if (!ctx) return canvas;

  const { width, height } = canvas;
  const imageData = ctx.getImageData(0, 0, width, height);
  const { data } = imageData;

  let top = 0, bottom = height - 1, left = 0, right = width - 1;

  // 找顶部边界
  findTop: for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;
      if (data[idx] < 250 || data[idx + 1] < 250 || data[idx + 2] < 250) {
        top = y;
        break findTop;
      }
    }
  }

  // 找底部边界
  findBottom: for (let y = height - 1; y >= 0; y--) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;
      if (data[idx] < 250 || data[idx + 1] < 250 || data[idx + 2] < 250) {
        bottom = y;
        break findBottom;
      }
    }
  }

  // 找左边界
  findLeft: for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      const idx = (y * width + x) * 4;
      if (data[idx] < 250 || data[idx + 1] < 250 || data[idx + 2] < 250) {
        left = x;
        break findLeft;
      }
    }
  }

  // 找右边界
  findRight: for (let x = width - 1; x >= 0; x--) {
    for (let y = 0; y < height; y++) {
      const idx = (y * width + x) * 4;
      if (data[idx] < 250 || data[idx + 1] < 250 || data[idx + 2] < 250) {
        right = x;
        break findRight;
      }
    }
  }

  // 添加 padding
  top = Math.max(0, top - padding);
  bottom = Math.min(height - 1, bottom + padding);
  left = Math.max(0, left - padding);
  right = Math.min(width - 1, right + padding);

  const croppedWidth = right - left + 1;
  const croppedHeight = bottom - top + 1;

  const croppedCanvas = document.createElement('canvas');
  croppedCanvas.width = croppedWidth;
  croppedCanvas.height = croppedHeight;
  const croppedCtx = croppedCanvas.getContext('2d');
  if (croppedCtx) {
    croppedCtx.fillStyle = '#ffffff';
    croppedCtx.fillRect(0, 0, croppedWidth, croppedHeight);
    croppedCtx.drawImage(canvas, left, top, croppedWidth, croppedHeight, 0, 0, croppedWidth, croppedHeight);
  }

  return croppedCanvas;
};
