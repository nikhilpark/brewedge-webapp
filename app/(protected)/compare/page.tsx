'use client';

import Link from 'next/link';
import useSWR from 'swr';
import { useCompare } from '@/context/compare';
import { Recipe } from '@/lib/api';
import { apiClient } from '@/lib/apiClient';
import { Button } from '@/components/ui/button';

// Fetch each selected recipe from GET /recipes/:id
const fetchRecipes = async (ids: string[]): Promise<Recipe[]> => {
  const loaded = await Promise.all(ids.map((id) => apiClient(`/recipes/${id}`)));
  return loaded.filter(Boolean) as Recipe[];
};

export default function ComparePage() {
  const { selectedRecipeIds, clearAll } = useCompare();

  const { data, isLoading } = useSWR(
    selectedRecipeIds.length > 0 ? ['compare-recipes', ...selectedRecipeIds] : null,
    () => fetchRecipes(selectedRecipeIds)
  );

  const recipes = data || [];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background py-8 px-4">
        <div className="max-w-7xl mx-auto text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
          <p className="text-muted-foreground">Loading recipes...</p>
        </div>
      </div>
    );
  }

  if (recipes.length === 0) {
    return (
      <div className="min-h-screen bg-background py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-serif font-bold text-foreground mb-2">Compare Recipes</h1>
          
          <div className="bg-card rounded-lg border border-border p-8 sm:p-12 text-center mt-8">
            <div className="text-4xl mb-4">🔍</div>
            <h2 className="text-xl font-serif font-bold text-foreground mb-2">No recipes selected</h2>
            <p className="text-muted-foreground mb-6">
              Add up to 3 recipes from the community to compare them side-by-side.
            </p>
            <Link href="/explore">
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium">
                Browse Recipes
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Check if recipes share fork lineage
  const shareLineage = recipes.length >= 2 && recipes.some((r, i) => {
    return recipes.some((other, j) => i !== j && (
      (r.forkedFromId && (r.forkedFromId === other.id || r.forkedFromId === other.forkedFromId)) ||
      (other.forkedFromId && other.forkedFromId === r.id)
    ));
  });

  // Find differences between values
  const findDifferences = (values: (string | number | undefined)[]): boolean => {
    const defined = values.filter(v => v !== undefined && v !== '');
    return new Set(defined).size > 1;
  };

  // Format value for display
  const formatValue = (value: string | number | undefined, label?: string) => {
    if (value === undefined || value === '') return '—';
    if (typeof value === 'number' && label?.includes('Ratio')) {
      return `1:${value.toFixed(1)}`;
    }
    return String(value);
  };

  const comparisonRows = [
    { label: 'Method', key: 'method' as const },
    { label: 'Grind Size', key: 'grindSize' as const },
    { label: 'Water Temp', key: 'waterTempCelsius' as const, format: (v: any) => v ? `${v}°C` : '—' },
    { label: 'Coffee (g)', key: 'coffeeGrams' as const },
    { label: 'Water (g)', key: 'waterGrams' as const },
    {
      label: 'Ratio',
      key: null as any,
      getValue: (r: Recipe) => r.coffeeGrams > 0 ? r.waterGrams / r.coffeeGrams : 0,
      format: (v: any) => v ? `1:${v.toFixed(1)}` : '—'
    },
    { label: 'Bloom Time (s)', key: 'bloomTimeSeconds' as const },
    { label: 'Brew Time (s)', key: 'totalBrewTimeSeconds' as const },
    { label: 'Roaster', key: 'roaster' as const },
    { label: 'Bean', key: 'beanName' as const },
    { label: 'Your Rating', key: 'personalRating' as const },
    { label: 'Community Rating', key: 'communityRating' as const, format: (v: any) => v ? v.toFixed(1) : '—' },
  ];

  return (
    <div className="min-h-screen bg-background py-8 px-4 pb-32">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-start justify-between gap-4 mb-8">
          <div>
            <h1 className="text-4xl font-serif font-bold text-foreground">Compare Recipes</h1>
            <p className="text-muted-foreground mt-1">
              {recipes.length} recipe{recipes.length !== 1 ? 's' : ''} selected
            </p>
          </div>
          <button
            onClick={clearAll}
            className="px-4 py-2 text-sm font-medium rounded bg-muted text-foreground hover:bg-muted/80 transition whitespace-nowrap"
          >
            Clear All
          </button>
        </div>

        {/* Fork Lineage Note */}
        {shareLineage && (
          <div className="mb-6 p-4 bg-accent/10 border border-accent/20 rounded-lg">
            <p className="text-sm text-foreground">
              <span className="font-semibold">🔄 Fork Lineage Detected:</span> These recipes are part of the same remix family, making iteration and experimentation visible.
            </p>
          </div>
        )}

        {/* Comparison Table */}
        <div className="overflow-x-auto bg-card rounded-lg border border-border">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="p-4 text-left text-sm font-semibold text-foreground min-w-40">Attribute</th>
                {recipes.map((recipe, idx) => (
                  <th key={recipe.id} className="p-4 text-center min-w-48">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex-1 text-left">
                        <p className="font-serif font-bold text-foreground line-clamp-2 text-sm">
                          {recipe.title}
                        </p>
                        <p className="text-xs text-muted-foreground">by {recipe.authorName}</p>
                      </div>
                      <Link href={`/recipes/${recipe.id}`}>
                        <button className="text-xs px-2 py-1 bg-muted text-foreground hover:bg-muted/80 rounded whitespace-nowrap">
                          View
                        </button>
                      </Link>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {comparisonRows.map((row, idx) => {
                const values = recipes.map(r => {
                  if (row.key) {
                    return r[row.key];
                  } else if (row.getValue) {
                    return row.getValue(r);
                  }
                  return undefined;
                });

                const hasDifference = findDifferences(values);

                return (
                  <tr
                    key={idx}
                    className={`border-b border-border ${idx % 2 === 0 ? 'bg-card' : 'bg-muted/20'}`}
                  >
                    <td className="p-4 text-sm font-medium text-foreground sticky left-0 z-10 bg-inherit">
                      {row.label}
                    </td>
                    {values.map((value, vIdx) => {
                      const formatted = row.format ? row.format(value) : formatValue(value, row.label);
                      const isDifferent = hasDifference && value !== undefined && value !== '';

                      return (
                        <td
                          key={`${row.label}-${vIdx}`}
                          className={`p-4 text-sm text-center text-foreground ${
                            isDifferent ? 'bg-accent/10 font-semibold' : ''
                          }`}
                        >
                          {row.label === 'Your Rating' || row.label === 'Community Rating' ? (
                            <div className="flex justify-center gap-1">
                              {[...Array(5)].map((_, i) => (
                                <span
                                  key={i}
                                  className={`text-lg ${
                                    i < Math.round((value as number) || 0) ? 'text-accent' : 'text-muted opacity-30'
                                  }`}
                                >
                                  ★
                                </span>
                              ))}
                            </div>
                          ) : (
                            formatted
                          )}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Tasting Notes */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {recipes.map(recipe => (
            <div key={recipe.id} className="bg-card rounded-lg border border-border p-6">
              <h3 className="font-serif font-bold text-foreground mb-3 line-clamp-2">{recipe.title}</h3>
              <div>
                <p className="text-xs text-muted-foreground mb-2 font-semibold">Tasting Notes</p>
                <p className="text-sm text-foreground">{recipe.tastingNotes}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
