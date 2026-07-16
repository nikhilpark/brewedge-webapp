'use client';

import { useParams } from 'next/navigation';
import { useAuth } from '@/context/auth';
import { useEffect, useState } from 'react';
import { getUserRecipes, getUserLikedRecipes, getFollowers, getFollowing, isFollowing, followUser, unfollowUser } from '@/lib/api';
import RecipeCard from '@/components/recipe-card';
import type { Recipe } from '@/lib/api';

type TabType = 'recipes' | 'liked' | 'remixes';

const MOCK_USERS: Record<string, { id: string; username: string; email: string; avatarUrl: string; joinedAt: string }> = {
  'user_seed_1': { id: 'user_seed_1', username: 'Sarah Chen', email: 'sarah@example.com', avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah', joinedAt: '2024-01-15' },
  'user_seed_2': { id: 'user_seed_2', username: 'James Wilson', email: 'james@example.com', avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=James', joinedAt: '2024-02-01' },
  'user_seed_3': { id: 'user_seed_3', username: 'Marcus Rodriguez', email: 'marcus@example.com', avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus', joinedAt: '2024-01-20' },
  'user_seed_4': { id: 'user_seed_4', username: 'Emma Thompson', email: 'emma@example.com', avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emma', joinedAt: '2024-02-10' },
  'user_seed_5': { id: 'user_seed_5', username: 'David Kim', email: 'david@example.com', avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=David', joinedAt: '2024-01-28' },
};

export default function ProfilePage() {
  const params = useParams();
  const { user: currentUser } = useAuth();
  const userId = params.userId as string;
  const profileUser = MOCK_USERS[userId];

  const [activeTab, setActiveTab] = useState<TabType>('recipes');
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [likedRecipes, setLikedRecipes] = useState<Recipe[]>([]);
  const [remixRecipes, setRemixRecipes] = useState<Recipe[]>([]);
  const [followers, setFollowers] = useState(0);
  const [following, setFollowing] = useState(0);
  const [isFollowingUser, setIsFollowingUser] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const isOwnProfile = currentUser?.id === userId;

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const userRecipes = await getUserRecipes(userId);
        setRecipes(userRecipes);
        setRemixRecipes(userRecipes.filter(r => r.forkedFromId));

        const liked = await getUserLikedRecipes(userId);
        setLikedRecipes(liked);

        const followersList = getFollowers(userId);
        const followingList = getFollowing(userId);
        setFollowers(followersList.length);
        setFollowing(followingList.length);

        if (currentUser && !isOwnProfile) {
          const following = isFollowing(currentUser.id, userId);
          setIsFollowingUser(following);
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [userId, currentUser, isOwnProfile]);

  const handleFollowToggle = async () => {
    if (!currentUser) return;
    
    try {
      if (isFollowingUser) {
        await unfollowUser(currentUser.id, userId);
        setIsFollowingUser(false);
      } else {
        await followUser(currentUser.id, userId);
        setIsFollowingUser(true);
      }
      
      // Update counts
      const followersList = getFollowers(userId);
      setFollowers(followersList.length);
    } catch (error) {
      console.error('Follow toggle error:', error);
    }
  };

  if (!profileUser) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <p className="text-center text-muted-foreground">User not found</p>
      </div>
    );
  }

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
            <p className="text-muted-foreground mb-4">Joined {profileUser.joinedAt}</p>
            
            {/* Stats */}
            <div className="flex gap-6 mb-4">
              <div>
                <p className="text-lg font-semibold text-foreground">{followers}</p>
                <p className="text-sm text-muted-foreground">Followers</p>
              </div>
              <div>
                <p className="text-lg font-semibold text-foreground">{following}</p>
                <p className="text-sm text-muted-foreground">Following</p>
              </div>
              <div>
                <p className="text-lg font-semibold text-foreground">{recipes.length}</p>
                <p className="text-sm text-muted-foreground">Recipes</p>
              </div>
            </div>

            {/* Follow Button */}
            {!isOwnProfile && currentUser && (
              <button
                onClick={handleFollowToggle}
                className={`px-4 py-2 rounded-md font-medium transition ${
                  isFollowingUser
                    ? 'bg-muted text-foreground hover:bg-muted/80'
                    : 'bg-primary text-primary-foreground hover:bg-primary/90'
                }`}
              >
                {isFollowingUser ? 'Following' : 'Follow'}
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
        {isLoading ? (
          <div className="text-center py-8 text-muted-foreground">Loading...</div>
        ) : tabContent.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-2">
              {activeTab === 'recipes' && "No recipes yet"}
              {activeTab === 'liked' && "No liked recipes"}
              {activeTab === 'remixes' && "No remixed recipes"}
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
