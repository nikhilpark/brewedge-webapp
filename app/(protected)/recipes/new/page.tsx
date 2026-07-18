'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/auth';
import { createRecipe } from '@/lib/hooks';
import RecipeForm from '@/components/recipe-form';

export default function NewRecipePage() {
  const router = useRouter();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (formData: any) => {
    if (!user) return;
    setError('');
    setIsLoading(true);

    try {
      // Backend derives userId and authorName from the auth token
      const recipe = await createRecipe(formData);
      router.push(`/recipes/${recipe.id}`);
    } catch (err: any) {
      setError(err?.data?.error || 'Failed to create recipe. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-serif font-bold text-foreground">Create Recipe</h1>
          <p className="text-muted-foreground mt-1">Log your latest coffee brew</p>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 p-4 bg-destructive/10 border border-destructive text-destructive rounded-md">
            {error}
          </div>
        )}

        {/* Form */}
        <div className="bg-card rounded-lg border border-border p-6">
          <RecipeForm onSubmit={handleSubmit} isLoading={isLoading} />
        </div>
      </div>
    </div>
  );
}
