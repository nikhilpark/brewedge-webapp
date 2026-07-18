// SWR hooks for all data fetching and mutations
// Every endpoint here maps 1:1 to the brew-edge-backend Express API
'use client';

import useSWR from 'swr';
import { apiClient, swrFetcher } from './apiClient';
import { Recipe, GrinderModel } from './api';

// ============================================================================
// RECIPES HOOKS
// ============================================================================

// GET /recipes?method=&roaster=&sort=&personalized=
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

  const { data, error, isLoading, mutate } = useSWR<Recipe[]>(key, swrFetcher);

  return {
    recipes: data || [],
    isLoading,
    error,
    mutate,
  };
}

// GET /recipes/:id — returns enriched recipe (communityRating, likeCount, userLiked, userRating)
export function useRecipe(recipeId: string | null) {
  const { data, error, isLoading, mutate } = useSWR<Recipe | null>(
    recipeId ? `/recipes/${recipeId}` : null,
    swrFetcher
  );

  return {
    recipe: data ?? undefined,
    isLoading,
    error,
    mutate,
  };
}

// GET /recipes/roasters — distinct roaster names for filters
export function useRoasters() {
  const { data, error, isLoading } = useSWR<string[]>('/recipes/roasters', swrFetcher);

  return {
    roasters: data || [],
    isLoading,
    error,
  };
}

// GET /recipes/:id/lineage — parent recipe if this one was forked
export function useRecipeLineage(recipeId: string | null) {
  const { data, error, isLoading } = useSWR<Recipe | null>(
    recipeId ? `/recipes/${recipeId}/lineage` : null,
    swrFetcher
  );

  return {
    parentRecipe: data ?? undefined,
    isLoading,
    error,
  };
}

// POST /recipes — backend derives userId/authorName from the auth token
export async function createRecipe(recipeData: Partial<Recipe>): Promise<Recipe> {
  return apiClient('/recipes', {
    method: 'POST',
    body: JSON.stringify(recipeData),
  });
}

// PATCH /recipes/:id — requires ownership
export async function updateRecipe(recipeId: string, recipeData: Partial<Recipe>): Promise<Recipe> {
  return apiClient(`/recipes/${recipeId}`, {
    method: 'PATCH',
    body: JSON.stringify(recipeData),
  });
}

// DELETE /recipes/:id — returns true
export async function deleteRecipe(recipeId: string): Promise<boolean> {
  return apiClient(`/recipes/${recipeId}`, {
    method: 'DELETE',
  });
}

// POST /recipes/:id/fork — returns the newly created (private) fork
export async function forkRecipe(recipeId: string): Promise<Recipe | null> {
  return apiClient(`/recipes/${recipeId}/fork`, {
    method: 'POST',
  });
}

// ============================================================================
// LIKES HOOKS
// ============================================================================

// POST /recipes/:id/like — returns boolean (new liked state)
export async function toggleLike(recipeId: string): Promise<boolean> {
  return apiClient(`/recipes/${recipeId}/like`, {
    method: 'POST',
  });
}

// GET /recipes/:id/like/count — returns number
export function useLikeCount(recipeId: string | null) {
  const { data, error, isLoading, mutate } = useSWR<number>(
    recipeId ? `/recipes/${recipeId}/like/count` : null,
    swrFetcher
  );

  return {
    likeCount: data ?? 0,
    isLoading,
    error,
    mutate,
  };
}

// GET /recipes/:id/like — returns boolean (has current user liked)
export function useHasLiked(recipeId: string | null) {
  const { data, error, isLoading, mutate } = useSWR<boolean>(
    recipeId ? `/recipes/${recipeId}/like` : null,
    swrFetcher
  );

  return {
    hasLiked: data ?? false,
    isLoading,
    error,
    mutate,
  };
}

// ============================================================================
// RATINGS HOOKS
// ============================================================================

// POST /recipes/:id/rating — body { rating: 1-5 }, returns the updated enriched recipe
export async function rateRecipe(recipeId: string, rating: number): Promise<Recipe | null> {
  return apiClient(`/recipes/${recipeId}/rating`, {
    method: 'POST',
    body: JSON.stringify({ rating }),
  });
}

// GET /recipes/:id/rating — current user's rating entry or null
export function useUserRating(recipeId: string | null) {
  const { data, error, isLoading, mutate } = useSWR<{
    recipeId: string;
    userId: string;
    rating: number;
  } | null>(recipeId ? `/recipes/${recipeId}/rating` : null, swrFetcher);

  return {
    userRating: data?.rating,
    isLoading,
    error,
    mutate,
  };
}

// ============================================================================
// USER HOOKS
// ============================================================================

export interface PublicUser {
  id: string;
  username: string;
  avatarUrl: string;
  bio: string;
  createdAt: string;
}

// GET /users/:id — public profile (no email)
export function useUser(userId: string | null) {
  const { data, error, isLoading, mutate } = useSWR<PublicUser>(
    userId ? `/users/${userId}` : null,
    swrFetcher
  );

  return {
    user: data,
    isLoading,
    error,
    mutate,
  };
}

// PATCH /users/me — update own profile { bio?, avatarUrl?, username? }
export async function updateProfile(data: {
  bio?: string;
  avatarUrl?: string;
  username?: string;
}): Promise<PublicUser> {
  return apiClient('/users/me', {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}

// GET /users/:id/recipes
export function useUserRecipes(userId: string | null) {
  const { data, error, isLoading, mutate } = useSWR<Recipe[]>(
    userId ? `/users/${userId}/recipes` : null,
    swrFetcher
  );

  return {
    recipes: data || [],
    isLoading,
    error,
    mutate,
  };
}

// GET /users/:id/liked
export function useUserLiked(userId: string | null) {
  const { data, error, isLoading, mutate } = useSWR<Recipe[]>(
    userId ? `/users/${userId}/liked` : null,
    swrFetcher
  );

  return {
    recipes: data || [],
    isLoading,
    error,
    mutate,
  };
}

// GET /users/:id/remixes
export function useUserRemixes(userId: string | null) {
  const { data, error, isLoading, mutate } = useSWR<Recipe[]>(
    userId ? `/users/${userId}/remixes` : null,
    swrFetcher
  );

  return {
    recipes: data || [],
    isLoading,
    error,
    mutate,
  };
}

// GET /users/:id/is-following — returns a raw boolean
export function useIsFollowing(userId: string | null) {
  const { data, error, isLoading, mutate } = useSWR<boolean>(
    userId ? `/users/${userId}/is-following` : null,
    swrFetcher
  );

  return {
    isFollowing: data ?? false,
    isLoading,
    error,
    mutate,
  };
}

// POST /users/:id/follow — 204 No Content
export async function followUser(userId: string): Promise<void> {
  await apiClient(`/users/${userId}/follow`, {
    method: 'POST',
  });
}

// DELETE /users/:id/follow — 204 No Content
export async function unfollowUser(userId: string): Promise<void> {
  await apiClient(`/users/${userId}/follow`, {
    method: 'DELETE',
  });
}

// GET /users/:id/followers — returns array of user ID strings
export function useUserFollowers(userId: string | null) {
  const { data, error, isLoading } = useSWR<string[]>(
    userId ? `/users/${userId}/followers` : null,
    swrFetcher
  );

  return {
    followers: data || [],
    isLoading,
    error,
  };
}

// GET /users/:id/following — returns array of user ID strings
export function useUserFollowing(userId: string | null) {
  const { data, error, isLoading, mutate } = useSWR<string[]>(
    userId ? `/users/${userId}/following` : null,
    swrFetcher
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

// GET /grinders — list of grinder models
export function useGrinders() {
  const { data, error, isLoading } = useSWR<GrinderModel[]>('/grinders', swrFetcher);

  return {
    grinders: data || [],
    isLoading,
    error,
  };
}

export interface GrinderConversionResult {
  fromGrinder: string;
  fromSetting: number;
  toGrinder: string;
  convertedSetting: number;
  note: string;
}

// GET /grinders/convert?fromGrinder=&fromSetting=&toGrinder=
export async function convertGrinderSetting(params: {
  fromGrinder: string;
  fromSetting: number;
  toGrinder: string;
}): Promise<GrinderConversionResult> {
  const query = new URLSearchParams({
    fromGrinder: params.fromGrinder,
    fromSetting: String(params.fromSetting),
    toGrinder: params.toGrinder,
  });

  return apiClient(`/grinders/convert?${query.toString()}`);
}
