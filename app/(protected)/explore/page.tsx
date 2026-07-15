'use client';

import { useEffect, useState } from 'react';
import { getRecipes, Recipe } from '@/lib/api';
import RecipeCard from '@/components/recipe-card';

const METHODS = ['All', 'V60', 'AeroPress', 'Chemex', 'French Press', 'Espresso', 'Cold Brew', 'Other'] as const;
type SortOption = 'recent' | 'rating';

export default function ExplorePage() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedMethod, setSelectedMethod] = useState<string | undefined>();
  const [sortBy, setSortBy] = useState<SortOption>('recent');

  useEffect(() => {
    const loadRecipes = async () => {
      try {
        const data = await getRecipes({
          method: selectedMethod && selectedMethod !== 'All' ? (selectedMethod as any) : undefined,
          sort: sortBy,
        });
        setRecipes(data);
      } finally {
        setIsLoading(false);
      }
    };

    setIsLoading(true);
    loadRecipes();
  }, [selectedMethod, sortBy]);

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-serif font-bold text-foreground">Community Recipes</h1>
          <p className="text-muted-foreground mt-1">Discover brewing methods from coffee enthusiasts</p>
        </div>

        {/* Filters */}
        <div className="mb-8 space-y-4 sm:space-y-0 sm:flex sm:items-center sm:gap-6">
          {/* Method Filter */}
          <div className="flex-1">
            <label className="block text-sm font-medium text-foreground mb-2">
              Method
            </label>
            <div className="flex flex-wrap gap-2">
              {METHODS.map((method) => (
                <button
                  key={method}
                  onClick={() => setSelectedMethod(method === 'All' ? undefined : method)}
                  className={`px-3 py-1 text-sm font-medium rounded-full transition ${
                    (method === 'All' && !selectedMethod) || selectedMethod === method
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-foreground hover:bg-muted/80'
                  }`}
                >
                  {method}
                </button>
              ))}
            </div>
          </div>

          {/* Sort */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Sort
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="px-4 py-2 border border-border rounded-md bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="recent">Most Recent</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            <p className="text-muted-foreground mt-4">Loading recipes...</p>
          </div>
        ) : recipes.length === 0 ? (
          <div className="bg-card rounded-lg border border-border p-8 sm:p-12 text-center">
            <div className="text-4xl mb-4">🔍</div>
            <h2 className="text-xl font-serif font-bold text-foreground mb-2">No recipes found</h2>
            <p className="text-muted-foreground">
              Try adjusting your filters or check back later.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recipes.map((recipe) => (
              <RecipeCard key={recipe.id} recipe={recipe} showAuthor={true} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
