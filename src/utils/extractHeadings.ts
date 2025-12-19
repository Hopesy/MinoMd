/**
 * 从 Markdown 文本中提取标题
 */

export interface Heading {
  id: string;
  text: string;
  level: number; // 1-6 对应 h1-h6
}

/**
 * 从 Markdown 文本提取所有标题
 */
export const extractHeadings = (markdown: string): Heading[] => {
  const headings: Heading[] = [];
  const lines = markdown.split('\n');

  for (const line of lines) {
    // 匹配 # 标题语法
    const match = line.match(/^(#{1,6})\s+(.+)$/);
    if (match) {
      const level = match[1].length;
      const text = match[2].trim();
      const id = `heading-${headings.length}`;

      headings.push({ id, text, level });
    }
  }

  return headings;
};
