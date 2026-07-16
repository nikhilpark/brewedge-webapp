'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/auth';
import { getUserRecipes, Recipe } from '@/lib/api';
import RecipeCard from '@/components/recipe-card';
import { Button } from '@/components/ui/button';

export default function DashboardPage() {
  const { user } = useAuth();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadRecipes = async () => {
      if (!user) return;
      try {
        const data = await getUserRecipes(user.id);
        setRecipes(data);
      } finally {
        setIsLoading(false);
      }
    };

    loadRecipes();
  }, [user]);

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-4xl font-serif font-bold text-foreground">Your Recipes</h1>
            <p className="text-muted-foreground mt-1">Track your coffee brewing experiments</p>
          </div>
          <Link href="/recipes/new">
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium">
              + New Recipe
            </Button>
          </Link>
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            <p className="text-muted-foreground mt-4">Loading your recipes...</p>
          </div>
        ) : recipes.length === 0 ? (
          <div className="bg-card rounded-lg border border-border p-8 sm:p-12 text-center">
            <div className="text-4xl mb-4">☕</div>
            <h2 className="text-xl font-serif font-bold text-foreground mb-2">No recipes yet</h2>
            <p className="text-muted-foreground mb-6">
              Start by creating your first coffee recipe. Log your brewing method, variables, and tasting notes.
            </p>
            <Link href="/recipes/new">
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium">
                Create Your First Recipe
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recipes.map((recipe) => (
              <RecipeCard key={recipe.id} recipe={recipe} showAuthor={false} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
