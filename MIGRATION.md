# Brew Edge: Mock to Real API Migration

This document outlines the complete migration from in-memory mock data (`lib/api.ts`) to real API calls against an Express + MongoDB backend running at `http://localhost:3000/api`.

## Architecture Overview

### Data Layer (New)

- **`lib/apiClient.ts`**: Thin fetch wrapper that:
  - Sets base URL from `NEXT_PUBLIC_API_URL` environment variable
  - Automatically attaches `Authorization: Bearer <token>` header for local auth sessions
  - Includes `credentials: 'include'` for httpOnly cookie-based Google OAuth sessions
  - Handles JSON parsing and error conversion

- **`context/swr.tsx`**: Global SWR configuration provider
  - Wraps entire app with SWR dedupe, retry, and error handling settings
  - All components use the configured fetcher automatically

- **`lib/hooks.ts`**: SWR hooks replacing all mock functions
  - `useRecipes(filters)` → `GET /api/recipes?method=...&roaster=...&sort=...&personalized=...`
  - `useRecipe(id)` → `GET /api/recipes/:id`
  - `useUser(id)` → `GET /api/users/:id`
  - `useUserRecipes(id)`, `useUserLiked(id)`, `useUserRemixes(id)` → User profile data
  - `useIsFollowing(id)` → `GET /api/users/:id/is-following`
  - `useUserFollowing(id)` → `GET /api/users/:id/following`
  - Mutations: `createRecipe()`, `updateRecipe()`, `forkRecipe()`, `toggleLike()`, `rateRecipe()`, `followUser()`, `unfollowUser()`

### Authentication

- **Updated `context/auth.tsx`**:
  - `login()` → `POST /api/auth/login`
  - `signup()` → `POST /api/auth/signup`
  - `logout()` → `POST /api/auth/logout`
  - Access tokens stored in memory (not localStorage) for XSS security
  - Refresh tokens handled via httpOnly cookies (automatic with `credentials: 'include'`)
  - Session restoration via `GET /api/auth/me` on app load

- **Google OAuth Flow**:
  - Login/signup pages have "Continue with Google" button
  - Full browser redirect to `GET /api/auth/google` (not a fetch call)
  - Backend redirects to `/auth/callback` after OAuth completion
  - New `/auth/callback` page calls `GET /api/auth/me` to fetch authenticated user
  - Callback page stores token and redirects to `/dashboard`

## API Endpoints Used

### Authentication
```
POST   /api/auth/signup              → { accessToken, user }
POST   /api/auth/login               → { accessToken, user }
POST   /api/auth/logout              → void
GET    /api/auth/me                  → user (requires auth)
GET    /api/auth/google              → (redirect to OAuth provider)
GET    /api/auth/google/callback     → (backend redirects to frontend /auth/callback)
POST   /api/auth/refresh             → { accessToken } (auto-called on 401)
```

### Recipes
```
GET    /api/recipes                  → Recipe[] (query params: method, roaster, sort, personalized)
GET    /api/recipes/:id              → Recipe
POST   /api/recipes                  → Recipe (auth required)
PATCH  /api/recipes/:id              → Recipe (auth required, owner only)
DELETE /api/recipes/:id              → void (auth required, owner only)
POST   /api/recipes/:id/fork         → Recipe (auth required)
GET    /api/recipes/:id/lineage      → { original, forks }
POST   /api/recipes/:id/rating       → { rating, averageRating, count }
POST   /api/recipes/:id/like         → { liked: boolean, likeCount: number }
```

### Users
```
PATCH  /api/users/me                 → user (auth required, update profile)
GET    /api/users/:id                → { id, username, email, avatar, stats }
GET    /api/users/:id/recipes        → Recipe[]
GET    /api/users/:id/liked          → Recipe[]
GET    /api/users/:id/remixes        → Recipe[] (forked recipes)
GET    /api/users/:id/followers      → { id, username }[]
GET    /api/users/:id/following      → { id, username }[]
GET    /api/users/:id/is-following   → { isFollowing: boolean } (optional auth)
POST   /api/users/:id/follow         → void (auth required)
DELETE /api/users/:id/follow         → void (auth required)
```

### Tools
```
GET    /api/grinders                 → GrinderModel[]
POST   /api/grinders/convert         → { fromSetting, toSetting, conversions }
```

## Component Updates

### Recipe Cards
- Like button calls `toggleLike()` SWR mutation directly from card
- Remix button calls `forkRecipe()`, redirects to `/recipes/[newId]/edit`
- Both use `stopPropagation()` to prevent opening recipe detail on click
- "Following" badge shows on cards where author is in current user's follow list
- Actions disabled/redirect to /login if unauthenticated

### Profile Page (`/profile/[userId]`)
- Tabs use `useUserRecipes()`, `useUserLiked()`, `useUserRemixes()`
- "Follow/Following" button uses `useIsFollowing()` + `followUser()/unfollowUser()` mutations
- Button hidden when viewing own profile; show "Edit Profile" instead
- Follower/following counts fetched via `useUserFollowers()`, `useUserFollowing()`

### Explore Page (`/explore`)
- `useRecipes({ personalized: true })` when authenticated to rank followed users' recipes
- Follow list cached via `useUserFollowing()` to determine "Following" badges on cards
- Method/roaster/sort filters passed to `useRecipes()` via query params

### Dashboard (`/dashboard`)
- `useUserRecipes(currentUserId)` to fetch user's own recipes
- "New Recipe" button links to `/recipes/new`
- Recipe cards support like/remix actions directly

## Error Handling

- 401 responses trigger `POST /api/auth/refresh` automatically via interceptor
- If refresh fails, user redirected to `/login`
- API errors wrapped with status + data for component-level handling
- SWR configured for 3 retries with exponential backoff

## Environment Setup

```env
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

Defaults to `http://localhost:3000/api` if not set. Update for production backends.

## Migration Checklist

- [x] Created `lib/apiClient.ts` with fetch wrapper
- [x] Created `context/swr.tsx` with SWR configuration
- [x] Created `lib/hooks.ts` with all SWR hooks
- [x] Updated `context/auth.tsx` for real API calls
- [x] Added `/auth/callback` page for Google OAuth
- [x] Updated `/login` page with Google button
- [x] Updated `/signup` page with Google button
- [x] Recipe cards support like/remix actions
- [x] Profile page uses real endpoints
- [x] Explore page supports personalized feed
- [x] App builds successfully with no TypeScript errors

## What Changed vs. What Stayed the Same

### Changed
- Data fetching: Mock in-memory arrays → SWR hooks + real API
- Auth flow: sessionStorage tokens → in-memory tokens + refresh cookies
- Google OAuth: Not implemented in mock → Full OAuth flow with callback page

### Unchanged
- UI/visual design (theme system, glassmorphism, grinder picker)
- Component structure and routing
- Like/remix/follow functionality (now backed by real API)
- TypeScript types and props

## Testing

1. Ensure Express backend is running at `http://localhost:3000/api`
2. Backend must have CORS configured to accept `http://localhost:3000` with credentials
3. Test local auth: Sign up/login with email + password
4. Test Google OAuth: Click "Continue with Google" and verify callback redirect
5. Test session restore: Log in, refresh page, verify user stays logged in
6. Test recipe mutations: Create, like, fork, rate recipes
7. Test follow: Navigate to another user's profile, follow/unfollow
8. Test explore: Verify personalized feed surfaces followed users' recipes

## Troubleshooting

**CORS errors on requests:**
Ensure backend CORS middleware allows `http://localhost:3000` with `credentials: true`

**401 errors after login:**
Check that access token is returned and set via `setAuthToken()`

**Cookies not being sent:**
Verify all API calls use `credentials: 'include'` (set in apiClient.ts fetcher)

**Google OAuth redirect fails:**
Confirm backend OAuth callback redirects to `http://localhost:3000/auth/callback`

**404 on recipe endpoints:**
Verify backend endpoint paths match those in `lib/hooks.ts`
