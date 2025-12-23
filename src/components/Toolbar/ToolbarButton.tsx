/**
 * 工具栏按钮组件
 */

import React from 'react';
import { useTheme } from '@/contexts/ThemeContext';

interface ToolbarButtonProps {
  icon: React.ReactNode;
  onClick: () => void;
  tooltip: string;
  disabled?: boolean;
}

export const ToolbarButton: React.FC<ToolbarButtonProps> = ({ icon, onClick, tooltip, disabled }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  const normalColor = isDark ? '#a5adcb' : '#6b7280';
  const hoverColor = isDark ? '#f5a97f' : '#ea580c';
  const hoverBg = isDark ? 'rgba(245, 169, 127, 0.15)' : '#fff7ed';
  const disabledColor = isDark ? '#494d64' : '#d1d5db';

  return (
    <button
      onClick={onClick}
      title={tooltip}
      disabled={disabled}
      className="p-2 rounded-md transition-colors"
      style={{ 
        color: disabled ? disabledColor : normalColor,
        cursor: disabled ? 'not-allowed' : 'pointer'
      }}
      onMouseEnter={(e) => {
        if (!disabled) {
          e.currentTarget.style.color = hoverColor;
          e.currentTarget.style.backgroundColor = hoverBg;
        }
      }}
      onMouseLeave={(e) => {
        if (!disabled) {
          e.currentTarget.style.color = normalColor;
          e.currentTarget.style.backgroundColor = 'transparent';
        }
      }}
    >
      {icon}
    </button>
  );
};
