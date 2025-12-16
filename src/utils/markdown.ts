/**
 * Markdown 处理工具函数
 */

/**
 * 处理 Markdown 特殊语法（如下划线）
 */
export const processMarkdown = (markdown: string): string => {
  return markdown.replace(/<u>(.*?)<\/u>/g, '[$1](__underline__)');
};

/**
 * 下载 Markdown 文件
 */
export const downloadMarkdown = (markdown: string): void => {
  const a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob([markdown], { type: 'text/markdown' }));
  a.download = "notes.md";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
};
