'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useCompare } from '@/context/compare';
import { getRecipeById, Recipe } from '@/lib/api';

export default function CompareTray() {
  const { selectedRecipeIds, removeRecipe, clearAll } = useCompare();
  const [recipes, setRecipes] = useState<Recipe[]>([]);

  useEffect(() => {
    const loadRecipes = async () => {
      const loaded = await Promise.all(
        selectedRecipeIds.map(id => getRecipeById(id))
      );
      setRecipes(loaded.filter(Boolean) as Recipe[]);
    };

    if (selectedRecipeIds.length > 0) {
      loadRecipes();
    } else {
      setRecipes([]);
    }
  }, [selectedRecipeIds]);

  if (selectedRecipeIds.length === 0) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border shadow-lg z-40">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground mb-2">
              Comparing <span className="font-semibold text-accent">{recipes.length}</span> recipe{recipes.length !== 1 ? 's' : ''}
            </p>
            <div className="flex gap-2 flex-wrap">
              {recipes.map(recipe => (
                <div
                  key={recipe.id}
                  className="inline-flex items-center gap-2 px-2 py-1 bg-muted rounded-md text-xs text-foreground"
                >
                  <span className="truncate max-w-xs">{recipe.title}</span>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      removeRecipe(recipe.id);
                    }}
                    className="hover:text-destructive"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-2 shrink-0">
            <button
              onClick={clearAll}
              className="px-3 py-1 text-xs font-medium rounded bg-muted text-foreground hover:bg-muted/80 transition"
            >
              Clear
            </button>
            <Link href="/compare">
              <button className="px-3 py-1 text-xs font-medium rounded bg-accent text-accent-foreground hover:bg-accent/90 transition">
                Compare Now
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
