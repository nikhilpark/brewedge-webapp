// Mock data that persists across client navigation within the session
let mockRecipes: Recipe[] = [];
let mockRatings: RatingEntry[] = [];
let mockLikes: LikeEntry[] = [];
let mockFollows: FollowEntry[] = [];
let initialized = false;

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
  communityRating?: number;
  ratingCount?: number;
  userRating?: number;
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

export interface LikeEntry {
  recipeId: string;
  userId: string;
  createdAt: string;
}

export interface FollowEntry {
  followerId: string;
  followingId: string;
}

export interface GrinderModel {
  id: string;
  name: string;
  settingType: 'clicks' | 'dial';
  minSetting: number;
  maxSetting: number;
}

export const GRINDER_MODELS: GrinderModel[] = [
  { id: 'comandante-c40', name: 'Comandante C40', settingType: 'clicks', minSetting: 0, maxSetting: 40 },
  { id: '1zpresso-jx-pro', name: '1Zpresso JX-Pro', settingType: 'clicks', minSetting: 0, maxSetting: 90 },
  { id: 'timemore-c3', name: 'Timemore C3', settingType: 'clicks', minSetting: 0, maxSetting: 36 },
  { id: 'baratza-encore', name: 'Baratza Encore', settingType: 'dial', minSetting: 1, maxSetting: 40 },
  { id: 'fellow-ode-gen2', name: 'Fellow Ode Gen 2', settingType: 'dial', minSetting: 1, maxSetting: 11 },
  { id: 'niche-zero', name: 'Niche Zero', settingType: 'dial', minSetting: 0, maxSetting: 30 },
];

// Initialize with seed data on first load
function initializeData() {
  if (initialized) return;
  initialized = true;

  const seedRecipes: Recipe[] = [
    {
      id: '1',
      userId: 'user_seed_1',
      authorName: 'Sarah Chen',
      title: 'Morning V60 - Ethiopian Yirgacheffe',
      method: 'V60',
      grindSize: 'Medium',
      waterTempCelsius: 195,
      coffeeGrams: 20,
      waterGrams: 300,
      bloomTimeSeconds: 45,
      totalBrewTimeSeconds: 210,
      tastingNotes: 'Bright berry notes, floral aroma, crisp finish',
      personalRating: 5,
      isPublic: true,
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      roaster: 'Onyx Coffee Lab',
      beanName: 'Ethiopia Gedeb',
      originNote: 'Ethiopian natural, floral and fruity',
    },
    {
      id: '2',
      userId: 'user_seed_2',
      authorName: 'James Wilson',
      title: 'Sweet AeroPress - Colombian Geisha',
      method: 'AeroPress',
      grindSize: 'Fine',
      waterTempCelsius: 200,
      coffeeGrams: 17,
      waterGrams: 250,
      bloomTimeSeconds: 30,
      totalBrewTimeSeconds: 120,
      tastingNotes: 'Chocolate body, subtle honey sweetness, smooth finish',
      personalRating: 5,
      isPublic: true,
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      roaster: 'Blue Bottle Coffee',
      beanName: 'Colombia Geisha',
      originNote: 'Colombian washed, sweet and clean',
    },
    {
      id: '3',
      userId: 'user_seed_1',
      authorName: 'Sarah Chen',
      title: 'Chemex Pour-Over - Kenyan AA',
      method: 'Chemex',
      grindSize: 'Coarse',
      waterTempCelsius: 200,
      coffeeGrams: 42,
      waterGrams: 600,
      bloomTimeSeconds: 60,
      totalBrewTimeSeconds: 300,
      tastingNotes: 'Intense stone fruit, deep body, wine-like acidity',
      personalRating: 4,
      isPublic: true,
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      roaster: 'Onyx Coffee Lab',
      beanName: 'Kenya AA',
      originNote: 'Kenyan AA washed, stone fruit and wine notes',
    },
    {
      id: '4',
      userId: 'user_seed_3',
      authorName: 'Marcus Rodriguez',
      title: 'Cold Brew - Brazilian Santos',
      method: 'Cold Brew',
      grindSize: 'Coarse',
      waterTempCelsius: 20,
      coffeeGrams: 80,
      waterGrams: 400,
      bloomTimeSeconds: 0,
      totalBrewTimeSeconds: 86400,
      tastingNotes: 'Smooth, chocolatey, naturally sweet, low acidity',
      personalRating: 4,
      isPublic: true,
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      roaster: 'Counter Culture Coffee',
      beanName: 'Brazil Santos',
      originNote: 'Brazilian natural, chocolate and nutty',
    },
    {
      id: '5',
      userId: 'user_seed_2',
      authorName: 'James Wilson',
      title: 'Espresso Shot - Costa Rican Tarrazú',
      method: 'Espresso',
      grindSize: 'Fine',
      waterTempCelsius: 205,
      coffeeGrams: 18,
      waterGrams: 36,
      bloomTimeSeconds: 0,
      totalBrewTimeSeconds: 30,
      tastingNotes: 'Caramel sweetness, hazelnut, velvety crema',
      personalRating: 5,
      isPublic: true,
      createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
      roaster: 'Blue Bottle Coffee',
      beanName: 'Costa Rica Tarrazú',
      originNote: 'Costa Rican washed, caramel and hazelnut',
    },
    {
      id: '6',
      userId: 'user_seed_4',
      authorName: 'Emma Thompson',
      title: 'French Press - Sumatra Mandheling',
      method: 'French Press',
      grindSize: 'Coarse',
      waterTempCelsius: 205,
      coffeeGrams: 45,
      waterGrams: 600,
      bloomTimeSeconds: 30,
      totalBrewTimeSeconds: 240,
      tastingNotes: 'Full body, earthy, dark chocolate, herbal notes',
      personalRating: 4,
      isPublic: true,
      createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
      roaster: 'Intelligentsia Coffee',
      beanName: 'Sumatra Mandheling',
      originNote: 'Indonesian semi-washed, earthy and full-bodied',
    },
    {
      id: '7',
      userId: 'user_seed_1',
      authorName: 'Sarah Chen',
      title: 'V60 Iced - Rwandan Natural Process',
      method: 'V60',
      grindSize: 'Medium-Fine',
      waterTempCelsius: 185,
      coffeeGrams: 18,
      waterGrams: 280,
      bloomTimeSeconds: 40,
      totalBrewTimeSeconds: 180,
      tastingNotes: 'Fruit-forward, berry jam, tea-like finish',
      personalRating: 5,
      isPublic: true,
      createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
      roaster: 'Onyx Coffee Lab',
      beanName: 'Rwanda Huye Mountain',
      originNote: 'Rwandan natural, fruity and floral',
      forkedFromId: '1',
      forkedFromAuthor: 'Sarah Chen',
    },
    {
      id: '8',
      userId: 'user_seed_5',
      authorName: 'David Kim',
      title: 'AeroPress Inverted - Ethiopian Yirgacheffe',
      method: 'AeroPress',
      grindSize: 'Medium-Fine',
      waterTempCelsius: 200,
      coffeeGrams: 16,
      waterGrams: 240,
      bloomTimeSeconds: 30,
      totalBrewTimeSeconds: 100,
      tastingNotes: 'Floral, jasmine, bright acidity, clean finish',
      personalRating: 4,
      isPublic: true,
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      roaster: 'Onyx Coffee Lab',
      beanName: 'Ethiopia Gedeb',
      originNote: 'Ethiopian natural, floral and fruity',
      forkedFromId: '1',
      forkedFromAuthor: 'Sarah Chen',
    },
  ];

  mockRecipes = seedRecipes;

  // Create varied ratings
  const seedRatings: RatingEntry[] = [
    // Recipe 1 ratings
    { recipeId: '1', userId: 'user_rater_1', rating: 5 },
    { recipeId: '1', userId: 'user_rater_2', rating: 4 },
    { recipeId: '1', userId: 'user_rater_3', rating: 5 },
    { recipeId: '1', userId: 'user_rater_4', rating: 5 },
    { recipeId: '1', userId: 'user_rater_5', rating: 4 },
    { recipeId: '1', userId: 'user_rater_6', rating: 5 },
    // Recipe 2 ratings
    { recipeId: '2', userId: 'user_rater_1', rating: 5 },
    { recipeId: '2', userId: 'user_rater_2', rating: 5 },
    { recipeId: '2', userId: 'user_rater_7', rating: 4 },
    { recipeId: '2', userId: 'user_rater_8', rating: 5 },
    // Recipe 3 ratings
    { recipeId: '3', userId: 'user_rater_1', rating: 4 },
    { recipeId: '3', userId: 'user_rater_3', rating: 3 },
    { recipeId: '3', userId: 'user_rater_9', rating: 4 },
    { recipeId: '3', userId: 'user_rater_10', rating: 4 },
    { recipeId: '3', userId: 'user_rater_11', rating: 5 },
    // Recipe 4 ratings
    { recipeId: '4', userId: 'user_rater_2', rating: 4 },
    { recipeId: '4', userId: 'user_rater_5', rating: 4 },
    { recipeId: '4', userId: 'user_rater_12', rating: 3 },
    { recipeId: '4', userId: 'user_rater_13', rating: 4 },
    // Recipe 5 ratings
    { recipeId: '5', userId: 'user_rater_1', rating: 5 },
    { recipeId: '5', userId: 'user_rater_4', rating: 5 },
    { recipeId: '5', userId: 'user_rater_6', rating: 5 },
    { recipeId: '5', userId: 'user_rater_14', rating: 4 },
    { recipeId: '5', userId: 'user_rater_15', rating: 5 },
    // Recipe 6 ratings
    { recipeId: '6', userId: 'user_rater_3', rating: 4 },
    { recipeId: '6', userId: 'user_rater_7', rating: 4 },
    { recipeId: '6', userId: 'user_rater_9', rating: 3 },
    { recipeId: '6', userId: 'user_rater_16', rating: 4 },
    // Recipe 7 ratings
    { recipeId: '7', userId: 'user_rater_2', rating: 5 },
    { recipeId: '7', userId: 'user_rater_5', rating: 5 },
    { recipeId: '7', userId: 'user_rater_8', rating: 5 },
    { recipeId: '7', userId: 'user_rater_10', rating: 4 },
    // Recipe 8 ratings
    { recipeId: '8', userId: 'user_rater_1', rating: 4 },
    { recipeId: '8', userId: 'user_rater_11', rating: 4 },
    { recipeId: '8', userId: 'user_rater_17', rating: 4 },
  ];

  mockRatings = seedRatings;

  // Seed likes
  const seedLikes: LikeEntry[] = [
    { recipeId: '1', userId: 'user_seed_2', createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() },
    { recipeId: '1', userId: 'user_seed_3', createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString() },
    { recipeId: '2', userId: 'user_seed_1', createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString() },
    { recipeId: '2', userId: 'user_seed_4', createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString() },
    { recipeId: '3', userId: 'user_seed_2', createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() },
    { recipeId: '4', userId: 'user_seed_1', createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString() },
    { recipeId: '4', userId: 'user_seed_5', createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString() },
  ];
  mockLikes = seedLikes;

  // Seed follows
  const seedFollows: FollowEntry[] = [
    { followerId: 'user_seed_2', followingId: 'user_seed_1' },
    { followerId: 'user_seed_3', followingId: 'user_seed_1' },
    { followerId: 'user_seed_1', followingId: 'user_seed_2' },
    { followerId: 'user_seed_4', followingId: 'user_seed_2' },
    { followerId: 'user_seed_5', followingId: 'user_seed_3' },
  ];
  mockFollows = seedFollows;
}

function computeRating(recipeId: string) {
  const ratings = mockRatings.filter(r => r.recipeId === recipeId);
  if (ratings.length === 0) return { communityRating: 0, ratingCount: 0 };
  
  const sum = ratings.reduce((acc, r) => acc + r.rating, 0);
  const avg = sum / ratings.length;
  
  return {
    communityRating: Math.round(avg * 10) / 10,
    ratingCount: ratings.length,
  };
}

function enrichRecipe(recipe: Recipe, userId?: string): Recipe {
  const { communityRating, ratingCount } = computeRating(recipe.id);
  const userRating = userId
    ? mockRatings.find(r => r.recipeId === recipe.id && r.userId === userId)?.rating
    : undefined;

  return {
    ...recipe,
    communityRating,
    ratingCount,
    userRating,
  };
}

export async function getRecipes(filters?: {
  method?: string;
  roaster?: string;
  sort?: 'rating' | 'recent';
}): Promise<Recipe[]> {
  initializeData();
  
  // Simulate network latency
  await new Promise(resolve => setTimeout(resolve, 400));

  let results = mockRecipes.filter(r => r.isPublic);

  if (filters?.method) {
    results = results.filter(r => r.method === filters.method);
  }

  if (filters?.roaster) {
    results = results.filter(r => r.roaster === filters.roaster);
  }

  if (filters?.sort === 'rating') {
    results.sort((a, b) => {
      const aRating = computeRating(a.id).communityRating;
      const bRating = computeRating(b.id).communityRating;
      return bRating - aRating;
    });
  } else if (filters?.sort === 'recent') {
    results.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  return results.map(r => enrichRecipe(r));
}

export function getDistinctRoasters(): string[] {
  initializeData();
  const roasters = new Set<string>();
  
  mockRecipes
    .filter(r => r.isPublic && r.roaster)
    .forEach(r => roasters.add(r.roaster!));
  
  return Array.from(roasters).sort();
}

export async function getUserRecipes(userId: string): Promise<Recipe[]> {
  initializeData();
  
  // Simulate network latency
  await new Promise(resolve => setTimeout(resolve, 350));

  return mockRecipes
    .filter(r => r.userId === userId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .map(r => enrichRecipe(r, userId));
}

export async function getRecipeById(id: string, userId?: string): Promise<Recipe | null> {
  initializeData();
  
  // Simulate network latency
  await new Promise(resolve => setTimeout(resolve, 300));

  const recipe = mockRecipes.find(r => r.id === id);
  return recipe ? enrichRecipe(recipe, userId) : null;
}

export async function createRecipe(
  data: Omit<Recipe, 'id' | 'createdAt' | 'communityRating' | 'ratingCount' | 'userRating'>
): Promise<Recipe> {
  initializeData();
  
  // Simulate network latency
  await new Promise(resolve => setTimeout(resolve, 500));

  const newRecipe: Recipe = {
    ...data,
    id: `recipe_${Date.now()}`,
    createdAt: new Date().toISOString(),
  };

  mockRecipes.push(newRecipe);
  return enrichRecipe(newRecipe, data.userId);
}

export async function updateRecipe(
  id: string,
  data: Partial<Omit<Recipe, 'id' | 'createdAt' | 'communityRating' | 'ratingCount' | 'userRating'>>
): Promise<Recipe | null> {
  initializeData();
  
  // Simulate network latency
  await new Promise(resolve => setTimeout(resolve, 400));

  const recipe = mockRecipes.find(r => r.id === id);
  if (!recipe) return null;

  const updated = { ...recipe, ...data };
  const index = mockRecipes.findIndex(r => r.id === id);
  mockRecipes[index] = updated;

  return enrichRecipe(updated, data.userId);
}

export async function deleteRecipe(id: string): Promise<boolean> {
  initializeData();
  
  // Simulate network latency
  await new Promise(resolve => setTimeout(resolve, 400));

  const index = mockRecipes.findIndex(r => r.id === id);
  if (index === -1) return false;

  mockRecipes.splice(index, 1);
  mockRatings = mockRatings.filter(r => r.recipeId !== id);
  return true;
}

export async function rateRecipe(
  recipeId: string,
  userId: string,
  rating: number
): Promise<Recipe | null> {
  initializeData();
  
  // Simulate network latency
  await new Promise(resolve => setTimeout(resolve, 350));

  // Check if user already rated
  const existingIndex = mockRatings.findIndex(
    r => r.recipeId === recipeId && r.userId === userId
  );

  if (existingIndex >= 0) {
    mockRatings[existingIndex].rating = rating;
  } else {
    mockRatings.push({ recipeId, userId, rating });
  }

  const recipe = mockRecipes.find(r => r.id === recipeId);
  return recipe ? enrichRecipe(recipe, userId) : null;
}

export async function forkRecipe(
  sourceRecipeId: string,
  userId: string,
  userName: string
): Promise<Recipe | null> {
  initializeData();
  
  // Simulate network latency
  await new Promise(resolve => setTimeout(resolve, 400));

  const sourceRecipe = mockRecipes.find(r => r.id === sourceRecipeId);
  if (!sourceRecipe) return null;

  const newRecipe: Recipe = {
    id: `recipe_${Date.now()}`,
    userId,
    authorName: userName,
    title: sourceRecipe.title,
    method: sourceRecipe.method,
    grindSize: sourceRecipe.grindSize,
    waterTempCelsius: sourceRecipe.waterTempCelsius,
    coffeeGrams: sourceRecipe.coffeeGrams,
    waterGrams: sourceRecipe.waterGrams,
    bloomTimeSeconds: sourceRecipe.bloomTimeSeconds,
    totalBrewTimeSeconds: sourceRecipe.totalBrewTimeSeconds,
    tastingNotes: '',
    personalRating: 0,
    isPublic: false,
    createdAt: new Date().toISOString(),
    forkedFromId: sourceRecipeId,
    forkedFromAuthor: sourceRecipe.authorName,
  };

  mockRecipes.push(newRecipe);
  return enrichRecipe(newRecipe, userId);
}

// Like functions
export async function toggleLike(recipeId: string, userId: string): Promise<boolean> {
  initializeData();
  await new Promise(resolve => setTimeout(resolve, 300));

  const existingIndex = mockLikes.findIndex(
    l => l.recipeId === recipeId && l.userId === userId
  );

  if (existingIndex >= 0) {
    mockLikes.splice(existingIndex, 1);
    return false;
  } else {
    mockLikes.push({ recipeId, userId, createdAt: new Date().toISOString() });
    return true;
  }
}

export function getLikeCount(recipeId: string): number {
  initializeData();
  return mockLikes.filter(l => l.recipeId === recipeId).length;
}

export function hasUserLiked(recipeId: string, userId: string): boolean {
  initializeData();
  return mockLikes.some(l => l.recipeId === recipeId && l.userId === userId);
}

export function getUserLikedRecipes(userId: string): Recipe[] {
  initializeData();
  const likedRecipeIds = mockLikes
    .filter(l => l.userId === userId)
    .map(l => l.recipeId);
  
  return mockRecipes.filter(r => likedRecipeIds.includes(r.id));
}

// Follow functions
export async function followUser(followerId: string, followingId: string): Promise<void> {
  initializeData();
  await new Promise(resolve => setTimeout(resolve, 300));

  if (followerId === followingId) return;
  if (!mockFollows.some(f => f.followerId === followerId && f.followingId === followingId)) {
    mockFollows.push({ followerId, followingId });
  }
}

export async function unfollowUser(followerId: string, followingId: string): Promise<void> {
  initializeData();
  await new Promise(resolve => setTimeout(resolve, 300));

  const index = mockFollows.findIndex(
    f => f.followerId === followerId && f.followingId === followingId
  );
  if (index >= 0) {
    mockFollows.splice(index, 1);
  }
}

export function isFollowing(followerId: string, followingId: string): boolean {
  initializeData();
  return mockFollows.some(f => f.followerId === followerId && f.followingId === followingId);
}

export function getFollowers(userId: string): string[] {
  initializeData();
  return mockFollows.filter(f => f.followingId === userId).map(f => f.followerId);
}

export function getFollowing(userId: string): string[] {
  initializeData();
  return mockFollows.filter(f => f.followerId === userId).map(f => f.followingId);
}
