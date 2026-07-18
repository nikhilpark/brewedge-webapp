// Shared API types matching the brew-edge-backend response shapes.
// All data fetching goes through SWR hooks in lib/hooks.ts — no mock data.

export interface Recipe {
  id: string;
  userId: string;
  authorName: string;
  title: string;
  method: 'V60' | 'AeroPress' | 'Chemex' | 'French Press' | 'Espresso' | 'Cold Brew' | 'Other';
  grindSize: string;
  grinderModel?: string;
  grinderSetting?: string;
  waterTempCelsius: number;
  coffeeGrams: number;
  waterGrams: number;
  bloomTimeSeconds: number;
  totalBrewTimeSeconds: number;
  tastingNotes: string;
  personalRating: number;
  isPublic: boolean;
  createdAt: string;
  // Enriched fields computed by the backend aggregation pipeline
  communityRating?: number;
  ratingCount?: number;
  likeCount?: number;
  userRating?: number;
  userLiked?: boolean;
  forkedFromId?: string;
  forkedFromAuthor?: string;
  roaster?: string;
  beanName?: string;
  originNote?: string;
}

export interface RatingEntry {
  recipeId: string;
  userId: string;
  rating: number;
}

export interface GrinderModel {
  id: string;
  name: string;
  settingType: 'clicks' | 'dial';
  minSetting: number;
  maxSetting: number;
}

export const BREW_METHODS = [
  'V60',
  'AeroPress',
  'Chemex',
  'French Press',
  'Espresso',
  'Cold Brew',
  'Other',
] as const;
