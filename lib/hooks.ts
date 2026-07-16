// SWR hooks for all data fetching and mutations
'use client';

import useSWR, { useSWRConfig } from 'swr';
import { apiClient } from './apiClient';
import { Recipe } from './api';

// ============================================================================
// RECIPES HOOKS
// ============================================================================

export function useRecipes(filters?: {
  method?: string;
  roaster?: string;
  sort?: 'rating' | 'recent';
  personalized?: boolean;
}) {
  const query = new URLSearchParams();
  if (filters?.method) query.append('method', filters.method);
  if (filters?.roaster) query.append('roaster', filters.roaster);
  if (filters?.sort) query.append('sort', filters.sort);
  if (filters?.personalized) query.append('personalized', 'true');

  const queryString = query.toString();
  const key = queryString ? `/recipes?${queryString}` : '/recipes';

  const { data, error, isLoading, mutate } = useSWR<Recipe[]>(key);

  return {
    recipes: data || [],
    isLoading,
    error,
    mutate,
  };
}

export function useRecipe(recipeId: string | null) {
  const { data, error, isLoading, mutate } = useSWR<Recipe>(
    recipeId ? `/recipes/${recipeId}` : null
  );

  return {
    recipe: data,
    isLoading,
    error,
    mutate,
  };
}

export async function createRecipe(recipeData: Partial<Recipe>) {
  return apiClient('/recipes', {
    method: 'POST',
    body: JSON.stringify(recipeData),
  });
}

export async function updateRecipe(recipeId: string, recipeData: Partial<Recipe>) {
  return apiClient(`/recipes/${recipeId}`, {
    method: 'PATCH',
    body: JSON.stringify(recipeData),
  });
}

export async function deleteRecipe(recipeId: string) {
  return apiClient(`/recipes/${recipeId}`, {
    method: 'DELETE',
  });
}

export async function forkRecipe(recipeId: string) {
  return apiClient(`/recipes/${recipeId}/fork`, {
    method: 'POST',
  });
}

// ============================================================================
// LIKES HOOKS
// ============================================================================

export async function toggleLike(recipeId: string) {
  return apiClient(`/recipes/${recipeId}/like`, {
    method: 'POST',
  });
}

// ============================================================================
// RATINGS HOOKS
// ============================================================================

export async function rateRecipe(recipeId: string, rating: number) {
  return apiClient(`/recipes/${recipeId}/rating`, {
    method: 'POST',
    body: JSON.stringify({ rating }),
  });
}

// ============================================================================
// USER HOOKS
// ============================================================================

export function useUser(userId: string | null) {
  const { data, error, isLoading, mutate } = useSWR(
    userId ? `/users/${userId}` : null
  );

  return {
    user: data,
    isLoading,
    error,
    mutate,
  };
}

export function useUserRecipes(userId: string | null) {
  const { data, error, isLoading, mutate } = useSWR(
    userId ? `/users/${userId}/recipes` : null
  );

  return {
    recipes: data || [],
    isLoading,
    error,
    mutate,
  };
}

export function useUserLiked(userId: string | null) {
  const { data, error, isLoading, mutate } = useSWR(
    userId ? `/users/${userId}/liked` : null
  );

  return {
    recipes: data || [],
    isLoading,
    error,
    mutate,
  };
}

export function useUserRemixes(userId: string | null) {
  const { data, error, isLoading, mutate } = useSWR(
    userId ? `/users/${userId}/remixes` : null
  );

  return {
    recipes: data || [],
    isLoading,
    error,
    mutate,
  };
}

export function useIsFollowing(userId: string | null) {
  const { data, error, isLoading, mutate } = useSWR(
    userId ? `/users/${userId}/is-following` : null
  );

  return {
    isFollowing: data?.isFollowing || false,
    isLoading,
    error,
    mutate,
  };
}

export async function followUser(userId: string) {
  return apiClient(`/users/${userId}/follow`, {
    method: 'POST',
  });
}

export async function unfollowUser(userId: string) {
  return apiClient(`/users/${userId}/follow`, {
    method: 'DELETE',
  });
}

export function useUserFollowers(userId: string | null) {
  const { data, error, isLoading } = useSWR(
    userId ? `/users/${userId}/followers` : null
  );

  return {
    followers: data || [],
    isLoading,
    error,
  };
}

export function useUserFollowing(userId: string | null) {
  const { data, error, isLoading, mutate } = useSWR(
    userId ? `/users/${userId}/following` : null
  );

  return {
    following: data || [],
    isLoading,
    error,
    mutate,
  };
}

// ============================================================================
// GRINDER HOOKS
// ============================================================================

export function useGrinders() {
  const { data, error, isLoading } = useSWR('/grinders');

  return {
    grinders: data || [],
    isLoading,
    error,
  };
}

export async function convertGrinderSetting(params: {
  fromGrinderId: string;
  toGrinderId: string;
  setting: string;
}) {
  return apiClient('/grinders/convert', {
    method: 'POST',
    body: JSON.stringify(params),
  });
}
