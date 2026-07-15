'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/auth';
import { getRecipeById, rateRecipe, forkRecipe, Recipe } from '@/lib/api';
import { Button } from '@/components/ui/button';

export default function RecipeDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const recipeId = params.id as string;

  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRating, setIsRating] = useState(false);
  const [hoverRating, setHoverRating] = useState(0);
  const [isForking, setIsForking] = useState(false);

  useEffect(() => {
    const loadRecipe = async () => {
      try {
        const data = await getRecipeById(recipeId, user?.id);
        setRecipe(data);
      } finally {
        setIsLoading(false);
      }
    };

    loadRecipe();
  }, [recipeId, user?.id]);

  const handleRate = async (rating: number) => {
    if (!user || !recipe) return;
    setIsRating(true);

    try {
      const updated = await rateRecipe(recipeId, user.id, rating);
      if (updated) {
        setRecipe(updated);
      }
    } finally {
      setIsRating(false);
    }
  };

  const handleFork = async () => {
    if (!user || !recipe) return;
    setIsForking(true);

    try {
      const forked = await forkRecipe(recipe.id, user.id, user.username);
      if (forked) {
        router.push(`/recipes/${forked.id}/edit`);
      }
    } finally {
      setIsForking(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
          <p className="text-muted-foreground">Loading recipe...</p>
        </div>
      </div>
    );
  }

  if (!recipe) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-2xl font-serif font-bold text-foreground mb-4">Recipe not found</h1>
          <Link href="/explore">
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
              Back to Explore
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const ratio = recipe.coffeeGrams > 0 ? (recipe.waterGrams / recipe.coffeeGrams).toFixed(2) : '0';
  const isOwnRecipe = user?.id === recipe.userId;

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Back link */}
        <Link href="/explore" className="text-primary hover:underline text-sm mb-6 inline-block">
          ← Back to recipes
        </Link>

        {/* Recipe Card */}
        <div className="bg-card rounded-lg border border-border overflow-hidden">
          {/* Header Section */}
          <div className="bg-muted/50 border-b border-border p-6 sm:p-8">
            {/* Lineage Badge */}
            {recipe.forkedFromId && (
              <div className="mb-4 inline-block px-3 py-1 bg-accent/20 text-accent text-xs font-medium rounded-full">
                Remixed from <Link href={`/recipes/${recipe.forkedFromId}`} className="hover:underline font-semibold">{recipe.forkedFromAuthor}</Link>&apos;s recipe
              </div>
            )}

            <div className="flex items-start justify-between gap-4 mb-4">
              <div className="flex-1">
                <h1 className="text-4xl font-serif font-bold text-foreground mb-2">{recipe.title}</h1>
                <p className="text-muted-foreground">by {recipe.authorName}</p>
              </div>
              <span className="px-4 py-2 bg-primary text-primary-foreground text-sm font-medium rounded">
                {recipe.method}
              </span>
            </div>

            {/* Your Rating */}
            <div className="mt-6">
              <p className="text-sm font-medium text-foreground mb-3">Your Rating</p>
              <div className="flex items-center gap-4">
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <button
                      key={rating}
                      onMouseEnter={() => setHoverRating(rating)}
                      onMouseLeave={() => setHoverRating(0)}
                      onClick={() => handleRate(rating)}
                      className={`text-3xl transition ${
                        rating <= (hoverRating || recipe.userRating || 0)
                          ? 'text-accent'
                          : 'text-muted opacity-30'
                      }`}
                      disabled={isRating}
                    >
                      ★
                    </button>
                  ))}
                </div>
                {recipe.userRating && (
                  <span className="text-sm text-muted-foreground">
                    You rated: {recipe.userRating} star{recipe.userRating !== 1 ? 's' : ''}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="p-6 sm:p-8 space-y-8">
            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-muted/50 rounded-lg p-4">
                <p className="text-xs text-muted-foreground mb-1">Ratio</p>
                <p className="text-lg font-serif font-bold text-foreground">1:{ratio}</p>
              </div>
              <div className="bg-muted/50 rounded-lg p-4">
                <p className="text-xs text-muted-foreground mb-1">Grind Size</p>
                <p className="text-lg font-serif font-bold text-foreground">{recipe.grindSize}</p>
              </div>
              <div className="bg-muted/50 rounded-lg p-4">
                <p className="text-xs text-muted-foreground mb-1">Water Temp</p>
                <p className="text-lg font-serif font-bold text-foreground">{recipe.waterTempCelsius}°C</p>
              </div>
              <div className="bg-muted/50 rounded-lg p-4">
                <p className="text-xs text-muted-foreground mb-1">Brew Time</p>
                <p className="text-lg font-serif font-bold text-foreground">{recipe.totalBrewTimeSeconds}s</p>
              </div>
            </div>

            {/* Detailed Variables */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Coffee</p>
                <p className="text-xl font-medium text-foreground">{recipe.coffeeGrams}g</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Water</p>
                <p className="text-xl font-medium text-foreground">{recipe.waterGrams}g</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Bloom Time</p>
                <p className="text-xl font-medium text-foreground">{recipe.bloomTimeSeconds}s</p>
              </div>
            </div>

            {/* Tasting Notes */}
            <div className="border-t border-border pt-6">
              <h2 className="text-xl font-serif font-bold text-foreground mb-4">Tasting Notes</h2>
              <p className="text-base text-foreground leading-relaxed">{recipe.tastingNotes}</p>
            </div>

            {/* Community Rating */}
            <div className="border-t border-border pt-6">
              <h2 className="text-xl font-serif font-bold text-foreground mb-4">Community Rating</h2>
              <div className="bg-muted/50 rounded-lg p-6">
                <div className="flex items-baseline gap-4">
                  <div className="text-4xl font-serif font-bold text-foreground">
                    {recipe.communityRating?.toFixed(1) || 'N/A'}
                  </div>
                  <div>
                    <div className="flex text-secondary">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className={i < Math.round(recipe.communityRating || 0) ? '' : 'opacity-30'}>
                          ★
                        </span>
                      ))}
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      Based on {recipe.ratingCount} {recipe.ratingCount === 1 ? 'rating' : 'ratings'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Recipe Actions */}
            <div className="border-t border-border pt-6 flex gap-3">
              {isOwnRecipe ? (
                <Link href={`/recipes/${recipe.id}/edit`} className="flex-1">
                  <Button className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground font-medium">
                    Edit Recipe
                  </Button>
                </Link>
              ) : (
                <Button
                  onClick={handleFork}
                  disabled={isForking || !user}
                  className="flex-1 bg-accent hover:bg-accent/90 text-accent-foreground font-medium"
                >
                  {isForking ? 'Remixing...' : 'Remix this recipe'}
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
