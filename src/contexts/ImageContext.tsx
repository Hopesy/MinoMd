/**
 * 图片映射状态管理
 */

import React, { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import type { ImageMap } from '@/types';

interface ImageContextType {
  imageMap: ImageMap;
  addImage: (id: string, base64: string) => void;
}

const ImageContext = createContext<ImageContextType | undefined>(undefined);

export const ImageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [imageMap, setImageMap] = useState<ImageMap>({});

  const addImage = (id: string, base64: string) => {
    setImageMap(prev => ({ ...prev, [id]: base64 }));
  };

  return (
    <ImageContext.Provider value={{ imageMap, addImage }}>
      {children}
    </ImageContext.Provider>
  );
};

export const useImage = (): ImageContextType => {
  const context = useContext(ImageContext);
  if (!context) {
    throw new Error('useImage must be used within ImageProvider');
  }
  return context;
};
