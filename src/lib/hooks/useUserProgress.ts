"use client";

import { useEffect, useState } from 'react';
import { createSPASassClient } from '@/lib/supabase/client';
import { Tables } from '@/lib/types';

interface UserProgress {
  currentLevel: number;
  completedLevels: number[];
  tierType: 'free' | 'paid';
  aiMessagesCount: number;
  profile: Tables<'user_profiles'> | null;
}

export function useUserProgress(userId?: string) {
  const [userProgress, setUserProgress] = useState<UserProgress | null>(null);
  const [progressData, setProgressData] = useState<Record<number, number>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    loadUserProgress();
  }, [userId]);

  const loadUserProgress = async () => {
    if (!userId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const sassClient = await createSPASassClient();
      const supabase = sassClient.getSupabaseClient();
      
      // Get user profile with progress data
      const { data: profile, error: profileError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (profileError) {
        throw profileError;
      }

      if (!profile) {
        throw new Error('User profile not found');
      }

      // For now, just use basic profile data without complex progress calculation
      setUserProgress({
        currentLevel: profile.current_level,
        completedLevels: profile.completed_lessons || [],
        tierType: profile.tier_type as 'free' | 'paid',
        aiMessagesCount: profile.ai_messages_count,
        profile
      });
      
      // Simple progress calculation - if level is in completed_lessons, it's 100%, otherwise 0%
      const progressMap: Record<number, number> = {};
      if (profile.completed_lessons) {
        profile.completed_lessons.forEach(levelId => {
          progressMap[levelId] = 100;
        });
      }
      
      setProgressData(progressMap);
      
    } catch (err) {
      console.error('Error loading user progress:', err);
      setError(err instanceof Error ? err.message : 'Failed to load progress');
    } finally {
      setLoading(false);
    }
  };

  const refreshProgress = () => {
    if (userId) {
      loadUserProgress();
    }
  };

  return {
    userProgress,
    progressData,
    loading,
    error,
    refreshProgress
  };
} 