'use client';

import { useParams } from 'next/navigation';
import { useAuth } from '@/context/auth';
import { useState } from 'react';
import { useUser, useUserRecipes, useUserLiked, useUserRemixes, useIsFollowing, followUser, unfollowUser } from '@/lib/hooks';
import RecipeCard from '@/components/recipe-card';

type TabType = 'recipes' | 'liked' | 'remixes';

export default function ProfilePage() {
  const params = useParams();
  const { user: currentUser } = useAuth();
  const userId = params.userId as string;

  const [activeTab, setActiveTab] = useState<TabType>('recipes');
  const [isFollowLoading, setIsFollowLoading] = useState(false);

  // Fetch data using SWR hooks
  const { user: profileUser, isLoading: userLoading } = useUser(userId);
  const { recipes, isLoading: recipesLoading } = useUserRecipes(userId);
  const { recipes: likedRecipes, isLoading: likedLoading } = useUserLiked(userId);
  const { recipes: remixRecipes, isLoading: remixLoading } = useUserRemixes(userId);
  const { isFollowing, mutate: mutateFollowing } = useIsFollowing(userId);

  const isOwnProfile = currentUser?.id === userId;

  const handleFollowToggle = async () => {
    if (!currentUser) return;
    
    setIsFollowLoading(true);
    try {
      if (isFollowing) {
        await unfollowUser(userId);
      } else {
        await followUser(userId);
      }
      // Revalidate following status
      await mutateFollowing();
    } catch (error) {
      console.error('Follow toggle error:', error);
    } finally {
      setIsFollowLoading(false);
    }
  };

  if (userLoading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-8">
        <p className="text-center text-muted-foreground">Loading profile...</p>
      </div>
    );
  }

  if (!profileUser) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-8">
        <p className="text-center text-muted-foreground">User not found</p>
      </div>
    );
  }

  const tabLoading = activeTab === 'recipes' ? recipesLoading : activeTab === 'liked' ? likedLoading : remixLoading;
  const tabContent = activeTab === 'recipes' ? recipes : activeTab === 'liked' ? likedRecipes : remixRecipes;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Profile Header */}
      <div className="bg-card rounded-lg border border-border p-8 mb-8">
        <div className="flex items-start gap-6 mb-6">
          <img
            src={profileUser.avatarUrl}
            alt={profileUser.username}
            className="w-24 h-24 rounded-full border-4 border-primary"
          />
          <div className="flex-1">
            <h1 className="text-3xl font-serif font-bold text-foreground mb-1">
              {profileUser.username}
            </h1>
            <p className="text-muted-foreground mb-4">{profileUser.email}</p>
            
            {/* Stats */}
            <div className="flex gap-6 mb-4">
              <div>
                <p className="text-lg font-semibold text-foreground">{recipes.length}</p>
                <p className="text-sm text-muted-foreground">Recipes</p>
              </div>
              <div>
                <p className="text-lg font-semibold text-foreground">{likedRecipes.length}</p>
                <p className="text-sm text-muted-foreground">Liked</p>
              </div>
              <div>
                <p className="text-lg font-semibold text-foreground">{remixRecipes.length}</p>
                <p className="text-sm text-muted-foreground">Remixes</p>
              </div>
            </div>

            {/* Follow Button */}
            {!isOwnProfile && currentUser && (
              <button
                onClick={handleFollowToggle}
                disabled={isFollowLoading}
                className={`px-4 py-2 rounded-md font-medium transition disabled:opacity-50 ${
                  isFollowing
                    ? 'bg-muted text-foreground hover:bg-muted/80'
                    : 'bg-primary text-primary-foreground hover:bg-primary/90'
                }`}
              >
                {isFollowLoading ? 'Loading...' : isFollowing ? 'Following' : 'Follow'}
              </button>
            )}

            {isOwnProfile && (
              <button className="px-4 py-2 rounded-md font-medium bg-muted text-foreground hover:bg-muted/80 transition">
                Edit Profile
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-8">
        <div className="flex gap-2 border-b border-border mb-6">
          {(['recipes', 'liked', 'remixes'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-3 font-medium text-sm border-b-2 transition ${
                activeTab === tab
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              {tab === 'recipes' && 'Recipes'}
              {tab === 'liked' && 'Liked'}
              {tab === 'remixes' && 'Remixes'}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {tabLoading ? (
          <div className="text-center py-8 text-muted-foreground">Loading...</div>
        ) : tabContent.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-2">
              {activeTab === 'recipes' && 'No recipes yet'}
              {activeTab === 'liked' && 'No liked recipes'}
              {activeTab === 'remixes' && 'No remixed recipes'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {tabContent.map((recipe) => (
              <RecipeCard key={recipe.id} recipe={recipe} showAuthor={false} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
