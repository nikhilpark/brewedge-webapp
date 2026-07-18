'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/context/auth';
import { useRecipe, updateRecipe } from '@/lib/hooks';
import RecipeForm from '@/components/recipe-form';

export default function EditRecipePage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const recipeId = params.id as string;

  const { recipe: fetchedRecipe, isLoading, mutate } = useRecipe(recipeId);
  const [error, setError] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // Ownership check — backend also enforces this on PATCH
  const recipe = fetchedRecipe && fetchedRecipe.userId === user?.id ? fetchedRecipe : null;

  const handleSubmit = async (formData: any) => {
    if (!user) return;
    setError('');
    setIsSaving(true);

    try {
      // Backend validates ownership; only send recipe fields
      const updated = await updateRecipe(recipeId, formData);
      await mutate(updated, { revalidate: false });
      router.push(`/recipes/${recipeId}`);
    } catch (err: any) {
      setError(err?.data?.error || 'Failed to update recipe. Please try again.');
    } finally {
      setIsSaving(false);
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

  if (error || !recipe) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-2xl font-serif font-bold text-foreground mb-4">
            {error || 'Recipe not found'}
          </h1>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-serif font-bold text-foreground">Edit Recipe</h1>
          <p className="text-muted-foreground mt-1">Update your coffee brew details</p>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 p-4 bg-destructive/10 border border-destructive text-destructive rounded-md">
            {error}
          </div>
        )}

        {/* Form */}
        <div className="bg-card rounded-lg border border-border p-6">
          <RecipeForm initialRecipe={recipe} onSubmit={handleSubmit} isLoading={isSaving} />
        </div>
      </div>
    </div>
  );
}
