/**
 * 工具栏按钮组件
 */

import React from 'react';

interface ToolbarButtonProps {
  icon: React.ReactNode;
  onClick: () => void;
  tooltip: string;
  disabled?: boolean;
}

export const ToolbarButton: React.FC<ToolbarButtonProps> = ({ icon, onClick, tooltip, disabled }) => {
  return (
    <button
      onClick={onClick}
      title={tooltip}
      disabled={disabled}
      className={`p-2 rounded-md transition-colors ${disabled ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:text-orange-600 hover:bg-orange-50'}`}
    >
      {icon}
    </button>
  );
};
