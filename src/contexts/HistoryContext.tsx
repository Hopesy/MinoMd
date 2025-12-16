/**
 * 历史记录状态管理
 */

import React, { createContext, useContext, useState, useRef, useCallback } from 'react';
import type { ReactNode } from 'react';
import { DEFAULT_MARKDOWN } from '@/constants';

interface HistoryContextType {
  history: string[];
  historyIndex: number;
  saveToHistory: (content: string) => void;
  saveHistoryImmediate: (content: string) => void;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  updateContent: (content: string) => void;
}

const HistoryContext = createContext<HistoryContextType | undefined>(undefined);

export const HistoryProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [history, setHistory] = useState([DEFAULT_MARKDOWN]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const historyTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // 防抖保存到历史记录
  const saveToHistory = useCallback((newContent: string) => {
    if (newContent === history[historyIndex]) return;
    if (historyTimeoutRef.current) clearTimeout(historyTimeoutRef.current);

    historyTimeoutRef.current = setTimeout(() => {
      setHistory(prev => {
        const newHistory = prev.slice(0, historyIndex + 1);
        newHistory.push(newContent);
        if (newHistory.length > 100) newHistory.shift();
        return newHistory;
      });
      setHistoryIndex(prev => Math.min(prev + 1, 99));
    }, 500);
  }, [history, historyIndex]);

  // 立即保存到历史记录
  const saveHistoryImmediate = useCallback((newContent: string) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(newContent);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  }, [history, historyIndex]);

  // 撤销
  const undo = useCallback(() => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
    }
  }, [historyIndex]);

  // 重做
  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
    }
  }, [history.length, historyIndex]);

  // 更新当前内容（占位函数）
  const updateContent = useCallback((_content: string) => {
    // 当前内容由 markdown context 管理
  }, []);

  return (
    <HistoryContext.Provider value={{
      history,
      historyIndex,
      saveToHistory,
      saveHistoryImmediate,
      undo,
      redo,
      canUndo: historyIndex > 0,
      canRedo: historyIndex < history.length - 1,
      updateContent,
    }}>
      {children}
    </HistoryContext.Provider>
  );
};

export const useHistory = (): HistoryContextType => {
  const context = useContext(HistoryContext);
  if (!context) {
    throw new Error('useHistory must be used within HistoryProvider');
  }
  return context;
};
