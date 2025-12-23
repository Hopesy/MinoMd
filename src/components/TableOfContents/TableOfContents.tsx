/**
 * 目录组件
 */

import React, { useState } from 'react';
import type { Heading } from '@/utils/extractHeadings';
import styles from './TableOfContents.module.css';

interface TableOfContentsProps {
  headings: Heading[];
}

export const TableOfContents: React.FC<TableOfContentsProps> = ({ headings }) => {
  const [isVisible, setIsVisible] = useState(false);

  if (headings.length === 0) {
    return null;
  }

  const handleClick = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <>
      {/* 触发区域 - 右侧中间的小区域 */}
      <div
        className={styles.triggerZone}
        onMouseEnter={() => setIsVisible(true)}
      />

      {/* 目录侧边栏 */}
      <div
        data-toc
        className={`${styles.tocContainer} ${isVisible ? styles.visible : ''}`}
        onMouseLeave={() => setIsVisible(false)}
      >
        <div className={styles.tocTitle}>
          目录
        </div>
        <nav>
          {headings.map((heading) => (
            <div
              key={heading.id}
              className={`${styles.tocItem} ${heading.level === 1 ? styles.tocItemLevel1 : styles.tocItemOther}`}
              style={{
                paddingLeft: `${(heading.level - 1) * 12}px`
              }}
              onClick={() => handleClick(heading.id)}
            >
              {heading.text}
            </div>
          ))}
        </nav>
      </div>
    </>
  );
};
