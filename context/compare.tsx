'use client';

import React, { createContext, useContext, useState } from 'react';

interface CompareContextType {
  selectedRecipeIds: string[];
  addRecipe: (id: string) => void;
  removeRecipe: (id: string) => void;
  clearAll: () => void;
  isSelected: (id: string) => boolean;
  isFull: () => boolean;
}

const CompareContext = createContext<CompareContextType | undefined>(undefined);

export function CompareProvider({ children }: { children: React.ReactNode }) {
  const [selectedRecipeIds, setSelectedRecipeIds] = useState<string[]>([]);

  const addRecipe = (id: string) => {
    if (selectedRecipeIds.length < 3 && !selectedRecipeIds.includes(id)) {
      setSelectedRecipeIds([...selectedRecipeIds, id]);
    }
  };

  const removeRecipe = (id: string) => {
    setSelectedRecipeIds(selectedRecipeIds.filter(rid => rid !== id));
  };

  const clearAll = () => {
    setSelectedRecipeIds([]);
  };

  const isSelected = (id: string) => selectedRecipeIds.includes(id);

  const isFull = () => selectedRecipeIds.length >= 3;

  return (
    <CompareContext.Provider value={{ selectedRecipeIds, addRecipe, removeRecipe, clearAll, isSelected, isFull }}>
      {children}
    </CompareContext.Provider>
  );
}

export function useCompare() {
  const context = useContext(CompareContext);
  if (!context) {
    throw new Error('useCompare must be used within CompareProvider');
  }
  return context;
}
