'use client';

import Link from 'next/link';
import { Recipe } from '@/lib/api';
import { useCompare } from '@/context/compare';

interface RecipeCardProps {
  recipe: Recipe;
  showAuthor?: boolean;
}

export default function RecipeCard({ recipe, showAuthor = true }: RecipeCardProps) {
  const ratio = recipe.coffeeGrams > 0 ? (recipe.waterGrams / recipe.coffeeGrams).toFixed(1) : '0';
  const { isSelected, addRecipe, removeRecipe, isFull } = useCompare();
  const selected = isSelected(recipe.id);

  const handleCompareClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (selected) {
      removeRecipe(recipe.id);
    } else if (!isFull()) {
      addRecipe(recipe.id);
    }
  };

  return (
    <div className="relative">
      <Link href={`/recipes/${recipe.id}`}>
        <div className="bg-card rounded-lg border border-border hover:shadow-lg transition cursor-pointer overflow-hidden h-full flex flex-col">
          {/* Header with method badge and fork badge */}
          <div className="p-4 border-b border-border bg-muted/50">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-serif font-bold text-lg text-foreground line-clamp-2 flex-1">{recipe.title}</h3>
                  {recipe.forkedFromId && (
                    <span className="text-xs bg-accent/20 text-accent px-2 py-1 rounded-full font-medium whitespace-nowrap">
                      🔄 Remix
                    </span>
                  )}
                </div>
                {showAuthor && (
                  <p className="text-xs text-muted-foreground">{recipe.authorName}</p>
                )}
                {recipe.roaster && recipe.beanName && (
                  <p className="text-xs text-muted-foreground mt-1">
                    {recipe.roaster} — {recipe.beanName}
                  </p>
                )}
              </div>
              <span className="px-2 py-1 bg-primary text-primary-foreground text-xs font-medium rounded whitespace-nowrap">
                {recipe.method}
              </span>
            </div>
          </div>

          {/* Content */}
          <div className="p-4 flex-1 flex flex-col">
          {/* Key specs */}
          <div className="grid grid-cols-2 gap-3 mb-4 pb-4 border-b border-border">
            <div>
              <p className="text-xs text-muted-foreground">Ratio</p>
              <p className="text-sm font-medium text-foreground">1:{ratio}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Grind</p>
              <p className="text-sm font-medium text-foreground">{recipe.grindSize}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Water Temp</p>
              <p className="text-sm font-medium text-foreground">{recipe.waterTempCelsius}°C</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Brew Time</p>
              <p className="text-sm font-medium text-foreground">{recipe.totalBrewTimeSeconds}s</p>
            </div>
          </div>

          {/* Tasting Notes */}
          <div className="mb-4 flex-1">
            <p className="text-xs text-muted-foreground mb-1">Tasting Notes</p>
            <p className="text-sm text-foreground line-clamp-2">{recipe.tastingNotes}</p>
          </div>

          {/* Ratings */}
          <div className="flex items-center justify-between pt-4 border-t border-border">
            <div className="flex items-center gap-2">
              <div className="flex text-accent">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className={i < Math.round(recipe.personalRating || 0) ? '' : 'opacity-30'}>
                    ★
                  </span>
                ))}
              </div>
              <span className="text-xs font-medium text-foreground">Your rating</span>
            </div>
          </div>

          {/* Community rating */}
          {recipe.ratingCount! > 0 && (
            <div className="flex items-center justify-between mt-2">
              <div className="flex text-secondary">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className={i < Math.round(recipe.communityRating || 0) ? '' : 'opacity-30'}>
                    ★
                  </span>
                ))}
              </div>
              <span className="text-xs text-muted-foreground">
                {recipe.communityRating?.toFixed(1)} ({recipe.ratingCount} ratings)
              </span>
            </div>
          )}

          </div>
        </div>
      </Link>

      {/* Compare button - outside link */}
      <div className="p-4 border-t border-border bg-card rounded-b-lg">
        <button
          onClick={handleCompareClick}
          disabled={!selected && isFull()}
          className={`w-full py-2 px-3 text-xs font-medium rounded transition ${
            selected
              ? 'bg-accent text-accent-foreground hover:bg-accent/90'
              : isFull()
              ? 'bg-muted text-muted-foreground cursor-not-allowed opacity-50'
              : 'bg-muted text-foreground hover:bg-muted/80'
          }`}
          title={isFull() && !selected ? 'Compare up to 3 recipes' : ''}
        >
          {selected ? '✓ In Compare' : 'Add to Compare'}
        </button>
      </div>
    </div>
  );
}
