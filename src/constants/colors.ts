/**
 * 主题配色常量
 */

// Atom One Dark 代码高亮配色
export const AtomColors = {
  background: '#282c34',
  text: '#abb2bf',
  keyword: '#c678dd',
  function: '#61afef',
  string: '#98c379',
  number: '#d19a66',
  comment: '#5c6370',
  operator: '#56b6c2',
};

// 暗色主题配色 (Catppuccin Macchiato 风格)
export const DarkTheme = {
  // 基础背景色
  base: '#24273a',        // 最深背景
  mantle: '#1e2030',      // 次深背景
  crust: '#181926',       // 最深色
  surface0: '#363a4f',    // 卡片/面板背景
  surface1: '#494d64',    // 悬浮背景
  surface2: '#5b6078',    // 边框色
  
  // 文字颜色
  text: '#cad3f5',        // 主文字
  subtext1: '#b8c0e0',    // 次要文字
  subtext0: '#a5adcb',    // 更淡文字
  overlay2: '#939ab7',    // 占位符文字
  overlay1: '#8087a2',    // 禁用文字
  overlay0: '#6e738d',    // 最淡文字
  
  // 强调色
  blue: '#8aadf4',        // 链接、主要操作
  lavender: '#b7bdf8',    // 次要强调
  sapphire: '#7dc4e4',    // 信息
  sky: '#91d7e3',         // 辅助信息
  teal: '#8bd5ca',        // 成功相关
  green: '#a6da95',       // 成功
  yellow: '#eed49f',      // 警告
  peach: '#f5a97f',       // 橙色强调
  maroon: '#ee99a0',      // 错误相关
  red: '#ed8796',         // 错误
  mauve: '#c6a0f6',       // 紫色强调
  pink: '#f5bde6',        // 粉色强调
  flamingo: '#f0c6c6',    // 浅粉
  rosewater: '#f4dbd6',   // 最浅粉
};

// 浅色主题配色
export const LightTheme = {
  // 基础背景色
  base: '#ffffff',
  mantle: '#f8f9fa',
  surface0: '#f3f4f6',
  surface1: '#e5e7eb',
  surface2: '#d1d5db',
  
  // 文字颜色
  text: '#1f2937',
  subtext1: '#374151',
  subtext0: '#4b5563',
  overlay2: '#6b7280',
  overlay1: '#9ca3af',
  
  // 强调色 (与暗色主题保持一致的色调)
  orange: '#ea580c',
  orangeLight: '#fff7ed',
  orangeBorder: '#fdba74',
  green: '#16a34a',
  greenLight: '#f0fdf4',
  blue: '#2563eb',
};
