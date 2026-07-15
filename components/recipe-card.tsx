import Link from 'next/link';
import { Recipe } from '@/lib/api';

interface RecipeCardProps {
  recipe: Recipe;
  showAuthor?: boolean;
}

export default function RecipeCard({ recipe, showAuthor = true }: RecipeCardProps) {
  const ratio = recipe.coffeeGrams > 0 ? (recipe.waterGrams / recipe.coffeeGrams).toFixed(1) : '0';

  return (
    <Link href={`/recipes/${recipe.id}`}>
      <div className="bg-card rounded-lg border border-border hover:shadow-lg transition cursor-pointer overflow-hidden h-full flex flex-col">
        {/* Header with method badge */}
        <div className="p-4 border-b border-border bg-muted/50">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1">
              <h3 className="font-serif font-bold text-lg text-foreground line-clamp-2">{recipe.title}</h3>
              {showAuthor && (
                <p className="text-xs text-muted-foreground mt-1">{recipe.authorName}</p>
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
  );
}
